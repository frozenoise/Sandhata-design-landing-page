// Jenkins pipeline for the Sandhata design site (Next.js 16 + Prisma + NextAuth).
//
// Flow:
//   checkout -> npm ci -> build -> copy into releases/<version> -> migrate DB
//   -> switch the `current` symlink -> restart service -> health check
//   (automatic rollback on failure) -> prune old releases.
//
// Unlike a static React app, this one has API routes, auth and a database, so it
// runs as a Node server (`next start`) under systemd, with nginx in front.
//
// One-time setup on the agent host is in deployment/SETUP.txt.

// Every `sh` runs in a fresh shell, so nvm has to be loaded each time.
def nodeSh(String script) {
    sh """#!/bin/bash
        set -eo pipefail
        export NVM_DIR="\$HOME/.nvm"
        . "\$NVM_DIR/nvm.sh" > /dev/null
        nvm use ${env.NODE_VERSION} > /dev/null
        set -u                                      # after nvm: nvm.sh breaks under nounset
        ${script}
    """
}

pipeline {
    agent { label 'server-145' }                    // host that runs the site

    options {
        disableConcurrentBuilds()                   // one deploy at a time
        buildDiscarder(logRotator(numToKeepStr: '15'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    environment {
        NODE_VERSION  = '24.13.0'
        DEPLOY_BRANCH = 'main'                      // only this branch deploys
        APP_BASE      = '/home/sandhata/test-env/sandhata-design'
        SERVICE_NAME  = 'sandhata-design'
        APP_PORT      = '3100'                      // must match deployment/sandhata-design.service
        HEALTH_URL    = "http://127.0.0.1:3100/"
        KEEP_RELEASES = '5'
        ENV_CRED_ID   = 'sandhata-design-env'       // Jenkins "Secret file" credential holding .env.local
        NEXT_TELEMETRY_DISABLED = '1'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.VERSION = "${env.BUILD_NUMBER}-${sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()}"
                }
                echo "Branch: ${env.BRANCH_NAME} | Version: ${env.VERSION}"
            }
        }

        stage('Install') {
            steps {
                nodeSh 'node -v && npm -v && npm ci --no-audit --no-fund'
            }
        }

        stage('Build') {
            steps {
                // The build reads the same env file the server uses at runtime,
                // so build-time and runtime config can't drift apart.
                withCredentials([file(credentialsId: env.ENV_CRED_ID, variable: 'ENV_FILE')]) {
                    sh 'install -m 600 "$ENV_FILE" .env.local'
                }
                nodeSh 'npm run build'              // prisma generate && next build
            }
        }

        stage('Deploy') {
            when { expression { env.BRANCH_NAME == env.DEPLOY_BRANCH } }
            steps {
                withCredentials([file(credentialsId: env.ENV_CRED_ID, variable: 'ENV_FILE')]) {
                    sh 'mkdir -p "$APP_BASE/releases" "$APP_BASE/shared" && install -m 600 "$ENV_FILE" "$APP_BASE/shared/.env.local"'
                }
                nodeSh '''
                    RELEASE="$APP_BASE/releases/$VERSION"
                    PREVIOUS="$(readlink -f "$APP_BASE/current" || true)"
                    UNIT_SRC="deployment/$SERVICE_NAME.service"
                    UNIT_DST="/etc/systemd/system/$SERVICE_NAME.service"

                    # 1. Copy the built workspace (code, .next, node_modules) into a new release folder.
                    mkdir -p "$RELEASE"
                    tar --exclude=./.git --exclude=./.env.local --exclude=./.next/cache -cf - . \
                        | tar -xf - -C "$RELEASE"
                    ln -sfn "$APP_BASE/shared/.env.local" "$RELEASE/.env.local"

                    # 2. Apply pending database migrations (reads DATABASE_URL from .env.local).
                    ( cd "$RELEASE" && npx prisma migrate deploy )

                    # 3. Keep the systemd unit in sync with git (installed/updated whenever it changes).
                    if ! cmp -s "$UNIT_SRC" "$UNIT_DST"; then
                        echo "Installing updated $UNIT_DST"
                        sudo cp "$UNIT_SRC" "$UNIT_DST"
                        sudo systemctl daemon-reload
                        sudo systemctl enable "$SERVICE_NAME"
                    fi

                    # 4. Go live: switch the symlink and restart.
                    ln -sfn "$RELEASE" "$APP_BASE/current"
                    sudo systemctl restart "$SERVICE_NAME"

                    # 5. Health check; roll back to the previous release if it doesn't answer.
                    if ! curl -fsS -o /dev/null --retry 10 --retry-delay 3 --retry-connrefused "$HEALTH_URL"; then
                        echo "Health check failed for $VERSION"
                        sudo journalctl -u "$SERVICE_NAME" -n 50 --no-pager || true
                        if [ -n "$PREVIOUS" ] && [ -d "$PREVIOUS" ]; then
                            echo "Rolling back to $PREVIOUS"
                            ln -sfn "$PREVIOUS" "$APP_BASE/current"
                            sudo systemctl restart "$SERVICE_NAME"
                            rm -rf "$RELEASE"
                        fi
                        exit 1
                    fi

                    # 6. Keep only the newest releases on disk.
                    ls -1dt "$APP_BASE"/releases/* | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf
                    echo "Live: $(readlink -f "$APP_BASE/current")"
                '''
            }
        }
    }

    post {
        always  { sh 'rm -f .env.local' }          // don't leave secrets in the workspace
        success { echo "Build ${env.VERSION} succeeded" + (env.BRANCH_NAME == env.DEPLOY_BRANCH ? " and is live" : " (not deployed: branch ${env.BRANCH_NAME})") }
        failure { echo "Build ${env.VERSION} failed" }
    }
}
