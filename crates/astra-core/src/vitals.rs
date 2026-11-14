use serde::{Deserialize, Serialize};

/// 1. Physical body and body composition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PhysicalBodyComposition {
    // General condition
    pub overall_physical_condition: String,
    pub functional_capacity_pct: f32,
    pub physical_wellness_score: f32,
    // Body measurements
    pub height_cm: f32,
    pub weight_kg: f32,
    pub bmi: f32,
    pub waist_circumference_cm: f32,
    pub body_fat_percentage: f32,
    // Body temperature
    pub core_temperature_c: f32,
    pub skin_temperature_c: f32,
    pub body_temperature_variation_c: f32,
    // Hydration
    pub total_body_water_l: f32,
    pub total_body_water_pct: f32,
    pub hydration_status: String,
    pub fluid_balance_ml: f32,
    // Muscle condition
    pub muscle_mass_kg: f32,
    pub muscle_strength_index: f32,
    pub muscle_endurance_pct: f32,
    pub muscle_fatigue_pct: f32,
    // Bone condition
    pub bone_mineral_density_t_score: f32,
    pub bone_mass_kg: f32,
    pub fracture_risk: String,
    // Skin
    pub skin_moisture_pct: f32,
    pub skin_integrity: String,
    pub wound_status: String,
    // Physical activity
    pub daily_steps: u32,
    pub movement_intensity_g: f32,
    pub exercise_duration_min: f32,
    pub activity_intensity_level: String,
    // Energy
    pub energy_expenditure_kcal: f32,
    pub resting_energy_expenditure_kcal: f32,
    pub physical_recovery_pct: f32,
    // Pain
    pub pain_location: String,
    pub pain_intensity_score: u8, // 0-10
    pub pain_duration_hrs: f32,
    pub discomfort_level: String,
}

impl Default for PhysicalBodyComposition {
    fn default() -> Self {
        Self {
            overall_physical_condition: "Optimal Spaceflight Readiness".to_string(),
            functional_capacity_pct: 95.4,
            physical_wellness_score: 93.8,
            height_cm: 182.0,
            weight_kg: 78.4,
            bmi: 23.67,
            waist_circumference_cm: 81.5,
            body_fat_percentage: 14.8,
            core_temperature_c: 37.0,
            skin_temperature_c: 34.8,
            body_temperature_variation_c: 0.18,
            total_body_water_l: 45.2,
            total_body_water_pct: 57.6,
            hydration_status: "Euhydrated (Balanced)".to_string(),
            fluid_balance_ml: 120.0,
            muscle_mass_kg: 38.6,
            muscle_strength_index: 92.4,
            muscle_endurance_pct: 88.0,
            muscle_fatigue_pct: 18.5,
            bone_mineral_density_t_score: -0.4,
            bone_mass_kg: 3.25,
            fracture_risk: "Low (Active Resistive Exercise Protocol)".to_string(),
            skin_moisture_pct: 62.0,
            skin_integrity: "Intact - No Dermatitis".to_string(),
            wound_status: "No active abrasions or lesions".to_string(),
            daily_steps: 8420,
            movement_intensity_g: 0.32,
            exercise_duration_min: 45.0,
            activity_intensity_level: "Moderate EVA Load".to_string(),
            energy_expenditure_kcal: 2680.0,
            resting_energy_expenditure_kcal: 1740.0,
            physical_recovery_pct: 91.2,
            pain_location: "None reported".to_string(),
            pain_intensity_score: 0,
            pain_duration_hrs: 0.0,
            discomfort_level: "Zero Discomfort".to_string(),
        }
    }
}

/// 2. Cardiovascular system
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CardiovascularSystem {
    // Heart activity
    pub heart_rate_bpm: f32,
    pub resting_heart_rate_bpm: f32,
    pub maximum_heart_rate_bpm: f32,
    // Electrical activity
    pub ecg_waveform: Vec<f32>,
    pub pr_interval_ms: f32,
    pub qrs_duration_ms: f32,
    pub qt_interval_ms: f32,
    pub heart_rhythm: String,
    // Heart-rate variability
    pub hrv_score: f32,
    pub sdnn_ms: f32,
    pub rmssd_ms: f32,
    pub rr_intervals_ms: f32,
    // Blood pressure
    pub systolic_bp_mmhg: f32,
    pub diastolic_bp_mmhg: f32,
    pub mean_arterial_pressure_mmhg: f32,
    // Blood circulation
    pub blood_flow_l_min: f32,
    pub pulse_strength_score: f32,
    pub peripheral_perfusion_index: f32,
    // Cardiac function
    pub cardiac_output_l_min: f32,
    pub stroke_volume_ml: f32,
    pub ejection_fraction_pct: f32,
    // Blood vessels
    pub vascular_resistance_dynes: f32,
    pub arterial_stiffness_index: f32,
    pub vascular_health_score: f32,
    // Circulation
    pub blood_volume_l: f32,
    pub circulation_time_sec: f32,
    pub capillary_refill_sec: f32,
    // Recovery
    pub heart_rate_recovery_bpm_min: f32,
    pub cardiovascular_response_to_exercise: String,
}

