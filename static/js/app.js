// ASTRA Master Controller: 12 Survival Parameter Systems & Astronaut Space Suit Monitoring Station
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Specialized Visualizers & HUD Engines
  const humanBodyHud = document.getElementById("humanBodyCanvas") ? new HumanBodyHud("humanBodyCanvas") : null;
  const ecgChart = new EcgChart("ecgCanvas");
  const cardioEcgChart = new EcgChart("cardioEcgCanvas");
  const lungsCanvas = typeof RespiratoryLungsCanvas !== "undefined" ? new RespiratoryLungsCanvas("lungsCanvas") : null;
  const pulmonarySim = typeof PulmonarySimulation !== "undefined" ? new PulmonarySimulation() : null;
  const neuroHud = typeof NeuroHud !== "undefined" ? new NeuroHud() : null;
  const endocrineHud = typeof EndocrineHud !== "undefined" ? new EndocrineHud() : null;
  const digestiveHud = typeof DigestiveHud !== "undefined" ? new DigestiveHud() : null;
  const cardioHud = typeof CardioHud !== "undefined" ? new CardioHud() : null;
  const immuneHud = typeof ImmuneHud !== "undefined" ? new ImmuneHud() : null;
  const spaceSuitHud = typeof SpaceSuitHud !== "undefined" ? new SpaceSuitHud() : null;
  const heartCanvas = typeof AnatomicalHeartCanvas !== "undefined" ? new AnatomicalHeartCanvas("heartFallbackCanvas") : null;

  // Expose on window for inter-component telemetry synchronization
  window.ecgChart = ecgChart;
  window.cardioEcgChart = cardioEcgChart;
  window.pulmonarySim = pulmonarySim;
  window.neuroHud = neuroHud;
  window.cardioHud = cardioHud;
  window.endocrineHud = endocrineHud;
  window.digestiveHud = digestiveHud;
  window.immuneHud = immuneHud;
  window.spaceSuitHud = spaceSuitHud;
  window.heartCanvas = heartCanvas;

  // State Management
  let activeViewId = "overview";
  let isConnectedToRustBackend = false;

  // Real-Time Simulator Modifiers (Interactive Controls)
  const simState = {
    exertionLevel: 1.0, // 1.0 nominal, 1.85 exercise
    hypoxiaActive: false,
    stressLevel: 24.5,
    radiationFlare: false,
    suitLeak: false,
    suitPsi: 4.30,
    tick: 0
  };

  // Tab & View Switching Logic for All Systems
  const navButtons = document.querySelectorAll(".nav-widget-btn");
  const widgetViews = document.querySelectorAll(".widget-view");

  function switchView(targetView) {
    if (targetView === "view-physical") targetView = "overview";
    navButtons.forEach(b => {
      if (b.getAttribute("data-view") === targetView) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });

    widgetViews.forEach(v => {
      if (v.id === targetView) {
        v.classList.add("active-view");
      } else {
        v.classList.remove("active-view");
      }
    });

    activeViewId = targetView;

    // Trigger canvas resize on view toggle
    if (humanBodyHud) humanBodyHud.resize();
    if (ecgChart) ecgChart.resize();
    if (cardioEcgChart) cardioEcgChart.resize();
    if (pulmonarySim) pulmonarySim.resize();
    if (neuroHud) neuroHud.resize();
    if (endocrineHud) endocrineHud.resize();
    if (digestiveHud) digestiveHud.resize();
    if (immuneHud) immuneHud.resize();
    if (spaceSuitHud) spaceSuitHud.resize();
    if (heartCanvas) heartCanvas.resize();

    if (targetView === "view-immune" && immuneHud) {
      immuneHud.playVideo();
    }
  }

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetView = btn.getAttribute("data-view");
      switchView(targetView);
    });
  });

  // Interactive Organ Pins on Holographic Body Scan
  document.querySelectorAll(".organ-pin").forEach(pin => {
    pin.addEventListener("click", () => {
      const organ = pin.getAttribute("data-organ");
      if (organ === "Cardiovascular") switchView("view-cardio");
      else if (organ === "Respiratory") switchView("view-respiratory");
      else if (organ === "Neuro & mental") switchView("view-neuro");
      else if (organ === "Digestive") switchView("view-digestive");
      else if (organ === "Endocrine") switchView("view-metabolic");
      else if (organ === "Suit" || organ === "Spacesuit") switchView("view-suit");
    });
  });

  // Interactive Simulation Controls
  window.triggerSimExercise = function() {
    simState.exertionLevel = simState.exertionLevel > 1.2 ? 1.0 : 1.85;
    toggleBtnState("btn-sim-exercise", simState.exertionLevel > 1.2);
  };

  window.triggerSimHypoxia = function() {
    simState.hypoxiaActive = !simState.hypoxiaActive;
    toggleBtnState("btn-sim-hypoxia", simState.hypoxiaActive);
  };

  window.triggerSimStress = function() {
    simState.stressLevel = simState.stressLevel > 40 ? 24.5 : 78.0;
    toggleBtnState("btn-sim-stress", simState.stressLevel > 40);
  };

  window.triggerSimRadiation = function() {
    simState.radiationFlare = !simState.radiationFlare;
    toggleBtnState("btn-sim-radiation", simState.radiationFlare);
  };

  window.triggerSimSuitLeak = function() {
    simState.suitLeak = !simState.suitLeak;
    if (simState.suitLeak) simState.suitPsi = 3.45;
    else simState.suitPsi = 4.30;
    toggleBtnState("btn-sim-leak", simState.suitLeak);
  };

  window.resetSimNominal = function() {
    simState.exertionLevel = 1.0;
    simState.hypoxiaActive = false;
    simState.stressLevel = 24.5;
    simState.radiationFlare = false;
    simState.suitLeak = false;
    simState.suitPsi = 4.30;

    ["btn-sim-exercise", "btn-sim-hypoxia", "btn-sim-stress", "btn-sim-radiation", "btn-sim-leak"]
      .forEach(id => toggleBtnState(id, false));
  };

  function toggleBtnState(btnId, isActive) {
    const el = document.getElementById(btnId);
    if (el) {
      if (isActive) el.classList.add("active-sim");
      else el.classList.remove("active-sim");
    }
  }

  // Connect to Rust Backend WebSocket
  function connectWebSocket() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host || "127.0.0.1:8080";
    const wsUrl = `${protocol}//${host}/ws/telemetry`;

    const statusEl = document.getElementById("connection-status");
    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        isConnectedToRustBackend = true;
        if (statusEl) {
          statusEl.textContent = "SYNCED TO RUST ENGINE";
          statusEl.style.color = "var(--neon-green)";
        }
      };

      ws.onmessage = (event) => {
        try {
          const packet = JSON.parse(event.data);
          if (simState.hypoxiaActive) packet.respiratory.spo2_pct = 88.2;
          if (simState.exertionLevel > 1.2) packet.cardiovascular.heart_rate_bpm = 138.0;
          if (simState.suitLeak) packet.survival.suit_internal_pressure_psi = simState.suitPsi;
          updateUI(packet);
        } catch (e) {
          console.error("Packet parse error:", e);
        }
      };

      ws.onclose = () => {
        isConnectedToRustBackend = false;
        if (statusEl) {
          statusEl.textContent = "STANDALONE SIMULATOR";
          statusEl.style.color = "var(--neon-cyan)";
        }
        setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = () => ws.close();
    } catch (e) {
      // Standalone simulator handles updates
    }
  }

  // High-Fidelity Standalone Telemetry Simulator Loop (Updates at 10 Hz)
  setInterval(() => {
    simState.tick++;
    const phase = simState.tick * 0.05;

    // Physical calculations
    const coreTemp = 37.0 + Math.sin(phase * 0.1) * 0.15;
    const skinTemp = 34.8 + Math.cos(phase * 0.1) * 0.2;
    const muscleFatigue = 18.5 + (simState.exertionLevel - 1.0) * 35.0;

    // Cardio calculations
    const baseHr = (72 * simState.exertionLevel) + Math.sin(phase * 0.2) * 4;
    const hr = simState.hypoxiaActive ? baseHr + 32 : baseHr;
    const sys = 118 + (simState.exertionLevel - 1.0) * 25 + Math.sin(phase) * 2;
    const dia = 76 + (simState.exertionLevel - 1.0) * 10;
    const map = dia + (sys - dia) / 3;

    // Respiratory calculations
    const spo2 = simState.hypoxiaActive ? 87.5 + Math.sin(phase) : (98.2 + Math.cos(phase * 0.1) * 0.4);
    const respRate = (14.5 * (simState.exertionLevel > 1.2 ? 1.6 : 1.0)) + Math.sin(phase * 0.2) * 1.2;

    // Neuro calculations
    const gamma = (35.1 + (simState.stressLevel > 40 ? 10 : 0) + Math.sin(phase * 0.3) * 2);
    const beta = (26.1 + (simState.stressLevel > 40 ? 8 : 0) + Math.cos(phase * 0.25) * 1.5);

    // Environment calculations
    const radiation = simState.radiationFlare ? (120.0 + Math.random() * 45) : (22.4 + (Math.random() > 0.85 ? Math.random() * 6 : 0));
    const co2 = 540 + Math.sin(phase * 0.1) * 30;

    // Survival calculations
    if (simState.suitLeak) {
      simState.suitPsi = Math.max(2.8, simState.suitPsi - 0.005);
    }
    const distanceKm = 1634400 + simState.tick * 28.5 * 0.1;

    const simPkt = {
      packet_id: simState.tick,
      astronaut: {
        name: "Commander Christina Koch",
        destination: "Kepler-296f Trajectory",
        distance_from_home_km: distanceKm,
        distance_from_home_au: distanceKm / 149597870.7,
        light_delay_seconds: distanceKm / 299792.458,
      },
      physical: {
        overall_physical_condition: simState.exertionLevel > 1.2 ? "High Exertion Metabolic State" : "Optimal Spaceflight Readiness",
        functional_capacity_pct: 95.4,
        core_temperature_c: coreTemp,
        skin_temperature_c: skinTemp,
        total_body_water_l: 45.2,
        hydration_status: "Euhydrated",
        muscle_fatigue_pct: muscleFatigue,
        bone_mass_kg: 3.25,
        energy_expenditure_kcal: 1740 + (940 * simState.exertionLevel),
        daily_steps: 8420 + Math.floor(simState.tick * 0.5)
      },
      cardiovascular: {
        heart_rate_bpm: hr,
        resting_heart_rate_bpm: 62,
        maximum_heart_rate_bpm: 178,
        systolic_bp_mmhg: sys,
        diastolic_bp_mmhg: dia,
        mean_arterial_pressure_mmhg: map,
        sdnn_ms: 54.2,
        rmssd_ms: 42.1,
        stroke_volume_ml: 75.0,
        cardiac_output_l_min: (hr * 75) / 1000,
        ejection_fraction_pct: 62.5,
        ecg_rhythm: hr > 120 ? "Sinus Tachycardia" : "Normal Sinus Rhythm"
      },
      respiratory: {
        respiratory_rate_bpm: respRate,
        spo2_pct: spo2,
        et_co2_mmhg: 38.0 + Math.sin(phase * 0.2) * 1.2,
        tidal_volume_ml: 520.0,
        alveolar_ventilation_l_min: (respRate * 370) / 1000,
        gas_exchange_efficiency_pct: simState.hypoxiaActive ? 74.0 : 98.4
      },
      neurological: {
        eeg_gamma_hz: gamma,
        eeg_beta_hz: beta,
        eeg_alpha_hz: 9.1,
        eeg_theta_hz: 4.2,
        eeg_delta_hz: 2.2,
        alertness_score: simState.hypoxiaActive ? 72.0 : 91.5,
        reaction_time_ms: simState.hypoxiaActive ? 320 : 218,
        consciousness_level: simState.hypoxiaActive ? "Mild Hypoxic Lethargy" : "Fully Conscious & Alert"
      },
      mental: {
        perceived_stress_index: simState.stressLevel,
        loneliness_solitary_confinement_index: 22.4 + (simState.tick * 0.001),
        mood_score: 85.0 - (simState.stressLevel > 40 ? 25 : 0),
        emotional_stability_pct: 91.2
      },
      sleep: {
        sleep_quality_score: 82.0,
        total_sleep_time_hrs: 6.42,
        time_in_bed_hrs: 7.17,
        sleep_efficiency_pct: 90.0
      },
      metabolic: {
        fasting_glucose_mg_dl: 88.0 + Math.sin(phase * 0.1) * 4,
        tsh_miu_l: 1.85,
        cortisol_ug_dl: 12.4 * (simState.stressLevel / 24.5),
        blood_ph: 7.41,
        serum_calcium_mg_dl: 9.4
      },
      digestive: {
        daily_calories_consumed_kcal: 2850,
        gastric_activity_score: 88.0,
        nutrient_absorption_efficiency_pct: 94.5,
        water_intake_ml: 2600,
        sodium_meq_l: 140.0
      },
      immune: {
        rbc_count_million_ul: 5.1,
        wbc_count_thousand_ul: 6.8,
        cd4_t_cell_count_ul: 920,
        dna_damage_gamma_h2ax_markers: simState.radiationFlare ? 6.8 : 1.4,
        dna_repair_rate_index: 94.8
      },
      sensory: {
        visual_acuity_snellen: "20/20",
        intraocular_pressure_mmhg: 14.5 + Math.sin(phase * 0.1) * 0.6,
        vestibular_function_score: 93.0
      },
      environment: {
        atmospheric_pressure_kpa: 101.32,
        oxygen_concentration_pct: 20.9,
        carbon_dioxide_ppm: co2,
        background_radiation_usv_h: radiation,
        air_temperature_c: 22.5,
        relative_humidity_pct: 48.0
      },
      survival: {
        suit_internal_pressure_psi: simState.suitPsi,
        primary_o2_reserve_kg: 5.9 - (simState.tick * 0.0001),
        power_battery_pct: 89.0,
        exterior_ambient_temp_c: 121.0,
        mission_safety_status: simState.suitLeak ? "EMERGENCY - SUIT LEAK" : (simState.hypoxiaActive ? "CRITICAL - HYPOXIA" : "NOMINAL"),
        highest_alarm_severity: simState.suitLeak ? "EMERGENCY" : (simState.hypoxiaActive ? "CRITICAL" : "NOMINAL")
      },
      connected_devices_count: 2
    };

    updateUI(simPkt);

    // Responsive fluctuations for Space Suit HUD
    if (spaceSuitHud) {
      spaceSuitHud.tickResponsiveData(simState.tick);
    }
  }, 100);

  // Update DOM Telemetry Across All Subsystems
  function updateUI(pkt) {
    // Header & Anchor
    setText("dist-km", `${Math.round(pkt.astronaut.distance_from_home_km).toLocaleString()} km`);
    setText("dist-au", `(${pkt.astronaut.distance_from_home_au.toFixed(4)} AU)`);
    setText("light-delay", `${pkt.astronaut.light_delay_seconds.toFixed(2)}s`);
    setText("device-count", pkt.connected_devices_count || 2);

    // Top EVA Quick Strip
    setText("eva-hr", Math.round(pkt.cardiovascular.heart_rate_bpm));
    setText("eva-spo2", pkt.respiratory.spo2_pct.toFixed(1));
    setText("eva-temp", pkt.physical.core_temperature_c.toFixed(1));
    setText("eva-bone", "4.2");
    setText("eva-psi", pkt.survival.suit_internal_pressure_psi.toFixed(2));
    setText("eva-o2", pkt.survival.primary_o2_reserve_kg.toFixed(1));
    setText("eva-battery", Math.round(pkt.survival.power_battery_pct));
    setText("eva-ext-temp", Math.round(pkt.survival.exterior_ambient_temp_c));

    // Synchronize ECG Oscilloscopes with current Heart Rate
    if (ecgChart) ecgChart.setHeartRate(pkt.cardiovascular.heart_rate_bpm);
    if (cardioEcgChart) cardioEcgChart.setHeartRate(pkt.cardiovascular.heart_rate_bpm);
    if (pulmonarySim) pulmonarySim.setBpm(pkt.respiratory.respiratory_rate_bpm);
    if (heartCanvas) heartCanvas.setBpm(pkt.cardiovascular.heart_rate_bpm);

    // 1. Physical body and body composition
    setText("phys-cond", pkt.physical.overall_physical_condition);
    setText("phys-wellness", `${pkt.physical.functional_capacity_pct.toFixed(1)}%`);
    setText("phys-core-temp", `${pkt.physical.core_temperature_c.toFixed(1)} °C`);
    setText("phys-skin-temp", `${pkt.physical.skin_temperature_c.toFixed(1)} °C`);
    setText("phys-tbw", `${pkt.physical.total_body_water_l.toFixed(1)} L`);
    setText("phys-fatigue", `${pkt.physical.muscle_fatigue_pct.toFixed(1)}%`);
    setText("phys-energy", `${Math.round(pkt.physical.energy_expenditure_kcal)} kcal`);
    setText("phys-steps", pkt.physical.daily_steps.toLocaleString());

    // 2. Cardiovascular system
    setText("cardio-hr", Math.round(pkt.cardiovascular.heart_rate_bpm));
    setText("cardio-rhythm", pkt.cardiovascular.ecg_rhythm);
    setText("cardio-bp", `${Math.round(pkt.cardiovascular.systolic_bp_mmhg)}/${Math.round(pkt.cardiovascular.diastolic_bp_mmhg)}`);
    setText("cardio-map", pkt.cardiovascular.mean_arterial_pressure_mmhg.toFixed(1));
    setText("cardio-co", `${pkt.cardiovascular.cardiac_output_l_min.toFixed(2)} L/min`);
    setText("cardio-ef", `${pkt.cardiovascular.ejection_fraction_pct.toFixed(1)}%`);
    setText("cardio-sdnn", pkt.cardiovascular.sdnn_ms.toFixed(1));
    setText("cardio-rmssd", pkt.cardiovascular.rmssd_ms.toFixed(1));

    // 3. Respiratory system
    setText("resp-rate", `${pkt.respiratory.respiratory_rate_bpm.toFixed(1)} BPM`);
    setText("resp-spo2", `${pkt.respiratory.spo2_pct.toFixed(1)}%`);
    setText("resp-co2", `${pkt.respiratory.et_co2_mmhg.toFixed(1)} mmHg`);
    setText("resp-vent", `${pkt.respiratory.alveolar_ventilation_l_min.toFixed(2)} L/min`);
    setText("resp-eff", `${pkt.respiratory.gas_exchange_efficiency_pct.toFixed(1)}%`);

    // 4. Neurological and brain function
    setText("eeg-gamma", `${pkt.neurological.eeg_gamma_hz.toFixed(1)} Hz`);
    setText("eeg-beta", `${pkt.neurological.eeg_beta_hz.toFixed(1)} Hz`);
    setText("eeg-alpha", `${pkt.neurological.eeg_alpha_hz.toFixed(1)} Hz`);
    setText("eeg-theta", `${pkt.neurological.eeg_theta_hz.toFixed(1)} Hz`);
    setText("eeg-delta", `${pkt.neurological.eeg_delta_hz.toFixed(1)} Hz`);
    setText("neuro-react", `${Math.round(pkt.neurological.reaction_time_ms)} ms`);
    setText("neuro-alert", `${pkt.neurological.alertness_score.toFixed(1)}%`);
    setText("neuro-state", pkt.neurological.consciousness_level);

    // 5. Mental and psychological health
    setText("mental-stress", `${pkt.mental.perceived_stress_index.toFixed(1)}%`);
    setText("mental-isolation", `${pkt.mental.loneliness_solitary_confinement_index.toFixed(1)}%`);
    setText("mental-mood", `${pkt.mental.mood_score.toFixed(0)}%`);

    // 6. Sleep & biological rhythms
    setText("sleep-index-score", Math.round(pkt.sleep.sleep_quality_score));
    setText("sleep-time-bed", "7h 10m");
    setText("sleep-total", "6h 25m");
    setText("sleep-eff", `${Math.round(pkt.sleep.sleep_efficiency_pct)}%`);

    // 7. Metabolic & endocrine
    setText("meta-glucose", `${Math.round(pkt.metabolic.fasting_glucose_mg_dl)} mg/dL`);
    setText("meta-cortisol", `${pkt.metabolic.cortisol_ug_dl.toFixed(1)} µg/dL`);
    setText("meta-ph", pkt.metabolic.blood_ph.toFixed(2));

    // 8. Digestive & hydration
    setText("dig-acid", "pH 1.8 (Optimal)");
    setText("dig-absorb", `${pkt.digestive.nutrient_absorption_efficiency_pct.toFixed(1)}%`);
    setText("dig-water", `${pkt.digestive.water_intake_ml} mL`);

    // 9. Immune & genetics
    setText("imm-tcells", `${pkt.immune.cd4_t_cell_count_ul} /µL`);
    setText("imm-dna-dmg", `${pkt.immune.dna_damage_gamma_h2ax_markers.toFixed(1)}`);
    setText("imm-repair", `${pkt.immune.dna_repair_rate_index.toFixed(1)}%`);

    // 10. Sensory & musculoskeletal
    setText("sens-iop", `${pkt.sensory.intraocular_pressure_mmhg.toFixed(1)} mmHg`);

    // 11. Environment
    setText("env-temp", `${pkt.environment.air_temperature_c.toFixed(1)}°C`);
    setText("env-humidity", `${Math.round(pkt.environment.relative_humidity_pct)}%`);
    setText("env-co2", `${Math.round(pkt.environment.carbon_dioxide_ppm)} PPM`);
    setText("env-radiation", `${pkt.environment.background_radiation_usv_h.toFixed(1)} µSv/h`);

    // 12. External survival resources & safety
    setText("surv-psi", `${pkt.survival.suit_internal_pressure_psi.toFixed(2)} psi`);
    setText("surv-o2", `${pkt.survival.primary_o2_reserve_kg.toFixed(1)} kg`);

    // Safety Alert Banner
    const banner = document.getElementById("mission-status-banner");
    const statusText = document.getElementById("mission-status-text");
    if (banner && statusText) {
      statusText.textContent = `STATUS: ${pkt.survival.mission_safety_status} // SEVERITY: ${pkt.survival.highest_alarm_severity}`;
      if (pkt.survival.highest_alarm_severity === "EMERGENCY" || pkt.survival.highest_alarm_severity === "CRITICAL") {
        banner.className = "alert-banner danger";
      } else {
        banner.className = "alert-banner";
      }
    }
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  connectWebSocket();

  // Animation Master Render Loop (60 FPS)
  function renderLoop(ts) {
    // 1. Lead-I ECG Oscilloscope always runs continuously
    if (ecgChart) ecgChart.draw();

    // 2. Active view visualizers
    if (activeViewId === "overview" || activeViewId === "view-physical") {
      if (humanBodyHud) humanBodyHud.draw("cardio");
    } else if (activeViewId === "view-cardio") {
      if (cardioEcgChart) cardioEcgChart.draw();
      if (heartCanvas) heartCanvas.draw();
    } else if (activeViewId === "view-respiratory") {
      if (pulmonarySim) pulmonarySim.animate(ts || performance.now());
    } else if (activeViewId === "view-neuro") {
      if (neuroHud) neuroHud.draw();
    } else if (activeViewId === "view-metabolic") {
      if (endocrineHud) endocrineHud.draw();
    } else if (activeViewId === "view-digestive") {
      if (digestiveHud) digestiveHud.draw();
    } else if (activeViewId === "view-immune") {
      if (immuneHud) immuneHud.draw();
    } else if (activeViewId === "view-suit") {
      if (spaceSuitHud) spaceSuitHud.draw();
    }

    requestAnimationFrame(renderLoop);
  }
  requestAnimationFrame(renderLoop);
});
