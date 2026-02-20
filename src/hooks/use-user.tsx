'use client';

import React, { createContext, useContext, useMemo, ReactNode, useState } from 'react';
import { useUser as useFirebaseAuthUser } from '@/firebase'; // Renamed to avoid conflict
import type { User as AppUser, UserRole } from '@/lib/types';
import { getMockDataForRole } from '@/lib/data';

interface UserContextType {
  user: AppUser | null;
  isLoading: boolean;
  error: Error | null;
  setUserRole: (role: UserRole) => void;
  availableRoles: UserRole[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user: authUser, isUserLoading, userError } = useFirebaseAuthUser();
  const [role, setRole] = useState<UserRole>('Admin');

  // The user object now combines real auth data with mock profile data for the demo.
  const user = useMemo(() => {
    if (!authUser) return null;

    const mockUserForRole = getMockDataForRole(role).users.find(u => u.role === role);

    if (mockUserForRole) {
      return {
        ...mockUserForRole,
        id: authUser.uid,
        email: authUser.email || mockUserForRole.email,
        firstName: authUser.displayName?.split(' ')[0] || mockUserForRole.firstName,
        lastName: authUser.displayName?.split(' ')[1] || mockUserForRole.lastName,
        avatar: authUser.photoURL || mockUserForRole.avatar,
        role, // The role is determined by the switcher
      };
    }

    // Fallback if no specific mock user for the role
    return {
        id: authUser.uid,
        email: authUser.email || 'user@example.com',
        firstName: role,
        lastName: 'User',
        role: role,
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    } as AppUser;
  }, [authUser, role]);

  const value = {
    user,
    isLoading: isUserLoading,
    error: userError,
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
