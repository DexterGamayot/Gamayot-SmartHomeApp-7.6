import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../../context/IoTContext';



export default function SensorsScreen() {

  const {
    sensors,
    sensorsLoading,
    sensorsError,
    refreshSensors,
  } = useIoT();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      <Text style={styles.title}>
        Sensors
      </Text>

      <Text style={styles.subtitle}>
        Monitor your environment
      </Text>

      {sensorsError && (
        <View style={[styles.banner, styles.errorBanner]}>

          <Ionicons
            name="alert-circle-outline"
            size={20}
            color="#b3261e"
          />

          <Text style={styles.errorBannerText}>
            {sensorsError}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={refreshSensors}
          >
            <Text style={styles.retryButtonText}>
              Retry
            </Text>
          </Pressable>

        </View>
      )}

      {sensorsLoading && (
        <View style={styles.banner}>
          <ActivityIndicator size="small" />
          <Text style={styles.loadingBannerText}>
            Refreshing Sensors...
          </Text>
        </View>
      )}

      <View style={styles.sensorCard}>

        <View style={styles.sensorHeader}>

          <Ionicons
            name="thermometer-outline"
            size={30}
          />

          <Text style={styles.sensorName}>
            Temperature
          </Text>

        </View>

        <Text style={styles.sensorValue}>
          {sensors.temperature} °C
        </Text>

        <Text style={styles.sensorDescription}>
          Current room temperature
        </Text>

      </View>

      <View style={styles.sensorCard}>

        <View style={styles.sensorHeader}>

          <Ionicons
            name="water-outline"
            size={30}
          />

          <Text style={styles.sensorName}>
            Humidity
          </Text>

        </View>

        <Text style={styles.sensorValue}>
          {sensors.humidity} %
        </Text>

        <Text style={styles.sensorDescription}>
          Current relative humidity
        </Text>

      </View>

      <View style={styles.sensorCard}>

        <View style={styles.sensorHeader}>

          <Ionicons
            name="sunny-outline"
            size={30}
          />

          <Text style={styles.sensorName}>
            Light Level
          </Text>

        </View>

        <Text style={styles.sensorValue}>
          {sensors.lightLevel} lux
        </Text>

        <Text style={styles.sensorDescription}>
          Current ambient light
        </Text>

      </View>

      <Pressable
        style={[
          styles.refreshButton,
          sensorsLoading && styles.refreshButtonDisabled,
        ]}
        onPress={refreshSensors}
        disabled={sensorsLoading}
      >

        {sensorsLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Ionicons
            name="refresh-outline"
            size={20}
            color="#ffffff"
          />
        )}

        <Text style={styles.refreshButtonText}>
          {sensorsLoading ? 'Refreshing Sensors...' : 'Refresh Sensors'}
        </Text>

      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 25,
  },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
    gap: 10,
  },

  errorBanner: {
    backgroundColor: '#fbe9e7',
  },

  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#b3261e',
  },

  loadingBannerText: {
    fontSize: 13,
  },

  retryButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#b3261e',
  },

  retryButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  sensorCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#1f1f1f',
    marginBottom: 15,
  },

  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  sensorName: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  sensorValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
  },

  sensorDescription: {
    fontSize: 13,
    marginTop: 5,
  },

  refreshButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 15,
    backgroundColor: '#2f6fed',
    marginBottom: 30,
  },

  refreshButtonDisabled: {
    opacity: 0.7,
  },

  refreshButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },

});
