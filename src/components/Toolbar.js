import React from 'react';

const Toolbar = ({ tools, activeTool, onToolSelect }) => {
  return (
    <div className="toolbar">
      {tools.map(tool => (
        <button
          key={tool.id}
          className={`tool-button ${activeTool === tool.id ? 'active' : ''}`}
          onClick={() => onToolSelect(tool.id)}
        >
          <span className="icon">{tool.icon}</span>
          <span>{tool.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Toolbar;