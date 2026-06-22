import { createContext, useContext, useState, type ReactNode } from "react";

export type Role = "visitor" | "attendee" | "organiser" | "admin";

interface RoleCtx {
  role: Role;
  setRole: (r: Role) => void;
}

const Ctx = createContext<RoleCtx>({ role: "visitor", setRole: () => {} });

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("visitor");
  return <Ctx.Provider value={{ role, setRole }}>{children}</Ctx.Provider>;
}

export const useRole = () => useContext(Ctx);
