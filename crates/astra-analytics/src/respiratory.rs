pub struct RespiratoryAnalytics;

impl RespiratoryAnalytics {
    /// Calculate SpO2 from MAX30102 Red and Infrared photodiode components:
    /// R = (AC_red / DC_red) / (AC_ir / DC_ir)
    /// SpO2 ~ 110 - 25 * R
    pub fn calculate_spo2_from_raw(ac_red: f32, dc_red: f32, ac_ir: f32, dc_ir: f32) -> f32 {
        if dc_red <= 0.0 || dc_ir <= 0.0 || ac_ir <= 0.0 {
            return 98.0;
        }
        let r_ratio = (ac_red / dc_red) / (ac_ir / dc_ir);
        let spo2 = 110.0 - 25.0 * r_ratio;
        spo2.clamp(70.0, 100.0)
    }

    /// Calculate Minute Ventilation (L/min) from Breathing Rate and Tidal Volume
    pub fn calculate_minute_ventilation(breaths_per_min: f32, tidal_volume_ml: f32) -> f32 {
        (breaths_per_min * tidal_volume_ml) / 1000.0
    }

    /// Assess Respiratory Distress Index (0 to 100)
    pub fn calculate_distress_index(breathing_rate: f32, spo2: f32, et_co2: f32) -> f32 {
        let mut score = 0.0;
        // Tachypnea or Bradypnea
        if breathing_rate > 24.0 {
            score += (breathing_rate - 24.0) * 3.0;
        } else if breathing_rate < 10.0 {
            score += (10.0 - breathing_rate) * 5.0;
        }
        // Hypoxemia
        if spo2 < 95.0 {
            score += (95.0 - spo2) * 8.0;
        }
        // Hypercapnia (elevated CO2)
        if et_co2 > 45.0 {
            score += (et_co2 - 45.0) * 2.5;
        }
        score.clamp(0.0, 100.0)
    }
}
