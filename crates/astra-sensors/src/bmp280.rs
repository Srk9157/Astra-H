/// BMP280 Barometric Pressure Sensor
pub struct Bmp280Driver {
    pub dig_t1: u16,
    pub dig_t2: i16,
    pub dig_t3: i16,
    pub dig_p1: u16,
    pub dig_p2: i16,
    pub dig_p3: i16,
    pub dig_p4: i16,
    pub dig_p5: i16,
    pub dig_p6: i16,
    pub dig_p7: i16,
    pub dig_p8: i16,
    pub dig_p9: i16,
}

impl Bmp280Driver {
    pub const I2C_ADDR: u8 = 0x76;

    pub fn default_calibration() -> Self {
        Self {
            dig_t1: 27504,
            dig_t2: 26435,
            dig_t3: -1000,
            dig_p1: 36477,
            dig_p2: -10685,
            dig_p3: 3024,
            dig_p4: 2855,
            dig_p5: 140,
            dig_p6: -7,
            dig_p7: 15500,
            dig_p8: -14600,
            dig_p9: 6000,
        }
    }

    /// Compensates raw 20-bit pressure and temperature to kPa and °C
    pub fn compensate(&self, raw_p: i32, raw_t: i32) -> (f32, f32) {
        // Bosch BMP280 temperature compensation algorithm
        let var1 = (((raw_t >> 3) - ((self.dig_t1 as i32) << 1)) * (self.dig_t2 as i32)) >> 11;
        let var2 = (((((raw_t >> 4) - (self.dig_t1 as i32)) * ((raw_t >> 4) - (self.dig_t1 as i32))) >> 12)
            * (self.dig_t3 as i32)) >> 14;
        let t_fine = var1 + var2;
        let temp_c = ((t_fine * 5 + 128) >> 8) as f32 / 100.0;

        // Bosch BMP280 pressure compensation
        let mut p_var1 = (t_fine as i64) - 128000;
        let mut p_var2 = p_var1 * p_var1 * (self.dig_p6 as i64);
        p_var2 += (p_var1 * (self.dig_p5 as i64)) << 17;
        p_var2 += (self.dig_p4 as i64) << 35;
        p_var1 = ((p_var1 * p_var1 * (self.dig_p3 as i64)) >> 8) + ((p_var1 * (self.dig_p2 as i64)) << 12);
        p_var1 = (((1i64 << 47) + p_var1) * (self.dig_p1 as i64)) >> 33;

        let pressure_kpa = if p_var1 == 0 {
            0.0
        } else {
            let mut p = 1048576 - (raw_p as i64);
            p = (((p << 31) - p_var2) * 3125) / p_var1;
            let v1 = ((self.dig_p9 as i64) * (p >> 13) * (p >> 13)) >> 25;
            let v2 = ((self.dig_p8 as i64) * p) >> 19;
            p = ((p + v1 + v2) >> 8) + ((self.dig_p7 as i64) << 4);
            (p as f32 / 256.0) / 1000.0 // Pa to kPa
        };

        (pressure_kpa, temp_c)
    }
}
