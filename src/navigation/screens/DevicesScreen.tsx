import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
  Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../../context/IoTContext';



export default function DevicesScreen() {

  const {
    devices,
    devicesLoading,
    devicesError,
    refreshDevices,
    updatingDeviceId,
    deviceUpdateError,
    toggleDevice,
    gatewayConnected,
    gatewayConnecting,
    gatewayError,
    connectGateway,
  } = useIoT();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      <Text style={styles.title}>
        Devices
      </Text>

      <Text style={styles.subtitle}>
        Control your connected devices
      </Text>

      {!gatewayConnecting && !gatewayConnected && (
        <View style={[styles.banner, styles.errorBanner]}>

          <Ionicons
            name="cloud-offline-outline"
            size={20}
            color="#b3261e"
          />

          <Text style={styles.errorBannerText}>
            {gatewayError ?? 'IoT Gateway is disconnected.'}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={connectGateway}
          >
            <Text style={styles.retryButtonText}>
              Retry
            </Text>
          </Pressable>

        </View>
      )}

   
      {devicesError && (
        <View style={[styles.banner, styles.errorBanner]}>

          <Ionicons
            name="alert-circle-outline"
            size={20}
            color="#b3261e"
          />

          <Text style={styles.errorBannerText}>
            {devicesError}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={refreshDevices}
          >
            <Text style={styles.retryButtonText}>
              Retry
            </Text>
          </Pressable>

        </View>
      )}


      {deviceUpdateError && (
        <View style={[styles.banner, styles.errorBanner]}>

          <Ionicons
            name="alert-circle-outline"
            size={20}
            color="#b3261e"
          />

          <Text style={styles.errorBannerText}>
            {deviceUpdateError}
          </Text>

        </View>
      )}

   
      {devicesLoading && (
        <View style={styles.banner}>
          <ActivityIndicator size="small" />
          <Text style={styles.loadingBannerText}>
            Loading devices...
          </Text>
        </View>
      )}

      {devices.map((device) => {

        const isUpdating = updatingDeviceId === device.id;
        const switchDisabled = !gatewayConnected || isUpdating;

        return (

          <View
            key={device.id}
            style={styles.deviceCard}
          >

            <View style={styles.deviceInfo}>

              <View style={styles.iconContainer}>

                <Ionicons
                  name={device.icon}
                  size={28}
                />

              </View>

              <View style={styles.deviceDetails}>

                <Text style={styles.deviceName}>
                  {device.name}
                </Text>

                <Text style={styles.deviceType}>
                  {device.type}
                </Text>

                <Text style={styles.deviceState}>
                  {isUpdating ? 'Updating...' : (device.status ? 'ON' : 'OFF')}
                </Text>

              </View>

            </View>

            {isUpdating ? (
              <ActivityIndicator size="small" />
            ) : (
              <Switch
                value={device.status}
                disabled={switchDisabled}
                onValueChange={(value) => {
                  toggleDevice(device.id, value);
                }}
              />
            )}

          </View>

        );

      })}

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

  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#1f1f1f',
    marginBottom: 15,
  },

  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  deviceDetails: {
    flex: 1,
  },

  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  deviceType: {
    fontSize: 13,
    marginTop: 3,
  },

  deviceState: {
    fontSize: 12,
    marginTop: 5,
  },

});
