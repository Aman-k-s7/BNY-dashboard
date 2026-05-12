const fixedDeviceSerial = (import.meta.env.VITE_FIXED_DEVICE_SERIAL || "AGFW26005").trim();

export const FIXED_DEVICE_SERIAL = fixedDeviceSerial || "AGFW26005";
export const DEFAULT_DASHBOARD_DEVICES = [FIXED_DEVICE_SERIAL];