impl Default for CardiovascularSystem {
    fn default() -> Self {
        Self {
            heart_rate_bpm: 72.0,
            resting_heart_rate_bpm: 62.0,
            maximum_heart_rate_bpm: 178.0,
            ecg_waveform: vec![0.0; 64],
            pr_interval_ms: 148.0,
            qrs_duration_ms: 88.0,
            qt_interval_ms: 395.0,
            heart_rhythm: "Normal Sinus Rhythm".to_string(),
            hrv_score: 78.5,
            sdnn_ms: 54.2,
            rmssd_ms: 42.1,
            rr_intervals_ms: 833.3,
            systolic_bp_mmhg: 118.0,
            diastolic_bp_mmhg: 76.0,
            mean_arterial_pressure_mmhg: 90.0,
            blood_flow_l_min: 5.2,
            pulse_strength_score: 8.5,
            peripheral_perfusion_index: 4.8,
            cardiac_output_l_min: 5.4,
            stroke_volume_ml: 75.0,
            ejection_fraction_pct: 62.5,
            vascular_resistance_dynes: 1120.0,
            arterial_stiffness_index: 6.8,
            vascular_health_score: 94.0,
            blood_volume_l: 5.0,
            circulation_time_sec: 21.0,
            capillary_refill_sec: 1.4,
            heart_rate_recovery_bpm_min: 28.0,
            cardiovascular_response_to_exercise: "Normal Athletic Adaptability".to_string(),
        }
    }
}

/// 3. Respiratory system
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RespiratorySystem {
    // Breathing
    pub respiratory_rate_bpm: f32,
    pub breathing_depth_ml: f32,
    pub breathing_pattern: String,
    // Oxygenation
    pub spo2_pct: f32,
    pub pao2_arterial_o2_mmhg: f32,
    // Carbon dioxide
    pub et_co2_mmhg: f32,
    pub paco2_arterial_co2_mmhg: f32,
    // Lung function
    pub tidal_volume_ml: f32,
    pub vital_capacity_l: f32,
    pub forced_vital_capacity_fvc_l: f32,
    // Airflow
    pub peak_expiratory_flow_pef_l_min: f32,
    pub forced_expiratory_volume_fev1_l: f32,
    // Gas exchange
    pub alveolar_ventilation_l_min: f32,
    pub gas_exchange_efficiency_pct: f32,
    // Breathing muscles
    pub respiratory_muscle_strength_cmh2o: f32,
    pub breathing_effort_score: f32,
    // Respiratory condition
    pub cough_detected: bool,
    pub wheezing_detected: bool,
    pub breathlessness_score: f32,
    pub respiratory_distress_index: f32,
}

impl Default for RespiratorySystem {
    fn default() -> Self {
        Self {
            respiratory_rate_bpm: 14.5,
            breathing_depth_ml: 520.0,
            breathing_pattern: "Eupneic Rhythmic".to_string(),
            spo2_pct: 98.2,
            pao2_arterial_o2_mmhg: 94.0,
            et_co2_mmhg: 38.0,
            paco2_arterial_co2_mmhg: 39.5,
            tidal_volume_ml: 520.0,
            vital_capacity_l: 4.85,
            forced_vital_capacity_fvc_l: 4.65,
            peak_expiratory_flow_pef_l_min: 580.0,
            forced_expiratory_volume_fev1_l: 3.95,
            alveolar_ventilation_l_min: 5.1,
            gas_exchange_efficiency_pct: 98.4,
            respiratory_muscle_strength_cmh2o: 105.0,
            breathing_effort_score: 12.0,
            cough_detected: false,
            wheezing_detected: false,
            breathlessness_score: 0.5,
            respiratory_distress_index: 2.1,
        }
    }
}

/// 4. Neurological and brain function
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NeurologicalBrainFunction {
    // Brain activity
    pub eeg_waveform: Vec<f32>,
    pub eeg_gamma_hz: f32, // 30-45 Hz Concentration
    pub eeg_beta_hz: f32,  // 13-35 Hz Active Mind
    pub eeg_alpha_hz: f32, // 8-13 Hz Reflective
    pub eeg_theta_hz: f32, // 4-8 Hz Drowsiness
    pub eeg_delta_hz: f32, // 0.5-4 Hz Deep Sleep
    // Consciousness
    pub consciousness_level: String,
    pub responsiveness_score: f32,
    pub alertness_score: f32,
    // Cognition
    pub memory_retention_score: f32,
    pub learning_rate_index: f32,
    pub reasoning_performance: f32,
    pub problem_solving_speed_ms: f32,
    // Attention
    pub concentration_score: f32,
    pub attention_span_min: f32,
    pub reaction_time_ms: f32,
    // Motor control
    pub movement_coordination_pct: f32,
    pub postural_balance_score: f32,
    pub reflexes_rating: String,
    // Nervous system
    pub autonomic_nervous_system_tone: String,
    pub sympathetic_activity_index: f32,
    pub parasympathetic_activity_index: f32,
    // Sensory processing
    pub visual_response_ms: f32,
    pub auditory_response_ms: f32,
    pub touch_perception_threshold: f32,
    // Brain function
    pub cognitive_performance_index: f32,
    pub neurological_examination_indicator: String,
    // Neurological symptoms
    pub dizziness_level: u8,
    pub headache_intensity: u8,
    pub tremor_detected: bool,
    pub numbness_detected: bool,
    pub disorientation_flag: bool,
}

