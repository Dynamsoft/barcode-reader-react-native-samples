import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScannerScreen from './ScannerScreen';

export type RootStackParamList = {
  Home: undefined;
  Scanner: { templateFileName: string, templateContent: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const barcodeFormats = [
  { label: 'Any Codes', image: require('../assets/common_2d_1d.png') },
  { label: '1D Retail', image: require('../assets/1d_retail.png'), templateFileName: 'ReadOneDRetail.json', templateContent: JSON.stringify(require('../assets/Templates/ReadOneDRetail.json')) },
  { label: '1D Industrial', image: require('../assets/1d_industrial.png'), templateFileName: 'ReadOneDIndustrial.json', templateContent: JSON.stringify(require('../assets/Templates/ReadOneDIndustrial.json')) },
  { label: 'QR Code', image: require('../assets/qr_code.png'), templateFileName: 'ReadQR.json', templateContent: JSON.stringify(require('../assets/Templates/ReadQR.json')) },
  { label: 'Data Matrix', image: require('../assets/data_matrix.png'), templateFileName: 'ReadDataMatrix.json', templateContent: JSON.stringify(require('../assets/Templates/ReadDataMatrix.json')) },
  { label: 'Common 2D\ncodes', image: require('../assets/common_2d.png'), templateFileName: 'ReadCommon2D.json', templateContent: JSON.stringify(require('../assets/Templates/ReadCommon2D.json')) },
  { label: 'Aztec Code', image: require('../assets/aztec_code.png'), templateFileName: 'ReadAztec.json', templateContent: JSON.stringify(require('../assets/Templates/ReadAztec.json')) },
  { label: 'Dot Code', image: require('../assets/dot_code.png'), templateFileName: 'ReadDotCode.json', templateContent: JSON.stringify(require('../assets/Templates/ReadDotCode.json')) },
  { label: 'Direct Part\nMarking(DPM)', image: require('../assets/dpm.png'), templateFileName: 'ReadDPM.json', templateContent: JSON.stringify(require('../assets/Templates/ReadDPM.json')) },
  { label: 'PDF417', image: require('../assets/pdf417.png'), templateFileName: 'ReadPDF417.json', templateContent: JSON.stringify(require('../assets/Templates/ReadPDF417.json')) },
];

const scenarios = [
  { label: 'High-Density\nCode', image: require('../assets/high_density.png'), templateFileName: 'ReadDenseBarcodes.json', templateContent: JSON.stringify(require('../assets/Templates/ReadDenseBarcodes.json')) },
];

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Scanner"
            component={ScannerScreen}
            options={{ headerShown: true, headerTitle: 'Scanner', headerTintColor: '#fff', headerStyle: { backgroundColor: '#151517' } }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require('../assets/dynamsoft-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.sectionTitle}>Select Scanner by Barcode Format</Text>
        <View style={styles.grid}>
          {barcodeFormats.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: index % 2 === 0 ? '#000000' : '#1d1d1d' }]}
              onPress={() => navigation.navigate('Scanner', item)}
            >
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Image source={item.image} resizeMode="contain" />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Select Scanner by Your Scenario</Text>
        <View style={styles.grid}>
          {scenarios.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: index % 2 === 0 ? '#000000' : '#1d1d1d' }]}
              onPress={() => navigation.navigate('Scanner', { templateFileName: item.templateFileName, templateContent: item.templateContent })}
            >
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Image source={item.image} resizeMode="contain" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#151517',
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  logo: {
    width: 200,
    height: 40,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#4ecdc4',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 16,
  },
  card: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3d3d3d',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '1.16%',
    padding: 8,
  },
  cardLabel: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  cardImage: {
    width: 64,
    height: 64,
  },
});
