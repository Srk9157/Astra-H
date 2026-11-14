use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub enum Severity {
    Nominal,
    Advisory,
    Warning,
    Critical,
    Emergency,
}

impl Severity {
    pub fn as_str(&self) -> &'static str {
        match self {
            Severity::Nominal => "NOMINAL",
            Severity::Advisory => "ADVISORY",
            Severity::Warning => "WARNING",
            Severity::Critical => "CRITICAL",
            Severity::Emergency => "EMERGENCY",
        }
    }
}
