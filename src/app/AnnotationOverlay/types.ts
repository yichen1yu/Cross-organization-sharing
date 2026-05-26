export type NoteType = 'annotation' | 'comment';

export interface Reply {
  id: number;
  text: string;
  author: string;
  timestamp: string;
}

export interface Note {
  id: number;
  type: NoteType;
  x: number;
  y: number;
  text: string;
  author: string;
  timestamp: string;
  resolved?: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  replies?: Reply[];
}
