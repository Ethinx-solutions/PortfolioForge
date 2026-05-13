import { findMatches, assemblePrompt, detectIncomeIntent } from '../shared-logic/engine.js';

document.getElementById('generate').addEventListener('click', () => {
  const input = document.getElementById('input').value;
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (!input) return;

  const matches = findMatches(input);
  const isIncomeOriented = detectIncomeIntent(input);

  if (matches.length === 0) {
    resultsDiv.innerHTML = '<p style="font-size: 12px; color: #6b7280;">No direct matches. Try adding keywords like "app", "SaaS", or "digital product".</p>';
    return;
  }

  matches.forEach(match => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-title">${match.title}</div>
      <div class="card-meta">${match.category}</div>
      <div class="badge">Passive Score: ${match.passiveScore}/10</div>
    `;
    card.addEventListener('click', () => {
      const finalPrompt = assemblePrompt(
        match.template, 
        input, 
        isIncomeOriented ? "Focus on scalable revenue model and automation." : ""
      );
      navigator.clipboard.writeText(finalPrompt).then(() => {
        alert('Prompt copied to clipboard! Optimized for income & scaling.');
      });
    });
    resultsDiv.appendChild(card);
  });
});
