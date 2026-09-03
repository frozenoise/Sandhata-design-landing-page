// Azure DevOps REST API helpers (Phase 1: manual PAT connect + one-way push
// status). Basic auth with an empty username and the PAT as the password —
// ADO's documented scheme for PAT-based REST calls.
// https://learn.microsoft.com/en-us/azure/devops/integrate/how-to/call-rest-api

const API_VERSION = "7.1";

export class AdoApiError extends Error {
  status: number;
  adoMessage?: string;
  constructor(message: string, status: number, adoMessage?: string) {
    super(message);
    this.name = "AdoApiError";
    this.status = status;
    this.adoMessage = adoMessage;
  }
}

function authHeader(pat: string): string {
  return "Basic " + Buffer.from(":" + pat).toString("base64");
}

function baseUrl(organization: string, adoProject: string): string {
  return `https://dev.azure.com/${encodeURIComponent(organization)}/${encodeURIComponent(adoProject)}/_apis`;
}

async function adoFetch(url: string, pat: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: authHeader(pat),
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    let adoMessage: string | undefined;
    try {
      const body = await res.json();
      adoMessage = body?.message || body?.value?.[0]?.message;
    } catch {}
    if (res.status === 401 || res.status === 403) {
      throw new AdoApiError(
        "Azure DevOps rejected the personal access token (401/403). Check the token is valid and has Work Items Read & Write scope.",
        res.status,
        adoMessage
      );
    }
    throw new AdoApiError(
      adoMessage || `Azure DevOps request failed (${res.status})`,
      res.status,
      adoMessage
    );
  }

  return res.json();
}

export type AdoWorkItemType = {
  name: string;
  referenceName: string;
};

export type AdoWorkItemState = {
  name: string;
  category: string; // "Proposed" | "InProgress" | "Resolved" | "Completed" | "Removed"
};

// GET /_apis/wit/workitemtypes — used both to validate a PAT (cheap call)
// and to pick the Phase-1 default work item type.
export async function listWorkItemTypes(
  organization: string,
  adoProject: string,
  pat: string
): Promise<AdoWorkItemType[]> {
  const url = `${baseUrl(organization, adoProject)}/wit/workitemtypes?api-version=${API_VERSION}`;
  const data = await adoFetch(url, pat);
  return (data.value || []).map((t: any) => ({ name: t.name, referenceName: t.referenceName }));
}

// GET /_apis/wit/workitemtypes/{type}/states
export async function listWorkItemTypeStates(
  organization: string,
  adoProject: string,
  pat: string,
  type: string
): Promise<AdoWorkItemState[]> {
  const url = `${baseUrl(organization, adoProject)}/wit/workitemtypes/${encodeURIComponent(type)}/states?api-version=${API_VERSION}`;
  const data = await adoFetch(url, pat);
  return (data.value || []).map((s: any) => ({ name: s.name, category: s.category }));
}

// Pick a generic default work item type for the Phase-1 "project"/"page"
// kinds: prefer "Task", else "Issue" (Basic process), else the first
// non-Bug/non-Epic type found. Never defaults to Bug or Epic — those carry
// process-specific required fields/semantics we don't want to assume.
export function pickDefaultWorkItemType(types: AdoWorkItemType[]): AdoWorkItemType {
  const byName = (n: string) => types.find(t => t.name.toLowerCase() === n.toLowerCase());
  const task = byName("Task");
  if (task) return task;
  const issue = byName("Issue");
  if (issue) return issue;
  const generic = types.find(t => !["bug", "epic"].includes(t.name.toLowerCase()));
  if (generic) return generic;
  if (types.length === 0) {
    throw new Error("Azure DevOps project has no work item types — cannot pick a default.");
  }
  return types[0];
}

export type BuilderStatus = "new" | "in_progress" | "completed";
export type StateMappingForType = Record<BuilderStatus, string>;

