import { useState } from 'react';
import { Dialog } from '@headlessui/react';
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

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />

      {/* Full-screen container */}
      <div className="fixed inset-0 flex items-start justify-center p-4 pt-20">
        <Dialog.Panel
          style={{
            background: '#1a1a1a',
            borderRadius: '8px',
            padding: '30px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            color: 'white',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <Dialog.Title style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
              Scene Tagging
            </Dialog.Title>
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

          {/* Content */}
          <div style={{ minHeight: '300px' }}>
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
            marginTop: '25px',
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
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
