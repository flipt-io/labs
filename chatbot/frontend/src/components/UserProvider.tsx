/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useState } from "react";

interface UserContextType {
  user: string;
  setUser: (user: string) => void;
}

export const UserContext = createContext<UserContextType>({
  user: "",
  setUser: () => {},
});

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState("");

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
