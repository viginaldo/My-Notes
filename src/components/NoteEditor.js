import React from 'react';
import './NoteEditor.css';

const NoteEditor = ({ content, onChange, textStyle }) => {
  return (
    <div className="note-editor-wrapper">
      <textarea
        className="note-editor"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start typing your note here..."
        style={textStyle}
        autoFocus
      />
      <div className="editor-footer">
        <span className="character-count">
          {content.length} characters
        </span>
        <span className="alignment-indicator">
          Align: {textStyle.textAlign || 'left'}
        </span>
      </div>
    </div>
  );
};

export default NoteEditor;