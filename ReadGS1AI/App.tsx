import {
  CameraEnhancer,
  CameraView,
  CaptureVisionRouter,
  EnumValidationStatus,
  LicenseManager,
  ParsedResult,
  ParsedResultItem
} from 'dynamsoft-capture-vision-react-native';
import React, {useEffect, useRef} from 'react';
import {Alert, StyleSheet, View} from 'react-native';

const License = 'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9';
LicenseManager.initLicense(License).catch(e => {
  Alert.alert('License error', e.message);
});

// An AI (Application Identifier) key is 2 to 4 digits, e.g. "01", "10", "17", "3103".
function isAI(str?: string): boolean {
  return !!str && /^\d{2,4}$/.test(str);
}

/**
 * Supported input formats:
 * - yyMMdd (6 digits): Returns a date in the format "yy/MM/dd".
 * - yyMMddHHmm (10 digits): Returns a date and time in the format "yy/MM/dd HH:mm".
 * - yyMMddHHmmSS (12 digits): Returns a date and time in the format "yy/MM/dd HH:mm:ss".
 */
function parseDateAndTimeString(dateStr?: string): string | null {
  // Only support yyMMdd, yyMMddHHmm, yyMMddHHmmSS. All characters must be digits of appropriate length (6, 10, or 12).
  if (!dateStr || !/^(\d{6}|\d{10}|\d{12})$/.test(dateStr)) {
    return null;
  }
  const length = dateStr.length;

  const year = parseInt(dateStr.substring(0, 2), 10) + 2000;
  const month = parseInt(dateStr.substring(2, 4), 10) - 1; // zero-based, mirrors Calendar's month field
  let day = parseInt(dateStr.substring(4, 6), 10);

  // Handle day=0 -> last day of month
  const lastDay = new Date(year, month + 1, 0).getDate();
  day = day === 0 ? lastDay : day;

  let hour = 0;
  let minute = 0;
  let second = 0;
  if (length >= 10) {
    hour = parseInt(dateStr.substring(6, 8), 10);
    minute = parseInt(dateStr.substring(8, 10), 10);
    if (length === 12) {
      second = parseInt(dateStr.substring(10, 12), 10);
    }
  }

  const pad = (n: number) => n.toString().padStart(2, '0');
  const yy = pad(year % 100);
  const mm = pad(month + 1);
  const dd = pad(day);

  if (length === 6) {
    return `${yy}/${mm}/${dd}`;
  } else if (length === 10) {
    return `${yy}/${mm}/${dd} ${pad(hour)}:${pad(minute)}`;
  }
  return `${yy}/${mm}/${dd} ${pad(hour)}:${pad(minute)}:${pad(second)}`;
}

function getContentsFromParsedItem(item: ParsedResultItem): string[] {
  const fields = item.parsedFields ?? {};
  const contents: string[] = [];

  // The flat `parsedFields` map keys each AI's sub-fields as `${ai}AI` / `${ai}Data`.
  // Collect the distinct AI prefixes first (mirrors Java's item.getParsedFields().keySet()).
  const aiPrefixes = new Set<string>();
  for (const key of Object.keys(fields)) {
    const match = key.match(/^(\d{2,4})(AI|Data)$/);
    if (match) {
      aiPrefixes.add(match[1]!);
    }
  }

  for (const fieldName of aiPrefixes) {
    if (!isAI(fieldName)) continue;
    if (fields[`${fieldName}Data`]?.validationStatus === EnumValidationStatus.VS_FAILED) {
      continue;
    }
    const aiDescription = fields[`${fieldName}AI`]?.value;
    let aiData = fields[`${fieldName}Data`]?.value;
    if (aiDescription && aiDescription.toLowerCase().includes('date')) {
      aiData = parseDateAndTimeString(aiData) ?? undefined;
    }
    if (aiData !== undefined) {
      contents.push(`${aiDescription}: ${aiData}`);
    }
  }

  return contents;
}


function App(): React.JSX.Element {
  const cameraView = useRef<CameraView>(null!);
  const cvr = CaptureVisionRouter.getInstance();
  const camera = CameraEnhancer.getInstance();

  useEffect(() => {
    CameraEnhancer.requestCameraPermission();

    cvr.setInput(camera);
    camera.setCameraView(cameraView.current);
    const templateObj = require('./assets/Templates/ReadGS1AI.json')
    const templateContent = JSON.stringify(templateObj);
    cvr.initSettings(templateContent).catch(e =>
      Alert.alert('Settings error', e.message),
    );

    const receiver = cvr.addResultReceiver({
      onParsedResultsReceived: (result: ParsedResult) => {
        const item = result.items?.[0];
        if (item) {
          cvr.stopCapturing();

          const contents = getContentsFromParsedItem(item);
          const gs1Message = contents.length > 0 ? contents.join('\n') : 'No AI fields recognized';

          Alert.alert('GS1 Result', gs1Message, [
            {
              text: 'OK',
              onPress: () => {
                cvr.startCapturing('ReadGS1AI').catch(e =>
                  Alert.alert('Start error', e.message),
                );
              },
            },
          ]);
        }
      },
    });

    const startScanning = () => {
      camera.open();
      cvr.startCapturing('ReadGS1AI').catch(e =>
        Alert.alert('Start error', e.message),
      );
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
  }, [cvr, camera]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <CameraView style={StyleSheet.absoluteFill} ref={cameraView} />
    </View>
  );
}

export default App;
