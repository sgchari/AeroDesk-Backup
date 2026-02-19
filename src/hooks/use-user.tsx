"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';
import type { User, UserRole } from '@/lib/types';
import { users } from '@/lib/data';

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  availableUsers: User[];
  switchUserRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(users[0]);

  const switchUserRole = (role: UserRole) => {
    const newUser = users.find(u => u.role === role);
    if (newUser) {
      setCurrentUser(newUser);
    }
  };
  
  const value = useMemo(() => ({
    user: currentUser,
    setUser: setCurrentUser,
    availableUsers: users,
    switchUserRole
  }), [currentUser]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
