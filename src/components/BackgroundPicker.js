import React from 'react';
import { FaFillDrip } from 'react-icons/fa';

const colors = [
  '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6',
  '#ced4da', '#adb5bd', '#6c757d', '#495057',
  '#343a40', '#212529', '#667eea', '#764ba2',
  '#6B46C1', '#4C51BF', '#4299E1', '#38B2AC',
  '#48BB78', '#ECC94B', '#ED8936', '#F56565'
];

const BackgroundPicker = ({ onSelectColor }) => {
  return (
    <div className="tool-panel">
      <h3>
        <FaFillDrip style={{ marginRight: '10px' }} />
        Background Color
      </h3>
      <div className="color-grid">
        {colors.map((color, index) => (
          <button
            key={index}
            className="color-item"
            style={{ backgroundColor: color }}
            onClick={() => onSelectColor(color)}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};

export default BackgroundPicker;