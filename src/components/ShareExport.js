import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { 
  FaWhatsapp, 
  FaFacebook, 
  FaDownload, 
  FaImage,
  FaMobileAlt,
  FaInstagram,
  FaTwitter,
  FaTimes
} from 'react-icons/fa';
import './ShareExport.css';

const ShareExport = ({ noteRef, noteContent, textStyle, activeTool, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('story');
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const previewRef = useRef(null);

  const formats = [
    { id: 'story', label: 'Story', icon: <FaMobileAlt />, ratio: '9:16', desc: 'WhatsApp/Instagram' },
    { id: 'post', label: 'Post', icon: <FaFacebook />, ratio: '1:1', desc: 'Facebook/Twitter' },
    { id: 'original', label: 'Original', icon: <FaImage />, ratio: 'Auto', desc: 'Keep layout' }
  ];

  const optimizeForStory = async (canvas) => {
    // Criar um canvas com proporção 9:16 (story)
    const storyWidth = 1080; // Largura ideal para stories
    const storyHeight = 1920; // Altura ideal para stories
    
    const storyCanvas = document.createElement('canvas');
    storyCanvas.width = storyWidth;
    storyCanvas.height = storyHeight;
    const ctx = storyCanvas.getContext('2d');

    // Fundo gradiente ou sólido baseado na cor de fundo
    if (textStyle.backgroundColor && textStyle.backgroundColor !== '#ffffff') {
      ctx.fillStyle = textStyle.backgroundColor;
      ctx.fillRect(0, 0, storyWidth, storyHeight);
    } else {
      // Gradiente padrão para stories
      const gradient = ctx.createLinearGradient(0, 0, storyWidth, storyHeight);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, storyWidth, storyHeight);
    }

    // Calcular dimensões para o conteúdo
    const contentWidth = canvas.width;
    const contentHeight = canvas.height;
    
    // Calcular escala para caber no story
    const scale = Math.min(
      (storyWidth * 0.8) / contentWidth,
      (storyHeight * 0.6) / contentHeight
    );

    const scaledWidth = contentWidth * scale;
    const scaledHeight = contentHeight * scale;
    
    const x = (storyWidth - scaledWidth) / 2;
    const y = (storyHeight - scaledHeight) / 2;

    // Desenhar sombra/glow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;

    // Desenhar o conteúdo da nota
    ctx.drawImage(canvas, x, y, scaledWidth, scaledHeight);

    // Adicionar marca d'água discreta
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = 'italic 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Created with Notepad Pro', storyWidth / 2, storyHeight - 50);

    return storyCanvas;
  };

  const captureNoteArea = async () => {
    // Encontrar o elemento da textarea
    const textarea = noteRef.current?.querySelector('.note-editor');
    if (!textarea) {
      throw new Error('Textarea not found');
    }

    // Criar um elemento clone para captura
    const clone = textarea.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '-9999px';
    clone.style.width = `${textarea.offsetWidth}px`;
    clone.style.height = 'auto';
    clone.style.overflow = 'visible';
    clone.style.padding = getComputedStyle(textarea).padding;
    clone.style.margin = getComputedStyle(textarea).margin;
    clone.style.border = getComputedStyle(textarea).border;
    clone.style.boxShadow = getComputedStyle(textarea).boxShadow;
    
    // Aplicar todos os estilos inline
    Object.assign(clone.style, {
      backgroundColor: textStyle.backgroundColor,
      color: textStyle.color,
      fontSize: textStyle.fontSize,
      fontWeight: textStyle.fontWeight,
      fontStyle: textStyle.fontStyle,
      textDecoration: textStyle.textDecoration,
      textAlign: textStyle.textAlign,
      fontFamily: textStyle.fontFamily,
      lineHeight: textStyle.lineHeight,
      borderRadius: '15px',
      border: 'none',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
    });

    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, {
      scale: 2, // Alta resolução
      backgroundColor: textStyle.backgroundColor || '#ffffff',
      useCORS: true,
      logging: false,
      allowTaint: true,
      removeContainer: true,
      onclone: (document, element) => {
        // Remover placeholder se existir
        const placeholder = element.querySelector('.centered-placeholder');
        if (placeholder) {
          placeholder.style.display = 'none';
        }
        
        // Garantir que o conteúdo esteja visível
        element.style.overflow = 'visible';
        element.style.height = 'auto';
        element.style.minHeight = '400px';
      }
    });

    document.body.removeChild(clone);

    return canvas;
  };

  const generateImage = async (format = 'story') => {
    if (!noteContent.trim()) {
      alert('Please add some content first!');
      return null;
    }

    setIsExporting(true);
    try {
      const canvas = await captureNoteArea();
      
      let finalCanvas;
      if (format === 'story') {
        finalCanvas = await optimizeForStory(canvas);
      } else if (format === 'post') {
        // Otimizar para formato quadrado (post)
        const postCanvas = document.createElement('canvas');
        const size = Math.max(canvas.width, canvas.height, 1080);
        postCanvas.width = size;
        postCanvas.height = size;
        const ctx = postCanvas.getContext('2d');
        
        // Fundo
        ctx.fillStyle = textStyle.backgroundColor || '#ffffff';
        ctx.fillRect(0, 0, size, size);
        
        // Centralizar conteúdo
        const scale = Math.min(
          (size * 0.85) / canvas.width,
          (size * 0.85) / canvas.height
        );
        const scaledWidth = canvas.width * scale;
        const scaledHeight = canvas.height * scale;
        const x = (size - scaledWidth) / 2;
        const y = (size - scaledHeight) / 2;
        
        ctx.drawImage(canvas, x, y, scaledWidth, scaledHeight);
        finalCanvas = postCanvas;
      } else {
        // Manter formato original
        finalCanvas = canvas;
      }

      return finalCanvas.toDataURL('image/jpeg', 0.95);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image. Please try again.');
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  const previewImage = async () => {
    const url = await generateImage(selectedFormat);
    if (url) {
      setPreviewUrl(url);
      setShowPreview(true);
    }
  };

  const downloadImage = async () => {
    const url = await generateImage(selectedFormat);
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = `note-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const shareToWhatsApp = async () => {
    const url = await generateImage(selectedFormat);
    if (url) {
      // Para WhatsApp Web
      const text = encodeURIComponent('Check out my note!');
      const whatsappUrl = `https://api.whatsapp.com/send?text=${text}`;
      
      // Tentar usar Web Share API primeiro
      if (navigator.share) {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          const file = new File([blob], 'note.jpg', { type: 'image/jpeg' });
          
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'My Note',
              text: 'Created with Notepad Pro'
            });
            return;
          }
        } catch (error) {
          console.log('Web Share failed:', error);
        }
      }
      
      // Fallback para abrir WhatsApp
      window.open(whatsappUrl, '_blank');
    }
  };

  const shareToInstagram = async () => {
    const url = await generateImage(selectedFormat);
    if (url) {
      // Instagram não tem API direta, então baixamos a imagem
      downloadImage();
      alert('Image downloaded! You can now upload it to Instagram from your gallery.');
    }
  };

  const shareToFacebook = async () => {
    const url = await generateImage(selectedFormat);
    if (url) {
      // Facebook não permite upload direto via URL, então baixamos
      downloadImage();
      alert('Image downloaded! You can now upload it to Facebook from your gallery.');
    }
  };

  return (
    <div className="share-export-panel">
      {showPreview ? (
        <div className="preview-overlay">
          <div className="preview-container">
            <div className="preview-header">
              <h3>Preview</h3>
              <button className="close-btn" onClick={() => setShowPreview(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="preview-content" ref={previewRef}>
              <img 
                src={previewUrl} 
                alt="Note preview" 
                className="preview-image"
              />
            </div>
            <div className="preview-actions">
              <button className="action-btn download-btn" onClick={downloadImage}>
                <FaDownload /> Download
              </button>
              <button className="action-btn share-btn" onClick={shareToWhatsApp}>
                <FaWhatsapp /> Share
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="panel-header">
            <h3>{activeTool === 'share' ? 'Share Note' : 'Export Note'}</h3>
            {onClose && (
              <button className="close-btn" onClick={onClose}>
                <FaTimes />
              </button>
            )}
          </div>

          <div className="format-selector">
            <h4>Select Format</h4>
            <div className="format-grid">
              {formats.map(format => (
                <button
                  key={format.id}
                  className={`format-card ${selectedFormat === format.id ? 'active' : ''}`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <div className="format-icon">{format.icon}</div>
                  <div className="format-label">{format.label}</div>
                  <div className="format-ratio">{format.ratio}</div>
                  <div className="format-desc">{format.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {activeTool === 'share' ? (
            <div className="share-options">
              <h4>Share To</h4>
              <div className="share-grid">
                <button 
                  className="share-option whatsapp-option"
                  onClick={shareToWhatsApp}
                  disabled={isExporting}
                >
                  <div className="share-icon">
                    <FaWhatsapp />
                  </div>
                  <span>WhatsApp</span>
                  <small>Status & Chats</small>
                </button>
                
                <button 
                  className="share-option instagram-option"
                  onClick={shareToInstagram}
                  disabled={isExporting}
                >
                  <div className="share-icon">
                    <FaInstagram />
                  </div>
                  <span>Instagram</span>
                  <small>Story & Posts</small>
                </button>
                
                <button 
                  className="share-option facebook-option"
                  onClick={shareToFacebook}
                  disabled={isExporting}
                >
                  <div className="share-icon">
                    <FaFacebook />
                  </div>
                  <span>Facebook</span>
                  <small>Story & Posts</small>
                </button>
                
                <button 
                  className="share-option preview-option"
                  onClick={previewImage}
                  disabled={isExporting}
                >
                  <div className="share-icon">
                    <FaImage />
                  </div>
                  <span>Preview</span>
                  <small>See how it looks</small>
                </button>
              </div>
            </div>
          ) : (
            <div className="export-options">
              <h4>Export Options</h4>
              <div className="export-grid">
                <button 
                  className="export-option"
                  onClick={previewImage}
                  disabled={isExporting}
                >
                  <FaImage className="export-icon" />
                  <span>Preview & Download</span>
                  <small>See before saving</small>
                </button>
                
                <button 
                  className="export-option"
                  onClick={downloadImage}
                  disabled={isExporting}
                >
                  <FaDownload className="export-icon" />
                  <span>Download Direct</span>
                  <small>Save to gallery</small>
                </button>
              </div>
              
              <div className="quality-info">
                <div className="quality-badge">HD Quality</div>
                <div className="quality-badge">Optimized for Mobile</div>
                <div className="quality-badge">Preserves Colors</div>
              </div>
            </div>
          )}

          {isExporting && (
            <div className="export-loading">
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
              <p>Creating your beautiful note image...</p>
              <small>This may take a few seconds</small>
            </div>
          )}

          <div className="panel-footer">
            <p className="footer-note">
              💡 <strong>Tip:</strong> For best results, add enough text and choose a colorful background!
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareExport;