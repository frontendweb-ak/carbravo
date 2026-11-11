export type MockUserRole = "AUTHOR" | "APPROVER" | "ADMIN";

const STORAGE_KEY = "carbravo.mock-user-role";
const DEFAULT_ROLE: MockUserRole = "ADMIN";
const listeners = new Set<(role: MockUserRole) => void>();

function isMockUserRole(value: string | null): value is MockUserRole {
  return value === "AUTHOR" || value === "APPROVER" || value === "ADMIN";
}

function readStoredRole(): MockUserRole {
  if (typeof window === "undefined") return DEFAULT_ROLE;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return isMockUserRole(value) ? value : DEFAULT_ROLE;
  } catch {
    return DEFAULT_ROLE;
  }
}

let currentRole = readStoredRole();

export function getMockUserRole(): MockUserRole {
  return currentRole;
}

export function setMockUserRole(role: MockUserRole): void {
  if (currentRole === role) return;
  currentRole = role;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, role);
    } catch {
      // The active role still applies for this page session if storage is blocked.
    }
  }
  for (const listener of listeners) {
    listener(currentRole);
  }
}

export function subscribeToMockUserRole(listener: (role: MockUserRole) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
