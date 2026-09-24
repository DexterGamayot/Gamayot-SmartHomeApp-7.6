import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import { Device, SensorData, sampleDevices } from '../models/IoTModels';
import * as IoTService from '../services/IoTService';



type IoTContextType = {

    // Devices
    devices: Device[];
    devicesLoading: boolean;
    devicesError: string | null;
    refreshDevices: () => Promise<void>;

    updatingDeviceId: number | null;
    deviceUpdateError: string | null;
    toggleDevice: (id: number, value: boolean) => Promise<void>;

    // Sensors
    sensors: SensorData;
    sensorsLoading: boolean;
    sensorsError: string | null;
    refreshSensors: () => Promise<void>;

    // Gateway connection
    gatewayConnected: boolean;
    gatewayConnecting: boolean;
    gatewayError: string | null;
    connectGateway: () => Promise<void>;

    // App appearance
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
};

const IoTContext = createContext<IoTContextType | undefined>(undefined);


const initialSensors: SensorData = {
    temperature: 0,
    humidity: 0,
    lightLevel: 0,
};

export function IoTProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    // Devices
    const [devices, setDevices] = useState<Device[]>(sampleDevices);
    const [devicesLoading, setDevicesLoading] = useState(false);
    const [devicesError, setDevicesError] = useState<string | null>(null);

    const [updatingDeviceId, setUpdatingDeviceId] = useState<number | null>(null);
    const [deviceUpdateError, setDeviceUpdateError] = useState<string | null>(null);

    // Sensors
    const [sensors, setSensors] = useState<SensorData>(initialSensors);
    const [sensorsLoading, setSensorsLoading] = useState(false);
    const [sensorsError, setSensorsError] = useState<string | null>(null);

    // Gateway
    const [gatewayConnected, setGatewayConnected] = useState(false);
    const [gatewayConnecting, setGatewayConnecting] = useState(false);
    const [gatewayError, setGatewayError] = useState<string | null>(null);

    // App appearance
    const [darkMode, setDarkMode] = useState(false);

    const connectGateway = useCallback(async () => {

        setGatewayConnecting(true);
        setGatewayError(null);

        try {
            await IoTService.connectGateway();
            setGatewayConnected(true);
        } catch (error) {
            setGatewayConnected(false);
            setGatewayError('IoT Gateway is disconnected.');
        } finally {
            setGatewayConnecting(false);
        }

    }, []);

    const refreshDevices = useCallback(async () => {

        setDevicesLoading(true);
        setDevicesError(null);

        try {
            const data = await IoTService.getDevices();
            setDevices(data);
        } catch (error) {
            setDevicesError('Unable to load devices.');
        } finally {
            setDevicesLoading(false);
        }

    }, []);

    const refreshSensors = useCallback(async () => {

        setSensorsLoading(true);
        setSensorsError(null);

        try {
            const data = await IoTService.getSensorData();
            setSensors(data);
        } catch (error) {
            setSensorsError('Unable to retrieve sensor data.');
        } finally {
            setSensorsLoading(false);
        }

    }, []);

    const toggleDevice = useCallback(async (
        id: number,
        value: boolean
    ) => {

       if (!gatewayConnected) {
            return;
        }

        setDeviceUpdateError(null);
        setUpdatingDeviceId(id);

       setDevices((current) => current.map((device) => (
            device.id === id ? { ...device, status: value } : device
        )));

        try {

            const updated = await IoTService.updateDeviceStatus(id, value);

            setDevices((current) => current.map((device) => (
                device.id === id ? updated : device
            )));

        } catch (error) {

            setDevices((current) => current.map((device) => (
                device.id === id ? { ...device, status: !value } : device
            )));

            setDeviceUpdateError(
                error instanceof Error
                    ? error.message
                    : 'Unable to update device.'
            );

        } finally {
            setUpdatingDeviceId(null);
        }

    }, [gatewayConnected]);

    
    useEffect(() => {

        connectGateway();
        refreshDevices();
        refreshSensors();

    }, [connectGateway, refreshDevices, refreshSensors]);

    return (
        <IoTContext.Provider
            value={{
                devices,
                devicesLoading,
                devicesError,
                refreshDevices,

                updatingDeviceId,
                deviceUpdateError,
                toggleDevice,

                sensors,
                sensorsLoading,
                sensorsError,
                refreshSensors,

                gatewayConnected,
                gatewayConnecting,
                gatewayError,
                connectGateway,

                darkMode,
                setDarkMode,
            }}
        >
            {children}
        </IoTContext.Provider>
    );
}

export function useIoT() {

    const context = useContext(IoTContext);

    if (!context) {
        throw new Error(
            'useIoT must be used inside IoTProvider'
        );
    }

    return context;
}
