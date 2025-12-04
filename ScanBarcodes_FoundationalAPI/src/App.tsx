/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  CameraEnhancer,
  CameraView,
  CaptureVisionRouter,
  EnumPresetTemplate,
  LicenseManager,
} from 'dynamsoft-capture-vision-react-native';
import React, {useEffect, useRef} from 'react';
import {Alert, AppState, SafeAreaView, StyleSheet} from 'react-native';

const License = 'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9';
LicenseManager.initLicense(License).catch(e => {
  Alert.alert('License error', e.message);
});

function App(): React.JSX.Element {
  const cameraView = useRef<CameraView>(null!);
  const cvr = CaptureVisionRouter.getInstance();
  const camera = CameraEnhancer.getInstance();

  useEffect(() => {
    // Request camera permission once
    CameraEnhancer.requestCameraPermission();

    // Configure router, camera and view
    cvr.setInput(camera);
    camera.setCameraView(cameraView.current);

    // Barcode result handler
    const receiver = cvr.addResultReceiver({
      onDecodedBarcodesReceived: ({items}) => {
        if (items?.length) {
          cvr.stopCapturing();
          Alert.alert(
            `Barcodes count: ${items.length}`,
            items.map((barcode, i) => `${i + 1}. ${barcode.formatString}: ${barcode.text}`).join('\n\n'),
            [
              {
                text: 'OK',
                onPress: () => {
                  cvr.startCapturing(EnumPresetTemplate.PT_READ_BARCODES)
                    .catch(e => Alert.alert('Start error', e.message));
                }
              }
            ]
          );
        }
      },
    });

    // Helper to start camera + scanning
    const startScanning = () => {
      console.log('Starting...');
      camera.open();
      cvr.startCapturing(EnumPresetTemplate.PT_READ_BARCODES)
        .catch(e => Alert.alert('Start error', e.message));
    };

    // Helper to stop camera + scanning
    const stopScanning = () => {
      console.log('Stopping...');
      cvr.stopCapturing();
      camera.close();
    };

    // Initial start when component mounts
    startScanning();

    // Listen to AppState changes
    const sub = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        startScanning();
      } else if (nextState.match(/inactive|background/)) {
        stopScanning();
      }
    });

    // Cleanup on unmount
    return () => {
      sub.remove();
      stopScanning();
      cvr.removeResultReceiver(receiver);
      camera.setCameraView(null);
    };
  }, [cvr, camera]);

  return (
    <SafeAreaView style={StyleSheet.absoluteFill}>
      <CameraView style={StyleSheet.absoluteFill} ref={cameraView}/>
    </SafeAreaView>
  );
}

export default App;


