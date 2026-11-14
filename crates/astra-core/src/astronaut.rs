use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AstronautProfile {
    pub id: String,
    pub name: String,
    pub callsign: String,
    pub role: String,
    pub mission_name: String,
    pub destination: String,
    /// Distance from Earth (Anchor) in kilometers
    pub distance_from_home_km: f64,
    /// Distance in Astronomical Units (AU)
    pub distance_from_home_au: f64,
    /// Light delay to Earth in seconds
    pub light_delay_seconds: f64,
    pub mission_elapsed_days: f32,
    pub eva_active: bool,
    pub crew_status: String,
}

impl Default for AstronautProfile {
    fn default() -> Self {
        let km = 384_400.0 + 1_250_000.0; // Interplanetary cruise beyond Moon
        let au = km / 149_597_870.7;
        let c_km_s = 299_792.458;
        Self {
            id: "ASTRA-01".to_string(),
            name: "Commander Christina Koch".to_string(),
            callsign: "ARES-1".to_string(),
            role: "Chief Mission Specialist / EVA Specialist".to_string(),
            mission_name: "Project ASTRA – Deep Space Outpost".to_string(),
            destination: "Kepler-296f Trajectory".to_string(),
            distance_from_home_km: km,
            distance_from_home_au: au,
            light_delay_seconds: km / c_km_s,
            mission_elapsed_days: 142.6,
            eva_active: true,
            crew_status: "Active on EVA Airlock Tether".to_string(),
        }
    }
}