impl Default for NeurologicalBrainFunction {
    fn default() -> Self {
        Self {
            eeg_waveform: vec![0.0; 64],
            eeg_gamma_hz: 35.1,
            eeg_beta_hz: 26.1,
            eeg_alpha_hz: 9.1,
            eeg_theta_hz: 4.2,
            eeg_delta_hz: 2.2,
            consciousness_level: "Fully Conscious & Alert".to_string(),
            responsiveness_score: 98.5,
            alertness_score: 91.5,
            memory_retention_score: 94.0,
            learning_rate_index: 92.5,
            reasoning_performance: 96.0,
            problem_solving_speed_ms: 420.0,
            concentration_score: 86.5,
            attention_span_min: 45.0,
            reaction_time_ms: 218.0,
            movement_coordination_pct: 94.2,
            postural_balance_score: 91.0,
            reflexes_rating: "2+ Normal Bilateral".to_string(),
            autonomic_nervous_system_tone: "Balanced Autonomic State".to_string(),
            sympathetic_activity_index: 44.0,
            parasympathetic_activity_index: 56.0,
            visual_response_ms: 185.0,
            auditory_response_ms: 160.0,
            touch_perception_threshold: 1.2,
            cognitive_performance_index: 95.0,
            neurological_examination_indicator: "Cranial Nerves & Neuro Intact".to_string(),
            dizziness_level: 0,
            headache_intensity: 0,
            tremor_detected: false,
            numbness_detected: false,
            disorientation_flag: false,
        }
    }
}

/// 5. Mental and psychological health
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MentalPsychologicalHealth {
    // Emotional state
    pub mood_score: f32,
    pub emotional_stability_pct: f32,
    pub irritability_score: f32,
    // Stress
    pub perceived_stress_index: f32,
    pub stress_self_assessment: String,
    // Anxiety
    pub anxiety_symptoms_score: f32,
    pub anxiety_self_assessment: String,
    // Motivation
    pub motivation_score: f32,
    pub interest_level: f32,
    pub engagement_pct: f32,
    // Cognitive workload
    pub mental_workload_index: f32,
    pub mental_exhaustion_score: f32,
    // Psychological well-being
    pub life_satisfaction_score: f32,
    pub emotional_wellbeing_pct: f32,
    // Social health
    pub social_interaction_score: f32,
    pub social_support_perception: f32,
    pub loneliness_solitary_confinement_index: f32,
    // Behaviour
    pub behavioural_changes_flag: bool,
    pub coping_strategies_effectiveness: f32,
    // Mental resilience
    pub resilience_score: f32,
    pub adaptability_index: f32,
    pub emotional_recovery_speed: f32,
    // Self-assessment
    pub psychological_questionnaire_score: f32,
    pub daily_mood_record: String,
}

impl Default for MentalPsychologicalHealth {
    fn default() -> Self {
        Self {
            mood_score: 85.0,
            emotional_stability_pct: 91.2,
            irritability_score: 8.5,
            perceived_stress_index: 24.5,
            stress_self_assessment: "Low (Mission Task Calibrated)".to_string(),
            anxiety_symptoms_score: 16.0,
            anxiety_self_assessment: "Minimal Anxiety".to_string(),
            motivation_score: 92.0,
            interest_level: 94.0,
            engagement_pct: 94.5,
            mental_workload_index: 31.0,
            mental_exhaustion_score: 14.5,
            life_satisfaction_score: 88.0,
            emotional_wellbeing_pct: 89.5,
            social_interaction_score: 76.0,
            social_support_perception: 84.0,
            loneliness_solitary_confinement_index: 22.4, // Light delay impact
            behavioural_changes_flag: false,
            coping_strategies_effectiveness: 91.0,
            resilience_score: 93.5,
            adaptability_index: 92.0,
            emotional_recovery_speed: 89.0,
            psychological_questionnaire_score: 92.0,
            daily_mood_record: "High enthusiasm, prepared for EVA checklist".to_string(),
        }
    }
}

