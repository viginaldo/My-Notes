import React, { useState, useRef } from 'react';
import Toolbar from './components/Toolbar';
import NoteEditor from './components/NoteEditor';
import BackgroundPicker from './components/BackgroundPicker';
import TextEffects from './components/TextEffects';
import ShareExport from './components/ShareExport';
import { 
  FaPalette, 
  FaFont, 
  FaMagic, 
  FaShareAlt, 
  FaDownload,
  FaTimes
} from 'react-icons/fa';
import './App.css';

function App() {
  const [activeTool, setActiveTool] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [textStyle, setTextStyle] = useState({
    fontSize: '20px', // Aumentado para melhor visualização mobile
    fontWeight: 'normal',
    color: '#000000',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: '1.6',
    textAlign: 'center',
    backgroundColor: '#ffffff'
  });
  const noteRef = useRef(null);

  const handleToolSelect = (tool) => {
    setActiveTool(activeTool === tool ? null : tool);
  };

  const changeBackground = (color) => {
    setTextStyle({ ...textStyle, backgroundColor: color });
  };

  const applyTextEffect = (effect) => {
    setTextStyle({ ...textStyle, ...effect });
  };

  const tools = [
    { id: 'background', label: 'Background', icon: <FaPalette /> },
    { id: 'text', label: 'Text', icon: <FaFont /> },
    { id: 'effects', label: 'Effects', icon: <FaMagic /> },
    { id: 'share', label: 'Share', icon: <FaShareAlt /> },
    { id: 'export', label: 'Export', icon: <FaDownload /> }
  ];

  return (
    <div className="app">
      <div className="header">
        <h1>Notepad Pro</h1>
        <div className="subtitle">Create & Share Beautiful Notes</div>
      </div>
      
      <div className="note-container" ref={noteRef}>
        <div className="note-wrapper">
          <NoteEditor 
            content={noteContent}
            onChange={setNoteContent}
            textStyle={textStyle}
          />
        </div>
      </div>

      <Toolbar 
        tools={tools}
        activeTool={activeTool}
        onToolSelect={handleToolSelect}
      />

      {activeTool === 'background' && (
        <BackgroundPicker onSelectColor={changeBackground} />
      )}

      {activeTool === 'effects' && (
        <TextEffects onApplyEffect={applyTextEffect} currentStyle={textStyle} />
      )}

      {activeTool === 'text' && (
        <div className="tool-panel">
          <div className="format-toolbar">
            <button 
              className={`format-btn ${textStyle.fontWeight === 'bold' ? 'active' : ''}`}
              onClick={() => applyTextEffect({ fontWeight: textStyle.fontWeight === 'bold' ? 'normal' : 'bold' })}
              title="Bold"
            >
              <strong>B</strong>
            </button>
            <button 
              className={`format-btn ${textStyle.fontStyle === 'italic' ? 'active' : ''}`}
              onClick={() => applyTextEffect({ fontStyle: textStyle.fontStyle === 'italic' ? 'normal' : 'italic' })}
              title="Italic"
            >
              <em>I</em>
            </button>
            <button 
              className={`format-btn ${textStyle.textDecoration === 'underline' ? 'active' : ''}`}
              onClick={() => applyTextEffect({ textDecoration: textStyle.textDecoration === 'underline' ? 'none' : 'underline' })}
              title="Underline"
            >
              <u>U</u>
            </button>
            <button 
              className={`format-btn align-btn ${textStyle.textAlign === 'left' ? 'active' : ''}`}
              onClick={() => applyTextEffect({ textAlign: 'left' })}
              title="Align Left"
            >
              <span className="align-icon">⎡</span>
            </button>
            <button 
              className={`format-btn align-btn ${textStyle.textAlign === 'center' ? 'active' : ''}`}
              onClick={() => applyTextEffect({ textAlign: 'center' })}
              title="Align Center"
            >
              <span className="align-icon">⎢</span>
            </button>
            <button 
              className={`format-btn align-btn ${textStyle.textAlign === 'right' ? 'active' : ''}`}
              onClick={() => applyTextEffect({ textAlign: 'right' })}
              title="Align Right"
            >
              <span className="align-icon">⎣</span>
            </button>
          </div>
        </div>
      )}

      {(activeTool === 'share' || activeTool === 'export') && (
        <ShareExport 
          noteRef={noteRef}
          noteContent={noteContent}
          textStyle={textStyle}
          activeTool={activeTool}
          onClose={() => setActiveTool(null)}
        />
      )}
    </div>
  );
}

export default App;