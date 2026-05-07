import * as React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Button,
  Content,
  Flex,
  FlexItem,
  Switch,
  TextArea,
  Title
} from '@patternfly/react-core';
import { ArrowRightIcon, CommentsIcon, GripVerticalIcon, TimesIcon, TrashIcon } from '@patternfly/react-icons';
import './AnnotationOverlay.css';

export interface Annotation {
  id: number;
  x: number;
  y: number;
  text: string;
  author: string;
  timestamp: string;
}

type AnnotationStore = Record<string, Annotation[]>;

const STORAGE_KEY = 'hcc-design-annotations';

const SEED_ANNOTATIONS: AnnotationStore = {
  '/my-user-access': [
    { id: 1, x: 200, y: 355, text: 'Clicking on a row or group name opens drawer.', author: 'Designer', timestamp: '5/7/2026, 1:30:00 PM' },
    { id: 2, x: 580, y: 190, text: "Drawer is the same as the 'Groups' tab on 'Users and Groups,' but the users and service accounts tabs have been removed.", author: 'Designer', timestamp: '5/7/2026, 1:30:00 PM' }
  ]
};

function loadAnnotations(): AnnotationStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors
  }
  saveAnnotations(SEED_ANNOTATIONS);
  return SEED_ANNOTATIONS;
}

function saveAnnotations(store: AnnotationStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore quota errors
  }
}

interface AnnotationContextType {
  annotations: Annotation[];
  isAnnotationMode: boolean;
  selectedAnnotation: number | null;
  toggleAnnotationMode: () => void;
  selectAnnotation: (id: number | null) => void;
  addAnnotation: (text: string) => void;
  removeAnnotation: (id: number) => void;
  updateAnnotationPosition: (id: number, x: number, y: number) => void;
}

const AnnotationContext = React.createContext<AnnotationContextType>({
  annotations: [],
  isAnnotationMode: false,
  selectedAnnotation: null,
  toggleAnnotationMode: () => {},
  selectAnnotation: () => {},
  addAnnotation: () => {},
  removeAnnotation: () => {},
  updateAnnotationPosition: () => {}
});

export const useAnnotations = () => React.useContext(AnnotationContext);

export const AnnotationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [store, setStore] = React.useState<AnnotationStore>(loadAnnotations);
  const [isAnnotationMode, setIsAnnotationMode] = React.useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = React.useState<number | null>(null);

  const annotations = store[currentPath] || [];

  const updateStore = React.useCallback((updater: (prev: Annotation[]) => Annotation[]) => {
    setStore(prevStore => {
      const currentAnnotations = prevStore[currentPath] || [];
      const updated = updater(currentAnnotations);
      const newStore = { ...prevStore, [currentPath]: updated };
      saveAnnotations(newStore);
      return newStore;
    });
  }, [currentPath]);

  React.useEffect(() => {
    setSelectedAnnotation(null);
  }, [currentPath]);

  const toggleAnnotationMode = React.useCallback(() => {
    setIsAnnotationMode(prev => {
      if (prev) setSelectedAnnotation(null);
      return !prev;
    });
  }, []);

  const selectAnnotation = React.useCallback((id: number | null) => {
    setSelectedAnnotation(id);
  }, []);

  const addAnnotation = React.useCallback((text: string) => {
    updateStore(prev => {
      const newId = prev.length > 0 ? Math.max(...prev.map(a => a.id)) + 1 : 1;
      return [...prev, {
        id: newId,
        x: 200 + (newId * 70) % 400,
        y: 150 + (newId * 90) % 350,
        text,
        author: 'You',
        timestamp: new Date().toLocaleString()
      }];
    });
  }, [updateStore]);

  const removeAnnotation = React.useCallback((id: number) => {
    updateStore(prev => prev.filter(a => a.id !== id));
    setSelectedAnnotation(prev => prev === id ? null : prev);
  }, [updateStore]);

  const updateAnnotationPosition = React.useCallback((id: number, x: number, y: number) => {
    updateStore(prev => prev.map(a => a.id === id ? { ...a, x, y } : a));
  }, [updateStore]);

  const value = React.useMemo(() => ({
    annotations,
    isAnnotationMode,
    selectedAnnotation,
    toggleAnnotationMode,
    selectAnnotation,
    addAnnotation,
    removeAnnotation,
    updateAnnotationPosition
  }), [annotations, isAnnotationMode, selectedAnnotation, toggleAnnotationMode, selectAnnotation, addAnnotation, removeAnnotation, updateAnnotationPosition]);

  return (
    <AnnotationContext.Provider value={value}>
      {children}
    </AnnotationContext.Provider>
  );
};

