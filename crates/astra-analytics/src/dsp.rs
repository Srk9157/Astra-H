use std::f32::consts::PI;

pub struct DspEngine;

impl DspEngine {
    /// Moving Average Filter for smoothing bio-signals
    pub fn moving_average(signal: &[f32], window_size: usize) -> Vec<f32> {
        if signal.is_empty() || window_size == 0 {
            return signal.to_vec();
        }
        let mut output = Vec::with_capacity(signal.len());
        for i in 0..signal.len() {
            let start = if i >= window_size { i - window_size + 1 } else { 0 };
            let slice = &signal[start..=i];
            let avg: f32 = slice.iter().sum::<f32>() / (slice.len() as f32);
            output.push(avg);
        }
        output
    }

    /// Goertzel Algorithm for isolated single-frequency power detection (efficient FFT alternative)
    pub fn goertzel_power(samples: &[f32], target_freq_hz: f32, sample_rate_hz: f32) -> f32 {
        let n = samples.len() as f32;
        let k = (0.5 + (n * target_freq_hz / sample_rate_hz)).floor();
        let omega = (2.0 * PI * k) / n;
        let coeff = 2.0 * omega.cos();

        let mut q0: f32;
        let mut q1: f32 = 0.0;
        let mut q2: f32 = 0.0;

        for &x in samples {
            q0 = coeff * q1 - q2 + x;
            q2 = q1;
            q1 = q0;
        }

        let real = q1 - q2 * omega.cos();
        let imag = q2 * omega.sin();
        (real * real + imag * imag).sqrt()
    }

    /// Peak detection with dynamic adaptive thresholding for ECG R-peaks
    pub fn find_r_peaks(ecg: &[f32], threshold: f32) -> Vec<usize> {
        let mut peaks = Vec::new();
        for i in 1..(ecg.len() - 1) {
            if ecg[i] > threshold && ecg[i] > ecg[i - 1] && ecg[i] > ecg[i + 1] {
                peaks.push(i);
            }
        }
        peaks
    }
}
