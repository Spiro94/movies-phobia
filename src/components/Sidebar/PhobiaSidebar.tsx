import { useState } from 'react';
import { usePhobiaContext } from '../../contexts/PhobiaContext';
import { PhobiaSelector } from '../PhobiaModal/PhobiaSelector';

export function PhobiaSidebar() {
  const { selectedPhobias, togglePhobia, setPhobias } = usePhobiaContext();
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
        style={{
          display: 'none',
          position: 'fixed',
          top: '80px',
          left: '16px',
          zIndex: 40,
          padding: '8px 12px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '6px',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
        }}
        className="mobile-toggle"
      >
        {isCollapsed ? 'Show Filters' : 'Hide Filters'}
      </button>

      {/* Sidebar */}
      <aside
        style={{
          width: '280px',
          minWidth: '280px',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          backgroundColor: '#1a1a1a',
          borderRight: '1px solid #333',
          padding: '20px',
          transition: 'transform 0.3s ease',
        }}
        className={isCollapsed ? 'sidebar-collapsed' : ''}
      >
        <div
          style={{
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid #333',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              color: '#fff',
            }}
          >
            Filter by Phobias
          </h2>
          <p
            style={{
              fontSize: '13px',
              color: '#aaa',
              margin: 0,
              lineHeight: '1.4',
            }}
          >
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
