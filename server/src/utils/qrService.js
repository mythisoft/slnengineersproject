import crypto from 'crypto';
import QRCode from 'qrcode';

export const generateSecureToken = () => {
  return crypto.randomBytes(16).toString('hex');
};

export const generateQRCodeDataUrl = async (reviewUrl) => {
  try {
    const dataUrl = await QRCode.toDataURL(reviewUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: '#0a192f', // High-contrast deep slate black
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
    return dataUrl;
  } catch (error) {
    console.error('[QRCode] Error generating QR code:', error);
    throw new Error('Failed to generate QR Code');
  }
};

export const generateGoogleQRCodeDataUrl = async (googleUrl) => {
  try {
    const dataUrl = await QRCode.toDataURL(googleUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: '#0a192f', // High-contrast deep slate black for instant camera recognition
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
    return dataUrl;
  } catch (error) {
    console.error('[QRCode] Error generating Google QR code:', error);
    return await generateQRCodeDataUrl(googleUrl);
  }
};
