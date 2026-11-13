# ScanBarcodes_ReadyToUseComponent

Demonstrates the quickest way to scan barcodes from live camera preview using the **Ready-to-Use Barcode Scanner component**, with minimal configuration required.

## What This Sample Does

- Launches the built-in scanner UI with a single call to `BarcodeScanner.launch()`, without touching the camera or the processing pipeline yourself
- Offers two scanning modes side by side:
  - **Scan Single Barcode** — `EnumScanningMode.SM_SINGLE`, stops at the first decoded barcode
  - **Scan multiple Barcodes** — `EnumScanningMode.SM_MULTIPLE`, keeps collecting barcodes until the scan settles
- Shows how optional fields change the behaviour of a session:
  - `expectedBarcodesCount` — stops the session once that many barcodes have been found
  - `maxConsecutiveStableFramesToExit` — how long the scanner keeps running with no new barcode decoded (default `5`)
- Reports the outcome through `EnumResultStatus` (`RS_FINISHED`, `RS_CANCELED`, `RS_EXCEPTION`) and prints either the decoded barcodes or the error code and message

Both optional configuration snippets are commented out in `App.tsx`; uncomment them to see the effect on a scanning session.

## Requirements

- A recent Node.js LTS release (the minimum is declared in the `engines` field of `package.json`)
- A React Native CLI project; the React Native, React and Dynamsoft package versions are declared in `package.json`
- A physical iOS or Android device with a camera — the sample relies on live camera input and is not meant to run on a simulator
- Dynamsoft Barcode Reader React-Native packages, already listed in `package.json`:
  - `dynamsoft-barcode-reader-bundle-react-native`
  - `dynamsoft-capture-vision-react-native`

## How to Run

1. Enter the sample folder

```bash
cd ScanBarcodes_ReadyToUseComponent
```

2. Install node modules

```bash
yarn install
```

or

```bash
npm install
```

3. Prepare iOS

You must install the necessary native frameworks from CocoaPods to run the application. In order to do this, the `pod install` command needs to be run as such:

```bash
cd ios
pod install
```

Open the **workspace** file `*.xcworkspace` (not `.xcodeproj`) from the `ios` directory in Xcode. Adjust *Provisioning* and *Signing* settings.

4. Build and run

- **Android**

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

- **iOS**

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see two buttons on a blank screen. Tap either of them to open the scanner.

> [!NOTE]
> If you want to run Android via `Windows`, you may encounter some build errors due to the `Windows Maximum Path Length Limitation`. The CMake version pinned in `android/app/build.gradle` already mitigates most of it, but we still recommend that you move the project to a directory with a shorter path.

> [!NOTE]
> The application needs to run on a physical device rather than a simulator as it requires the use of the camera.

## Integration Notes For Your Own Project

### Android: pin a newer CMake

The Dynamsoft native libraries are built with CMake. Add the following block inside the `android` section of your app-level `android/app/build.gradle`, next to `compileSdkVersion`:

```gradle
android {
    // ... your existing configuration

    externalNativeBuild {
        cmake {
            version "3.31.6"
        }
    }
}
```

The Android Gradle Plugin defaults to CMake 3.22.1, which bundles ninja 1.10.2. That version of ninja cannot handle paths longer than 260 characters, so builds break as soon as the project (or its Gradle cache) lives in a deep directory on Windows. CMake 3.31 and later bundle ninja 1.12, which supports Windows long paths, so pinning 3.31.6 keeps the native build working regardless of where the project is checked out.

### iOS: camera permission

The scanner opens the camera from native code, so iOS requires a usage description. Add the `NSCameraUsageDescription` key to `ios/ScanBarcodes_ReadyToUseComponent/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>Open camera to scan barcode.</string>
```

- The value is shown to the user in the permission prompt, so describe your own use case instead of copying the sample text verbatim.
- Without this key the app is terminated by the system the first time it touches the camera, and App Store review will reject the build.
- If you create the project with a newer React Native template, the key may already be present — check before adding a duplicate.

## License

- You can request a 30-day trial license via the [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&utm_source=github&package=mobile) link.
- The trial license string is embedded in `App.tsx` and requires a network connection to activate. Replace it with your own license for production use.

## Contact

https://www.dynamsoft.com/company/contact/
