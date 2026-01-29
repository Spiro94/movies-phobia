import { useState } from 'react';
import { usePhobias } from '../../hooks/usePhobias';
import { PhobiaSelector } from '../PhobiaModal/PhobiaSelector';

export function PhobiaSidebar() {
  const { selectedPhobias, togglePhobia, setPhobias } = usePhobias();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleClear = () => {
    setPhobias([]);
  };

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleCollapsed}
        className="mobile-toggle hidden md:hidden fixed top-20 left-4 z-40 px-3 py-2 bg-app-card border border-app-border rounded-md text-white cursor-pointer text-sm font-semibold"
      >
        {isCollapsed ? 'Show Filters' : 'Hide Filters'}
      </button>

      {/* Sidebar */}
      <aside
        className={`w-[280px] min-w-[280px] sticky top-0 h-screen overflow-y-auto bg-app-card border-r border-app-border p-5 transition-transform duration-300 ease-in-out ${
          isCollapsed ? 'sidebar-collapsed' : ''
        }`}
      >
        <div className="mb-5 pb-4 border-b border-app-border">
          <h2 className="text-lg font-bold m-0 mb-2 text-white">
            Filter by Phobias
          </h2>
          <p className="text-[13px] text-gray-400 m-0 leading-snug">
            Select or deselect phobias to update danger scores in real-time
          </p>
        </div>

        <PhobiaSelector
          selectedPhobias={selectedPhobias}
          onToggle={togglePhobia}
          onClear={handleClear}
        />
      </aside>

      {/* Mobile-specific styles */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-toggle {
            display: block !important;
          }

          aside {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 30;
            box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
          }

          .sidebar-collapsed {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </>
  );
}
