# ScanBarcodes_FoundationalAPI

Demonstrates how to scan barcodes from live camera preview using the **Foundational API**, providing full control over camera, processing pipeline, and barcode results.

## What This Sample Does

- Builds the scanning pipeline by hand: `CameraView` → `CameraEnhancer` → `CaptureVisionRouter`
- Starts decoding with the `PT_READ_BARCODES` preset template and receives results through a result receiver
- Displays every decoded barcode in an `Alert` (format string plus text) and resumes scanning when you dismiss it
- Pauses capturing and closes the camera when the app goes to the background, and restarts both when it becomes active again

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
cd ScanBarcodes_FoundationalAPI
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

If everything is set up _correctly_, you should see the camera preview and a scanning session starting automatically.

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

The camera is accessed through native code, so iOS requires a usage description. Add the `NSCameraUsageDescription` key to `ios/ScanBarcodes_FoundationalAPI/Info.plist`:

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
