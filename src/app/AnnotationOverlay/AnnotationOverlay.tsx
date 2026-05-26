import * as React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Button,
  Content,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  MenuToggle,
  Switch,
  Tab,
  Tabs,
  TabTitleText,
  TextArea,
  Title,
  Tooltip
} from '@patternfly/react-core';
import { ArrowRightIcon, CheckCircleIcon, CommentsIcon, ExportIcon, GripVerticalIcon, ListIcon, TimesIcon, TrashIcon } from '@patternfly/react-icons';
import {
  subscribeToNotes,
  addNoteToFirestore,
  deleteNoteFromFirestore,
  addReplyToFirestore,
  resolveNoteInFirestore,
  updateNotePositionInFirestore
} from './notesService';
import { Note, NoteType } from './types';
export type { Note, NoteType, Reply } from './types';
import './AnnotationOverlay.css';

interface NoteContextType {
  annotations: Note[];
  comments: Note[];
  resolvedComments: Note[];
  dotsVisible: boolean;
  panelOpen: boolean;
  selectedNote: number | null;
  toggleDots: () => void;
  togglePanel: () => void;
  selectNote: (id: number | null) => void;
  addNote: (text: string, type: NoteType) => void;
  addReply: (noteId: number, text: string) => void;
  removeNote: (id: number) => void;
  resolveComment: (id: number) => void;
  updateNotePosition: (id: number, x: number, y: number) => void;
}

const NoteContext = React.createContext<NoteContextType>({
  annotations: [],
  comments: [],
  resolvedComments: [],
  dotsVisible: false,
  panelOpen: false,
  selectedNote: null,
  toggleDots: () => {},
  togglePanel: () => {},
  selectNote: () => {},
  addNote: () => {},
  addReply: () => {},
  removeNote: () => {},
  resolveComment: () => {},
  updateNotePosition: () => {}
});

export const useAnnotations = () => React.useContext(NoteContext);

export const AnnotationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [pageNotes, setPageNotes] = React.useState<Note[]>([]);
  const [dotsVisible, setDotsVisible] = React.useState(false);
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [selectedNote, setSelectedNote] = React.useState<number | null>(null);

  React.useEffect(() => {
    setSelectedNote(null);
    const unsubscribe = subscribeToNotes(currentPath, (notes) => {
      setPageNotes(notes);
    });
    return () => unsubscribe();
  }, [currentPath]);

  const annotations = React.useMemo(() => pageNotes.filter(n => n.type === 'annotation' && !n.resolved), [pageNotes]);
  const comments = React.useMemo(() => pageNotes.filter(n => n.type === 'comment' && !n.resolved), [pageNotes]);
  const resolvedComments = React.useMemo(() => pageNotes.filter(n => n.resolved), [pageNotes]);

  const toggleDots = React.useCallback(() => {
    setDotsVisible(prev => {
      if (prev) {
        setPanelOpen(false);
        setSelectedNote(null);
      } else {
        const activeNotes = pageNotes.filter(n => !n.resolved);
        if (activeNotes.length === 0) {
          setPanelOpen(true);
        }
      }
      return !prev;
    });
  }, [pageNotes]);

  const togglePanel = React.useCallback(() => {
    setPanelOpen(prev => !prev);
  }, []);

  const selectNote = React.useCallback((id: number | null) => {
    setSelectedNote(id);
  }, []);

  const addNote = React.useCallback((text: string, type: NoteType) => {
    const newId = pageNotes.length > 0 ? Math.max(...pageNotes.map(n => n.id)) + 1 : 1;
    const container = document.getElementById('primary-app-container');
    const scrollX = container ? container.scrollLeft : window.scrollX;
    const scrollY = container ? container.scrollTop : window.scrollY;
    const note: Note = {
      id: newId,
      type,
      x: scrollX + 200 + (newId * 70) % 400,
      y: scrollY + 150 + (newId * 90) % 350,
      text,
      author: 'You',
      timestamp: new Date().toLocaleString()
    };
    addNoteToFirestore(currentPath, note);
  }, [pageNotes, currentPath]);

  const addReply = React.useCallback((noteId: number, text: string) => {
    const note = pageNotes.find(n => n.id === noteId);
    if (!note) return;
    const replies = note.replies || [];
    const newReplyId = replies.length > 0 ? Math.max(...replies.map(r => r.id)) + 1 : 1;
    const updatedReplies = [...replies, { id: newReplyId, text, author: 'You', timestamp: new Date().toLocaleString() }];
    addReplyToFirestore(currentPath, noteId, updatedReplies);
  }, [pageNotes, currentPath]);

  const removeNote = React.useCallback((id: number) => {
    deleteNoteFromFirestore(currentPath, id);
    setSelectedNote(prev => prev === id ? null : prev);
  }, [currentPath]);

  const resolveComment = React.useCallback((id: number) => {
    resolveNoteInFirestore(currentPath, id, 'You', new Date().toLocaleString());
    setSelectedNote(prev => prev === id ? null : prev);
  }, [currentPath]);

  const updateNotePosition = React.useCallback((id: number, x: number, y: number) => {
    updateNotePositionInFirestore(currentPath, id, x, y);
  }, [currentPath]);

  const value = React.useMemo(() => ({
    annotations,
    comments,
    resolvedComments,
    dotsVisible,
    panelOpen,
    selectedNote,
    toggleDots,
    togglePanel,
    selectNote,
    addNote,
    addReply,
    removeNote,
    resolveComment,
    updateNotePosition
  }), [annotations, comments, resolvedComments, dotsVisible, panelOpen, selectedNote, toggleDots, togglePanel, selectNote, addNote, addReply, removeNote, resolveComment, updateNotePosition]);

  return (
    <NoteContext.Provider value={value}>
      {children}
    </NoteContext.Provider>
  );
};

