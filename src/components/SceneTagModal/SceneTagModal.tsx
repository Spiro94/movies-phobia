import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useSceneTags } from '../../hooks/useSceneTags';
import { TagForm } from './TagForm';
import { TimelineTags } from './TimelineTags';

interface SceneTagModalProps {
  movieId: string;
  movieRuntime: number; // minutes
  isOpen: boolean;
  onClose: () => void;
}

export function SceneTagModal({ movieId, movieRuntime, isOpen, onClose }: SceneTagModalProps) {
  const { tags, addTag, removeTag } = useSceneTags(movieId);
  const [activeTab, setActiveTab] = useState<'view' | 'add'>('view');

  console.log('[SceneTagModal] Rendering with props:', { movieId, movieRuntime, isOpen });
  console.log('[SceneTagModal] Tags loaded:', tags.length);

  if (!isOpen) {
    console.log('[SceneTagModal] Modal is closed, not rendering Dialog');
    return null;
  }

  console.log('[SceneTagModal] Modal is open, rendering Dialog');

  return (
    <Dialog open={isOpen} onClose={onClose} style={{ position: 'relative', zIndex: 50 }}>
      {/* Backdrop */}
      <DialogBackdrop
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      />

      {/* Modal Panel Container */}
      <div style={{
        position: 'fixed',
        inset: 0,
        overflowY: 'auto',
        zIndex: 10,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          minHeight: '100%',
          padding: '80px 16px 16px 16px',
        }}>
          <DialogPanel style={{
            position: 'relative',
            background: '#1a1a1a',
            borderRadius: '8px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '672px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            color: 'white',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              padding: '20px 20px 0 20px',
            }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>
                Scene Tagging
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '5px',
                  lineHeight: 1,
                }}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '0 20px 20px 20px' }}>
              {/* Tabs */}
              <div
                className="tabs"
                style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '25px',
                  borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <button
                  onClick={() => setActiveTab('view')}
                  style={{
                    padding: '10px 20px',
                    background: activeTab === 'view' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === 'view' ? '2px solid #1976d2' : '2px solid transparent',
                    color: 'white',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    marginBottom: '-2px',
                  }}
                >
                  View Tags {tags.length > 0 && `(${tags.length})`}
                </button>
                <button
                  onClick={() => setActiveTab('add')}
                  style={{
                    padding: '10px 20px',
                    background: activeTab === 'add' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === 'add' ? '2px solid #1976d2' : '2px solid transparent',
                    color: 'white',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    marginBottom: '-2px',
                  }}
                >
                  Add Tag
                </button>
              </div>

              {/* Tab Content */}
              <div style={{ minHeight: '300px', marginBottom: '25px' }}>
                {activeTab === 'view' ? (
                  <TimelineTags tags={tags} onRemoveTag={removeTag} />
                ) : (
                  <TagForm
                    movieRuntime={movieRuntime}
                    onSubmit={(tag) => {
                      addTag(tag);
                      setActiveTab('view'); // Switch to view after adding
                    }}
                  />
                )}
              </div>

              {/* Footer */}
              <div style={{
                paddingTop: '20px',
                borderTop: '2px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'right',
              }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '1rem',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
