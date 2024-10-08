"use client";

import { SubscriptionWithUser } from "@/@types";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { use } from "react";

type UserContextType = {
  user: SubscriptionWithUser | null;
  setUser: (user: SubscriptionWithUser | null) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function useUser(): UserContextType {
  let context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function UserProvider({
  children,
  userData,
}: {
  children: ReactNode;
  userData: SubscriptionWithUser;
}) {
  let [user, setUser] = useState<SubscriptionWithUser | null>(userData);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
