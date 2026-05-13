/**
 * CROMENIX TERRITORY SERVER
 * EthinX Empire OS — Territory: Cromenix
 * Port: 3020 | Brand: Gold (#C9A84C) / Bright Gold (#E8C96A)
 * Revenue Split: 70% Operator / 30% EthinX Core
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3020;
const TERRITORY = {
  name: process.env.TERRITORY_NAME || 'Cromenix',
  id: process.env.TERRITORY_ID || 'cromenix',
  brand: {
    primary: process.env.BRAND_PRIMARY || '#C9A84C',
    secondary: process.env.BRAND_SECONDARY || '#E8C96A',
    background: '#0A0A0A',
    text: '#F5F5F5'
  },
  revenue: {
    operatorSplit: parseInt(process.env.REVENUE_SPLIT_OPERATOR || '70'),
    coreSplit: parseInt(process.env.REVENUE_SPLIT_CORE || '30')
  }
};

// In-memory metrics
const metrics = {
  requests: 0,
  startTime: Date.now(),
  lastActivity: null
};

function generateHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${TERRITORY.name} — EthinX Territory</title>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: ${TERRITORY.brand.background};
      color: ${TERRITORY.brand.text};
      font-family: 'Rajdhani', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    
    /* Animated background grid */
    body::before {
      content: '';
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: 
        linear-gradient(rgba(201, 168, 76, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(201, 168, 76, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: gridPulse 4s ease-in-out infinite;
      z-index: 0;
    }
    
    @keyframes gridPulse {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.8; }
    }
    
    .container {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 2rem;
    }
    
    .territory-badge {
      display: inline-block;
      padding: 0.5rem 2rem;
      border: 1px solid ${TERRITORY.brand.primary};
      border-radius: 2px;
      font-family: 'Orbitron', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: ${TERRITORY.brand.primary};
      margin-bottom: 2rem;
      position: relative;
    }
    
    .territory-badge::before,
    .territory-badge::after {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      border: 1px solid ${TERRITORY.brand.secondary};
    }
    .territory-badge::before { top: -4px; left: -4px; border-right: none; border-bottom: none; }
    .territory-badge::after { bottom: -4px; right: -4px; border-left: none; border-top: none; }
    
    h1 {
      font-family: 'Orbitron', monospace;
      font-size: 4rem;
      font-weight: 900;
      background: linear-gradient(135deg, ${TERRITORY.brand.primary}, ${TERRITORY.brand.secondary});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 1rem;
      text-shadow: 0 0 40px rgba(201, 168, 76, 0.3);
    }
    
    .subtitle {
      font-size: 1.2rem;
      color: rgba(245, 245, 245, 0.6);
      letter-spacing: 0.1em;
      margin-bottom: 3rem;
    }
    
    .status-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .status-card {
      background: rgba(201, 168, 76, 0.05);
      border: 1px solid rgba(201, 168, 76, 0.15);
      padding: 1.5rem;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    
    .status-card:hover {
      border-color: ${TERRITORY.brand.primary};
      background: rgba(201, 168, 76, 0.1);
      transform: translateY(-2px);
    }
    
    .status-label {
      font-family: 'Orbitron', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: ${TERRITORY.brand.primary};
      margin-bottom: 0.5rem;
    }
    
    .status-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: ${TERRITORY.brand.text};
    }
    
    .pulse-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
      margin-right: 0.5rem;
      animation: pulse 2s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
      50% { opacity: 0.8; box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
    }
    
    .footer {
      position: fixed;
      bottom: 2rem;
      font-family: 'Orbitron', monospace;
      font-size: 0.6rem;
      letter-spacing: 0.3em;
      color: rgba(201, 168, 76, 0.3);
    }
    
    @media (max-width: 640px) {
      h1 { font-size: 2.5rem; }
      .status-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="territory-badge">EthinX Territory</div>
    <h1>${TERRITORY.name.toUpperCase()}</h1>
    <p class="subtitle"><span class="pulse-dot"></span>Territory Online — Revenue Engine Active</p>
    
    <div class="status-grid">
      <div class="status-card">
        <div class="status-label">Status</div>
        <div class="status-value">ACTIVE</div>
      </div>
      <div class="status-card">
        <div class="status-label">Port</div>
        <div class="status-value">${PORT}</div>
      </div>
      <div class="status-card">
        <div class="status-label">Revenue Split</div>
        <div class="status-value">${TERRITORY.revenue.operatorSplit}/${TERRITORY.revenue.coreSplit}</div>
      </div>
    </div>
  </div>
  
  <div class="footer">POWERED BY ETHINX EMPIRE OS</div>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  metrics.requests++;
  metrics.lastActivity = new Date().toISOString();

  // Health check endpoint
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'operational',
      territory: TERRITORY.name,
      port: PORT,
      uptime: Math.floor((Date.now() - metrics.startTime) / 1000),
      requests: metrics.requests,
      revenue_split: `${TERRITORY.revenue.operatorSplit}/${TERRITORY.revenue.coreSplit}`,
      timestamp: new Date().toISOString()
    }));
  }

  // API status endpoint
  if (req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      territory: TERRITORY,
      metrics: {
        ...metrics,
        uptimeSeconds: Math.floor((Date.now() - metrics.startTime) / 1000)
      }
    }));
  }

  // Main landing page
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(generateHTML());
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[CROMENIX] Territory server online on port ${PORT}`);
  console.log(`[CROMENIX] Brand: ${TERRITORY.brand.primary} / ${TERRITORY.brand.secondary}`);
  console.log(`[CROMENIX] Revenue Split: ${TERRITORY.revenue.operatorSplit}% Operator / ${TERRITORY.revenue.coreSplit}% Core`);
});
