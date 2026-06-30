import { Note, Reply } from './types';

type Unsubscribe = () => void;

const store = new Map<string, Note[]>();
const listeners = new Map<string, Set<(notes: Note[]) => void>>();

function getNotesForPath(path: string): Note[] {
  if (!store.has(path)) {
    store.set(path, []);
  }
  return store.get(path)!;
}

function notify(path: string) {
  const notes = getNotesForPath(path);
  const subs = listeners.get(path);
  if (subs) {
    subs.forEach((cb) => cb([...notes]));
  }
}

export function subscribeToNotes(path: string, onUpdate: (notes: Note[]) => void): Unsubscribe {
  if (!listeners.has(path)) {
    listeners.set(path, new Set());
  }
  listeners.get(path)!.add(onUpdate);

  onUpdate([...getNotesForPath(path)]);

  return () => {
    listeners.get(path)?.delete(onUpdate);
  };
}

export async function addNoteToFirestore(path: string, note: Note): Promise<void> {
  const notes = getNotesForPath(path);
  notes.push(note);
  notify(path);
}

export async function deleteNoteFromFirestore(path: string, noteId: number): Promise<void> {
  const notes = getNotesForPath(path);
  const idx = notes.findIndex((n) => n.id === noteId);
  if (idx !== -1) {
    notes.splice(idx, 1);
    notify(path);
  }
}

export async function updateNoteInFirestore(path: string, noteId: number, updates: Partial<Note>): Promise<void> {
  const notes = getNotesForPath(path);
  const note = notes.find((n) => n.id === noteId);
  if (note) {
    Object.assign(note, updates);
    notify(path);
  }
}

export async function addReplyToFirestore(path: string, noteId: number, replies: Reply[]): Promise<void> {
  const notes = getNotesForPath(path);
  const note = notes.find((n) => n.id === noteId);
  if (note) {
    note.replies = replies;
    notify(path);
  }
}

export async function resolveNoteInFirestore(path: string, noteId: number, resolvedBy: string, resolvedAt: string): Promise<void> {
  const notes = getNotesForPath(path);
  const note = notes.find((n) => n.id === noteId);
  if (note) {
    note.resolved = true;
    note.resolvedBy = resolvedBy;
    note.resolvedAt = resolvedAt;
    notify(path);
  }
}

export async function updateNotePositionInFirestore(path: string, noteId: number, x: number, y: number): Promise<void> {
  const notes = getNotesForPath(path);
  const note = notes.find((n) => n.id === noteId);
  if (note) {
    note.x = x;
    note.y = y;
    notify(path);
  }
}
