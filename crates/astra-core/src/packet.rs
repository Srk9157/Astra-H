use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use crate::astronaut::AstronautProfile;
use crate::vitals::{
    CardiovascularSystem, DigestiveNutritionHydration, EnvironmentalConditions,
    ExternalSurvivalResourcesSafety, ImmuneCellularGeneticHealth, MetabolicEndocrineSystem,
    MentalPsychologicalHealth, NeurologicalBrainFunction, PhysicalBodyComposition,
    RespiratorySystem, SensoryMusculoskeletalSystem, SleepBiologicalRhythms,
};

/// Hardware Peripheral Health & Connectivity Status
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PeripheralStatus {
    pub max30102_connected: bool, // SpO2 & Heart Rate
    pub max30205_connected: bool, // Body Temp
    pub bmp280_connected: bool,   // Internal/Cabin Pressure
    pub ads1299_connected: bool,  // 8-Ch EEG Brain Signals
    pub ad8232_connected: bool,   // ECG Analog Lead
    pub mhz19b_connected: bool,   // NDIR CO2
    pub o2_sensor_connected: bool,
    pub pressure_transducer_connected: bool,
    pub external_temp_sensor_connected: bool,
    pub digital_bp_connected: bool,
}

impl Default for PeripheralStatus {
    fn default() -> Self {
        Self {
            max30102_connected: true,
            max30205_connected: true,
            bmp280_connected: true,
            ads1299_connected: true,
            ad8232_connected: true,
            mhz19b_connected: true,
            o2_sensor_connected: true,
            pressure_transducer_connected: true,
            external_temp_sensor_connected: true,
            digital_bp_connected: true,
        }
    }
}

/// Unified Telemetry Packet covering all 12 Survival Parameter Systems from NASA Space Apps
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TelemetryPacket {
    pub packet_id: u64,
    pub timestamp: DateTime<Utc>,
    pub astronaut: AstronautProfile,
    // The 12 Official Systems
    pub physical: PhysicalBodyComposition,
    pub cardiovascular: CardiovascularSystem,
    pub respiratory: RespiratorySystem,
    pub neurological: NeurologicalBrainFunction,
    pub mental: MentalPsychologicalHealth,
    pub sleep: SleepBiologicalRhythms,
    pub metabolic: MetabolicEndocrineSystem,
    pub digestive: DigestiveNutritionHydration,
    pub immune: ImmuneCellularGeneticHealth,
    pub sensory: SensoryMusculoskeletalSystem,
    pub environment: EnvironmentalConditions,
    pub survival: ExternalSurvivalResourcesSafety,
    // System Peripherals & Sync
    pub peripherals: PeripheralStatus,
    pub connected_devices_count: usize,
}

impl Default for TelemetryPacket {
    fn default() -> Self {
        Self {
            packet_id: 1,
            timestamp: Utc::now(),
            astronaut: AstronautProfile::default(),
            physical: PhysicalBodyComposition::default(),
            cardiovascular: CardiovascularSystem::default(),
            respiratory: RespiratorySystem::default(),
            neurological: NeurologicalBrainFunction::default(),
            mental: MentalPsychologicalHealth::default(),
            sleep: SleepBiologicalRhythms::default(),
            metabolic: MetabolicEndocrineSystem::default(),
            digestive: DigestiveNutritionHydration::default(),
            immune: ImmuneCellularGeneticHealth::default(),
            sensory: SensoryMusculoskeletalSystem::default(),
            environment: EnvironmentalConditions::default(),
            survival: ExternalSurvivalResourcesSafety::default(),
            peripherals: PeripheralStatus::default(),
            connected_devices_count: 2,
        }
    }
}
