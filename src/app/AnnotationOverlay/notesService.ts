import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { Note, Reply } from './types';

const COLLECTION = 'notes';

export function subscribeToNotes(path: string, onUpdate: (notes: Note[]) => void): Unsubscribe {
  const q = query(collection(db, COLLECTION), where('path', '==', path));
  return onSnapshot(q, (snapshot) => {
    const notes: Note[] = snapshot.docs.map(d => {
      const data = d.data();
      return {
        id: data.id,
        type: data.type,
        x: data.x,
        y: data.y,
        text: data.text,
        author: data.author,
        timestamp: data.timestamp,
        resolved: data.resolved || false,
        resolvedBy: data.resolvedBy || undefined,
        resolvedAt: data.resolvedAt || undefined,
        replies: data.replies || []
      } as Note;
    });
    onUpdate(notes);
  });
}

function noteDocId(path: string, noteId: number): string {
  return `${path.replace(/\//g, '_')}_note_${noteId}`;
}

export async function addNoteToFirestore(path: string, note: Note): Promise<void> {
  const docId = noteDocId(path, note.id);
  await setDoc(doc(db, COLLECTION, docId), { ...note, path });
}

export async function deleteNoteFromFirestore(path: string, noteId: number): Promise<void> {
  const docId = noteDocId(path, noteId);
  await deleteDoc(doc(db, COLLECTION, docId));
}

export async function updateNoteInFirestore(path: string, noteId: number, updates: Partial<Note>): Promise<void> {
  const docId = noteDocId(path, noteId);
  await updateDoc(doc(db, COLLECTION, docId), updates);
}

export async function addReplyToFirestore(path: string, noteId: number, replies: Reply[]): Promise<void> {
  const docId = noteDocId(path, noteId);
  await updateDoc(doc(db, COLLECTION, docId), { replies });
}

export async function resolveNoteInFirestore(path: string, noteId: number, resolvedBy: string, resolvedAt: string): Promise<void> {
  const docId = noteDocId(path, noteId);
  await updateDoc(doc(db, COLLECTION, docId), { resolved: true, resolvedBy, resolvedAt });
}

export async function updateNotePositionInFirestore(path: string, noteId: number, x: number, y: number): Promise<void> {
  const docId = noteDocId(path, noteId);
  await updateDoc(doc(db, COLLECTION, docId), { x, y });
}