const DraggableMarker: React.FC<{
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (x: number, y: number) => void;
}> = ({ note, isSelected, onSelect, onPositionChange }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const hasDragged = React.useRef(false);
  const dragOffset = React.useRef({ x: 0, y: 0 });
  const markerRef = React.useRef<HTMLDivElement>(null);

  const getScrollOffset = () => {
    const container = document.getElementById('primary-app-container');
    if (container) {
      return { x: container.scrollLeft, y: container.scrollTop };
    }
    return { x: window.scrollX, y: window.scrollY };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    hasDragged.current = false;
    const scroll = getScrollOffset();
    dragOffset.current = {
      x: (e.clientX + scroll.x) - note.x,
      y: (e.clientY + scroll.y) - note.y
    };
  };

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      hasDragged.current = true;
      const scroll = getScrollOffset();
      const newX = (e.clientX + scroll.x) - dragOffset.current.x;
      const newY = (e.clientY + scroll.y) - dragOffset.current.y;
      onPositionChange(newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onPositionChange]);

  const isComment = note.type === 'comment';
  const classNames = [
    'annotation-marker',
    isComment ? 'annotation-marker--comment' : '',
    isSelected ? 'annotation-marker--active' : '',
    isDragging ? 'annotation-marker--dragging' : ''
  ].filter(Boolean).join(' ');

  const replyCount = note.replies?.length || 0;
  const tooltipContent = (
    <div>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>
        <span style={{ textTransform: 'capitalize' }}>{note.type}</span> · {note.author} · {note.timestamp}
      </div>
      <div>{note.text}</div>
      {replyCount > 0 && (
        <div style={{ marginTop: 4, opacity: 0.8, fontSize: 11 }}>
          {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
        </div>
      )}
    </div>
  );

  return (
    <>
      <Tooltip content={tooltipContent} position="top" triggerRef={markerRef} />
      <div
        ref={markerRef}
        className={classNames}
        style={{ left: note.x, top: note.y }}
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          e.stopPropagation();
          if (!hasDragged.current) {
            onSelect();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${note.type} ${note.id}: ${note.text}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onSelect();
        }}
      >
        <span className="annotation-marker__pulse" />
        {note.id}
      </div>
    </>
  );
};

