"use client";
// Cookie consent (UK GDPR / PECR). Sign-in cookies and the browser storage
// the site needs to work are strictly necessary and always on. The only
// optional piece is Vercel Web Analytics, which loads only after "Accept".
// Rejecting is one click and as prominent as accepting. The choice is kept
// in localStorage and can be changed any time from "Cookie settings" (any
// element can reopen the banner with openCookieSettings()).
import * as React from "react";
import { Analytics } from "@vercel/analytics/react";

const CONSENT_STORAGE = "sd-cookie-consent";
const CONSENT_VERSION = 1;     // bump to ask again if what we use changes
const OPEN_EVENT = "sd-open-cookie-settings";

type Choice = "all" | "essential";

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

function readChoice(): Choice | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE);
    if (!raw) return null;
    const d = JSON.parse(raw);
    return d?.v === CONSENT_VERSION && (d.choice === "all" || d.choice === "essential") ? d.choice : null;
  } catch {
    return null;
  }
}

export function CookieConsent() {
  const [choice, setChoice] = React.useState<Choice | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const c = readChoice();
    setChoice(c);
    setOpen(c === null);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  function decide(c: Choice) {
    try { localStorage.setItem(CONSENT_STORAGE, JSON.stringify({ choice: c, v: CONSENT_VERSION, at: new Date().toISOString() })); } catch {}
    setChoice(c);
    setOpen(false);
  }

  return (
    <>
      {choice === "all" && <Analytics />}
      {open && (
        <div className="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-banner-title">
          <p className="cookie-banner-title" id="cookie-banner-title">Cookies on Spectra</p>
          <p className="cookie-banner-text">
            We use essential cookies to keep you signed in and make the site work. With your
            permission we&apos;d also like to use analytics to see how the site is used, so we can
            improve it. <a href="/cookies">Cookie policy</a>
          </p>
          <div className="cookie-banner-actions">
            <button type="button" onClick={() => decide("all")}>Accept analytics</button>
            <button type="button" onClick={() => decide("essential")}>Essential only</button>
          </div>
        </div>
      )}
    </>
  );
}

/** Footer / policy-page link that reopens the banner. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" className={className ?? "cookie-settings-link"} onClick={openCookieSettings}>
      Cookie settings
    </button>
  );
}
