'use client';

import React, { createContext, useContext, useMemo, ReactNode, useState } from 'react';
import type { User, UserRole } from '@/lib/types';
import { getMockDataForRole } from '@/lib/data';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  setUserRole: (role: UserRole) => void;
  availableRoles: UserRole[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('Admin');

  const user = useMemo(() => {
    const { users } = getMockDataForRole(role);
    const mockUser = users.find(u => u.role === role);
    if(mockUser) return mockUser;

    // Fallback
    return {
        id: 'mock-user-01',
        email: 'mock.user@example.com',
        firstName: role,
        lastName: 'User',
        role: role,
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
  }, [role]);

  const value = {
    user,
    isLoading: false,
    error: null,
    setUserRole: setRole,
    availableRoles: getMockDataForRole('Admin').users.map(u => u.role) as UserRole[],
  };

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
