import React from 'react';
import '../styles/Sidebar.css';

function Sidebar({ sections, activeSection, onSectionChange }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-title">Documentation</h3>
          <ul className="nav-list">
            {Object.entries(sections).map(([key, section]) => (
              <li key={key}>
                <button
                  className={`nav-link ${activeSection === key ? 'active' : ''}`}
                  onClick={() => onSectionChange(key)}
                >
                  <span className="nav-icon">{section.icon}</span>
                  <span className="nav-text">{section.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-section resources">
          <h3 className="nav-title">Resources</h3>
          <ul className="nav-list">
            <li>
              <a href="https://stripe.com/docs" target="_blank" rel="noopener noreferrer" className="nav-link">
                <span className="nav-icon">📚</span>
                <span className="nav-text">Stripe Docs</span>
              </a>
            </li>
            <li>
              <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="nav-link">
                <span className="nav-icon">⚛️</span>
                <span className="nav-text">React Docs</span>
              </a>
            </li>
            <li>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="nav-link">
                <span className="nav-icon">🐙</span>
                <span className="nav-text">GitHub</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