/// 6. Sleep and biological rhythms
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SleepBiologicalRhythms {
    // Sleep duration
    pub total_sleep_time_hrs: f32,
    pub time_in_bed_hrs: f32,
    // Sleep quality
    pub sleep_efficiency_pct: f32,
    pub sleep_quality_score: f32, // Image 6 "82 Sleep Index"
    // Sleep stages
    pub rem_sleep_min: f32,
    pub light_sleep_min: f32,
    pub deep_sleep_min: f32,
    // Sleep interruptions
    pub awakenings_count: u32,
    pub sleep_latency_min: f32,
    pub wake_after_sleep_onset_waso_min: f32,
    // Sleep schedule
    pub bedtime_utc: String,
    pub wake_up_time_utc: String,
    pub sleep_regularity_score: f32,
    // Circadian rhythm
    pub circadian_phase_alignment: f32,
    pub day_night_rhythm_sync: String,
    pub light_exposure_lux_hrs: f32,
    // Fatigue
    pub physical_fatigue_score: f32,
    pub mental_fatigue_score: f32,
    pub drowsiness_score: f32,
    // Recovery
    pub sleep_recovery_score: f32,
    pub post_sleep_alertness_pct: f32,
    // Daily rhythms
    pub body_temp_circadian_amplitude_c: f32,
    pub estimated_cortisol_ug_dl: f32,
    pub estimated_melatonin_pg_ml: f32,
    // Contributors (Image 6 style)
    pub sleep_efficiency_rating: String,
    pub temperature_rating: String,
    pub restfulness_rating: String,
    pub consistency_rating: String,
    pub total_sleep_rating: String,
    pub hr_drop_rating: String,
    pub timing_rating: String,
    pub restoration_time_rating: String,
}

impl Default for SleepBiologicalRhythms {
    fn default() -> Self {
        Self {
            total_sleep_time_hrs: 6.42, // 6h 25m in Image 6
            time_in_bed_hrs: 7.17,      // 7h 10m in Image 6
            sleep_efficiency_pct: 90.0,
            sleep_quality_score: 82.0,  // "82 Sleep Index"
            rem_sleep_min: 82.0,
            light_sleep_min: 215.0,
            deep_sleep_min: 88.0,
            awakenings_count: 2,
            sleep_latency_min: 14.0,
            wake_after_sleep_onset_waso_min: 18.0,
            bedtime_utc: "22:45 UTC".to_string(),
            wake_up_time_utc: "06:02 UTC".to_string(),
            sleep_regularity_score: 88.5,
            circadian_phase_alignment: 93.0,
            day_night_rhythm_sync: "Aligned with ISS/Crew Cycle".to_string(),
            light_exposure_lux_hrs: 420.0,
            physical_fatigue_score: 22.0,
            mental_fatigue_score: 18.0,
            drowsiness_score: 12.0,
            sleep_recovery_score: 89.0,
            post_sleep_alertness_pct: 92.5,
            body_temp_circadian_amplitude_c: 0.65,
            estimated_cortisol_ug_dl: 14.2,
            estimated_melatonin_pg_ml: 6.8,
            sleep_efficiency_rating: "Good".to_string(),
            temperature_rating: "Optimal".to_string(),
            restfulness_rating: "Optimal".to_string(),
            consistency_rating: "Optimal".to_string(),
            total_sleep_rating: "Good".to_string(),
            hr_drop_rating: "Optimal".to_string(),
            timing_rating: "Optimal".to_string(),
            restoration_time_rating: "Needs attention".to_string(),
        }
    }
}

/// 7. Metabolic and endocrine systems
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MetabolicEndocrineSystem {
    // Blood glucose
    pub fasting_glucose_mg_dl: f32,
    pub post_meal_glucose_mg_dl: f32,
    pub hba1c_pct: f32,
    // Energy metabolism
    pub basal_metabolic_rate_kcal: f32,
    pub metabolic_rate_met: f32,
    pub total_energy_expenditure_kcal: f32,
    // Thyroid
    pub tsh_miu_l: f32,
    pub t3_ng_dl: f32,
    pub t4_ug_dl: f32,
    // Stress hormones
    pub cortisol_ug_dl: f32,
    pub adrenaline_noradrenaline_index: f32,
    // Reproductive hormones
    pub testosterone_ng_dl: f32,
    pub estrogen_pg_ml: f32,
    pub progesterone_ng_ml: f32,
    pub lh_iu_l: f32,
    pub fsh_iu_l: f32,
    // Growth regulation
    pub growth_hormone_ng_ml: f32,
    pub igf_1_ng_ml: f32,
    // Insulin regulation
    pub fasting_insulin_u_iu_ml: f32,
    pub insulin_sensitivity_homa_ir: f32,
    // Metabolic health
    pub triglycerides_mg_dl: f32,
    pub total_cholesterol_mg_dl: f32,
    pub hdl_cholesterol_mg_dl: f32,
    pub ldl_cholesterol_mg_dl: f32,
    // Body chemistry
    pub blood_ph: f32,
    pub blood_bicarbonate_meq_l: f32,
    // Calcium regulation
    pub serum_calcium_mg_dl: f32,
    pub parathyroid_hormone_pth_pg_ml: f32,
    pub vitamin_d_25_oh_ng_ml: f32,
}

