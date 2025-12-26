import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { FaWhatsapp, FaFacebook, FaDownload, FaImage } from 'react-icons/fa';

const ShareExport = ({ noteRef, noteContent, textStyle, activeTool }) => {
  const [quality, setQuality] = useState('high');
  const [isExporting, setIsExporting] = useState(false);

  const exportAsImage = async (format = 'png') => {
    if (!noteRef.current || !noteContent.trim()) {
      alert('Please add some content to the note first!');
      return;
    }

    setIsExporting(true);
    
    try {
      const scale = quality === 'high' ? 2 : 1;
      
      const canvas = await html2canvas(noteRef.current, {
        scale,
        backgroundColor: textStyle.backgroundColor || '#ffffff',
        useCORS: true,
        logging: false,
      });

      const imageUrl = canvas.toDataURL(`image/${format}`);
      
      if (format === 'png') {
        // Download PNG
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `note-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For JPEG
        const jpegUrl = canvas.toDataURL('image/jpeg', 0.9);
        const link = document.createElement('a');
        link.href = jpegUrl;
        link.download = `note-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error exporting image:', error);
      alert('Error exporting image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const shareToWhatsApp = async () => {
    if (!noteContent.trim()) {
      alert('Please add some content to share!');
      return;
    }

    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(noteRef.current, {
        scale: 1,
        backgroundColor: textStyle.backgroundColor || '#ffffff',
        useCORS: true,
      });

      const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      // Convert data URL to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'note.jpg', { type: 'image/jpeg' });

      // Create WhatsApp share URL
      const text = encodeURIComponent('Check out my note!');
      const whatsappUrl = `https://api.whatsapp.com/send?text=${text}`;
      
      // For mobile devices with Web Share API
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'My Note',
            text: 'Check out my note!',
          });
        } catch (shareError) {
          console.log('Web Share failed, opening WhatsApp:', shareError);
          window.open(whatsappUrl, '_blank');
        }
      } else {
        // Fallback to opening WhatsApp
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error);
      alert('Error sharing to WhatsApp. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const shareToFacebook = async () => {
    if (!noteContent.trim()) {
      alert('Please add some content to share!');
      return;
    }

    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(noteRef.current, {
        scale: 1,
        backgroundColor: textStyle.backgroundColor || '#ffffff',
        useCORS: true,
      });

      const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      // For Facebook, we need to upload the image first
      // This is a simplified version - in production, you'd upload to your server
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent('Check out my note!')}`;
      window.open(facebookUrl, '_blank', 'width=600,height=400');
    } catch (error) {
      console.error('Error sharing to Facebook:', error);
      alert('Error sharing to Facebook. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="share-panel">
      {activeTool === 'share' && (
        <>
          <h3>Share Note</h3>
          <div className="share-grid">
            <button 
              className="share-button whatsapp-btn"
              onClick={shareToWhatsApp}
              disabled={isExporting}
            >
              <FaWhatsapp className="icon" />
              <span>WhatsApp</span>
            </button>
            
            <button 
              className="share-button facebook-btn"
              onClick={shareToFacebook}
              disabled={isExporting}
            >
              <FaFacebook className="icon" />
              <span>Facebook</span>
            </button>
          </div>
        </>
      )}

      {activeTool === 'export' && (
        <>
          <h3>Export Note</h3>
          <div className="share-grid">
            <button 
              className="share-button download-btn"
              onClick={() => exportAsImage('png')}
              disabled={isExporting}
            >
              <FaImage className="icon" />
              <span>PNG Image</span>
            </button>
            
            <button 
              className="share-button download-btn"
              onClick={() => exportAsImage('jpeg')}
              disabled={isExporting}
            >
              <FaImage className="icon" />
              <span>JPEG Image</span>
            </button>
          </div>

          <div className="quality-options">
            <button 
              className={`quality-btn ${quality === 'high' ? 'active' : ''}`}
              onClick={() => setQuality('high')}
            >
              High Quality
            </button>
            <button 
              className={`quality-btn ${quality === 'normal' ? 'active' : ''}`}
              onClick={() => setQuality('normal')}
            >
              Normal
            </button>
          </div>

          {isExporting && (
            <div className="export-loading">
              <div className="spinner"></div>
              <span>Preparing your note...</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShareExport;