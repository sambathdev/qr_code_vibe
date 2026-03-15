import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface ScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (errorMessage: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScanSuccess, onScanError }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Initialize the scanner
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 150 },
      aspectRatio: 1.0,
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.QR_CODE,
      ],
    };

    const scanner = new Html5QrcodeScanner('reader', config, false);
    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        onScanSuccess(decodedText);
      },
      (errorMessage) => {
        if (onScanError) onScanError(errorMessage);
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error('Failed to clear scanner', error);
        });
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden rounded-2xl bg-black/5 border border-black/5 shadow-inner">
      <div id="reader" className="w-full"></div>
    </div>
  );
};

export default Scanner;
