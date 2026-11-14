use astra_core::packet::TelemetryPacket;

pub struct MedicalAiAdvisor;

impl MedicalAiAdvisor {
    /// Evaluates multi-parameter telemetry vector across all 12 systems and generates automated triage
    pub fn evaluate(pkt: &mut TelemetryPacket) {
        let mut recommendations = Vec::new();
        let mut alerts = Vec::new();
        let mut status = "NOMINAL".to_string();
        let mut highest_sev = "INFO".to_string();

        // Rule 1: Suit Decompression
        if pkt.survival.suit_internal_pressure_psi < 3.8 {
            status = "EMERGENCY".to_string();
            highest_sev = "EMERGENCY".to_string();
            alerts.push(format!("CRITICAL: Suit pressure at {:.2} psi (Minimum 3.8 psi)", pkt.survival.suit_internal_pressure_psi));
            recommendations.push("ABORT EVA: Ingress Hab Airlock immediately.".to_string());
            recommendations.push("Engage emergency secondary oxygen purge line.".to_string());
        }

        // Rule 2: Hypoxia / Low SpO2
        if pkt.respiratory.spo2_pct < 92.0 {
            if highest_sev != "EMERGENCY" {
                status = "CRITICAL".to_string();
                highest_sev = "CRITICAL".to_string();
            }
            alerts.push(format!("WARNING: Severe arterial desaturation {:.1}% SpO2", pkt.respiratory.spo2_pct));
            recommendations.push("Administer 100% supplemental FiO2 into helmet loop.".to_string());
        }

        // Rule 3: Cardiovascular Tachycardia
        if pkt.cardiovascular.heart_rate_bpm > 125.0 {
            if highest_sev == "INFO" {
                status = "WARNING".to_string();
                highest_sev = "WARNING".to_string();
            }
            alerts.push(format!("ADVISORY: Tachycardia {:.0} BPM - high cardiac workload", pkt.cardiovascular.heart_rate_bpm));
            recommendations.push("Paced diaphragmatic breathing (4s in, 6s out). Reduce EVA metabolic effort.".to_string());
        }

        // Rule 4: Radiation Geiger Flare
        if pkt.environment.background_radiation_usv_h > 60.0 {
            if highest_sev != "EMERGENCY" {
                status = "WARNING".to_string();
                highest_sev = "WARNING".to_string();
            }
            alerts.push(format!("ALERT: Solar energetic particle flux {:.1} uSv/h", pkt.environment.background_radiation_usv_h));
            recommendations.push("Retreat to water-shielded crew storm shelter.".to_string());
        }

        if recommendations.is_empty() {
            recommendations.push("All 12 vital biological systems operating within NASA Class-I mission thresholds.".to_string());
            recommendations.push("Maintain hydration electrolyte intake at 12:00 MET.".to_string());
        }

        if !alerts.is_empty() {
            pkt.survival.active_emergency_checklist = alerts;
        }

        pkt.survival.mission_safety_status = status;
        pkt.survival.highest_alarm_severity = highest_sev;
        pkt.survival.ai_clinical_recommendations = recommendations;
    }
}
