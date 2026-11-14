/// MH-Z19B NDIR Infrared CO2 Sensor Driver
pub struct MhZ19bDriver;

impl MhZ19bDriver {
    pub const READ_CO2_CMD: [u8; 9] = [0xFF, 0x01, 0x86, 0x00, 0x00, 0x00, 0x00, 0x00, 0x79];

    /// Validates checksum of a 9-byte response: sum bytes 1..8, invert, add 1
    pub fn verify_checksum(packet: &[u8; 9]) -> bool {
        let mut sum: u8 = 0;
        for i in 1..8 {
            sum = sum.wrapping_add(packet[i]);
        }
        let checksum = (!sum).wrapping_add(1);
        checksum == packet[8]
    }

    /// Parse CO2 concentration in PPM from 9-byte response [0xFF, 0x86, HIGH, LOW, ...]
    pub fn parse_response(packet: &[u8; 9]) -> Option<f32> {
        if packet[0] != 0xFF || packet[1] != 0x86 {
            return None;
        }
        if !Self::verify_checksum(packet) {
            return None;
        }
        let co2_ppm = ((packet[2] as u16) << 8) | (packet[3] as u16);
        Some(co2_ppm as f32)
    }
}