const DraggableMarker: React.FC<{
  annotation: Annotation;
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (x: number, y: number) => void;
}> = ({ annotation, isSelected, onSelect, onPositionChange }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const hasDragged = React.useRef(false);
  const dragOffset = React.useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    hasDragged.current = false;
    dragOffset.current = {
      x: e.clientX - annotation.x,
      y: e.clientY - annotation.y
    };
  };

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      hasDragged.current = true;
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
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

  const classNames = [
    'annotation-marker',
    isSelected ? 'annotation-marker--active' : '',
    isDragging ? 'annotation-marker--dragging' : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      style={{ left: annotation.x, top: annotation.y }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        if (!hasDragged.current) {
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Annotation ${annotation.id}: ${annotation.text}`}
      title={annotation.text}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect();
      }}
    >
      <span className="annotation-marker__pulse" />
      {annotation.id}
    </div>
  );
};

const AnnotationPanel: React.FC = () => {
  const { annotations, isAnnotationMode, selectedAnnotation, selectAnnotation, addAnnotation, removeAnnotation, toggleAnnotationMode } = useAnnotations();
  const location = useLocation();
  const [newComment, setNewComment] = React.useState('');
  const commentListRef = React.useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (newComment.trim()) {
      addAnnotation(newComment.trim());
      setNewComment('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  React.useEffect(() => {
    if (selectedAnnotation && commentListRef.current) {
      const el = commentListRef.current.querySelector(`[data-annotation-id="${selectedAnnotation}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedAnnotation]);

  return (
    <div className={`annotation-panel-overlay ${!isAnnotationMode ? 'annotation-panel-overlay--hidden' : ''}`}>
      {/* Header */}
      <Flex
        alignItems={{ default: 'alignItemsCenter' }}
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
        style={{ padding: '16px 24px', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}
      >
        <FlexItem>
          <Title headingLevel="h3" size="md">
            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem><CommentsIcon /></FlexItem>
              <FlexItem>Design Notes</FlexItem>
            </Flex>
          </Title>
        </FlexItem>
        <FlexItem>
          <Button variant="plain" aria-label="Close panel" onClick={toggleAnnotationMode}>
            <TimesIcon />
          </Button>
        </FlexItem>
      </Flex>

      {/* Notes list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }} ref={commentListRef}>
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: 16 }}>
          <FlexItem>
            <span className="annotation-notes-badge">
              {annotations.length} annotation{annotations.length !== 1 ? 's' : ''} on this page
            </span>
          </FlexItem>
          <FlexItem>
            <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
              Page: <strong>{location.pathname}</strong>
            </Content>
          </FlexItem>
          <FlexItem>
            <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
              <GripVerticalIcon style={{ marginRight: 4 }} />
              Drag numbered markers to reposition them.
            </Content>
          </FlexItem>
        </Flex>

        {annotations.length === 0 && (
          <Content component="p" style={{ color: 'var(--pf-t--global--text--color--subtle)', textAlign: 'center', padding: '32px 0' }}>
            No annotations on this page yet. Add one below.
          </Content>
        )}

        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
          {annotations.map((annotation) => (
            <FlexItem key={annotation.id}>
              <div
                data-annotation-id={annotation.id}
                className={`annotation-comment ${selectedAnnotation === annotation.id ? 'annotation-comment--selected' : ''}`}
                onClick={() => selectAnnotation(annotation.id === selectedAnnotation ? null : annotation.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') selectAnnotation(annotation.id === selectedAnnotation ? null : annotation.id);
                }}
              >
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: 6 }}>
                  <FlexItem><span className="annotation-comment__number">{annotation.id}</span></FlexItem>
                  <FlexItem><strong style={{ fontSize: 13 }}>{annotation.author}</strong></FlexItem>
                  <FlexItem align={{ default: 'alignRight' }}>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>
                        <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{annotation.timestamp}</Content>
                      </FlexItem>
                      <FlexItem>
                        <Button
                          variant="plain"
                          size="sm"
                          aria-label={`Delete annotation ${annotation.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAnnotation(annotation.id);
                          }}
                          className="annotation-comment__delete"
                        >
                          <TrashIcon />
                        </Button>
                      </FlexItem>
                    </Flex>
                  </FlexItem>
                </Flex>
                <Content component="p" style={{ margin: 0, fontSize: 14 }}>{annotation.text}</Content>
              </div>
            </FlexItem>
          ))}
        </Flex>
      </div>

      {/* Input */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--pf-t--global--border--color--default)' }}>
        <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsFlexStart' }}>
          <FlexItem flex={{ default: 'flex_1' }}>
            <TextArea
              value={newComment}
              onChange={(_e, val) => setNewComment(val)}
              placeholder="Add a comment..."
              aria-label="Add a comment"
              rows={2}
              onKeyDown={handleKeyDown}
            />
          </FlexItem>
          <FlexItem>
            <Button
              variant="plain"
              onClick={handleSubmit}
              isDisabled={!newComment.trim()}
              aria-label="Send comment"
              style={{ color: newComment.trim() ? '#e91e8a' : undefined }}
            >
              <ArrowRightIcon />
            </Button>
          </FlexItem>
        </Flex>
      </div>
    </div>
  );
};

export const AnnotationOverlay: React.FC = () => {
  const { annotations, isAnnotationMode, selectedAnnotation, selectAnnotation, updateAnnotationPosition } = useAnnotations();

  if (!isAnnotationMode) return <AnnotationPanel />;

  return (
    <>
      <div className="annotation-overlay annotation-overlay--active">
        {annotations.map((annotation) => (
          <DraggableMarker
            key={annotation.id}
            annotation={annotation}
            isSelected={selectedAnnotation === annotation.id}
            onSelect={() => selectAnnotation(annotation.id === selectedAnnotation ? null : annotation.id)}
            onPositionChange={(x, y) => updateAnnotationPosition(annotation.id, x, y)}
          />
        ))}
      </div>
      <AnnotationPanel />
    </>
  );
};

export const AnnotationToggleBar: React.FC = () => {
  const { isAnnotationMode, toggleAnnotationMode, annotations } = useAnnotations();

  return (
    <div className="annotation-toggle-bar">
      <CommentsIcon />
      <Switch
        id="annotation-toggle"
        label="Design annotations"
        isChecked={isAnnotationMode}
        onChange={toggleAnnotationMode}
        isReversed
      />
      {isAnnotationMode && (
        <Content component="small" style={{ opacity: 0.7 }}>
          {annotations.length} note{annotations.length !== 1 ? 's' : ''}
        </Content>
      )}
    </div>
  );
};
