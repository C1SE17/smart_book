import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import './Captcha.css';

const Captcha = forwardRef(({ onCaptchaChange, error, onCodeGenerated }, ref) => {
  const canvasRef = useRef(null);
  const [captchaCode, setCaptchaCode] = useState('');
  const [userInput, setUserInput] = useState('');

  // Generate random captcha code
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing characters
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setUserInput('');
    drawCaptcha(code);
    if (onCaptchaChange) {
      onCaptchaChange('');
    }
    if (onCodeGenerated) {
      onCodeGenerated(code);
    }
  };

  // Draw captcha on canvas
  const drawCaptcha = (code) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // Add noise lines
    ctx.strokeStyle = '#dee2e6';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // Draw text
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw each character with slight rotation and offset
    for (let i = 0; i < code.length; i++) {
      ctx.save();
      const x = (width / (code.length + 1)) * (i + 1);
      const y = height / 2;
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.3); // Random rotation
      ctx.fillStyle = `rgb(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)})`;
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }

    // Add noise dots
    ctx.fillStyle = '#adb5bd';
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Expose refresh method via ref
  useImperativeHandle(ref, () => ({
    refresh: () => {
      generateCaptcha();
    }
  }), []);

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setUserInput(value);
    if (onCaptchaChange) {
      onCaptchaChange(value);
    }
  };

  const handleRefresh = () => {
    generateCaptcha();
  };

  return (
    <div className="captcha-container">
      <label htmlFor="captcha" className="form-label text-dark fw-medium">
        Captcha <span className="text-danger">*</span>
      </label>
      <div className="captcha-wrapper">
        <canvas
          ref={canvasRef}
          width={150}
          height={50}
          className="captcha-canvas"
        />
        <button
          type="button"
          onClick={handleRefresh}
          className="captcha-refresh-btn"
          title="Refresh captcha"
        >
          <i className="bi bi-arrow-clockwise"></i>
        </button>
      </div>
      <input
        type="text"
        id="captcha"
        name="captcha"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Enter captcha code"
        className={`form-control captcha-input ${error ? 'is-invalid' : ''}`}
        style={{
          backgroundColor: '#f8f9fa',
          border: error ? '1px solid #dc3545' : '1px solid #e9ecef',
          borderRadius: '8px',
          padding: '12px 16px',
          marginTop: '10px',
          textTransform: 'uppercase'
        }}
        maxLength={5}
      />
      {error && (
        <div className="invalid-feedback">
          {error}
        </div>
      )}
      <input type="hidden" name="captchaCode" value={captchaCode} />
    </div>
  );
});

// Expose refresh method via ref
Captcha.displayName = 'Captcha';

export default Captcha;

