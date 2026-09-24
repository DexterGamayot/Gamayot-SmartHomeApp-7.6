import { Device, SensorData, sampleDevices } from '../models/IoTModels';

// ─────────────────────────────────────────────
// Activity 10 — IoT Service
// This is the bottom of the architecture:
//   Screens -> useIoT() -> IoTContext -> IoTService -> Simulated IoT API
// Screens never talk to this file directly, and never generate IoT data
// themselves — only IoTContext calls into this service.
// ─────────────────────────────────────────────

// Simulates real network / radio latency to a physical gateway.
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Chance that a simulated request fails, to exercise error handling.
const FAILURE_RATE = 0.15;

function shouldFail(rate: number = FAILURE_RATE): boolean {
    return Math.random() < rate;
}

// Acts as the "device database" on the simulated gateway/API so that
// status changes persist between calls during the app session.
let deviceStore: Device[] = sampleDevices.map((device) => ({
    ...device,
}));

/**
 * Simulates connecting to the physical IoT gateway.
 */
export async function connectGateway(): Promise<boolean> {

    await delay(1000);

    if (shouldFail(0.1)) {
        throw new Error('Unable to connect to the IoT Gateway.');
    }

    return true;
}

/**
 * Simulates fetching the list of known devices from the gateway.
 */
export async function getDevices(): Promise<Device[]> {

    await delay(1200);

    if (shouldFail()) {
        throw new Error('Unable to retrieve devices.');
    }

    return deviceStore.map((device) => ({ ...device }));
}

/**
 * Simulates reading live sensor values from the gateway.
 */
export async function getSensorData(): Promise<SensorData> {

    await delay(1500);

    if (shouldFail()) {
        throw new Error('Unable to retrieve sensor data.');
    }

    return {
        temperature: Math.floor(Math.random() * (32 - 18 + 1)) + 18,
        humidity: Math.floor(Math.random() * (80 - 30 + 1)) + 30,
        lightLevel: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    };
}

/**
 * Simulates sending a command to the gateway to change a device's status.
 */
export async function updateDeviceStatus(
    id: number,
    status: boolean
): Promise<Device> {

    await delay(1000);

    const device = deviceStore.find((item) => item.id === id);

    if (!device) {
        throw new Error('Device not found.');
    }

    if (shouldFail()) {
        throw new Error(`Unable to update ${device.name}.`);
    }

    device.status = status;

    return { ...device };
}