impl Default for MetabolicEndocrineSystem {
    fn default() -> Self {
        Self {
            fasting_glucose_mg_dl: 88.0,
            post_meal_glucose_mg_dl: 114.0,
            hba1c_pct: 5.1,
            basal_metabolic_rate_kcal: 1740.0,
            metabolic_rate_met: 1.35,
            total_energy_expenditure_kcal: 2680.0,
            tsh_miu_l: 1.85,
            t3_ng_dl: 125.0,
            t4_ug_dl: 7.8,
            cortisol_ug_dl: 12.4,
            adrenaline_noradrenaline_index: 24.0,
            testosterone_ng_dl: 620.0,
            estrogen_pg_ml: 28.0,
            progesterone_ng_ml: 0.4,
            lh_iu_l: 4.8,
            fsh_iu_l: 5.2,
            growth_hormone_ng_ml: 1.8,
            igf_1_ng_ml: 195.0,
            fasting_insulin_u_iu_ml: 6.2,
            insulin_sensitivity_homa_ir: 1.35,
            triglycerides_mg_dl: 98.0,
            total_cholesterol_mg_dl: 172.0,
            hdl_cholesterol_mg_dl: 58.0,
            ldl_cholesterol_mg_dl: 94.0,
            blood_ph: 7.41,
            blood_bicarbonate_meq_l: 24.5,
            serum_calcium_mg_dl: 9.4,
            parathyroid_hormone_pth_pg_ml: 28.0,
            vitamin_d_25_oh_ng_ml: 42.0,
        }
    }
}

/// 8. Digestive, nutritional and hydration systems
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DigestiveNutritionHydration {
    // Food intake
    pub daily_calories_consumed_kcal: f32,
    pub meal_frequency_daily: u8,
    pub food_composition_status: String,
    // Macronutrients
    pub carbs_grams: f32,
    pub proteins_grams: f32,
    pub fats_grams: f32,
    // Micronutrients
    pub iron_mg: f32,
    pub zinc_mg: f32,
    pub magnesium_mg: f32,
    pub vitamins_balance_score: f32,
    // Digestion
    pub gastric_activity_score: f32,
    pub digestive_enzyme_pepsin_amylase_index: f32,
    // Absorption
    pub nutrient_absorption_efficiency_pct: f32,
    // Gastrointestinal health
    pub bowel_movement_frequency: String,
    pub stool_characteristics_bristol_type: u8, // 1-7 Bristol scale
    // Liver function
    pub alt_u_l: f32,
    pub ast_u_l: f32,
    pub total_bilirubin_mg_dl: f32,
    pub albumin_g_dl: f32,
    // Pancreatic function
    pub pancreatic_amylase_u_l: f32,
    pub pancreatic_lipase_u_l: f32,
    // Hydration
    pub water_intake_ml: f32,
    pub fluid_output_ml: f32,
    pub total_body_water_l: f32,
    // Electrolytes
    pub sodium_meq_l: f32,
    pub potassium_meq_l: f32,
    pub chloride_meq_l: f32,
    pub serum_calcium_meq_l: f32,
    pub serum_magnesium_meq_l: f32,
    // Kidney function
    pub serum_creatinine_mg_dl: f32,
    pub blood_urea_nitrogen_mg_dl: f32,
    pub egfr_ml_min_173m2: f32,
    // Urinary function
    pub urine_volume_24h_ml: f32,
    pub urine_specific_gravity: f32,
    pub urine_frequency: String,
}

impl Default for DigestiveNutritionHydration {
    fn default() -> Self {
        Self {
            daily_calories_consumed_kcal: 2850.0,
            meal_frequency_daily: 3,
            food_composition_status: "Complete Spaceflight Ration".to_string(),
            carbs_grams: 340.0,
            proteins_grams: 110.0,
            fats_grams: 78.0,
            iron_mg: 16.5,
            zinc_mg: 12.0,
            magnesium_mg: 410.0,
            vitamins_balance_score: 96.0,
            gastric_activity_score: 88.0,
            digestive_enzyme_pepsin_amylase_index: 92.0,
            nutrient_absorption_efficiency_pct: 94.5,
            bowel_movement_frequency: "1x Daily".to_string(),
            stool_characteristics_bristol_type: 4, // Ideal smooth snake
            alt_u_l: 22.0,
            ast_u_l: 20.0,
            total_bilirubin_mg_dl: 0.7,
            albumin_g_dl: 4.5,
            pancreatic_amylase_u_l: 55.0,
            pancreatic_lipase_u_l: 38.0,
            water_intake_ml: 2600.0,
            fluid_output_ml: 2480.0,
            total_body_water_l: 45.2,
            sodium_meq_l: 140.0,
            potassium_meq_l: 4.2,
            chloride_meq_l: 102.0,
            serum_calcium_meq_l: 4.7,
            serum_magnesium_meq_l: 2.1,
            serum_creatinine_mg_dl: 0.95,
            blood_urea_nitrogen_mg_dl: 14.0,
            egfr_ml_min_173m2: 108.0,
            urine_volume_24h_ml: 1650.0,
            urine_specific_gravity: 1.015,
            urine_frequency: "5-6 Times Daily".to_string(),
        }
    }
}

