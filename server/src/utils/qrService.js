import crypto from 'crypto';
import QRCode from 'qrcode';

export const generateSecureToken = () => {
  return crypto.randomBytes(16).toString('hex');
};

export const generateQRCodeDataUrl = async (reviewUrl) => {
  try {
    const dataUrl = await QRCode.toDataURL(reviewUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0f4c81', // Brand blue
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });
    return dataUrl;
  } catch (error) {
    console.error('[QRCode] Error generating QR code:', error);
    throw new Error('Failed to generate QR Code');
  }
};
