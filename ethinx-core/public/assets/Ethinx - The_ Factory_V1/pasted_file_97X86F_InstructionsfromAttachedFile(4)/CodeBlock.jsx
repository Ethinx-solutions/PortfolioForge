import React, { useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-bash';
import '../styles/CodeBlock.css';

function CodeBlock({ code, language = 'javascript', title = '' }) {
  const [copied, setCopied] = useState(false);

  const highlightCode = () => {
    return Prism.highlight(code, Prism.languages[language] || Prism.languages.javascript, language);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-container">
      {title && <div className="code-block-title">{title}</div>}
      <div className="code-block-header">
        <span className="code-language">{language}</span>
        <button 
          className={`copy-button ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="code-block-pre">
        <code 
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlightCode() }}
        />
      </pre>
    </div>
  );
}

export default CodeBlock;
