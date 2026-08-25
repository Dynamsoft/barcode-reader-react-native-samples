/*
 * This is the sample of Dynamsoft Barcode Reader.
 *
 * Copyright © Dynamsoft Corporation. All rights reserved.
 */

import React, { useCallback, useState } from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';
import { setScanResultDelegate } from './CameraScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [itemId, setItemId] = useState('');

  const handleScanPressed = useCallback(() => {
    // Register delegate before navigating — mirroring Swift's delegate = self
    setScanResultDelegate((text: string) => {
      setItemId(text);
    });
    navigation.navigate('Camera', { mode: 'scan' });
  }, [navigation]);

  return (
    <View style={styles.homeContainer}>
      <View style={styles.homeContent}>
        <Text style={styles.title}>Locate an Item with Barcode</Text>

        <Text style={styles.stepLabel}>
          1.Enter or Scan the Item ID that you're searching for:
        </Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Item ID"
            placeholderTextColor="#999"
            value={itemId}
            onChangeText={setItemId}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleScanPressed}
          >
            <Text style={styles.scanButtonText}>📷</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.stepLabel}>2.Start searching for the item</Text>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            if (!itemId.trim()) {
              Alert.alert('Hint', 'Please enter or scan an Item ID first.');
              return;
            }
            navigation.navigate('Camera', { mode: 'search', targetText: itemId });
          }}
        >
          <Text style={styles.startButtonText}>Start Searching</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  homeContent: {
    backgroundColor: '#5a5a5a',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 360,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  stepLabel: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 12,
    marginTop: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
  },
  scanButton: {
    width: 44,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: 22,
  },
  startButton: {
    backgroundColor: '#f5a623',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
