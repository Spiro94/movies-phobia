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
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <DialogBackdrop className="fixed inset-0 bg-black/80" />

      {/* Modal Panel Container */}
      <div className="fixed inset-0 overflow-y-auto z-10">
        <div className="flex items-start justify-center min-h-full pt-20 px-4 pb-4">
          <DialogPanel className="relative bg-app-card rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] max-w-[672px] w-full max-h-[90vh] overflow-y-auto text-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-5 p-5 pb-0">
              <h2 className="text-[1.8rem] font-bold m-0">
                Scene Tagging
              </h2>
              <button
                onClick={onClose}
                className="bg-transparent border-none text-white text-2xl cursor-pointer p-1.5 leading-none"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="px-5 pb-5">
              {/* Tabs */}
              <div className="tabs flex gap-2.5 mb-6 border-b-2 border-white/10">
                <button
                  onClick={() => setActiveTab('view')}
                  className={`px-5 py-2.5 border-none border-b-2 text-white text-base cursor-pointer -mb-0.5 ${
                    activeTab === 'view'
                      ? 'bg-white/10 border-[#1976d2]'
                      : 'bg-transparent border-transparent'
                  }`}
                >
                  View Tags {tags.length > 0 && `(${tags.length})`}
                </button>
                <button
                  onClick={() => setActiveTab('add')}
                  className={`px-5 py-2.5 border-none border-b-2 text-white text-base cursor-pointer -mb-0.5 ${
                    activeTab === 'add'
                      ? 'bg-white/10 border-[#1976d2]'
                      : 'bg-transparent border-transparent'
                  }`}
                >
                  Add Tag
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[300px] mb-6">
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
              <div className="pt-5 border-t-2 border-white/10 text-right">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-white/10 border border-white/20 rounded text-white text-base cursor-pointer transition-colors hover:bg-white/20"
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
