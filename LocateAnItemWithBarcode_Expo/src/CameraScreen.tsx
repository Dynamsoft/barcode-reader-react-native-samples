/*
 * This is the sample of Dynamsoft Barcode Reader.
 *
 * Copyright © Dynamsoft Corporation. All rights reserved.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  CameraEnhancer,
  CameraView,
  CaptureVisionRouter,
  EnumCapturedResultItemType,
  EnumPresetTemplate,
  FeedBack,
  LicenseManager,
  MultiFrameResultCrossFilter,
  type BarcodeResultItem,
} from 'dynamsoft-capture-vision-react-native';
import type { RootStackParamList } from './App';

// Initialize the license.
// The license string here is a trial license. Note that network connection is required for this license to work.
// You can request an extension via the following link: https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&utm_source=samples&package=react-native
const License = 'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9';
LicenseManager.initLicense(License).catch((e: Error) => {
  Alert.alert('License error', e.message);
});

// Delegate for passing scan results back to HomeScreen
// (mirrors Swift's PopViewControllerDelegate pattern)
let scanResultDelegate: ((text: string) => void) | null = null;

export function setScanResultDelegate(fn: ((text: string) => void) | null) {
  scanResultDelegate = fn;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

interface OverlayArc {
  /** View-coordinate centre of the arc. */
  x: number;
  y: number;
  symbol: string;
  isMatch: boolean;
  /** The decoded barcode text (only used when isMatch is true). */
  barcodeText?: string;
}

// Memoized marker so unchanged arcs skip re-rendering their subtree.
// A custom comparator is required because `arc` is a freshly created object
// on every state update, so the default shallow-prop check would always
// consider props to have changed.
const ArcMarker = React.memo(
  ({ arc }: { arc: OverlayArc }) => {
    const color = arc.isMatch ? '#4CAF50' : '#F44336';
    // Explicit zIndex (in addition to render-order sorting) so matched
    // markers reliably stack above unmatched ones across platforms.
    const zIndex = arc.isMatch ? 2 : 1;
    return (
      <>
        {/* Filled circle with symbol inside */}
        <View
          style={[
            styles.arc,
            {
              left: arc.x - 10,
              top: arc.y - 10,
              backgroundColor: color,
              zIndex,
            },
          ]}
        >
          <Text style={styles.arcSymbol}>{arc.symbol}</Text>
        </View>
        {/* Barcode text below the circle (only for matched items) */}
        {arc.isMatch && arc.barcodeText && (
          <Text
            style={[
              styles.arcLabel,
              {
                left: arc.x - 80,
                top: arc.y + 5,
                color,
                zIndex,
              },
            ]}
            numberOfLines={1}
          >
            {arc.barcodeText}
          </Text>
        )}
      </>
    );
  },
  (prev, next) =>
    prev.arc.x === next.arc.x &&
    prev.arc.y === next.arc.y &&
    prev.arc.symbol === next.arc.symbol &&
    prev.arc.isMatch === next.arc.isMatch &&
    prev.arc.barcodeText === next.arc.barcodeText
);

