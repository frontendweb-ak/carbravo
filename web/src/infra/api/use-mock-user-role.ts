import { useCallback, useEffect, useState } from "react";

import {
  getMockUserRole,
  setMockUserRole,
  subscribeToMockUserRole,
  type MockUserRole,
} from "./mock-session";

export function useMockUserRole() {
  const [role, setRole] = useState<MockUserRole>(getMockUserRole);

  useEffect(() => {
    const unsubscribe = subscribeToMockUserRole(setRole);
    return () => {
      unsubscribe();
    };
  }, []);

  const updateRole = useCallback((nextRole: MockUserRole) => {
    setMockUserRole(nextRole);
  }, []);

  return { role, setRole: updateRole };
}
