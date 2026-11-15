pub struct NeuroAnalytics;

impl NeuroAnalytics {
    /// Calculate Cognitive Stress Index from EEG Band Power
    /// Stress Index = ((Beta + Gamma) / (Alpha + Theta)) * 10.0
    pub fn calculate_stress_index(_delta: f32, theta: f32, alpha: f32, beta: f32, gamma: f32) -> f32 {
        let denominator = (alpha + theta).max(0.1);
        let numerator = beta + gamma;
        let raw_ratio = (numerator / denominator) * 10.0;
        // Normalize between 0 and 100
        raw_ratio.clamp(5.0, 95.0)
    }

    /// Calculate Alertness Score (0 - 100%)
    pub fn calculate_alertness(alpha: f32, theta: f32, reaction_time_ms: f32) -> f32 {
        let band_ratio = alpha / theta.max(0.1);
        let mut score = band_ratio * 35.0;
        if reaction_time_ms > 350.0 {
            score -= (reaction_time_ms - 350.0) * 0.1;
        } else if reaction_time_ms < 220.0 {
            score += 10.0;
        }
        score.clamp(10.0, 100.0)
    }

    /// Solitary Confinement Psychological Impact Model
    /// Evaluates cumulative confinement pressure based on mission elapsed days,
    /// communication light delay to Earth (Anchor), and sleep disruption.
    pub fn solitary_confinement_strain(
        mission_days: f32,
        light_delay_sec: f64,
        sleep_quality: f32,
    ) -> f32 {
        // Base isolation growth with duration
        let day_factor = (mission_days / 365.0).min(2.0) * 20.0;
        // Comms lag factor (at 20 minutes Mars delay, real-time voice chat is impossible)
        let lag_factor = (light_delay_sec as f32 / 60.0).min(30.0) * 1.2;
        // Sleep buffer
        let sleep_penalty = if sleep_quality < 70.0 { (70.0 - sleep_quality) * 0.5 } else { 0.0 };

        (day_factor + lag_factor + sleep_penalty).clamp(5.0, 95.0)
    }
}
