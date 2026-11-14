pub struct Max30205Driver;

impl Max30205Driver {
    pub const I2C_ADDR: u8 = 0x48;
    pub const REG_TEMP: u8 = 0x00;
    pub const REG_CONFIG: u8 = 0x01;

    /// Converts two raw register bytes from MAX30205 to Celsius
    pub fn raw_to_celsius(msb: u8, lsb: u8) -> f32 {
        let raw = ((msb as i16) << 8) | (lsb as i16);
        (raw as f32) * 0.00390625 // LSB is 0.00390625 °C (1/256 °C)
    }
}
