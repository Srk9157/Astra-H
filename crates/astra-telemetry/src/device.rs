use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConnectedDevice {
    pub device_id: String,
    pub name: String,
    pub role: String, // e.g., "Astronaut Helmet HUD", "Flight Surgeon Tablet", "Mission Control Terminal"
    pub ip_address: String,
    pub connected_at: DateTime<Utc>,
    pub ping_latency_ms: u32,
}

impl ConnectedDevice {
    pub fn new(device_id: String, name: String, role: String, ip_address: String) -> Self {
        Self {
            device_id,
            name,
            role,
            ip_address,
            connected_at: Utc::now(),
            ping_latency_ms: 12,
        }
    }
}
