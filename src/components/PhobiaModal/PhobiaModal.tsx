import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { usePhobias } from '../../hooks/usePhobias';
import { PhobiaSelector } from './PhobiaSelector';

export function PhobiaModal() {
  const { selectedPhobias, setPhobias, isLoaded } = usePhobias();
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
              <Dialog.Panel className="bg-app-card rounded-xl p-8 max-w-[800px] w-full max-h-[90vh] overflow-auto border border-app-border">
                {!showSkipWarning ? (
                  <>
                    <Dialog.Title
                      as="h2"
                      className="text-2xl font-bold mb-3 text-white"
                    >
                      Select Your Phobias
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-gray-400 mb-6 leading-normal">
                      Choose the phobias that affect you to receive personalized
                      danger scores for movies. This helps you identify potentially
                      triggering content before watching.
                    </Dialog.Description>

                    <PhobiaSelector
                      selectedPhobias={tempSelections}
                      onToggle={handleToggle}
                      onClear={handleClear}
                    />

                    <div className="flex justify-between items-center mt-8 gap-4">
                      <button
                        onClick={handleSkip}
                        className="px-5 py-2.5 text-sm bg-transparent text-gray-500 border border-[#444] rounded-md cursor-pointer transition-all hover:bg-[#2a2a2a] hover:border-[#666]"
                      >
                        Skip for now
                      </button>

                      <button
                        onClick={handleConfirm}
                        disabled={tempSelections.length === 0}
                        className={`px-6 py-2.5 text-sm border-none rounded-md font-semibold transition-all ${
                          tempSelections.length > 0
                            ? 'bg-[#646cff] text-white cursor-pointer hover:bg-[#535bf2]'
                            : 'bg-[#333] text-[#666] cursor-not-allowed'
                        }`}
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
                      className="text-2xl font-bold mb-3 text-danger-yellow"
                    >
                      Skip Phobia Selection?
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-gray-400 mb-6 leading-relaxed">
                      <p className="mb-3">
                        <strong className="text-white">
                          You won't see personalized danger scores.
                        </strong>
                      </p>
                      <p>
                        Without selecting phobias, all movies will show generic
                        danger information. You can always add your phobias later
                        using the sidebar filter.
                      </p>
                    </Dialog.Description>

                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={cancelSkip}
                        className="px-5 py-2.5 text-sm bg-transparent text-white border border-[#666] rounded-md cursor-pointer transition-all hover:bg-[#2a2a2a]"
                      >
                        Go Back
                      </button>

                      <button
                        onClick={confirmSkip}
                        className="px-6 py-2.5 text-sm bg-danger-yellow text-black border-none rounded-md cursor-pointer font-semibold transition-all hover:bg-[#f57c00]"
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
