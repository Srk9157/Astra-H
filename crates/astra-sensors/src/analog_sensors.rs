use serde::{Deserialize, Serialize};

/// Galvanic Fuel Cell / Optical O2 Sensor
pub struct OxygenSensorDriver;

impl OxygenSensorDriver {
    /// Converts millivolt output of galvanic cell to % O2 (e.g. 9-13 mV in 20.9% air)
    pub fn mv_to_percent_o2(mv: f32, cal_air_mv: f32) -> f32 {
        if cal_air_mv <= 0.0 {
            return 20.9;
        }
        (mv / cal_air_mv) * 20.9
    }
}

/// Industrial Pressure Transducer for EVA Suit & Oxygen High-Pressure Tank
pub struct PressureTransducerDriver;

impl PressureTransducerDriver {
    /// Converts 0.5V - 4.5V ratiometric signal to PSI
    pub fn voltage_to_psi(voltage: f32, max_psi: f32) -> f32 {
        let v_min = 0.5;
        let v_max = 4.5;
        if voltage <= v_min {
            return 0.0;
        }
        let ratio = (voltage - v_min) / (v_max - v_min);
        (ratio * max_psi).clamp(0.0, max_psi)
    }
}

/// External Ambient Temperature Sensor (Platinum RTD PT100 / Thermocouple)
pub struct ExternalTempSensorDriver;

impl ExternalTempSensorDriver {
    /// Callendar-Van Dusen equation approximation for PT100 RTD resistance to Celsius
    pub fn resistance_to_celsius(ohms: f32) -> f32 {
        let r0 = 100.0;
        let a = 3.9083e-3;
        // Linearized approximation for quick onboard calculation: R = R0(1 + A*T)
        (ohms - r0) / (r0 * a)
    }
}

/// Digital Blood Pressure Monitor Packet
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DigitalBpReading {
    pub systolic_mmhg: f32,
    pub diastolic_mmhg: f32,
    pub pulse_bpm: f32,
    pub error_code: u8,
}

pub struct DigitalBpDriver;

impl DigitalBpDriver {
    /// Parse standard 7-byte serial frame from digital oscillometric cuff
    /// [HEADER: 0xAA, SYS_H, SYS_L, DIA_H, DIA_L, PULSE, CHKSUM]
    pub fn parse_serial_frame(frame: &[u8; 7]) -> Option<DigitalBpReading> {
        if frame[0] != 0xAA {
            return None;
        }
        let sys = ((frame[1] as u16) << 8) | (frame[2] as u16);
        let dia = ((frame[3] as u16) << 8) | (frame[4] as u16);
        let pulse = frame[5] as f32;

        Some(DigitalBpReading {
            systolic_mmhg: sys as f32,
            diastolic_mmhg: dia as f32,
            pulse_bpm: pulse,
            error_code: 0,
        })
    }
}
