use serde::{Deserialize, Serialize};

/// MAX30102 Optical Heart-Rate and SpO2 Sensor Frame
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Max30102RawSample {
    pub red_led_raw: u32,  // 18-bit ADC red channel
    pub ir_led_raw: u32,   // 18-bit ADC infrared channel
    pub ambient_light_overflow: bool,
}

pub struct Max30102Driver {
    pub sample_rate_hz: u32,
    pub pulse_width_us: u16,
    pub led_current_ma: f32,
}

impl Max30102Driver {
    pub const I2C_ADDR: u8 = 0x57;

    pub fn new() -> Self {
        Self {
            sample_rate_hz: 100,
            pulse_width_us: 411,
            led_current_ma: 6.4,
        }
    }

    /// Parse raw 6-byte FIFO data packet from MAX30102
    pub fn parse_fifo_sample(&self, bytes: &[u8; 6]) -> Max30102RawSample {
        let red = (((bytes[0] as u32) << 16) | ((bytes[1] as u32) << 8) | (bytes[2] as u32)) & 0x03FFFF;
        let ir = (((bytes[3] as u32) << 16) | ((bytes[4] as u32) << 8) | (bytes[5] as u32)) & 0x03FFFF;
        Max30102RawSample {
            red_led_raw: red,
            ir_led_raw: ir,
            ambient_light_overflow: (bytes[0] & 0x40) != 0,
        }
    }
}
