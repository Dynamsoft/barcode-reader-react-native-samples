# Dynamsoft Barcode Reader samples for React-Native edition

This repository contains multiple samples that demonstrate how to use the [Dynamsoft Barcode Reader](https://www.dynamsoft.com/barcode-reader/) React-Native Edition.

## Integration Guide For Your Project

- [Guide for Scanning Barcodes with Ready-to-use Component](https://www.dynamsoft.com/barcode-reader/docs/mobile/programming/react-native/user-guide.html)
- [Guide for Scanning Barcodes with Foundational APIs](https://www.dynamsoft.com/barcode-reader/docs/mobile/programming/react-native/foundational-user-guide.html)

## API References

There are two ways to use the Dynamsoft Barcode Reader React-Native SDK:

- [Ready-to-use BarcodeScanner APIs](https://www.dynamsoft.com/barcode-reader/docs/mobile/programming/react-native/api-reference/barcode-scanner/index.html)
  
- [Foundational APIs](https://www.dynamsoft.com/barcode-reader/docs/mobile/programming/react-native/api-reference/)

## Samples

| Sample Name | Description |
|-------------|-------------|
| [ScanBarcodes_ReadyToUseComponent](ScanBarcodes_ReadyToUseComponent) | Demonstrates the quickest way to scan barcodes from live camera preview using the **Ready-to-Use Barcode Scanner component**, with minimal configuration required. |
| [ScanBarcodes_FoundationalAPI](ScanBarcodes_FoundationalAPI) | Demonstrates how to scan barcodes from live camera preview using the **Foundational API**, providing full control over camera, processing pipeline, and barcode results. |
| [ScanBarcodes_Expo](ScanBarcodes_Expo) | Demonstrates barcode scanning using the **Foundational API in an Expo (Bare) project**, showing how to integrate Dynamsoft Barcode Reader into an Expo-based workflow. |
| [ScanDriversLicense](ScanDriversLicense) | Demonstrates how to recognize and extract information from drivers’ licenses in real-time video streaming. |
| [ScanVIN](ScanVIN) | Demonstrates how to recognize and extract information from VIN barcodes in real-time video streaming. |

### How to build and run a sample

#### For React Native CLI Samples

1. Enter a sample folder that you want to try

```bash
cd ScanBarcodes_FoundationalAPI
```

or

```bash
cd ScanBarcodes_ReadyToUseComponent
```

or

```bash
cd ScanDriversLicense
```

or

```bash
cd ScanVIN
```

2. Install node modules

Run the following command:

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

Open the **workspace** file `*.xcworkspace` (not .xcodeproj) from the `ios` directory in Xcode. Adjust *Provisioning* and *Signing* settings.

4. Build and Run

- **Android**

Go to your project folder and run the following command:

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

- **iOS**

In the terminal, go to the project folder in your project:

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running on your device.
This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

> [!NOTE]
> If you want to run Android via `Windows`, You may encounter some build errors due to the `Windows Maximum Path Length Limitation`.
> Therefore, we recommend that you move the project to a directory with a shorter path.

> [!NOTE]
>
>- The application needs to run on a physical device rather than a simulator as it requires the use of the camera. If you try running it on a simulator, you will most likely run into a number of errors/failures.
>- On iOS, in order to run the React Native app on a physical device you will need to install the [`ios-deploy`](https://www.npmjs.com/package/ios-deploy) library. Afterwards, you can run the react native app from the terminal as such `npx react-native run-ios --device` assuming it's the only device connected to the Mac.
>- Alternatively on iOS, you can simply open the xcworkspace of the project found in the `ios` folder using Xcode and run the sample on your connected iOS device from there. The advantage that this offers is that it is easier to deal with the developer signatures for deployment in there.

#### For Expo Sample

1. Enter the Expo sample folder

```bash
cd ScanBarcodes_Expo
```

2. Install node modules

```bash
yarn install
```

or

```bash
npm install
```

3. Generate native projects

Run the following command to generate the `android` and `ios` folders:

```bash
npx expo prebuild
```

4. Prepare iOS

Install the necessary native frameworks from CocoaPods:

```bash
cd ios
pod install
cd ..
```

5. Build and Run

- **Android**

```bash
npx expo run:android
```

- **iOS**

```bash
npx expo run:ios
```

> [!NOTE]
> The application needs to run on a physical device rather than a simulator as it requires the use of the camera.

### How to use the new architecture of React Native (Optional)

[How to enable new architecture in Android](https://reactnative.dev/architecture/landing-page#android)

[How to enable new architecture in iOS](https://reactnative.dev/architecture/landing-page#ios)


## License

- You can request a 30-day trial license via the [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&utm_source=github&package=mobile) link.

## Contact

https://www.dynamsoft.com/company/contact/