/// 9. Immune, blood, cellular and genetic health
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImmuneCellularGeneticHealth {
    // Blood composition
    pub rbc_count_million_ul: f32,
    pub wbc_count_thousand_ul: f32,
    pub platelet_count_thousand_ul: f32,
    // Haemoglobin
    pub haemoglobin_concentration_g_dl: f32,
    pub haematocrit_pct: f32,
    // Oxygen transport
    pub blood_oxygen_carrying_capacity_ml_dl: f32,
    // Immune system
    pub cd4_t_cell_count_ul: f32,
    pub cd8_t_cell_count_ul: f32,
    pub immune_response_activity_index: f32,
    // Inflammation
    pub crp_c_reactive_protein_mg_l: f32,
    pub esr_erythrocyte_sedimentation_mm_h: f32,
    pub il_6_interleukin_pg_ml: f32,
    // Infection
    pub temperature_response_c: f32,
    pub pathogen_test_result: String,
    // Antibodies
    pub igg_mg_dl: f32,
    pub igm_mg_dl: f32,
    pub iga_mg_dl: f32,
    // Cellular health
    pub cell_count_viability_pct: f32,
    pub cell_damage_index: f32,
    pub cellular_atp_energy_metabolism_pct: f32,
    // Genetic health
    pub genetic_stability_index: f32,
    pub inherited_risk_profile: String,
    // DNA integrity
    pub dna_damage_gamma_h2ax_markers: f32,
    pub dna_repair_rate_index: f32,
    // Oxidative stress
    pub ros_reactive_oxygen_species_index: f32,
    pub antioxidant_status_tac_mmol_l: f32,
    // Coagulation
    pub clotting_time_pt_seconds: f32,
    pub inr_international_normalized_ratio: f32,
    pub aptt_seconds: f32,
}

impl Default for ImmuneCellularGeneticHealth {
    fn default() -> Self {
        Self {
            rbc_count_million_ul: 5.1,
            wbc_count_thousand_ul: 6.8,
            platelet_count_thousand_ul: 245.0,
            haemoglobin_concentration_g_dl: 15.6,
            haematocrit_pct: 46.2,
            blood_oxygen_carrying_capacity_ml_dl: 20.8,
            cd4_t_cell_count_ul: 920.0,
            cd8_t_cell_count_ul: 540.0,
            immune_response_activity_index: 92.5,
            crp_c_reactive_protein_mg_l: 0.6,
            esr_erythrocyte_sedimentation_mm_h: 4.0,
            il_6_interleukin_pg_ml: 1.8,
            temperature_response_c: 37.0,
            pathogen_test_result: "Negative - All Microbial Assays Clean".to_string(),
            igg_mg_dl: 1120.0,
            igm_mg_dl: 135.0,
            iga_mg_dl: 210.0,
            cell_count_viability_pct: 98.6,
            cell_damage_index: 3.2,
            cellular_atp_energy_metabolism_pct: 96.0,
            genetic_stability_index: 97.4,
            inherited_risk_profile: "Low Risk Profile".to_string(),
            dna_damage_gamma_h2ax_markers: 1.4, // Cosmic background radiation trace
            dna_repair_rate_index: 94.8,
            ros_reactive_oxygen_species_index: 18.0,
            antioxidant_status_tac_mmol_l: 1.45,
            clotting_time_pt_seconds: 11.8,
            inr_international_normalized_ratio: 1.02,
            aptt_seconds: 29.5,
        }
    }
}

/// 10. Sensory and musculoskeletal systems
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SensoryMusculoskeletalSystem {
    // Vision
    pub visual_acuity_snellen: String,
    pub colour_vision_score_pct: f32,
    pub visual_field_degrees: f32,
    pub intraocular_pressure_mmhg: f32, // Spaceflight-associated neuro-ocular syndrome (SANS) check
    // Hearing
    pub hearing_threshold_db: f32,
    pub auditory_response_latency_ms: f32,
    // Smell & Taste
    pub olfactory_sensitivity_score: f32,
    pub taste_perception_score: f32,
    // Touch
    pub tactile_sensitivity_score: f32,
    pub pressure_perception_threshold_g: f32,
    // Balance
    pub vestibular_function_score: f32,
    pub postural_stability_index: f32,
    // Muscles
    pub muscle_strength_newtons: f32,
    pub muscle_tone_score: f32,
    pub muscle_endurance_hold_sec: f32,
    // Bones
    pub bone_density_dexa_z_score: f32,
    pub trabecular_bone_structure_index: f32,
    pub joint_integrity_score: f32,
    // Joints
    pub range_of_motion_degrees: f32,
    pub joint_flexibility_score: f32,
    pub joint_stiffness_rating: String,
    // Movement
    pub gait_velocity_m_s: f32,
    pub posture_alignment_score: f32,
    pub motor_coordination_index: f32,
    pub walking_speed_km_h: f32,
    // Reflexes
    pub deep_tendon_reflexes: String,
    pub protective_reflex_response_ms: f32,
}

