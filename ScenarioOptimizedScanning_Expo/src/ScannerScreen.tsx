import {
  CameraEnhancer,
  CameraView,
  CaptureVisionRouter,
  EnumPresetTemplate,
  EnumResolution,
  LicenseManager,
} from 'dynamsoft-capture-vision-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';

const License = 'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9';
LicenseManager.initLicense(License).catch(e => {
  Alert.alert('License error', e.message);
});

type NavigationProps = NativeStackScreenProps<RootStackParamList, 'Scanner'>;

export default function ScannerScreen({ route }: NavigationProps) {
  const { templateFileName, templateContent } = route.params;
  const cameraView = useRef<CameraView>(null!);
  const cvr = CaptureVisionRouter.getInstance();
  const camera = CameraEnhancer.getInstance();
  const [results, setResults] = useState<string>('');
  const [resultCount, setResultCount] = useState<number>(0);

  useEffect(() => {
    CameraEnhancer.requestCameraPermission();

    cvr.setInput(camera);
    camera.setCameraView(cameraView.current);

    if (templateContent) {
        cvr.initSettings(templateContent)
          .catch(e => Alert.alert('Load template error', e.message));
    }

    // Dot Code: set scan region and zoom
    if (templateFileName === 'ReadDotCode.json') {
      camera.setScanRegion({
        left: 0.15,
        top: 0.35,
        right: 0.85,
        bottom: 0.48,
        measuredInPercentage: true,
      });
      camera.setZoomFactor(3.0);
    }

    // PDF417: set 4K resolution
    if (templateFileName === 'ReadPDF417.json') {
      camera.setResolution(EnumResolution.RESOLUTION_4K);
    }

    const receiver = cvr.addResultReceiver({
      onDecodedBarcodesReceived: ({ items }) => {
        if (items?.length) {
          const text = items
            .map((barcode, i) => `${i + 1}. Format: ${barcode.formatString}\n    Text: ${barcode.text}`)
            .join('\n\n');
          setResults(text);
          setResultCount(items.length);
        }
      },
    });

    // If templateContent is undefined, it means the default template should be used,
    // in which case EnumPresetTemplate.PT_READ_BARCODES is used as the template name.
    // Otherwise (a custom template was loaded via initSettings), pass '' as the template name.
    const name: string = templateContent ? '' : EnumPresetTemplate.PT_READ_BARCODES;
    const startScanning = () => {
      camera.open();
      cvr.startCapturing(name)
        .catch(e => Alert.alert('Start error', e.message));
    };

    const stopScanning = () => {
      cvr.stopCapturing();
      camera.close();
    };

    startScanning();

    return () => {
      stopScanning();
      cvr.removeResultReceiver(receiver);
      camera.setCameraView(null);
      cvr.dispose();
      camera.dispose();
    };
  }, [cvr, camera, templateFileName, templateContent]);

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
    backgroundColor: '#000000',
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
