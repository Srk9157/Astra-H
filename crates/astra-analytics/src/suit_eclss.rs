pub struct SuitEclssAnalytics;

impl SuitEclssAnalytics {
    /// Calculate Suit Pressure Decay Rate (psi/min)
    pub fn calculate_pressure_leak_rate(p_prev: f32, p_curr: f32, dt_seconds: f32) -> f32 {
        if dt_seconds <= 0.0 {
            return 0.0;
        }
        let dp = p_prev - p_curr;
        (dp / dt_seconds) * 60.0 // psi per minute
    }

    /// Estimate Oxygen Consumption Rate (L/min) based on heart rate and metabolic exertion
    pub fn calculate_metabolic_o2_consumption(hr: f32, body_mass_kg: f32) -> f32 {
        let vo2_ml_kg_min = if hr < 80.0 {
            4.0 // resting
        } else if hr < 110.0 {
            12.0 // moderate EVA spacewalk work
        } else {
            24.0 // heavy resistive work
        };
        (vo2_ml_kg_min * body_mass_kg) / 1000.0 // L/min
    }

    /// Estimate remaining EVA oxygen duration in minutes
    pub fn calculate_remaining_duration_min(reserve_kg: f32, consumption_rate_l_min: f32) -> f32 {
        // Density of gaseous O2 at STP is ~1.429 g/L => 1 kg ~ 700 Liters
        let total_liters = reserve_kg * 700.0;
        let rate = consumption_rate_l_min.max(0.1);
        total_liters / rate
    }

    /// Estimate cumulative microgravity bone density loss (%) based on mission elapsed days
    /// and resistive countermeasure exercise hours
    pub fn calculate_bone_loss_pct(mission_days: f32, daily_exercise_min: f32) -> f32 {
        let months = mission_days / 30.4;
        let base_loss_rate = 1.1; // ~1.1% per month without exercise
        let exercise_protection = (daily_exercise_min / 60.0).clamp(0.0, 1.0) * 0.65; // Exercise preserves up to 65%
        let effective_rate = base_loss_rate * (1.0 - exercise_protection);
        (months * effective_rate).clamp(0.0, 25.0)
    }
}
