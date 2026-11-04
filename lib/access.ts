import { prisma } from "./prisma";

// Common workspace access rules - the one place that decides who can see or
// change a project and the pages ("sessions") inside it. Routes call these
// instead of filtering on `userId: session.user.id` directly, so a member of
// a shared project gets the same view of its pages as the owner.
//
//   owner  - Project.userId. Everything, including sharing, rename, delete
//            and the GitHub / Azure DevOps integrations (those routes keep
//            their own owner-only checks and don't use this file).
//   editor - open and edit every page in the project, add new pages to it.
//   viewer - open pages read-only.

export type ProjectRole = "owner" | "editor" | "viewer";
export const MEMBER_ROLES = ["editor", "viewer"] as const;

export function canEdit(role: ProjectRole | null): boolean {
  return role === "owner" || role === "editor";
}

/** A project in the Trash counts as not found for everyone, so every route
 * that checks access hides it without its own deletedAt check. */
export async function projectRole(userId: string, projectId: string): Promise<ProjectRole | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { userId: true, deletedAt: true, members: { where: { userId }, select: { role: true } } },
  });
  if (!project || project.deletedAt) return null;
  if (project.userId === userId) return "owner";
  const role = project.members[0]?.role;
  return role === "editor" || role === "viewer" ? role : null;
}

/** A page's access comes from its project when it has one. A page outside any
 * project is private to whoever created it, exactly as before sharing existed. */
export async function sessionRole(userId: string, sessionId: string): Promise<{ role: ProjectRole | null; projectId: string | null; ownerId: string | null }> {
  const s = await prisma.builderSession.findUnique({
    where: { id: sessionId },
    select: { userId: true, projectId: true, deletedAt: true },
  });
  if (!s || s.deletedAt) return { role: null, projectId: null, ownerId: null };
  if (s.projectId) {
    const role = await projectRole(userId, s.projectId);
    // A page in a project belongs to the project: someone removed from it
    // loses access even to pages they created. While they can still edit it,
    // the creator gets owner rights over their own page (delete, move).
    const pageRole: ProjectRole | null = s.userId === userId && canEdit(role) ? "owner" : role;
    return { role: pageRole, projectId: s.projectId, ownerId: s.userId };
  }
  return { role: s.userId === userId ? "owner" : null, projectId: null, ownerId: s.userId };
}

/** Ids of every project the user owns or is a member of. */
export async function accessibleProjectIds(userId: string): Promise<string[]> {
  const [owned, member] = await Promise.all([
    prisma.project.findMany({ where: { userId, deletedAt: null }, select: { id: true } }),
    prisma.projectMember.findMany({ where: { userId, project: { deletedAt: null } }, select: { projectId: true } }),
  ]);
  return [...owned.map(p => p.id), ...member.map(m => m.projectId)];
}

/** Turns any pending invites for this email into memberships. Called on the
 * project list load, so an invitee sees the shared project the first time
 * they open the builder after signing in with the invited address. */
export async function claimInvites(userId: string, email: string | null | undefined): Promise<void> {
  if (!email) return;
  const invites = await prisma.projectInvite.findMany({ where: { email: email.toLowerCase() } });
  for (const inv of invites) {
    const project = await prisma.project.findUnique({ where: { id: inv.projectId }, select: { userId: true } });
    if (project && project.userId !== userId) {
      // The project list and the notifications bell both claim on load, so
      // two requests can race here: a duplicate membership insert or an
      // invite already deleted by the other request is fine to ignore.
      await prisma.projectMember.upsert({
        where: { projectId_userId: { projectId: inv.projectId, userId } },
        create: { projectId: inv.projectId, userId, role: inv.role, addedById: inv.invitedById },
        update: {},
      }).catch(() => {});
    }
    await prisma.projectInvite.deleteMany({ where: { id: inv.id } });
  }
}

/** Whether a project has anyone besides the owner - decides if its pages open
 * a live (Liveblocks) room or stay on the plain single-user save path. */
export async function isShared(projectId: string): Promise<boolean> {
  const [members, invites] = await Promise.all([
    prisma.projectMember.count({ where: { projectId } }),
    prisma.projectInvite.count({ where: { projectId } }),
  ]);
  return members + invites > 0;
}
