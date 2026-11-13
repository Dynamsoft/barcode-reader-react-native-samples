import React, {useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  BarcodeScanConfig,
  BarcodeScanner,
  BarcodeScanResult,
  EnumResultStatus,
  EnumScanningMode,
} from 'dynamsoft-barcode-reader-bundle-react-native';
// Initialize the license.
// The license string here is a trial license. Note that network connection is required for this license to work.
// You can request an extension via the following link: https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&utm_source=samples&package=react-native
const LICENSE = 'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9';
const ScanSingleBarcode = (): Promise<BarcodeScanResult> => {
  let barcodeScanConfig = {
    license: LICENSE,
    scanningMode: EnumScanningMode.SM_SINGLE,
  } as BarcodeScanConfig;
  return BarcodeScanner.launch(barcodeScanConfig);
};
const ScanMultipleBarcodes = (): Promise<BarcodeScanResult> => {
  let barcodeScanConfig = {
    license: LICENSE,
    scanningMode: EnumScanningMode.SM_MULTIPLE,

    /**
     * Set expectedBarcodesCount to determine the expected number of barcodes.
     * The multiple barcodes scanning will be stopped when the expectedBarcodesCount is reached.
     * */
    //expectedBarcodesCount: 999,

    /**
     * Set maxConsecutiveStableFramesToExit to determine how long the library
     * will keep scanning when there is no more barcodes to decode.
     * Default is 5.*/
    //maxConsecutiveStableFramesToExit: 5,
  } as BarcodeScanConfig;
  return BarcodeScanner.launch(barcodeScanConfig);
};

const BarcodeScanResultToDisplayString = (barcodeResult: BarcodeScanResult, scanMode: EnumScanningMode) => {
  let displayString: string;
  if (barcodeResult.resultStatus === EnumResultStatus.RS_FINISHED) {
    if (scanMode === EnumScanningMode.SM_SINGLE) {
      //Only one barcode decoded when using Single scanning mode.
      let barcode = barcodeResult?.barcodes![0];
      displayString = `${barcode.formatString}: ${barcode.text}`;
    } else { //EnumScanningMode.SM_MULTIPLE
      let barcodes = barcodeResult?.barcodes!;
      displayString = `Barcode count: ${barcodes?.length}\n\n` +
        barcodes.map((barcode, index) => `${index + 1}. ${barcode.formatString}: ${barcode.text}`)
          .join('\n\n');
    }
  } else if (barcodeResult.resultStatus === EnumResultStatus.RS_CANCELED) {
    displayString = 'Scan cancelled.';
  } else {
    displayString = `ErrorCode: ${barcodeResult.errorCode}\n\nErrorMessage: ${barcodeResult.errorString}`;
  }
  return displayString;
};


function App(): React.JSX.Element {
  const [display, setDisplay] = useState({text: '', isError: false});

  const scanBarcode = async (scanMode: EnumScanningMode) => {
    let barcodeResult: BarcodeScanResult;
    if (scanMode === EnumScanningMode.SM_SINGLE) {
      barcodeResult = await ScanSingleBarcode();
    } else { //EnumScanningMode.SM_MULTIPLE
      barcodeResult = await ScanMultipleBarcodes();
    }
    let displayString = BarcodeScanResultToDisplayString(barcodeResult, scanMode);
    setDisplay({text: displayString, isError: barcodeResult.resultStatus === EnumResultStatus.RS_EXCEPTION})
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={[styles.text, display.isError ? styles.error : null]}>
          {display.text}
        </Text>
      </ScrollView>
      <View style={styles.spacer}/>
      <Button title={'Scan Single Barcode'} onPress={() => scanBarcode(EnumScanningMode.SM_SINGLE)}/>
      <View style={styles.spacer}/>
      <Button title={'Scan multiple Barcodes'} onPress={() => scanBarcode(EnumScanningMode.SM_MULTIPLE)}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 50,
  },
  text: {marginTop: 20, fontSize: 16, color: 'black'},
  error: {color: 'red'},
  spacer: {height: 20},
});

export default App;
