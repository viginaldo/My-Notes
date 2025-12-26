import React from 'react';

const stickers = ['😀', '😂', '🥰', '😎', '🌟', '🎉', '❤️', '🔥', '📌', '📍', '🎨', '✏️'];

const StickerPicker = ({ onSelectSticker }) => {
  return (
    <div className="tool-panel">
      <h3>Stickers</h3>
      <div className="sticker-grid">
        {stickers.map((sticker, index) => (
          <button
            key={index}
            className="sticker-item"
            onClick={() => onSelectSticker(sticker)}
          >
            {sticker}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StickerPicker;