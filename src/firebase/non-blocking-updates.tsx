
'use client';
    
import {
  CollectionReference,
  DocumentReference,
  SetOptions,
} from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { mockStore } from '@/lib/mock-store';
import { UserRole } from '@/lib/types';


/**
 * In demo mode, this function now interacts with the mock store.
 */
export function setDocumentNonBlocking(docRef: DocumentReference, data: any, options: SetOptions) {
    if (!docRef.path) {
        toast({
            title: 'Demo Mode',
            description: 'This action is disabled in the read-only demo.',
        });
        return;
    }
    const [collection, docId] = docRef.path.split('/');
    mockStore.updateDoc(collection, docId, data);
    toast({
        title: 'Demo Data Updated',
        description: 'Your changes have been saved for this session.',
    });
}


/**
 * In demo mode, this function adds a document to the mock store.
 */
export function addDocumentNonBlocking(colRef: CollectionReference, data: any) {
  if (!colRef.path) {
      toast({
          title: 'Demo Mode',
          description: 'This action is disabled in the read-only demo.',
      });
      return Promise.resolve();
  }
  mockStore.addDoc(colRef.path, data);
  toast({
      title: 'Demo Data Added',
      description: 'Your new item has been saved for this session.',
  });
  return Promise.resolve();
}


/**
 * In demo mode, this function updates a document in the mock store.
 */
export function updateDocumentNonBlocking(docRef: DocumentReference, data: any) {
    if (!docRef.path) {
        toast({
            title: 'Demo Mode',
            description: 'This action is disabled in the read-only demo.',
        });
        return;
    }
    const pathSegments = docRef.path.split('/');
    const collection = pathSegments.length > 2 ? `${pathSegments[0]}/${pathSegments[1]}/${pathSegments[2]}` : pathSegments[0];
    const docId = pathSegments.length > 2 ? pathSegments[3] : pathSegments[1];

    mockStore.updateDoc(collection, docId, data);
    toast({
        title: 'Demo Data Updated',
        description: 'Your changes have been saved for this session.',
    });
}


/**
 * In demo mode, this function removes a document from the mock store.
 */
export function deleteDocumentNonBlocking(docRef: DocumentReference) {
    if (!docRef.path) {
        toast({
            title: 'Demo Mode',
            description: 'This action is disabled in the read-only demo.',
        });
        return;
    }
    const pathSegments = docRef.path.split('/');
    const collection = pathSegments.length > 2 ? `${pathSegments[0]}/${pathSegments[1]}/${pathSegments[2]}` : pathSegments[0];
    const docId = pathSegments.length > 2 ? pathSegments[3] : pathSegments[1];
    
    mockStore.deleteDoc(collection, docId);
    toast({
        title: 'Demo Data Deleted',
        description: 'The item has been removed for this session.',
    });
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

    let collection = 'customers'; // Default
    switch (role) {
        case 'Admin': collection = 'platformAdmins'; break;
        case 'Customer': collection = 'customers'; break;
        case 'Operator': 
            collection = 'operators';
            newUser.companyName = `${newUser.firstName}'s Company`;
            break;
        case 'Authorized Distributor': 
            collection = 'distributors';
            newUser.companyName = `${newUser.firstName}'s Agency`;
            break;
        case 'Hotel Partner':
            collection = 'hotelPartners';
            newUser.companyName = `${newUser.firstName}'s Hotel`;
            break;
        case 'CTD Admin':
        case 'Corporate Admin':
        case 'Requester':
            if (ctdId) {
                collection = `corporateTravelDesks/${ctdId}/users`;
                newUser.ctdId = ctdId;
            }
            break;
    }
    
    mockStore.addDoc(collection, newUser);
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
