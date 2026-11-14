pub struct CardioAnalytics;

impl CardioAnalytics {
    /// Calculate Mean Arterial Pressure (MAP): DBP + 1/3 * (SBP - DBP)
    pub fn calculate_map(systolic: f32, diastolic: f32) -> f32 {
        diastolic + ((systolic - diastolic) / 3.0)
    }

    /// Calculate Pulse Pressure: SBP - DBP
    pub fn calculate_pulse_pressure(systolic: f32, diastolic: f32) -> f32 {
        systolic - diastolic
    }

    /// Calculate Heart Rate Variability: SDNN (Standard Deviation of NN intervals) in milliseconds
    pub fn calculate_sdnn(rr_intervals_ms: &[f32]) -> f32 {
        if rr_intervals_ms.len() < 2 {
            return 50.0;
        }
        let mean = rr_intervals_ms.iter().sum::<f32>() / (rr_intervals_ms.len() as f32);
        let variance = rr_intervals_ms
            .iter()
            .map(|&rr| (rr - mean).powi(2))
            .sum::<f32>()
            / ((rr_intervals_ms.len() - 1) as f32);
        variance.sqrt()
    }

    /// Calculate Heart Rate Variability: RMSSD (Root Mean Square of Successive Differences) in ms
    pub fn calculate_rmssd(rr_intervals_ms: &[f32]) -> f32 {
        if rr_intervals_ms.len() < 2 {
            return 42.0;
        }
        let mut sum_sq_diff = 0.0;
        for i in 0..(rr_intervals_ms.len() - 1) {
            let diff = rr_intervals_ms[i + 1] - rr_intervals_ms[i];
            sum_sq_diff += diff * diff;
        }
        (sum_sq_diff / ((rr_intervals_ms.len() - 1) as f32)).sqrt()
    }

    /// Assess Arrhythmia and Cardiac Rhythm State
    pub fn evaluate_rhythm(heart_rate: f32, hrv_rmssd: f32) -> (String, bool) {
        if heart_rate > 115.0 {
            ("Sinus Tachycardia (Elevated Load)".to_string(), true)
        } else if heart_rate < 48.0 {
            ("Sinus Bradycardia (Depressed Heart Rate)".to_string(), true)
        } else if hrv_rmssd < 15.0 {
            ("Reduced Autonomic Variability / Stress Spike".to_string(), false)
        } else {
            ("Normal Sinus Rhythm".to_string(), false)
        }
    }

    /// Estimate Cardiac Workload (Rate-Pressure Product RPP = HR * SBP / 100)
    pub fn calculate_cardiac_workload(hr: f32, sbp: f32) -> f32 {
        (hr * sbp) / 100.0
    }
}
