import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { usePhobiaContext } from '../../contexts/PhobiaContext';
import { PhobiaSelector } from './PhobiaSelector';

export function PhobiaModal() {
  const { selectedPhobias, setPhobias, isLoaded } = usePhobiaContext();
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelections, setTempSelections] = useState<string[]>([]);
  const [showSkipWarning, setShowSkipWarning] = useState(false);

  // Open modal automatically if no phobias selected on first load
  useState(() => {
    if (isLoaded && selectedPhobias.length === 0) {
      setIsOpen(true);
      setTempSelections([]);
    }
  });

  const handleToggle = (phobiaId: string) => {
    setTempSelections((prev) => {
      if (prev.includes(phobiaId)) {
        return prev.filter((id) => id !== phobiaId);
      } else {
        return [...prev, phobiaId];
      }
    });
  };

  const handleClear = () => {
    setTempSelections([]);
  };

  const handleConfirm = () => {
    setPhobias(tempSelections);
    setIsOpen(false);
    setShowSkipWarning(false);
  };

  const handleSkip = () => {
    setShowSkipWarning(true);
  };

  const confirmSkip = () => {
    setPhobias([]);
    setIsOpen(false);
    setShowSkipWarning(false);
  };

  const cancelSkip = () => {
    setShowSkipWarning(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        {/* Modal content */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                style={{
                  backgroundColor: '#1a1a1a',
                  borderRadius: '12px',
                  padding: '32px',
                  maxWidth: '800px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflow: 'auto',
                  border: '1px solid #333',
                }}
              >
                {!showSkipWarning ? (
                  <>
                    <Dialog.Title
                      as="h2"
                      style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        marginBottom: '12px',
                        color: '#fff',
                      }}
                    >
                      Select Your Phobias
                    </Dialog.Title>
                    <Dialog.Description
                      style={{
                        fontSize: '14px',
                        color: '#aaa',
                        marginBottom: '24px',
                        lineHeight: '1.5',
                      }}
                    >
                      Choose the phobias that affect you to receive personalized
                      danger scores for movies. This helps you identify potentially
                      triggering content before watching.
                    </Dialog.Description>

                    <PhobiaSelector
                      selectedPhobias={tempSelections}
                      onToggle={handleToggle}
                      onClear={handleClear}
                    />

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '32px',
                        gap: '16px',
                      }}
                    >
                      <button
                        onClick={handleSkip}
                        style={{
                          padding: '10px 20px',
                          fontSize: '14px',
                          backgroundColor: 'transparent',
                          color: '#888',
                          border: '1px solid #444',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#2a2a2a';
                          e.currentTarget.style.borderColor = '#666';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = '#444';
                        }}
                      >
                        Skip for now
                      </button>

                      <button
                        onClick={handleConfirm}
                        disabled={tempSelections.length === 0}
                        style={{
                          padding: '10px 24px',
                          fontSize: '14px',
                          backgroundColor:
                            tempSelections.length > 0 ? '#646cff' : '#333',
                          color: tempSelections.length > 0 ? '#fff' : '#666',
                          border: 'none',
                          borderRadius: '6px',
                          cursor:
                            tempSelections.length > 0 ? 'pointer' : 'not-allowed',
                          fontWeight: '600',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          if (tempSelections.length > 0) {
                            e.currentTarget.style.backgroundColor = '#535bf2';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (tempSelections.length > 0) {
                            e.currentTarget.style.backgroundColor = '#646cff';
                          }
                        }}
                      >
                        Confirm Selection
                        {tempSelections.length > 0 &&
                          ` (${tempSelections.length})`}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Dialog.Title
                      as="h2"
                      style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        marginBottom: '12px',
                        color: '#ff9800',
                      }}
                    >
                      Skip Phobia Selection?
                    </Dialog.Title>
                    <Dialog.Description
                      style={{
                        fontSize: '14px',
                        color: '#aaa',
                        marginBottom: '24px',
                        lineHeight: '1.6',
                      }}
                    >
                      <p style={{ marginBottom: '12px' }}>
                        <strong style={{ color: '#fff' }}>
                          You won't see personalized danger scores.
                        </strong>
                      </p>
                      <p>
                        Without selecting phobias, all movies will show generic
                        danger information. You can always add your phobias later
                        using the sidebar filter.
                      </p>
                    </Dialog.Description>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '12px',
                        marginTop: '24px',
                      }}
                    >
                      <button
                        onClick={cancelSkip}
                        style={{
                          padding: '10px 20px',
                          fontSize: '14px',
                          backgroundColor: 'transparent',
                          color: '#fff',
                          border: '1px solid #666',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#2a2a2a';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        Go Back
                      </button>

                      <button
                        onClick={confirmSkip}
                        style={{
                          padding: '10px 24px',
                          fontSize: '14px',
                          backgroundColor: '#ff9800',
                          color: '#000',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f57c00';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ff9800';
                        }}
                      >
                        Skip Anyway
                      </button>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
