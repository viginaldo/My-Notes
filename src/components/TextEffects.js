import React, { useState } from 'react';
import { 
  FaTextHeight, 
  FaPalette, 
  FaBold, 
  FaItalic, 
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaMagic
} from 'react-icons/fa';

const TextEffects = ({ onApplyEffect, currentStyle }) => {
  const [fontSize, setFontSize] = useState(parseInt(currentStyle.fontSize));
  const [color, setColor] = useState(currentStyle.color);

  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 40];
  const colors = [
    '#000000', '#2D3748', '#4A5568', '#718096',
    '#667eea', '#764ba2', '#F56565', '#ED8936',
    '#ECC94B', '#48BB78', '#38B2AC', '#4299E1'
  ];

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    onApplyEffect({ fontSize: `${size}px` });
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
    onApplyEffect({ color: newColor });
  };

  return (
    <div className="tool-panel">
      <h3>
        <FaMagic style={{ marginRight: '10px' }} />
        Text Effects
      </h3>
      
      <div className="effect-section">
        <h4>
          <FaTextHeight style={{ marginRight: '8px' }} />
          Font Size
        </h4>
        <div className="size-buttons">
          {fontSizes.map(size => (
            <button
              key={size}
              className={`size-button ${fontSize === size ? 'active' : ''}`}
              onClick={() => handleFontSizeChange(size)}
            >
              {size}px
            </button>
          ))}
        </div>
      </div>

      <div className="effect-section">
        <h4>
          <FaPalette style={{ marginRight: '8px' }} />
          Text Color
        </h4>
        <div className="color-buttons">
          {colors.map((col, index) => (
            <button
              key={index}
              className="color-button"
              style={{ 
                backgroundColor: col,
                border: color === col ? '3px solid #667eea' : '2px solid #e2e8f0'
              }}
              onClick={() => handleColorChange(col)}
            />
          ))}
        </div>
      </div>

      <div className="effect-section">
        <h4>Text Style</h4>
        <div className="style-buttons">
          <button 
            className={`style-btn ${currentStyle.fontWeight === 'bold' ? 'active' : ''}`}
            onClick={() => onApplyEffect({ 
              fontWeight: currentStyle.fontWeight === 'bold' ? 'normal' : 'bold' 
            })}
          >
            <FaBold /> Bold
          </button>
          <button 
            className={`style-btn ${currentStyle.fontStyle === 'italic' ? 'active' : ''}`}
            onClick={() => onApplyEffect({ 
              fontStyle: currentStyle.fontStyle === 'italic' ? 'normal' : 'italic' 
            })}
          >
            <FaItalic /> Italic
          </button>
          <button 
            className={`style-btn ${currentStyle.textDecoration === 'underline' ? 'active' : ''}`}
            onClick={() => onApplyEffect({ 
              textDecoration: currentStyle.textDecoration === 'underline' ? 'none' : 'underline' 
            })}
          >
            <FaUnderline /> Underline
          </button>
        </div>
      </div>

      <div className="effect-section">
        <h4>Text Alignment</h4>
        <div className="alignment-buttons">
          <button 
            className={`align-option ${currentStyle.textAlign === 'left' ? 'active' : ''}`}
            onClick={() => onApplyEffect({ textAlign: 'left' })}
            title="Align Left"
          >
            <FaAlignLeft />
            <span>Left</span>
          </button>
          <button 
            className={`align-option ${currentStyle.textAlign === 'center' ? 'active' : ''}`}
            onClick={() => onApplyEffect({ textAlign: 'center' })}
            title="Align Center"
          >
            <FaAlignCenter />
            <span>Center</span>
          </button>
          <button 
            className={`align-option ${currentStyle.textAlign === 'right' ? 'active' : ''}`}
            onClick={() => onApplyEffect({ textAlign: 'right' })}
            title="Align Right"
          >
            <FaAlignRight />
            <span>Right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextEffects;