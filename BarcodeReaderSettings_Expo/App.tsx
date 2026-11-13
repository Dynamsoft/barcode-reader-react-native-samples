import {
  CameraEnhancer,
  CameraView,
  CaptureVisionRouter,
  EnumPresetTemplate,
  LicenseManager,
  EnumBarcodeFormat,
} from 'dynamsoft-capture-vision-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';

// Initialize the license.
// The license string here is a trial license. Note that network connection is required for this license to work.
// You can request an extension via the following link:
// https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&utm_source=samples&package=react-native
const License = 'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9';
LicenseManager.initLicense(License).catch(e => {
  Alert.alert('License error', e.message);
});

export default function App(): React.JSX.Element {
  const cameraView = useRef<CameraView>(null!);
  const cvr = CaptureVisionRouter.getInstance();
  const camera = CameraEnhancer.getInstance();
  const [results, setResults] = useState<string>('');
  const [resultCount, setResultCount] = useState<number>(0);

  useEffect(() => {
    CameraEnhancer.requestCameraPermission();

    cvr.setInput(camera);
    camera.setCameraView(cameraView.current);

    const receiver = cvr.addResultReceiver({
      onDecodedBarcodesReceived: ({items}) => {
        if (items?.length) {
          const text = items
            .map((barcode, i) => `${i + 1}. Format: ${barcode.formatString}\n    Text: ${barcode.text}`)
            .join('\n\n');
          setResults(text);
          setResultCount(items.length);
        }
      },
    });

    const startScanning = () => {
      camera.open();
      cvr.startCapturing(EnumPresetTemplate.PT_READ_BARCODES)
        .catch(e => Alert.alert('Start error', e.message));
    };

    const stopScanning = () => {
      cvr.stopCapturing();
      camera.close();
    };


    const updateSettings = async () => {
      const settings = await cvr.getSimplifiedSettings(EnumPresetTemplate.PT_READ_BARCODES);
      if (settings == null) {
        Alert.alert('Settings Error', 'Failed to get settings.');
        return;
      }
      // Modify the settings as needed

      if (settings.barcodeSettings) {
        // barcode format
        settings.barcodeSettings.barcodeFormatIds = EnumBarcodeFormat.BF_ALL;

        // expected barcodes count
        settings.barcodeSettings.expectedBarcodesCount = 0;

        // minimum result confidence
        settings.barcodeSettings.minResultConfidence = 30;

        // scale down threshold
        settings.barcodeSettings.scaleDownThreshold = 1200;

        // minimum barcode text length
        settings.barcodeSettings.minBarcodeTextLength = 0;
      }

      // timeout
      settings.timeout = 500;

      // minimum image capture interval
      settings.minImageCaptureInterval = 100;
      await cvr.updateSettings(settings, EnumPresetTemplate.PT_READ_BARCODES);
    };

    // update settings before starting scanning if needed.
    // updateSettings();
    startScanning();

    return () => {
      stopScanning();
      cvr.removeResultReceiver(receiver);
      camera.setCameraView(null);
      cvr.dispose();
      camera.dispose();
    };
  }, [cvr, camera]);

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraView} />
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Total Results: {resultCount}</Text>
        <Text style={styles.resultText}>{results || 'Waiting for barcode...'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  resultContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    paddingBottom: 40,
    minHeight: 120,
  },
  resultTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultText: {
    color: '#0f0',
    fontSize: 14,
  },
});
