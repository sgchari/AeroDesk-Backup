
'use client';
    
import {
  CollectionReference,
  DocumentReference,
  SetOptions,
} from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

const showDemoToast = () => {
    toast({
        title: 'Demo Mode',
        description: 'This action is disabled in the read-only demo.',
    });
};

/**
 * In demo mode, this function shows a toast notification instead of writing to Firestore.
 */
export function setDocumentNonBlocking(docRef: DocumentReference, data: any, options: SetOptions) {
  showDemoToast();
}


/**
 * In demo mode, this function shows a toast notification instead of writing to Firestore.
 */
export function addDocumentNonBlocking(colRef: CollectionReference, data: any) {
  showDemoToast();
  // Return a resolved promise to not break chains
  return Promise.resolve();
}


/**
 * In demo mode, this function shows a toast notification instead of writing to Firestore.
 */
export function updateDocumentNonBlocking(docRef: DocumentReference, data: any) {
  showDemoToast();
}


/**
 * In demo mode, this function shows a toast notification instead of writing to Firestore.
 */
export function deleteDocumentNonBlocking(docRef: DocumentReference) {
  showDemoToast();
}
