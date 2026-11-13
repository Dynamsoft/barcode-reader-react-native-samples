# Dynamsoft Barcode Reader samples for React-Native edition

This repository contains multiple samples that demonstrate how to use the [Dynamsoft Barcode Reader](https://www.dynamsoft.com/barcode-reader/) React-Native Edition.

## Samples

| Sample Name | Description | Build & Run |
|-------------|-------------|-------------|
| [ScanBarcodes_ReadyToUseComponent](ScanBarcodes_ReadyToUseComponent) | Demonstrates the quickest way to scan barcodes from live camera preview using the **Ready-to-Use Barcode Scanner component**, with minimal configuration required. | [README](ScanBarcodes_ReadyToUseComponent/README.md) |
| [ScanBarcodes_FoundationalAPI](ScanBarcodes_FoundationalAPI) | Demonstrates how to scan barcodes from live camera preview using the **Foundational API**, providing full control over camera, processing pipeline, and barcode results. | [README](ScanBarcodes_FoundationalAPI/README.md) |
| [ScanDriversLicense_Expo](ScanDriversLicense_Expo) | Demonstrates how to recognize and extract information from drivers’ licenses in real-time video streaming. | [README](ScanDriversLicense_Expo/README.md) |
| [ScanVIN_Expo](ScanVIN_Expo) | Demonstrates how to recognize and extract information from VIN barcodes in real-time video streaming. | [README](ScanVIN_Expo/README.md) |
| [ScenarioOptimizedScanning_Expo](ScenarioOptimizedScanning_Expo) | Demonstrates how to optimize scanning performance for different barcode formats and scenarios by loading scenario-specific templates (1D Retail, 1D Industrial, QR Code, Data Matrix, Aztec, Dot Code, DPM, PDF417, and High-Density codes). | [README](ScenarioOptimizedScanning_Expo/README.md) |
| [BarcodeReaderSettings_Expo](BarcodeReaderSettings_Expo) | Demonstrates how to configure the barcode reading settings via the **Foundational API**, including barcode formats, expected barcode count, minimum result confidence, and timeout. | [README](BarcodeReaderSettings_Expo/README.md) |
| [LocateAnItemWithBarcode_Expo](LocateAnItemWithBarcode_Expo) | Demonstrates how to locate an item by scanning or entering its barcode ID, using visual guidance to help find the matching item in real-time video streaming. | [README](LocateAnItemWithBarcode_Expo/README.md) |
| [ReadGS1AI_Expo](ReadGS1AI_Expo) | Demonstrates how to recognize and parse GS1 Application Identifiers (AIs) from barcodes, extracting and formatting fields such as dates and other AI data. | [README](ReadGS1AI_Expo/README.md) |

> **📌 Note on sample types**
>
> The samples above are divided into two categories based on the project type:
> - **React Native CLI samples** (non-Expo): `ScanBarcodes_ReadyToUseComponent`, `ScanBarcodes_FoundationalAPI`
> - **Expo (Bare) samples**: everything else, as indicated by the `_Expo` suffix
>
> Please refer to the README of the sample you want to try for its own build instructions.

### How to build and run a sample

Each sample folder contains its own `README.md` with the prerequisites, the exact commands to install dependencies, generate native projects (Expo samples only), install CocoaPods, and build for Android and iOS. Open the folder of the sample you want to try and follow its README.

> [!NOTE]
>
> - The applications need to run on a physical device rather than a simulator as they require the use of the camera. If you try running one on a simulator, you will most likely run into a number of errors/failures.
> - The samples use native modules, so they do not run in Expo Go. Expo samples must be built as a development build with `npx expo run:android` or `npx expo run:ios`.
> - If you want to run Android via `Windows`, you may encounter some build errors due to the `Windows Maximum Path Length Limitation`. The samples pin CMake 3.31.6 to work around it, but we still recommend that you keep the project in a directory with a shorter path.

## Integration Guide For Your Project

- [Guide for Scanning Barcodes with Ready-to-use Component](https://www.dynamsoft.com/barcode-reader/docs/mobile/programming/react-native/user-guide.html)
- [Guide for Scanning Barcodes with Foundational APIs](https://www.dynamsoft.com/barcode-reader/docs/mobile/programming/react-native/foundational-user-guide.html)

Each sample README also contains an **Integration Notes For Your Own Project** section with the platform-specific configuration the SDK needs:

- **Expo samples** — the `expo-build-properties` plugin in `app.json` (`cmakeVersion` and `extraMavenRepos`)
- **CLI samples** — the `externalNativeBuild` CMake block in `android/app/build.gradle`
- **iOS, all samples** — the `NSCameraUsageDescription` entry, in `app.json` for Expo and in `Info.plist` for CLI

## API References

There are two ways to use the Dynamsoft Barcode Reader React-Native SDK:

- [Ready-to-use BarcodeScanner APIs](https://www.dynamsoft.com/barcode-reader/docs/mobile/programming/react-native/api-reference/barcode-scanner/index.html)
  
- [Foundational APIs](https://www.dynamsoft.com/barcode-reader/docs/mobile/programming/react-native/api-reference/)

## License

- You can request a 30-day trial license via the [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&utm_source=github&package=mobile) link.

## Contact

https://www.dynamsoft.com/company/contact/