// Build { new, in_progress, completed } → real ADO state names from the
// type's states list, using each state's `category` field rather than
// hardcoding literal state names (category is process-agnostic: Basic,
// Agile, Scrum, CMMI all set it consistently even though state names vary).
export function buildStateMapping(states: AdoWorkItemState[]): StateMappingForType {
  const byCategory = (cat: string) => states.find(s => s.category === cat);

  const proposed = byCategory("Proposed");
  const inProgress = byCategory("InProgress");
  const completed = byCategory("Completed");

  if (!proposed || !inProgress || !completed) {
    const missing = [
      !proposed && "Proposed",
      !inProgress && "InProgress",
      !completed && "Completed",
    ].filter(Boolean).join(", ");
    throw new Error(
      `Azure DevOps work item type is missing a state in category: ${missing}. Cannot build a default state mapping.`
    );
  }

  return {
    new: proposed.name,
    in_progress: inProgress.name,
    completed: completed.name,
  };
}

// POST /_apis/wit/workitems/${type} — JSON Patch body, Content-Type
// application/json-patch+json (ADO's create-work-item convention).
export async function createWorkItem(
  organization: string,
  adoProject: string,
  pat: string,
  type: string,
  fields: { title: string; description?: string }
): Promise<{ id: number; url: string; state: string }> {
  const patch: Array<{ op: string; path: string; value: string }> = [
    { op: "add", path: "/fields/System.Title", value: fields.title },
  ];
  if (fields.description) {
    patch.push({ op: "add", path: "/fields/System.Description", value: fields.description });
  }

  const url = `${baseUrl(organization, adoProject)}/wit/workitems/$${encodeURIComponent(type)}?api-version=${API_VERSION}`;
  const data = await adoFetch(url, pat, {
    method: "POST",
    headers: { "Content-Type": "application/json-patch+json" },
    body: JSON.stringify(patch),
  });
  return { id: data.id, url: data.url, state: data.fields?.["System.State"] };
}

// PATCH /_apis/wit/workitems/{id} — change System.State.
export async function updateWorkItemState(
  organization: string,
  adoProject: string,
  pat: string,
  id: number,
  state: string
): Promise<{ id: number; state: string }> {
  const patch = [{ op: "replace", path: "/fields/System.State", value: state }];
  const url = `${baseUrl(organization, adoProject)}/wit/workitems/${id}?api-version=${API_VERSION}`;
  const data = await adoFetch(url, pat, {
    method: "PATCH",
    headers: { "Content-Type": "application/json-patch+json" },
    body: JSON.stringify(patch),
  });
  return { id: data.id, state: data.fields?.["System.State"] };
}

// GET /_apis/wit/workitems?ids=1,2,3 — batch fetch for reconciliation.
export async function getWorkItemsBatch(
  organization: string,
  adoProject: string,
  pat: string,
  ids: number[]
): Promise<Array<{ id: number; state: string; url: string }>> {
  if (ids.length === 0) return [];
  const url = `${baseUrl(organization, adoProject)}/wit/workitems?ids=${ids.join(",")}&api-version=${API_VERSION}`;
  const data = await adoFetch(url, pat);
  return (data.value || []).map((w: any) => ({
    id: w.id,
    state: w.fields?.["System.State"],
    url: w.url,
  }));
}

export function workItemWebUrl(organization: string, adoProject: string, id: number): string {
  return `https://dev.azure.com/${encodeURIComponent(organization)}/${encodeURIComponent(adoProject)}/_workitems/edit/${id}`;
}

// Reverse-lookup: given a resolved ADO state name for a type, find which
// builder status bucket it belongs to (used to cache lastKnownCategory-ish
// info on sync/create without a second states-list call). Returns null if
// the state isn't one of the three mapped states (e.g. a custom state set
// manually in ADO outside the builder's control).
export function builderStatusForState(
  stateMapping: StateMappingForType,
  state: string
): BuilderStatus | null {
  const entry = (Object.entries(stateMapping) as [BuilderStatus, string][]).find(
    ([, v]) => v === state
  );
  return entry ? entry[0] : null;
}
