use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Ad8232Sample {
    pub raw_mv: f32,
    pub lead_off_positive: bool,
    pub lead_off_negative: bool,
    pub leads_attached: bool,
}

pub struct Ad8232Driver;

impl Ad8232Driver {
    /// Translates 10-bit or 12-bit ADC reading and LO+/LO- digital lines
    pub fn parse_sample(adc_raw: u16, lo_plus: bool, lo_minus: bool, vref: f32, max_adc: f32) -> Ad8232Sample {
        let attached = !lo_plus && !lo_minus;
        let mv = if attached {
            ((adc_raw as f32 / max_adc) * vref) * 1000.0
        } else {
            0.0
        };
        Ad8232Sample {
            raw_mv: mv,
            lead_off_positive: lo_plus,
            lead_off_negative: lo_minus,
            leads_attached: attached,
        }
    }
}
