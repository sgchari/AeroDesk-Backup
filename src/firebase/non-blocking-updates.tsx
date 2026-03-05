'use client';
    
import {
  CollectionReference,
  DocumentReference,
  SetOptions,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { mockStore } from '@/lib/mock-store';
import { UserRole } from '@/lib/types';

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

/**
 * Commits document updates to either the mock store (Demo) or Cloud Firestore (Production).
 */
export function setDocumentNonBlocking(docRef: DocumentReference, data: any, options: SetOptions) {
    if (isDemoMode || (docRef.firestore as any)._isMock) {
        if (!docRef.path) return;
        const [collection, docId] = docRef.path.split('/');
        mockStore.updateDoc(collection, docId, data);
        toast({ title: 'Demo Data Updated', description: 'Your changes have been saved for this session.' });
    } else {
        setDoc(docRef, data, options).catch(err => {
            console.error("Firestore Write Error:", err);
            toast({ title: 'Sync Error', description: 'Failed to update institutional record.', variant: 'destructive' });
        });
    }
}

/**
 * Adds a new document to the registry.
 */
export function addDocumentNonBlocking(colRef: CollectionReference, data: any) {
  if (isDemoMode || (colRef.firestore as any)._isMock) {
      if (!colRef.path) return Promise.resolve();
      mockStore.addDoc(colRef.path, data);
      toast({ title: 'Demo Data Added', description: 'Your new item has been saved for this session.' });
      return Promise.resolve();
  } else {
      return addDoc(colRef, data).catch(err => {
          console.error("Firestore Create Error:", err);
          toast({ title: 'Persistence Error', description: 'Failed to register new data entry.', variant: 'destructive' });
      });
  }
}

/**
 * Updates an existing document in the database.
 */
export function updateDocumentNonBlocking(docRef: DocumentReference, data: any) {
    if (isDemoMode || (docRef.firestore as any)._isMock) {
        if (!docRef.path) return;
        const pathSegments = docRef.path.split('/');
        const collection = pathSegments.length > 2 ? `${pathSegments[0]}/${pathSegments[1]}/${pathSegments[2]}` : pathSegments[0];
        const docId = pathSegments.length > 2 ? pathSegments[3] : pathSegments[1];

        mockStore.updateDoc(collection, docId, data);
        toast({ title: 'Demo Data Updated', description: 'Your changes have been saved for this session.' });
    } else {
        updateDoc(docRef, data).catch(err => {
            console.error("Firestore Update Error:", err);
            toast({ title: 'Registry Sync Error', description: 'Could not synchronize changes with production.', variant: 'destructive' });
        });
    }
}

/**
 * Removes a document from the production or simulation store.
 */
export function deleteDocumentNonBlocking(docRef: DocumentReference) {
    if (isDemoMode || (docRef.firestore as any)._isMock) {
        if (!docRef.path) return;
        const pathSegments = docRef.path.split('/');
        const collection = pathSegments.length > 2 ? `${pathSegments[0]}/${pathSegments[1]}/${pathSegments[2]}` : pathSegments[0];
        const docId = pathSegments.length > 2 ? pathSegments[3] : pathSegments[1];
        
        mockStore.deleteDoc(collection, docId);
        toast({ title: 'Demo Data Deleted', description: 'The item has been removed for this session.' });
    } else {
        deleteDoc(docRef).catch(err => {
            console.error("Firestore Delete Error:", err);
            toast({ title: 'Governance Error', description: 'Failed to remove record from production.', variant: 'destructive' });
        });
    }
}

// Special mock function for creating a user in demo mode
export const createDemoUser = (name: string, email: string, role: UserRole, ctdId?: string) => {
    const newUser: any = {
        id: `demo-user-${Date.now()}`,
        email,
        firstName: name.split(' ')[0] || '',
        lastName: name.split(' ').slice(1).join(' ') || 'User',
        role,
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    let collectionName = 'customers'; 
    switch (role) {
        case 'Admin': collectionName = 'platformAdmins'; break;
        case 'Customer': collectionName = 'customers'; break;
        case 'Operator': 
            collectionName = 'operators';
            newUser.companyName = `${newUser.firstName}'s Company`;
            break;
        case 'Authorized Distributor': 
            collectionName = 'distributors';
            newUser.companyName = `${newUser.firstName}'s Agency`;
            break;
        case 'Hotel Partner':
            collectionName = 'hotelPartners';
            newUser.companyName = `${newUser.firstName}'s Hotel`;
            break;
        case 'CTD Admin':
        case 'Corporate Admin':
        case 'Requester':
            if (ctdId) {
                collectionName = `corporateTravelDesks/${ctdId}/users`;
                newUser.ctdId = ctdId;
            }
            break;
    }
    
    mockStore.addDoc(collectionName, newUser);
    return newUser;
};

export const createDemoCtd = (adminId: string, companyName: string) => {
    const ctdData = { 
        id: adminId, 
        companyName: companyName, 
        adminExternalAuthId: adminId, 
        status: 'Active', 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
    };
    mockStore.addDoc('corporateTravelDesks', ctdData);
    return ctdData;
}
