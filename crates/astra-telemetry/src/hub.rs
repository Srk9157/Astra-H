use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::{broadcast, RwLock};

use astra_core::packet::TelemetryPacket;
use crate::device::ConnectedDevice;

#[derive(Clone)]
pub struct TelemetryHub {
    sender: broadcast::Sender<String>,
    devices: Arc<RwLock<HashMap<String, ConnectedDevice>>>,
    latest_packet: Arc<RwLock<TelemetryPacket>>,
}

impl TelemetryHub {
    pub fn new(capacity: usize) -> Self {
        let (sender, _) = broadcast::channel(capacity);
        Self {
            sender,
            devices: Arc::new(RwLock::new(HashMap::new())),
            latest_packet: Arc::new(RwLock::new(TelemetryPacket::default())),
        }
    }

    /// Subscribe to real-time telemetry broadcast messages
    pub fn subscribe(&self) -> broadcast::Receiver<String> {
        self.sender.subscribe()
    }

    /// Register a new remote device monitoring this astronaut
    pub async fn register_device(&self, device: ConnectedDevice) {
        let mut dev_map = self.devices.write().await;
        dev_map.insert(device.device_id.clone(), device);
    }

    /// Unregister a disconnected device
    pub async fn unregister_device(&self, device_id: &str) {
        let mut dev_map = self.devices.write().await;
        dev_map.remove(device_id);
    }

    /// Retrieve all currently connected monitoring devices
    pub async fn list_devices(&self) -> Vec<ConnectedDevice> {
        let dev_map = self.devices.read().await;
        dev_map.values().cloned().collect()
    }

    /// Store and broadcast new calculated telemetry packet to all devices
    pub async fn broadcast_packet(&self, mut packet: TelemetryPacket) {
        let dev_count = {
            let dev_map = self.devices.read().await;
            dev_map.len().max(1)
        };
        packet.connected_devices_count = dev_count;

        {
            let mut latest = self.latest_packet.write().await;
            *latest = packet.clone();
        }

        if let Ok(json_str) = serde_json::to_string(&packet) {
            let _ = self.sender.send(json_str);
        }
    }

    /// Get snapshot of current latest packet
    pub async fn get_latest_packet(&self) -> TelemetryPacket {
        let latest = self.latest_packet.read().await;
        latest.clone()
    }
}