const NoteCard: React.FC<{
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onResolve?: () => void;
  onReply: (text: string) => void;
}> = ({ note, isSelected, onSelect, onRemove, onResolve, onReply }) => {
  const isComment = note.type === 'comment';
  const [replyText, setReplyText] = React.useState('');
  const [showReplyInput, setShowReplyInput] = React.useState(false);

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(replyText.trim());
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  return (
    <div
      data-annotation-id={note.id}
      className={`annotation-comment ${isComment ? 'annotation-comment--comment' : ''} ${isSelected ? 'annotation-comment--selected' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }}
    >
      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: 6 }}>
        <FlexItem>
          <span className={`annotation-comment__number ${isComment ? 'annotation-comment__number--comment' : ''}`}>{note.id}</span>
        </FlexItem>
        <FlexItem><strong style={{ fontSize: 13 }}>{note.author}</strong></FlexItem>
        <FlexItem align={{ default: 'alignRight' }}>
          <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{note.timestamp}</Content>
            </FlexItem>
            {onResolve && (
              <FlexItem>
                <Tooltip content="Resolve">
                  <Button
                    variant="plain"
                    size="sm"
                    aria-label={`Resolve comment ${note.id}`}
                    onClick={(e) => { e.stopPropagation(); onResolve(); }}
                    className="annotation-comment__resolve"
                  >
                    <CheckCircleIcon />
                  </Button>
                </Tooltip>
              </FlexItem>
            )}
            <FlexItem>
              <Button
                variant="plain"
                size="sm"
                aria-label={`Delete ${note.type} ${note.id}`}
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="annotation-comment__delete"
              >
                <TrashIcon />
              </Button>
            </FlexItem>
          </Flex>
        </FlexItem>
      </Flex>
      <Content component="p" style={{ margin: 0, fontSize: 14 }}>{note.text}</Content>

      {/* Replies */}
      {note.replies && note.replies.length > 0 && (
        <div className="annotation-comment__replies">
          {note.replies.map(reply => (
            <div key={reply.id} className="annotation-comment__reply">
              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }} style={{ marginBottom: 2 }}>
                <FlexItem><strong style={{ fontSize: 12 }}>{reply.author}</strong></FlexItem>
                <FlexItem>
                  <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{reply.timestamp}</Content>
                </FlexItem>
              </Flex>
              <Content component="p" style={{ margin: 0, fontSize: 13 }}>{reply.text}</Content>
            </div>
          ))}
        </div>
      )}

      {/* Reply action */}
      {!showReplyInput ? (
        <Button
          variant="link"
          size="sm"
          isInline
          onClick={(e) => { e.stopPropagation(); setShowReplyInput(true); }}
          style={{ marginTop: 8, fontSize: 12 }}
        >
          Reply
        </Button>
      ) : (
        <div className="annotation-comment__reply-input" onClick={(e) => e.stopPropagation()}>
          <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsFlexStart' }}>
            <FlexItem flex={{ default: 'flex_1' }}>
              <TextArea
                value={replyText}
                onChange={(_e, val) => setReplyText(val)}
                placeholder="Write a reply..."
                aria-label="Write a reply"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReplySubmit(); }
                  if (e.key === 'Escape') setShowReplyInput(false);
                }}
                autoFocus
              />
            </FlexItem>
            <FlexItem>
              <Button variant="plain" size="sm" onClick={handleReplySubmit} isDisabled={!replyText.trim()} aria-label="Send reply">
                <ArrowRightIcon />
              </Button>
            </FlexItem>
          </Flex>
        </div>
      )}
    </div>
  );
};

export const AnnotationPanel: React.FC = () => {
  const { annotations, comments, resolvedComments, panelOpen, selectedNote, selectNote, addNote, addReply, removeNote, resolveComment, togglePanel } = useAnnotations();
  const location = useLocation();
  const [newText, setNewText] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<number>(0);
  const [addType, setAddType] = React.useState<NoteType>('annotation');
  const commentListRef = React.useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (newText.trim()) {
      addNote(newText.trim(), addType);
      setNewText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  React.useEffect(() => {
    if (selectedNote && commentListRef.current) {
      const el = commentListRef.current.querySelector(`[data-annotation-id="${selectedNote}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedNote]);

  React.useEffect(() => {
    if (activeTab === 0) setAddType('annotation');
    else if (activeTab === 1) setAddType('comment');
  }, [activeTab]);

  const [exportOpen, setExportOpen] = React.useState(false);

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filePrefix = `design-notes${location.pathname.replace(/\//g, '-') || '-root'}`;

  const exportMarkdown = () => {
    const allNotes = [...annotations, ...comments, ...resolvedComments];
    if (allNotes.length === 0) return;

    const lines: string[] = [];
    lines.push(`# Design Notes — ${location.pathname}`);
    lines.push(`Exported: ${new Date().toLocaleString()}`);
    lines.push('');

    const formatNote = (note: Note) => {
      const replies = note.replies || [];
      let block = `- **[${note.type.toUpperCase()} #${note.id}]** ${note.text}\n`;
      block += `  - Author: ${note.author} | ${note.timestamp}\n`;
      if (note.resolved) {
        block += `  - ✅ Resolved by ${note.resolvedBy} · ${note.resolvedAt}\n`;
      }
      if (replies.length > 0) {
        replies.forEach(r => {
          block += `  - ↳ **${r.author}** (${r.timestamp}): ${r.text}\n`;
        });
      }
      return block;
    };

    if (annotations.length > 0) {
      lines.push('## Annotations');
      lines.push('');
      annotations.forEach(n => lines.push(formatNote(n)));
    }
    if (comments.length > 0) {
      lines.push('## Comments');
      lines.push('');
      comments.forEach(n => lines.push(formatNote(n)));
    }
    if (resolvedComments.length > 0) {
      lines.push('## Resolved');
      lines.push('');
      resolvedComments.forEach(n => lines.push(formatNote(n)));
    }

    downloadFile(lines.join('\n'), `${filePrefix}.md`, 'text/markdown');
  };

  const exportJSON = () => {
    const data = {
      page: location.pathname,
      exported: new Date().toISOString(),
      annotations,
      comments,
      resolved: resolvedComments
    };
    downloadFile(JSON.stringify(data, null, 2), `${filePrefix}.json`, 'application/json');
  };

  const exportCSV = () => {
    const allNotes = [...annotations, ...comments, ...resolvedComments];
    if (allNotes.length === 0) return;

    const headers = ['ID', 'Type', 'Text', 'Author', 'Timestamp', 'Status', 'Resolved By', 'Resolved At', 'Replies'];
    const rows = allNotes.map(n => [
      n.id,
      n.type,
      `"${(n.text || '').replace(/"/g, '""')}"`,
      n.author,
      n.timestamp,
      n.resolved ? 'Resolved' : 'Active',
      n.resolvedBy || '',
      n.resolvedAt || '',
      `"${(n.replies || []).map(r => `${r.author}: ${r.text}`).join(' | ').replace(/"/g, '""')}"`
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile(csv, `${filePrefix}.csv`, 'text/csv');
  };

  const exportHTML = () => {
    const allNotes = [...annotations, ...comments, ...resolvedComments];
    if (allNotes.length === 0) return;

    const noteToHtml = (note: Note) => {
      const replies = note.replies || [];
      let html = `<li><strong>[${note.type.toUpperCase()} #${note.id}]</strong> ${note.text}<br/>`;
      html += `<small>${note.author} · ${note.timestamp}</small>`;
      if (note.resolved) {
        html += `<br/><small style="color:green">✅ Resolved by ${note.resolvedBy} · ${note.resolvedAt}</small>`;
      }
      if (replies.length > 0) {
        html += '<ul>';
        replies.forEach(r => { html += `<li><strong>${r.author}</strong> (${r.timestamp}): ${r.text}</li>`; });
        html += '</ul>';
      }
      html += '</li>';
      return html;
    };

    let body = `<h1>Design Notes — ${location.pathname}</h1>`;
    body += `<p><em>Exported: ${new Date().toLocaleString()}</em></p>`;

    if (annotations.length > 0) {
      body += '<h2>Annotations</h2><ul>' + annotations.map(noteToHtml).join('') + '</ul>';
    }
    if (comments.length > 0) {
      body += '<h2>Comments</h2><ul>' + comments.map(noteToHtml).join('') + '</ul>';
    }
    if (resolvedComments.length > 0) {
      body += '<h2>Resolved</h2><ul>' + resolvedComments.map(noteToHtml).join('') + '</ul>';
    }

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Design Notes</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:0 20px}li{margin-bottom:12px}</style></head><body>${body}</body></html>`;
    downloadFile(html, `${filePrefix}.html`, 'text/html');
  };

  const handleExport = (format: string) => {
    setExportOpen(false);
    switch (format) {
      case 'md': exportMarkdown(); break;
      case 'json': exportJSON(); break;
      case 'csv': exportCSV(); break;
      case 'html': exportHTML(); break;
    }
  };

  return (
    <div className={`annotation-panel-overlay ${!panelOpen ? 'annotation-panel-overlay--hidden' : ''}`}>
      {/* Header with close button */}
      <Flex
        alignItems={{ default: 'alignItemsCenter' }}
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
        style={{ padding: '12px 12px 12px 24px', borderBottom: '1px solid var(--pf-t--global--border--color--default)', flexShrink: 0 }}
      >
        <FlexItem>
          <Title headingLevel="h3" size="md">Design Notes</Title>
        </FlexItem>
        <FlexItem>
          <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Dropdown
                isOpen={exportOpen}
                onSelect={() => setExportOpen(false)}
                onOpenChange={setExportOpen}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plain"
                    onClick={() => setExportOpen(prev => !prev)}
                    aria-label="Export notes"
                  >
                    <ExportIcon />
                  </MenuToggle>
                )}
                popperProps={{ position: 'right' }}
              >
                <DropdownList>
                  <DropdownItem key="md" onClick={() => handleExport('md')}>Markdown (.md)</DropdownItem>
                  <DropdownItem key="json" onClick={() => handleExport('json')}>JSON (.json)</DropdownItem>
                  <DropdownItem key="csv" onClick={() => handleExport('csv')}>CSV (.csv)</DropdownItem>
                  <DropdownItem key="html" onClick={() => handleExport('html')}>HTML (.html)</DropdownItem>
                </DropdownList>
              </Dropdown>
            </FlexItem>
            <FlexItem>
              <Button variant="plain" aria-label="Close panel" onClick={togglePanel} icon={<TimesIcon />} />
            </FlexItem>
          </Flex>
        </FlexItem>
      </Flex>

      {/* Tabs */}
      <div className="annotation-panel__tabs">
        <Tabs activeKey={activeTab} onSelect={(_e, idx) => setActiveTab(idx as number)}>
          <Tab eventKey={0} title={<TabTitleText>Annotations ({annotations.length})</TabTitleText>} />
          <Tab eventKey={1} title={<TabTitleText>Comments ({comments.length})</TabTitleText>} />
          <Tab eventKey={2} title={<TabTitleText>History ({resolvedComments.length})</TabTitleText>} />
        </Tabs>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }} ref={commentListRef}>
        {activeTab === 0 && (
          <>
            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: 16 }}>
              <FlexItem>
                <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Page: <strong>{location.pathname}</strong>
                </Content>
              </FlexItem>
              <FlexItem>
                <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                  <GripVerticalIcon style={{ marginRight: 4 }} />
                  Drag markers to reposition. Pink = annotations.
                </Content>
              </FlexItem>
            </Flex>
            {annotations.length === 0 && (
              <Content component="p" style={{ color: 'var(--pf-t--global--text--color--subtle)', textAlign: 'center', padding: '32px 0' }}>
                No annotations yet. Add one below.
              </Content>
            )}
            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
              {annotations.map(note => (
                <FlexItem key={note.id}>
                  <NoteCard
                    note={note}
                    isSelected={selectedNote === note.id}
                    onSelect={() => selectNote(note.id === selectedNote ? null : note.id)}
                    onRemove={() => removeNote(note.id)}
                    onReply={(text) => addReply(note.id, text)}
                  />
                </FlexItem>
              ))}
            </Flex>
          </>
        )}

        {activeTab === 1 && (
          <>
            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: 16 }}>
              <FlexItem>
                <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Yellow = comments. Comments can be resolved.
                </Content>
              </FlexItem>
            </Flex>
            {comments.length === 0 && (
              <Content component="p" style={{ color: 'var(--pf-t--global--text--color--subtle)', textAlign: 'center', padding: '32px 0' }}>
                No comments yet. Add one below.
              </Content>
            )}
            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
              {comments.map(note => (
                <FlexItem key={note.id}>
                  <NoteCard
                    note={note}
                    isSelected={selectedNote === note.id}
                    onSelect={() => selectNote(note.id === selectedNote ? null : note.id)}
                    onRemove={() => removeNote(note.id)}
                    onResolve={() => resolveComment(note.id)}
                    onReply={(text) => addReply(note.id, text)}
                  />
                </FlexItem>
              ))}
            </Flex>
          </>
        )}

        {activeTab === 2 && (
          <>
            {resolvedComments.length === 0 && (
              <Content component="p" style={{ color: 'var(--pf-t--global--text--color--subtle)', textAlign: 'center', padding: '32px 0' }}>
                No resolved comments yet.
              </Content>
            )}
            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
              {resolvedComments.map(note => (
                <FlexItem key={note.id}>
                  <div className="annotation-comment annotation-comment--resolved">
                    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: 6 }}>
                      <FlexItem><CheckCircleIcon color="var(--pf-t--global--color--status--success--default)" /></FlexItem>
                      <FlexItem><strong style={{ fontSize: 13 }}>{note.author}</strong></FlexItem>
                      <FlexItem align={{ default: 'alignRight' }}>
                        <Button
                          variant="plain"
                          size="sm"
                          aria-label={`Delete resolved ${note.id}`}
                          onClick={() => removeNote(note.id)}
                          className="annotation-comment__delete"
                          style={{ opacity: 1 }}
                        >
                          <TrashIcon />
                        </Button>
                      </FlexItem>
                    </Flex>
                    <Content component="p" style={{ margin: 0, fontSize: 14, textDecoration: 'line-through', opacity: 0.7 }}>{note.text}</Content>
                    <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)', marginTop: 4, display: 'block' }}>
                      Resolved by {note.resolvedBy} · {note.resolvedAt}
                    </Content>
                  </div>
                </FlexItem>
              ))}
            </Flex>
          </>
        )}
      </div>

      {/* Input (not shown on History tab) */}
      {activeTab !== 2 && (
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--pf-t--global--border--color--default)' }}>
          <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsFlexStart' }}>
            <FlexItem flex={{ default: 'flex_1' }}>
              <TextArea
                value={newText}
                onChange={(_e, val) => setNewText(val)}
                placeholder={activeTab === 0 ? 'Add an annotation...' : 'Add a comment...'}
                aria-label={activeTab === 0 ? 'Add an annotation' : 'Add a comment'}
                rows={2}
                onKeyDown={handleKeyDown}
              />
            </FlexItem>
            <FlexItem>
              <Button
                variant="plain"
                onClick={handleSubmit}
                isDisabled={!newText.trim()}
                aria-label="Send"
                style={{ color: newText.trim() ? (addType === 'annotation' ? '#e91e8a' : '#d4a017') : undefined }}
              >
                <ArrowRightIcon />
              </Button>
            </FlexItem>
          </Flex>
        </div>
      )}
    </div>
  );
};

export const AnnotationOverlay: React.FC = () => {
  const { annotations, comments, dotsVisible, selectedNote, selectNote, updateNotePosition } = useAnnotations();

  const allActive = [...annotations, ...comments];

  return (
    <>
      {dotsVisible && (
        <div className="annotation-overlay">
          {allActive.map((note) => (
            <DraggableMarker
              key={note.id}
              note={note}
              isSelected={selectedNote === note.id}
              onSelect={() => selectNote(note.id === selectedNote ? null : note.id)}
              onPositionChange={(x, y) => updateNotePosition(note.id, x, y)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export const AnnotationToggleBar: React.FC = () => {
  const { dotsVisible, panelOpen, toggleDots, togglePanel, annotations, comments } = useAnnotations();
  const totalActive = annotations.length + comments.length;

  return (
    <div className="annotation-toggle-bar">
      <CommentsIcon />
      <Switch
        id="annotation-toggle"
        label="Annotations"
        isChecked={dotsVisible}
        onChange={toggleDots}
        isReversed
      />
      {dotsVisible && (
        <>
          <span className="annotation-toggle-bar__divider" />
          <span className="annotation-toggle-bar__notes-count">
            {totalActive} note{totalActive !== 1 ? 's' : ''}
          </span>
          <Tooltip content={panelOpen ? 'Hide panel' : 'Show panel'}>
            <button
              type="button"
              onClick={togglePanel}
              aria-label="Toggle comment panel"
              className={`annotation-toggle-bar__panel-btn ${panelOpen ? 'annotation-toggle-bar__panel-btn--active' : ''}`}
            >
              <ListIcon />
            </button>
          </Tooltip>
        </>
      )}
    </div>
  );
};