impl Default for SensoryMusculoskeletalSystem {
    fn default() -> Self {
        Self {
            visual_acuity_snellen: "20/20 Left / 20/20 Right".to_string(),
            colour_vision_score_pct: 100.0,
            visual_field_degrees: 175.0,
            intraocular_pressure_mmhg: 14.5, // SANS monitor: normal range 10-21 mmHg
            hearing_threshold_db: 12.0,
            auditory_response_latency_ms: 155.0,
            olfactory_sensitivity_score: 92.0,
            taste_perception_score: 90.0,
            tactile_sensitivity_score: 94.0,
            pressure_perception_threshold_g: 0.8,
            vestibular_function_score: 93.0,
            postural_stability_index: 92.5,
            muscle_strength_newtons: 460.0,
            muscle_tone_score: 91.0,
            muscle_endurance_hold_sec: 145.0,
            bone_density_dexa_z_score: -0.3,
            trabecular_bone_structure_index: 1.38,
            joint_integrity_score: 95.0,
            range_of_motion_degrees: 135.0,
            joint_flexibility_score: 92.0,
            joint_stiffness_rating: "No Stiffness".to_string(),
            gait_velocity_m_s: 1.32,
            posture_alignment_score: 96.0,
            motor_coordination_index: 94.0,
            walking_speed_km_h: 4.8,
            deep_tendon_reflexes: "Patellar & Achilles 2+ Normal".to_string(),
            protective_reflex_response_ms: 180.0,
        }
    }
}

/// 11. Earth atmosphere and environmental conditions
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EnvironmentalConditions {
    // A. Atmospheric composition
    pub oxygen_concentration_pct: f32,      // 20.9%
    pub nitrogen_concentration_pct: f32,    // 78.1%
    pub carbon_dioxide_ppm: f32,            // 540 ppm (MH-Z19B)
    pub argon_concentration_pct: f32,       // 0.93%
    pub water_vapour_g_m3: f32,             // 9.5 g/m3
    pub ozone_concentration_ppb: f32,       // 18.0 ppb
    pub atmospheric_pressure_kpa: f32,      // 101.3 kPa (BMP280)
    pub oxygen_partial_pressure_kpa: f32,   // 21.2 kPa
    pub air_density_kg_m3: f32,             // 1.204 kg/m3

    // B. Air quality
    pub pm1_ug_m3: f32,
    pub pm2_5_ug_m3: f32,
    pub pm10_ug_m3: f32,
    pub carbon_monoxide_co_ppm: f32,
    pub nitrogen_dioxide_no2_ppb: f32,
    pub sulphur_dioxide_so2_ppb: f32,
    pub ground_level_ozone_ppb: f32,
    pub volatile_organic_compounds_voc_ppb: f32,
    pub indoor_radon_bq_m3: f32,
    pub airborne_biological_particles_count: f32,

    // C. Climate and thermal conditions
    pub air_temperature_c: f32,
    pub relative_humidity_pct: f32,
    pub wind_airflow_speed_m_s: f32,
    pub wind_direction_deg: f32,
    pub solar_radiation_w_m2: f32,
    pub uv_index: f32,
    pub heat_index_c: f32,
    pub wet_bulb_temperature_c: f32,
    pub atmospheric_pressure_variation_hpa: f32,
    pub rainfall_mm: f32,
    pub ambient_light_lux: f32,
    pub thermal_comfort_pmv_index: f32,

    // E. Physical environmental exposures
    pub background_radiation_usv_h: f32, // Geiger counter
    pub cumulative_radiation_msv: f32,
    pub uv_exposure_dose_j_m2: f32,
    pub noise_level_dba: f32,
    pub vibration_m_s2: f32,
    pub emf_exposure_ut: f32,
    pub light_exposure_lux: f32,
    pub indoor_ventilation_air_changes_per_hr: f32,
    pub dust_exposure_ug_m3: f32,
    pub chemical_exposure_status: String,

    // F. Biological environment
    pub bacteria_concentration_status: String,
    pub viruses_pathogen_presence: String,
    pub fungi_spores_status: String,
    pub pollen_concentration: String,
    pub food_contamination_status: String,
    pub soil_contamination_status: String,
}

