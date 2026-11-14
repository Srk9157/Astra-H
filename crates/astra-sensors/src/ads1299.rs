use serde::{Deserialize, Serialize};

/// ADS1299 8-Channel 24-bit Low-Noise EEG ADC
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Ads1299Frame {
    pub status_bits: u32,
    pub channels_u_v: [f32; 8], // Microvolts on Ch1 - Ch8
}

pub struct Ads1299Driver {
    pub gain: f32, // typically 24x for EEG
    pub vref: f32, // 4.5V internal reference
}

impl Ads1299Driver {
    pub fn new() -> Self {
        Self {
            gain: 24.0,
            vref: 4.5,
        }
    }

    /// Converts 24-bit signed two's complement integer to microvolts (uV)
    pub fn raw_24bit_to_microvolts(&self, raw: i32) -> f32 {
        let max_val = 8388607.0; // 2^23 - 1
        let v = ((raw as f32) / max_val) * (self.vref / self.gain);
        v * 1_000_000.0 // Volts to microvolts
    }

    /// Parse a 27-byte ADS1299 SPI data packet (3 status bytes + 8 * 3 channel bytes)
    pub fn parse_spi_frame(&self, buffer: &[u8; 27]) -> Ads1299Frame {
        let status = ((buffer[0] as u32) << 16) | ((buffer[1] as u32) << 8) | (buffer[2] as u32);
        let mut channels = [0.0; 8];

        for i in 0..8 {
            let offset = 3 + i * 3;
            let mut val = ((buffer[offset] as i32) << 16)
                | ((buffer[offset + 1] as i32) << 8)
                | (buffer[offset + 2] as i32);
            // Sign extend 24-bit to 32-bit
            if (val & 0x00800000) != 0 {
                val |= !0x00FFFFFF;
            }
            channels[i] = self.raw_24bit_to_microvolts(val);
        }

        Ads1299Frame {
            status_bits: status,
            channels_u_v: channels,
        }
    }
}