export default function CameraScreen({ navigation, route }: Props) {
  const { mode, targetText } = route.params;
  const cameraView = useRef<CameraView>(null!);
  const cvr = CaptureVisionRouter.getInstance();
  const camera = CameraEnhancer.getInstance();
  const [overlayArcs, setOverlayArcs] = useState<OverlayArc[]>([]);
  const [isTargetFound, setIsTargetFound] = useState(false);
  const hasReturned = useRef(false);

  useEffect(() => {
    CameraEnhancer.requestCameraPermission();

    cvr.setInput(camera);
    camera.setCameraView(cameraView.current);

    // Set up multi-frame filter for smooth results
    const filter = new MultiFrameResultCrossFilter();
    filter.enableLatestOverlapping(EnumCapturedResultItemType.CRIT_BARCODE, true);
    filter.setMaxOverlappingFrames(EnumCapturedResultItemType.CRIT_BARCODE, 10);
    cvr.addFilter(filter);

    if (mode === 'search') {
      const templateObj = require('../assets/Templates/ReadMultipleBarcodes.json')
      const templateContent = JSON.stringify(templateObj);
      cvr.initSettings(templateContent).catch((e: Error) => {
        Alert.alert('Template error', e.message);
      });
    }

    const receiver = cvr.addResultReceiver({
      onDecodedBarcodesReceived: ({ items }) => {
        if (mode === 'scan') {
          // Scan mode: return first result via delegate and pop back
          if (items?.length && !hasReturned.current) {
            hasReturned.current = true;
            FeedBack.beep();
            // Call delegate (mirrors Swift's delegate?.didReceiveText)
            scanResultDelegate?.(items[0]!.text);
            // Pop back to Home so useEffect cleanup runs (mirrors Swift's popViewController)
            navigation.goBack();
          }
        } else {
          // Search mode: draw circles on barcode locations
          if (items?.length) {
            const arcs: OverlayArc[] = [];
            let found = false;
            for (const item of items) {
              const centrePoint = item.location.centrePoint;
              // Convert to view coordinates
              const viewPt = camera.convertPointToViewCoordinates({ x: centrePoint.x, y: centrePoint.y });
              const isMatch = item.text === targetText;
              if (isMatch) found = true;
              arcs.push({
                x: viewPt.x,
                y: viewPt.y,
                symbol: isMatch ? '+' : '✕',
                isMatch,
                barcodeText: isMatch ? item.text : undefined,
              });
            }
            setOverlayArcs(arcs);
            setIsTargetFound(found);
          } else {
            setOverlayArcs([]);
            setIsTargetFound(false);
          }
        }
      },
    });

    const templateName = mode === 'search' ? 'ReadMultipleBarcodes' : EnumPresetTemplate.PT_READ_BARCODES;

    const startScanning = async () => {
      camera.open();
      if (mode !== 'search') {
        await cvr.resetSettings();
      }
      await cvr.startCapturing(templateName);
    };

    const stopScanning = () => {
      cvr.stopCapturing();
      camera.close();
    };

    startScanning().catch((e: Error) => {
      Alert.alert('Start error', e.message);
    });

    return () => {
      stopScanning();
      cvr.removeResultReceiver(receiver);
      cvr.removeFilter(filter);
      filter.destroy();
      camera.setCameraView(null);
      cvr.dispose();
      camera.dispose();
      // Clear the delegate when CameraScreen is popped
      setScanResultDelegate(null);
    };
  }, [cvr, camera, mode, targetText, navigation]);

  return (
    <View style={styles.cameraContainer}>
      <CameraView style={StyleSheet.absoluteFill} ref={cameraView} torchButtonVisible={true} visibleLayerIds={[]}>
        {/* Overlay circles at decoded barcode locations (search mode) */}
        {mode === 'search' &&
          overlayArcs.map((arc, index) => (
            <ArcMarker key={(arc.barcodeText ?? `nomatch`) + `-${index}`} arc={arc} />
          ))}
        {/* Search mode: top button to go back */}
        {mode === 'search' && (
          <View style={styles.topOverlay}>
            <TouchableOpacity style={styles.locateAnotherButton} onPress={() => navigation.goBack()}>
              <Text style={styles.locateAnotherText}>Locate another item</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Search mode: status banner at bottom */}
        {mode === 'search' && (
          <View style={styles.searchOverlay}>
            <View style={[styles.statusBanner, isTargetFound ? styles.statusFound : styles.statusSearching]}>
              <Text style={styles.statusText}>
                {isTargetFound
                  ? `✓ Item Found: "${targetText}"`
                  : `Searching for: "${targetText}"`}
              </Text>
            </View>
          </View>
        )}
      </CameraView>


    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  topOverlay: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  locateAnotherButton: {
    backgroundColor: '#f5a623',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    zIndex : 100,
  },
  locateAnotherText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  searchOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  statusBanner: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  statusFound: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
  },
  statusSearching: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  arc: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arcSymbol: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  arcLabel: {
    position: 'absolute',
    width: 160,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
