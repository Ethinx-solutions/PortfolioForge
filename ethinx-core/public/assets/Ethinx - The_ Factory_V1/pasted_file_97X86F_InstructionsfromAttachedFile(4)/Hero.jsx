import React from 'react';
import '../styles/Hero.css';

function Hero() {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          React Stripe Integration Guide
        </h1>
        <p className="hero-subtitle">
          Complete setup for Neural Recon Strike ($2,500 AUD) with industrial aesthetic
        </p>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">8</span>
            <span className="stat-label">Steps to Deploy</span>
          </div>
          <div className="stat">
            <span className="stat-number">100%</span>
            <span className="stat-label">Production Ready</span>
          </div>
          <div className="stat">
            <span className="stat-number">0px</span>
            <span className="stat-label">Border Radius</span>
          </div>
        </div>

        <div className="hero-features">
          <h2>What You'll Learn</h2>
          <ul className="features-list">
            <li>✓ Complete Stripe integration setup</li>
            <li>✓ React component architecture</li>
            <li>✓ Backend API configuration</li>
            <li>✓ Webhook handling and events</li>
            <li>✓ Security best practices</li>
            <li>✓ Production deployment</li>
            <li>✓ Troubleshooting guide</li>
            <li>✓ Monitoring and analytics</li>
          </ul>
        </div>

        <div className="hero-cta">
          <button className="cta-button primary">
            Start Learning
          </button>
          <button className="cta-button secondary">
            View on GitHub
          </button>
        </div>

        <div className="hero-tech-stack">
          <h3>Tech Stack</h3>
          <div className="tech-badges">
            <span className="tech-badge">React 19</span>
            <span className="tech-badge">Stripe API</span>
            <span className="tech-badge">Express.js</span>
            <span className="tech-badge">Node.js</span>
            <span className="tech-badge">Webhooks</span>
            <span className="tech-badge">HTTPS</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="visual-box">
          <div className="visual-icon">💳</div>
          <p>Secure Payment Processing</p>
        </div>
        <div className="visual-box">
          <div className="visual-icon">⚙️</div>
          <p>Full Integration</p>
        </div>
        <div className="visual-box">
          <div className="visual-icon">🚀</div>
          <p>Production Ready</p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