impl Default for EnvironmentalConditions {
    fn default() -> Self {
        Self {
            oxygen_concentration_pct: 20.9,
            nitrogen_concentration_pct: 78.1,
            carbon_dioxide_ppm: 540.0,
            argon_concentration_pct: 0.93,
            water_vapour_g_m3: 9.5,
            ozone_concentration_ppb: 18.0,
            atmospheric_pressure_kpa: 101.32,
            oxygen_partial_pressure_kpa: 21.18,
            air_density_kg_m3: 1.204,
            pm1_ug_m3: 0.8,
            pm2_5_ug_m3: 1.2,
            pm10_ug_m3: 2.1,
            carbon_monoxide_co_ppm: 0.2,
            nitrogen_dioxide_no2_ppb: 4.5,
            sulphur_dioxide_so2_ppb: 1.1,
            ground_level_ozone_ppb: 14.0,
            volatile_organic_compounds_voc_ppb: 38.0,
            indoor_radon_bq_m3: 8.5,
            airborne_biological_particles_count: 0.04,
            air_temperature_c: 22.5,
            relative_humidity_pct: 48.0,
            wind_airflow_speed_m_s: 0.22,
            wind_direction_deg: 90.0,
            solar_radiation_w_m2: 1361.0, // Solar constant
            uv_index: 0.2,                // Inside Hab / EMU shield
            heat_index_c: 22.3,
            wet_bulb_temperature_c: 15.2,
            atmospheric_pressure_variation_hpa: 0.05,
            rainfall_mm: 0.0,
            ambient_light_lux: 480.0,
            thermal_comfort_pmv_index: 0.05, // Neutral comfortable
            background_radiation_usv_h: 22.4,
            cumulative_radiation_msv: 14.8,
            uv_exposure_dose_j_m2: 12.0,
            noise_level_dba: 58.2,
            vibration_m_s2: 0.02,
            emf_exposure_ut: 0.15,
            light_exposure_lux: 480.0,
            indoor_ventilation_air_changes_per_hr: 8.5,
            dust_exposure_ug_m3: 1.8,
            chemical_exposure_status: "No Toxic Off-Gassing Detected".to_string(),
            bacteria_concentration_status: "Nominal Sterile Filter (HEPA OK)".to_string(),
            viruses_pathogen_presence: "None Detected".to_string(),
            fungi_spores_status: "Undetectable (<1 CFU/m³)".to_string(),
            pollen_concentration: "Zero".to_string(),
            food_contamination_status: "100% Sterile Sealed Rations".to_string(),
            soil_contamination_status: "Lunar/Martian Simulant Scrubbed".to_string(),
        }
    }
}

/// 12. External survival resources and safety
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExternalSurvivalResourcesSafety {
    // Spacesuit integrity
    pub suit_internal_pressure_psi: f32, // 4.3 psi
    pub suit_pressure_leak_rate_psi_min: f32,
    pub helmet_seal_status: String,
    pub joint_pressure_integrity_pct: f32,
    pub thermal_micrometeoroid_garment_status: String,
    // Life support supplies
    pub primary_o2_reserve_kg: f32,
    pub secondary_backup_o2_kg: f32,
    pub o2_tank_pressure_bar: f32,
    pub o2_consumption_rate_l_min: f32,
    pub remaining_eva_oxygen_duration_min: f32,
    pub co2_scrubber_efficiency_pct: f32,
    pub water_reserve_l: f32,
    pub water_recycling_efficiency_pct: f32,
    pub power_battery_pct: f32,
    pub power_remaining_hrs: f32,
    // Hab airlock & safety barrier
    pub airlock_door_status: String,
    pub umbilical_tether_status: String,
    pub exterior_ambient_temp_c: f32,
    // Emergency response & AI safety
    pub mission_safety_status: String,
    pub highest_alarm_severity: String,
    pub active_emergency_checklist: Vec<String>,
    pub ai_clinical_recommendations: Vec<String>,
}

impl Default for ExternalSurvivalResourcesSafety {
    fn default() -> Self {
        Self {
            suit_internal_pressure_psi: 4.30,
            suit_pressure_leak_rate_psi_min: 0.00,
            helmet_seal_status: "LOCKED & HERMETICALLY SEALED".to_string(),
            joint_pressure_integrity_pct: 99.6,
            thermal_micrometeoroid_garment_status: "Intact - Multi-Layer Insulation OK".to_string(),
            primary_o2_reserve_kg: 5.9,
            secondary_backup_o2_kg: 2.4,
            o2_tank_pressure_bar: 198.5,
            o2_consumption_rate_l_min: 0.38,
            remaining_eva_oxygen_duration_min: 440.0,
            co2_scrubber_efficiency_pct: 98.4,
            water_reserve_l: 340.0,
            water_recycling_efficiency_pct: 94.8,
            power_battery_pct: 89.0,
            power_remaining_hrs: 18.5,
            airlock_door_status: "Airlock Outer Hatch Depressurized".to_string(),
            umbilical_tether_status: "High-Strength Braided Kevlar Tether Engaged".to_string(),
            exterior_ambient_temp_c: 121.0,
            mission_safety_status: "NOMINAL".to_string(),
            highest_alarm_severity: "INFO".to_string(),
            active_emergency_checklist: vec![
                "Check suit wrist & neck seal O-rings".to_string(),
                "Confirm secondary O2 purge valve in standby".to_string(),
                "Verify umbilical comms line impedance".to_string(),
            ],
            ai_clinical_recommendations: vec![
                "All 12 vital biological systems operating within NASA Class-I mission thresholds.".to_string(),
                "Maintain hydration electrolyte intake at 12:00 MET.".to_string(),
            ],
        }
    }
}
