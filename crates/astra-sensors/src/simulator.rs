use std::f32::consts::PI;
use astra_core::packet::TelemetryPacket;
use rand::Rng;

pub struct TelemetrySimulator {
    pub tick: u64,
    pub phase: f32,
    pub ecg_phase: f32,
    pub eeg_phase: f32,
    // Interactive Simulation Modifiers
    pub stress_multiplier: f32,
    pub hypoxia_flag: bool,
    pub exertion_level: f32, // 1.0 = nominal, 2.0 = heavy exercise
    pub radiation_flare_flag: bool,
    pub suit_leak_rate: f32,
}

impl TelemetrySimulator {
    pub fn new() -> Self {
        Self {
            tick: 0,
            phase: 0.0,
            ecg_phase: 0.0,
            eeg_phase: 0.0,
            stress_multiplier: 1.0,
            hypoxia_flag: false,
            exertion_level: 1.0,
            radiation_flare_flag: false,
            suit_leak_rate: 0.0,
        }
    }

    /// Generates next real-time telemetry frame across all 12 survival parameter systems
    pub fn next_packet(&mut self, base: &TelemetryPacket) -> TelemetryPacket {
        let mut rng = rand::thread_rng();
        self.tick += 1;
        self.phase += 0.05;

        let mut pkt = base.clone();
        pkt.packet_id = self.tick;
        pkt.timestamp = chrono::Utc::now();

        // 1. PHYSICAL BODY & COMPOSITION
        let temp_jitter = rng.gen_range(-0.03..0.03);
        pkt.physical.core_temperature_c = (37.0 + (self.phase * 0.08).sin() * 0.15 + temp_jitter) as f32;
        pkt.physical.skin_temperature_c = (34.8 + (self.phase * 0.1).cos() * 0.25) as f32;
        pkt.physical.movement_intensity_g = 0.28 * self.exertion_level + (self.phase * 0.5).sin().abs() * 0.1;
        pkt.physical.muscle_fatigue_pct = (18.5 + (self.tick as f32 * 0.005) * self.exertion_level).min(75.0);
        pkt.physical.energy_expenditure_kcal = 1740.0 + (940.0 * self.exertion_level);

        // 2. CARDIOVASCULAR SYSTEM
        let base_hr = (72.0 * self.exertion_level) + (self.phase * 0.1).sin() * 4.0;
        let hr = if self.hypoxia_flag { base_hr + 28.0 } else { base_hr };
        pkt.cardiovascular.heart_rate_bpm = hr;
        pkt.cardiovascular.rr_intervals_ms = 60_000.0 / hr;
        pkt.cardiovascular.cardiac_output_l_min = (hr * pkt.cardiovascular.stroke_volume_ml) / 1000.0;
        pkt.cardiovascular.systolic_bp_mmhg = 118.0 + (self.exertion_level - 1.0) * 22.0 + rng.gen_range(-1.5..1.5);
        pkt.cardiovascular.diastolic_bp_mmhg = 76.0 + (self.exertion_level - 1.0) * 8.0;
        pkt.cardiovascular.mean_arterial_pressure_mmhg = pkt.cardiovascular.diastolic_bp_mmhg
            + (pkt.cardiovascular.systolic_bp_mmhg - pkt.cardiovascular.diastolic_bp_mmhg) / 3.0;

        // Generate ECG waveform buffer (P-Q-R-S-T)
        let mut ecg_points = Vec::with_capacity(64);
        let bps = hr / 60.0;
        let dt = 1.0 / (64.0 * bps);
        for i in 0..64 {
            let t = (self.ecg_phase + (i as f32) * dt * bps * 2.0 * PI) % (2.0 * PI);
            let p = 0.15 * (-((t - 0.7).powi(2) / 0.02)).exp();
            let q = -0.15 * (-((t - 1.15).powi(2) / 0.005)).exp();
            let r = 1.25 * (-((t - 1.25).powi(2) / 0.003)).exp();
            let s = -0.25 * (-((t - 1.35).powi(2) / 0.006)).exp();
            let t_w = 0.28 * (-((t - 1.9).powi(2) / 0.04)).exp();
            let noise = rng.gen_range(-0.015..0.015);
            ecg_points.push(p + q + r + s + t_w + noise);
        }
        self.ecg_phase = (self.ecg_phase + 0.35) % (2.0 * PI);
        pkt.cardiovascular.ecg_waveform = ecg_points;

        // 3. RESPIRATORY SYSTEM
        let resp_base = 14.2 * (0.8 + 0.2 * self.exertion_level);
        let resp_rate = if self.hypoxia_flag { resp_base + 8.5 } else { resp_base };
        pkt.respiratory.respiratory_rate_bpm = resp_rate + (self.phase * 0.2).sin() * 1.0;
        pkt.respiratory.spo2_pct = if self.hypoxia_flag {
            (88.5 + (self.phase * 0.1).sin() * 1.5).clamp(82.0, 91.0)
        } else {
            (98.2 + (self.phase * 0.08).cos() * 0.4).clamp(96.5, 99.8)
        };
        pkt.respiratory.et_co2_mmhg = (38.0 + (self.phase * 0.15).sin() * 1.2) as f32;
        pkt.respiratory.alveolar_ventilation_l_min = (pkt.respiratory.respiratory_rate_bpm * (pkt.respiratory.tidal_volume_ml - 150.0)) / 1000.0;

        // 4. NEUROLOGICAL & BRAIN FUNCTION (ADS1299)
        let stress_boost = (self.stress_multiplier - 1.0) * 12.0;
        pkt.neurological.eeg_gamma_hz = (35.1 + stress_boost + (self.phase * 0.3).sin() * 2.5).clamp(25.0, 48.0);
        pkt.neurological.eeg_beta_hz = (26.1 + stress_boost * 0.8 + (self.phase * 0.25).cos() * 2.0).clamp(18.0, 38.0);
        pkt.neurological.eeg_alpha_hz = (9.1 - stress_boost * 0.4 + (self.phase * 0.18).sin() * 1.0).clamp(4.0, 14.0);
        pkt.neurological.eeg_theta_hz = (4.2 + (self.phase * 0.1).cos() * 0.6).clamp(2.0, 8.0);
        pkt.neurological.eeg_delta_hz = (2.2 + (self.phase * 0.05).sin() * 0.4).clamp(1.0, 4.0);
        pkt.neurological.reaction_time_ms = 218.0 + (if self.hypoxia_flag { 95.0 } else { 0.0 }) + rng.gen_range(-5.0..5.0);

        // 5. MENTAL & PSYCHOLOGICAL HEALTH
        pkt.mental.perceived_stress_index = (24.5 * self.stress_multiplier + (self.phase * 0.05).sin() * 4.0).clamp(5.0, 95.0);
        pkt.mental.loneliness_solitary_confinement_index = (22.4 + (self.tick as f32 * 0.001)).clamp(0.0, 100.0);
        pkt.mental.mood_score = (85.0 - (self.stress_multiplier - 1.0) * 20.0).clamp(20.0, 98.0);

        // 6. SLEEP & BIOLOGICAL RHYTHMS
        pkt.sleep.sleep_quality_score = 82.0 + (self.phase * 0.02).sin() * 3.0;

        // 7. METABOLIC & ENDOCRINE SYSTEMS
        pkt.metabolic.fasting_glucose_mg_dl = 88.0 + (self.phase * 0.1).sin() * 4.0;
        pkt.metabolic.cortisol_ug_dl = 12.4 * self.stress_multiplier;
        pkt.metabolic.blood_ph = (7.41 + (self.phase * 0.05).sin() * 0.02).clamp(7.35, 7.45);

        // 8. DIGESTIVE, NUTRITIONAL & HYDRATION
        pkt.digestive.water_intake_ml = 2600.0;
        pkt.digestive.gastric_activity_score = 88.0 + (self.phase * 0.2).sin() * 5.0;

        // 9. IMMUNE, CELLULAR & GENETIC HEALTH
        pkt.immune.dna_damage_gamma_h2ax_markers = if self.radiation_flare_flag { 6.8 } else { 1.4 };
        pkt.immune.crp_c_reactive_protein_mg_l = 0.6 + (if self.radiation_flare_flag { 2.4 } else { 0.0 });

        // 10. SENSORY & MUSCULOSKELETAL
        pkt.sensory.intraocular_pressure_mmhg = 14.5 + (self.phase * 0.04).sin() * 0.5; // SANS check

        // 11. EARTH ATMOSPHERE & ENVIRONMENTAL CONDITIONS
        let rad_spike = if self.radiation_flare_flag { rng.gen_range(80.0..180.0) } else { 0.0 };
        pkt.environment.background_radiation_usv_h = 22.4 + rad_spike + (self.phase * 0.05).sin() * 2.0;
        pkt.environment.carbon_dioxide_ppm = 540.0 + (self.phase * 0.1).sin() * 25.0;
        pkt.environment.atmospheric_pressure_kpa = 101.32 + (self.phase * 0.02).cos() * 0.15;

        // 12. EXTERNAL SURVIVAL RESOURCES & SAFETY
        if self.suit_leak_rate > 0.0 {
            pkt.survival.suit_internal_pressure_psi = (pkt.survival.suit_internal_pressure_psi - self.suit_leak_rate * 0.01).max(2.8);
            pkt.survival.suit_pressure_leak_rate_psi_min = self.suit_leak_rate;
            pkt.survival.mission_safety_status = "CRITICAL SUIT DECOMPRESSION".to_string();
            pkt.survival.highest_alarm_severity = "EMERGENCY".to_string();
        } else {
            pkt.survival.suit_internal_pressure_psi = 4.30 + (self.phase * 0.04).sin() * 0.02;
            pkt.survival.suit_pressure_leak_rate_psi_min = 0.00;
        }
        pkt.survival.primary_o2_reserve_kg = (5.9 - (self.tick as f32 * 0.0001) * self.exertion_level).max(1.0);
        pkt.survival.power_battery_pct = (89.0 - (self.tick as f32 * 0.0004)).max(12.0);

        // Increment Distance to Earth (Anchor)
        pkt.astronaut.distance_from_home_km += 28.5 * 0.1;
        pkt.astronaut.distance_from_home_au = pkt.astronaut.distance_from_home_km / 149_597_870.7;
        pkt.astronaut.light_delay_seconds = pkt.astronaut.distance_from_home_km / 299_792.458;

        pkt
    }
}
