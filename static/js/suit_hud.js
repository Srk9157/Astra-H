// ASTRA Astronaut Complete Space Suit Monitoring System (EMU & ECLSS Architecture)
class SpaceSuitHud {
  constructor() {
    this.canvas = document.getElementById('emuCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.waveOffset = 0;
    this.selectedZone = 1;
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.logConsole = document.getElementById('suit-log-console');
    window.spaceSuitHud = this;
    window.suitHud = this;

    // 12 Anatomical Architecture Zones (ASTRA Monitoring Map)
    this.anatomicalZones = [
      { id: 1, name: "Head & brain interface", desc: "Helmet, visor, communications cap, head temperature, display and visibility", pos: { top: "15%", left: "49%", width: "74px", height: "66px" }, cat: "head", integrity: 99.9, temp: 21.4, psi: 4.30, mobility: "100% VIS", keyMetric: "VISOR CLARITY: 99.5%" },
      { id: 2, name: "Neck & helmet connection", desc: "Neck ring, pressure seal, ventilation and communication connections", pos: { top: "24%", left: "49%", width: "68px", height: "30px" }, cat: "torso", integrity: 99.8, temp: 22.1, psi: 4.30, mobility: "HERMETIC", keyMetric: "SEAL LEAK: < 0.001 sccm" },
      { id: 3, name: "Chest & upper torso", desc: "Hard upper torso, suit pressure, oxygen delivery, chest controls and vital monitoring", pos: { top: "33%", left: "48%", width: "95px", height: "64px" }, cat: "torso", integrity: 100.0, temp: 23.0, psi: 4.30, mobility: "HUT RIGID", keyMetric: "O₂ DELIV: 0.082 kg/h" },
      { id: 4, name: "Back & life-support backpack", desc: "Oxygen storage, CO₂ removal, circulation fan, cooling, water and battery", pos: { top: "30%", left: "75%", width: "80px", height: "115px" }, cat: "backpack", integrity: 99.6, temp: 15.8, psi: 4.30, mobility: "PLSS LOCKED", keyMetric: "PRIMARY O₂: 96% (5.88 kg)" },
      { id: 5, name: "Shoulders & upper arms", desc: "Shoulder bearings, pressure seals, arm mobility and garment integrity", pos: { top: "32%", left: "32%", width: "56px", height: "52px" }, cat: "arms", integrity: 99.4, temp: 21.8, psi: 4.29, mobility: "95.2% RANGE", keyMetric: "AXIAL BEARING: SMOOTH" },
      { id: 6, name: "Elbows & forearms", desc: "Elbow joints, forearm pressure, mobility and suit temperature", pos: { top: "42%", left: "27%", width: "52px", height: "54px" }, cat: "arms", integrity: 99.5, temp: 22.0, psi: 4.30, mobility: "94.0% FLEX", keyMetric: "RESISTANCE: 0.8 Nm" },
      { id: 7, name: "Wrists, hands & gloves", desc: "Wrist seals, glove pressure, finger movement, temperature and dexterity", pos: { top: "54%", left: "23%", width: "55px", height: "58px" }, cat: "hands", integrity: 99.1, temp: 20.4, psi: 4.28, mobility: "92.8% DEXT", keyMetric: "GRIP FORCE: 285 N" },
      { id: 8, name: "Waist & abdomen", desc: "Waist bearing, lower torso connection, hydration and waste interfaces", pos: { top: "48%", left: "48%", width: "84px", height: "44px" }, cat: "waist", integrity: 99.9, temp: 23.5, psi: 4.30, mobility: "45° PITCH", keyMetric: "BEARING: SEALED RING" },
      { id: 9, name: "Hips & pelvis", desc: "Hip mobility, pressure garment integrity and lower torso fit", pos: { top: "55%", left: "49%", width: "90px", height: "46px" }, cat: "waist", integrity: 99.7, temp: 23.2, psi: 4.30, mobility: "93.6% FREE", keyMetric: "SYMMETRY: 98.2%" },
      { id: 10, name: "Thighs & knees", desc: "Joint movement, pressure integrity, thermal condition and mobility resistance", pos: { top: "67%", left: "46%", width: "95px", height: "70px" }, cat: "legs", integrity: 99.5, temp: 23.4, psi: 4.30, mobility: "94.5% ARTIC", keyMetric: "BELLOWS: PLEATED" },
      { id: 11, name: "Lower legs & ankles", desc: "Leg mobility, pressure seals, cooling garment and ankle movement", pos: { top: "80%", left: "46%", width: "95px", height: "64px" }, cat: "legs", integrity: 99.3, temp: 22.8, psi: 4.30, mobility: "91.0% FLEX", keyMetric: "COOLING FLOW: 0.88 L/m" },
      { id: 12, name: "Feet & boots", desc: "Boot pressure integrity, temperature, sole condition, foot movement and contact", pos: { top: "92%", left: "45%", width: "105px", height: "48px" }, cat: "boots", integrity: 99.6, temp: 19.8, psi: 4.29, mobility: "ENGAGED", keyMetric: "EXT TEMP: +74/-62°C" }
    ];

    // Master Checklist Dataset (11 Categories, Real-time responsive)
    this.checklists = [
      // 1. Head and helmet (19 items)
      { cat: "head", catName: "Head and helmet", items: [
        { id: "h_ipres", name: "Helmet internal pressure", val: 4.30, unit: "psi", status: "NOMINAL", min: 4.1, max: 4.5 },
        { id: "h_pstab", name: "Helmet pressure stability", val: "±0.005", unit: "psi/min", status: "OPTIMAL", min: 0, max: 0.02 },
        { id: "h_sinteg", name: "Helmet seal integrity", val: 99.9, unit: "%", status: "HERMETIC", min: 98, max: 100 },
        { id: "h_temp", name: "Helmet temperature", val: 21.4, unit: "°C", status: "NOMINAL", min: 18, max: 24 },
        { id: "h_hum", name: "Helmet humidity", val: 42.0, unit: "% RH", status: "OPTIMAL", min: 30, max: 55 },
        { id: "h_vtemp", name: "Visor temperature", val: 18.5, unit: "°C", status: "HEATED", min: 15, max: 25 },
        { id: "h_vpos", name: "Visor position", val: "Down & Locked", unit: "", status: "SECURE" },
        { id: "h_vfog", name: "Visor fogging", val: 0.0, unit: "%", status: "CLEAR", min: 0, max: 5 },
        { id: "h_vinteg", name: "Visor integrity", val: 100.0, unit: "%", status: "INTACT", min: 95, max: 100 },
        { id: "h_visib", name: "Visibility", val: 99.5, unit: "%", status: "CLEAR", min: 90, max: 100 },
        { id: "h_airf", name: "Helmet airflow", val: 5.8, unit: "CFM", status: "NOMINAL", min: 4.5, max: 6.5 },
        { id: "h_co2", name: "Helmet CO₂", val: 0.12, unit: "mmHg", status: "NOMINAL", min: 0, max: 1.5 },
        { id: "h_ppo2", name: "Helmet ppO₂", val: 3.12, unit: "psi", status: "NOMINAL", min: 2.8, max: 3.5 },
        { id: "h_mic", name: "Microphone status", val: "Dual Active", unit: "Echo-Cancelling", status: "ONLINE" },
        { id: "h_spk", name: "Speaker status", val: "Stereo 72 dB", unit: "Balanced", status: "ONLINE" },
        { id: "h_cam", name: "Camera status", val: "4K HDR 60fps", unit: "Feed Synced", status: "ONLINE" },
        { id: "h_lights", name: "Helmet lights", val: "Bank 100%", unit: "850 Lumens", status: "ACTIVE" },
        { id: "h_hud", name: "HUD status", val: "Retina Projection", unit: "Calibrated", status: "SYNCED" },
        { id: "h_water", name: "Water intrusion", val: 0.00, unit: "mL", status: "DRY", min: 0, max: 0.1 }
      ]},

      // 2. Neck and torso (16 items)
      { cat: "torso", catName: "Neck and torso", items: [
        { id: "t_nring", name: "Neck-ring integrity", val: "Latched & Locked", unit: "Mechanical 360°", status: "SECURE" },
        { id: "t_nseal", name: "Neck seal leakage", val: "< 0.001", unit: "sccm", status: "HERMETIC" },
        { id: "t_hconn", name: "Helmet connection", val: "Positive Lock", unit: "Dual Detent", status: "ENGAGED" },
        { id: "t_hut", name: "Hard upper torso integrity", val: 100.0, unit: "%", status: "STRUCTURAL OK", min: 95, max: 100 },
        { id: "t_cpres", name: "Chest pressure", val: 4.30, unit: "psi", status: "NOMINAL", min: 4.1, max: 4.5 },
        { id: "t_spres", name: "Suit pressure", val: 4.30, unit: "psi", status: "NOMINAL", min: 4.1, max: 4.5 },
        { id: "t_ctemp", name: "Chest temperature", val: 23.1, unit: "°C", status: "NOMINAL", min: 19, max: 26 },
        { id: "t_chum", name: "Chest humidity", val: 44.0, unit: "% RH", status: "OPTIMAL", min: 30, max: 60 },
        { id: "t_inflow", name: "Air inlet flow", val: 6.0, unit: "CFM", status: "NOMINAL", min: 5.0, max: 7.0 },
        { id: "t_outflow", name: "Air outlet flow", val: 5.9, unit: "CFM", status: "NOMINAL", min: 5.0, max: 7.0 },
        { id: "t_o2del", name: "Oxygen delivery", val: 0.082, unit: "kg/h", status: "NOMINAL", min: 0.05, max: 0.12 },
        { id: "t_co2pp", name: "CO₂ partial pressure", val: 1.4, unit: "mmHg", status: "OPTIMAL", min: 0, max: 3.0 },
        { id: "t_elec", name: "Electrical connector", val: "28V DC Bus", unit: "Isolated Shield", status: "NOMINAL" },
        { id: "t_coolc", name: "Cooling connector", val: "Quick-Disconnect", unit: "Hermetic Valve", status: "SEALED" },
        { id: "t_wseal", name: "Waist seal", val: "360° Ring Pressurized", unit: "", status: "SECURE" },
        { id: "t_drink", name: "Drink-bag connection", val: "950 mL", unit: "Bite-Valve Clear", status: "READY" }
      ]},

      // 3. Backpack and life support (25 items)
      { cat: "backpack", catName: "Backpack and life support", items: [
        { id: "b_po2", name: "Primary oxygen reserve", val: 5.88, unit: "kg", status: "96% FULL", min: 1.0, max: 6.0 },
        { id: "b_so2", name: "Secondary oxygen reserve", val: 2.45, unit: "kg", status: "100% STANDBY", min: 1.0, max: 2.5 },
        { id: "b_tankp", name: "Oxygen tank pressure", val: 204.5, unit: "bar", status: "NOMINAL", min: 150, max: 220 },
        { id: "b_o2rate", name: "Oxygen consumption rate", val: 0.078, unit: "kg/h", status: "METABOLIC", min: 0.04, max: 0.15 },
        { id: "b_o2flow", name: "Oxygen delivery flow", val: 5.8, unit: "CFM", status: "NOMINAL", min: 4.5, max: 7.0 },
        { id: "b_regstat", name: "Oxygen regulator status", val: "Dual-Stage Primary", unit: "", status: "ACTIVE" },
        { id: "b_co2conc", name: "CO₂ concentration", val: 0.08, unit: "%", status: "NOMINAL", min: 0, max: 0.25 },
        { id: "b_scrubber", name: "CO₂ scrubber status", val: "Amine Bed Loop A", unit: "", status: "ONLINE" },
        { id: "b_filtsat", name: "Filter saturation", val: 14.2, unit: "%", status: "CLEAN", min: 0, max: 80 },
        { id: "b_fanspd", name: "Fan speed", val: 19450, unit: "RPM", status: "REGULATED", min: 16000, max: 22000 },
        { id: "b_airf", name: "Airflow rate", val: 6.1, unit: "CFM", status: "NOMINAL", min: 5.0, max: 7.5 },
        { id: "b_gassep", name: "Gas separator status", val: "Rotary Centrifugal", unit: "", status: "ACTIVE" },
        { id: "b_wlvl", name: "Cooling water level", val: 3.85, unit: "L", status: "94% FULL", min: 1.0, max: 4.0 },
        { id: "b_wtemp", name: "Cooling water temperature", val: 15.8, unit: "°C", status: "CHILLED", min: 10, max: 22 },
        { id: "b_pmpstat", name: "Cooling pump status", val: "Dual Impeller Prime", unit: "", status: "RUNNING" },
        { id: "b_cflow", name: "Cooling flow rate", val: 1.82, unit: "L/min", status: "BALANCED", min: 1.2, max: 2.2 },
        { id: "b_sublim", name: "Sublimator/chiller status", val: "Porous Plate Ice Matrix", unit: "", status: "NOMINAL" },
        { id: "b_batpct", name: "Battery percentage", val: 89.4, unit: "%", status: "HEALTHY", min: 20, max: 100 },
        { id: "b_batv", name: "Battery voltage", val: 29.2, unit: "V", status: "NOMINAL", min: 24, max: 32 },
        { id: "b_bati", name: "Battery current", val: 3.85, unit: "A", status: "NOMINAL", min: 1.0, max: 7.0 },
        { id: "b_battemp", name: "Battery temperature", val: 24.6, unit: "°C", status: "OPTIMAL", min: 15, max: 35 },
        { id: "b_pwr", name: "Power consumption", val: 112.4, unit: "W", status: "EFFICIENT", min: 80, max: 180 },
        { id: "b_runtime", name: "Estimated runtime", val: "7h 48m", unit: "at current load", status: "SUFFICIENT" },
        { id: "b_contam", name: "Contaminant cartridge status", val: "Trace Charcoal", unit: "96% Life", status: "NOMINAL" },
        { id: "b_waste", name: "Waste system status", val: "MAG Receptacle Clean", unit: "0% Capacity", status: "NOMINAL" }
      ]},

      // 4. Shoulders, arms and elbows (15 items)
      { cat: "arms", catName: "Shoulders, arms and elbows", items: [
        { id: "a_lsh_ang", name: "Left shoulder angle", val: 38.5, unit: "°", status: "FLEXION", min: 0, max: 120 },
        { id: "a_rsh_ang", name: "Right shoulder angle", val: 42.1, unit: "°", status: "FLEXION", min: 0, max: 120 },
        { id: "a_sh_mob", name: "Shoulder mobility", val: 95.2, unit: "%", status: "UNRESTRICTED", min: 80, max: 100 },
        { id: "a_sh_brg", name: "Shoulder bearing status", val: "Dual Axial Sealed", unit: "Low Friction", status: "NOMINAL" },
        { id: "a_uarm_p", name: "Upper-arm pressure", val: 4.29, unit: "psi", status: "NOMINAL", min: 4.1, max: 4.5 },
        { id: "a_uarm_t", name: "Upper-arm temperature", val: 21.8, unit: "°C", status: "NOMINAL", min: 18, max: 26 },
        { id: "a_arm_seal", name: "Arm seal integrity", val: 100.0, unit: "%", status: "HERMETIC", min: 95, max: 100 },
        { id: "a_lelb_ang", name: "Elbow angle", val: 65.4, unit: "°", status: "ARTICULATING", min: 0, max: 130 },
        { id: "a_elb_mob", name: "Elbow mobility", val: 94.0, unit: "%", status: "SMOOTH", min: 80, max: 100 },
        { id: "a_elb_brg", name: "Elbow bearing status", val: "Bellows Constant-Vol", unit: "Torque 0.8Nm", status: "NOMINAL" },
        { id: "a_elb_res", name: "Elbow resistance", val: 0.8, unit: "Nm", status: "LOW RESISTANCE", min: 0.2, max: 2.0 },
        { id: "a_farm_p", name: "Forearm pressure", val: 4.30, unit: "psi", status: "NOMINAL", min: 4.1, max: 4.5 },
        { id: "a_farm_t", name: "Forearm temperature", val: 22.0, unit: "°C", status: "NOMINAL", min: 18, max: 26 },
        { id: "a_garm_int", name: "Arm garment integrity", val: 99.8, unit: "%", status: "INTACT", min: 95, max: 100 },
        { id: "a_strain", name: "Arm movement strain", val: 12.4, unit: "%", status: "LOW FATIGUE", min: 0, max: 40 }
      ]},

      // 5. Wrists, hands and gloves (14 items)
      { cat: "hands", catName: "Wrists, hands and gloves", items: [
        { id: "g_lwr_ang", name: "Left wrist angle", val: 12.0, unit: "°", status: "NEUTRAL", min: -40, max: 40 },
        { id: "g_rwr_ang", name: "Right wrist angle", val: 8.5, unit: "°", status: "NEUTRAL", min: -40, max: 40 },
        { id: "g_wr_seal", name: "Wrist seal integrity", val: 99.9, unit: "%", status: "DUAL O-RING", min: 95, max: 100 },
        { id: "g_wr_brg", name: "Wrist bearing status", val: "360° Rotational Free", unit: "0.2 Nm", status: "SMOOTH" },
        { id: "g_glv_p", name: "Glove pressure", val: 4.28, unit: "psi", status: "NOMINAL", min: 4.0, max: 4.5 },
        { id: "g_glv_t", name: "Glove temperature", val: 20.4, unit: "°C", status: "HEATED", min: 15, max: 25 },
        { id: "g_glv_int", name: "Glove integrity", val: 99.4, unit: "%", status: "RTV SILICONE OK", min: 90, max: 100 },
        { id: "g_fmov", name: "Finger movement", val: "Full Dexterity", unit: "10-Finger Sensory", status: "NOMINAL" },
        { id: "g_tmov", name: "Thumb movement", val: "Opposable Locking", unit: "Range 100%", status: "NOMINAL" },
        { id: "g_grip", name: "Grip force estimate", val: 285, unit: "N", status: "STRONG", min: 100, max: 400 },
        { id: "g_dext", name: "Dexterity score", val: 92.8, unit: "%", status: "HIGH DEXTERITY", min: 70, max: 100 },
        { id: "g_tact", name: "Tactile feedback status", val: "Piezo Array Online", unit: "Haptic Synced", status: "ACTIVE" },
        { id: "g_fatig", name: "Hand fatigue", val: 14.5, unit: "%", status: "LOW", min: 0, max: 45 },
        { id: "g_circ", name: "Finger circulation estimate", val: "Capillary Refill 1.2s", unit: "SpO₂ 98%", status: "OPTIMAL" }
      ]},

      // 6. Waist, hips and pelvis (12 items)
      { cat: "waist", catName: "Waist, hips and pelvis", items: [
        { id: "w_pres", name: "Waist pressure", val: 4.30, unit: "psi", status: "NOMINAL", min: 4.1, max: 4.5 },
        { id: "w_brg", name: "Waist bearing status", val: "Axial Ring Sealed", unit: "Low Friction", status: "LOCKED" },
        { id: "w_mob", name: "Waist mobility", val: "45° Pitch / 30° Roll", unit: "Range OK", status: "FLEXIBLE" },
        { id: "w_seal", name: "Waist seal integrity", val: 99.9, unit: "%", status: "HERMETIC", min: 95, max: 100 },
        { id: "w_pelv_p", name: "Pelvic pressure", val: 4.30, unit: "psi", status: "NOMINAL", min: 4.1, max: 4.5 },
        { id: "w_lhip_ang", name: "Left hip angle", val: 18.2, unit: "°", status: "ABDUCTION", min: 0, max: 60 },
        { id: "w_rhip_ang", name: "Right hip angle", val: 16.5, unit: "°", status: "ABDUCTION", min: 0, max: 60 },
        { id: "w_hip_mob", name: "Hip mobility", val: 93.6, unit: "%", status: "FREE", min: 75, max: 100 },
        { id: "w_hip_res", name: "Hip joint resistance", val: 1.2, unit: "Nm", status: "LOW RESISTANCE", min: 0.5, max: 3.0 },
        { id: "w_hip_brg", name: "Hip bearing status", val: "Sealed Gimbal Rotator", unit: "", status: "NOMINAL" },
        { id: "w_hip_garm", name: "Hip garment integrity", val: 100.0, unit: "%", status: "MULTI-LAYER OK", min: 95, max: 100 },
        { id: "w_symm", name: "Movement symmetry", val: 98.2, unit: "%", status: "BALANCED", min: 85, max: 100 }
      ]},

      // 7. Thighs, knees and lower legs (15 items)
      { cat: "legs", catName: "Thighs, knees and lower legs", items: [
        { id: "l_lthigh_p", name: "Left thigh pressure", val: 4.30, unit: "psi", status: "NOMINAL", min: 4.1, max: 4.5 },
        { id: "l_rthigh_p", name: "Right thigh pressure", val: 4.30, unit: "psi", status: "NOMINAL", min: 4.1, max: 4.5 },
        { id: "l_thigh_t", name: "Thigh temperature", val: 23.4, unit: "°C", status: "LCVG LOOP", min: 19, max: 27 },
        { id: "l_thigh_int", name: "Thigh garment integrity", val: 100.0, unit: "%", status: "INTACT", min: 95, max: 100 },
        { id: "l_lknee_ang", name: "Left knee angle", val: 24.5, unit: "°", status: "FLEXION", min: 0, max: 110 },
        { id: "l_rknee_ang", name: "Right knee angle", val: 26.0, unit: "°", status: "FLEXION", min: 0, max: 110 },
        { id: "l_knee_mob", name: "Knee mobility", val: 94.5, unit: "%", status: "SMOOTH", min: 80, max: 100 },
        { id: "l_knee_brg", name: "Knee bearing status", val: "Pleated Constant-Vol Bellows", unit: "", status: "NOMINAL" },
        { id: "l_knee_res", name: "Knee resistance", val: 1.4, unit: "Nm", status: "NOMINAL", min: 0.5, max: 3.5 },
        { id: "l_lleg_p", name: "Lower-leg pressure", val: 4.30, unit: "psi", status: "NOMINAL", min: 4.1, max: 4.5 },
        { id: "l_lleg_t", name: "Lower-leg temperature", val: 22.8, unit: "°C", status: "NOMINAL", min: 18, max: 26 },
        { id: "l_ank_ang", name: "Ankle angle", val: 5.2, unit: "°", status: "PLANTARFLEX", min: -30, max: 30 },
        { id: "l_ank_mob", name: "Ankle mobility", val: 91.0, unit: "%", status: "ARTICULATING", min: 75, max: 100 },
        { id: "l_ank_brg", name: "Ankle bearing status", val: "Interlocking Rotary Ring", unit: "", status: "SEALED" },
        { id: "l_cool_flow", name: "Cooling garment flow", val: 0.88, unit: "L/min", status: "LOWER LOOP OK", min: 0.6, max: 1.2 }
      ]},

      // 8. Feet and boots (13 items)
      { cat: "boots", catName: "Feet and boots", items: [
        { id: "f_lb_p", name: "Left boot pressure", val: 4.29, unit: "psi", status: "NOMINAL", min: 4.1, max: 4.5 },
        { id: "f_rb_p", name: "Right boot pressure", val: 4.29, unit: "psi", status: "NOMINAL", min: 4.1, max: 4.5 },
        { id: "f_seal", name: "Boot seal integrity", val: 100.0, unit: "%", status: "ANODIZED RING OK", min: 95, max: 100 },
        { id: "f_temp", name: "Boot temperature", val: 19.8, unit: "°C", status: "HEATED INSOLE", min: 15, max: 25 },
        { id: "f_ext_temp", name: "External boot temperature", val: "+74.2 / -62.0", unit: "°C (Sun/Shade)", status: "MLI INSULATED" },
        { id: "f_sole", name: "Boot sole condition", val: 98.5, unit: "%", status: "RTV SILICONE 98%", min: 80, max: 100 },
        { id: "f_insul", name: "Boot insulation status", val: "14-Layer MLI Thermal", unit: "Radiative Shield", status: "OPTIMAL" },
        { id: "f_mov", name: "Foot movement", val: "Dorsiflexion Clear", unit: "Range 100%", status: "FREE" },
        { id: "f_tmov", name: "Toe movement", val: "Toe-Box Volume Clear", unit: "", status: "FREE" },
        { id: "f_contact", name: "Foot contact", val: "Foot Restraint Interlocked", unit: "Portable FR", status: "ENGAGED" },
        { id: "f_dist", name: "Foot pressure distribution estimate", val: "50 / 50 Bilateral", unit: "Even Distribution", status: "BALANCED" },
        { id: "f_dmg", name: "Boot damage", val: "Zero Abrasions", unit: "Inspection Clear", status: "CLEAN" },
        { id: "f_dust", name: "Dust contamination", val: 2.1, unit: "%", status: "ELECTROSTATIC REP", min: 0, max: 20 }
      ]},

      // 9. Full-body protection and garment (16 items)
      { cat: "garment", catName: "Full-body protection and garment", items: [
        { id: "g_blad", name: "Pressure bladder integrity", val: 99.9, unit: "%", status: "URETHANE NYLON", min: 95, max: 100 },
        { id: "g_restr", name: "Restraint layer condition", val: 100.0, unit: "%", status: "DACRON WEBBING OK", min: 95, max: 100 },
        { id: "g_tinsul", name: "Thermal insulation condition", val: 99.5, unit: "%", status: "14-LAYER MLI", min: 90, max: 100 },
        { id: "g_outfab", name: "Outer fabric condition", val: 99.8, unit: "%", status: "ORTHO-FABRIC OK", min: 90, max: 100 },
        { id: "g_seam", name: "Seam integrity", val: 100.0, unit: "%", status: "HIGH TENSILE STITCH", min: 95, max: 100 },
        { id: "g_mmoid", name: "Micrometeoroid impact indicator", val: "0 Events", unit: "Piezo Sensor Grid", status: "SECURE" },
        { id: "g_dustexp", name: "Dust exposure", val: "Low Lunar/Mars Regolith", unit: "Repellent Grid Active", status: "NOMINAL" },
        { id: "g_radrate", name: "Radiation dose rate", val: 22.4, unit: "µSv/h", status: "GALACTIC BACKGROUND", min: 10, max: 100 },
        { id: "g_cumrad", name: "Cumulative radiation exposure", val: 1.42, unit: "mSv", status: "SAFE MISSION ACCUM", min: 0, max: 50 },
        { id: "g_lcvg_t", name: "LCVG temperature", val: 18.2, unit: "°C", status: "COOLING ACTIVE", min: 14, max: 24 },
        { id: "g_lcvg_in", name: "LCVG inlet temperature", val: 15.4, unit: "°C", status: "CHILLED", min: 10, max: 20 },
        { id: "g_lcvg_out", name: "LCVG outlet temperature", val: 21.0, unit: "°C", status: "HEAT REMOVED", min: 16, max: 26 },
        { id: "g_lcvg_wflow", name: "LCVG water flow", val: 1.82, unit: "L/min", status: "BALANCED", min: 1.2, max: 2.2 },
        { id: "g_lcvg_leak", name: "LCVG leakage", val: 0.00, unit: "mL/h", status: "HERMETIC", min: 0, max: 0.5 },
        { id: "g_gar_hum", name: "Garment humidity", val: 42.0, unit: "% RH", status: "COMFORTABLE", min: 30, max: 60 },
        { id: "g_comfort", name: "Thermal comfort score", val: 96.5, unit: "%", status: "OPTIMAL", min: 75, max: 100 }
      ]},

      // 10. Astronaut biometrics (17 items)
      { cat: "biometrics", catName: "Astronaut biometrics", items: [
        { id: "bio_hr", name: "Heart rate", val: 72, unit: "bpm", status: "NORMAL SINUS", min: 55, max: 105 },
        { id: "bio_ecg", name: "ECG", val: "Lead-I Continuous Wave", unit: "AD8232 Clinical", status: "SYNCHRONIZED" },
        { id: "bio_hrv", name: "HRV (RMSSD / SDNN)", val: "42.1 / 54.2", unit: "ms", status: "HIGH VAGAL TONE" },
        { id: "bio_bp", name: "Blood pressure if available", val: "118 / 76", unit: "mmHg (MAP: 90.0)", status: "NORMATIVE" },
        { id: "bio_spo2", name: "SpO₂", val: 98.2, unit: "%", status: "SATURATED", min: 94, max: 100 },
        { id: "bio_rr", name: "Respiratory rate", val: 14.5, unit: "breaths/min", status: "EUPNEIC", min: 10, max: 22 },
        { id: "bio_coret", name: "Core temperature estimate", val: 37.0, unit: "°C", status: "HOMEOSTASIS", min: 36.3, max: 37.5 },
        { id: "bio_skint", name: "Skin temperature", val: 34.8, unit: "°C", status: "NORMAL", min: 32.5, max: 35.8 },
        { id: "bio_hydr", name: "Hydration estimate", val: "Euhydrated (45.2 L TBW)", unit: "Bioimpedance", status: "OPTIMAL" },
        { id: "bio_act", name: "Activity level", val: "Moderate Orbital EVA", unit: "1.25 METs", status: "STEADY" },
        { id: "bio_fatig", name: "Muscle fatigue estimate", val: 18.5, unit: "%", status: "LOW RESIDUAL", min: 0, max: 50 },
        { id: "bio_alert", name: "Alertness", val: 94.2, unit: "%", status: "HIGH READINESS", min: 70, max: 100 },
        { id: "bio_react", name: "Reaction time", val: 218, unit: "ms", status: "RAPID REFLEX", min: 150, max: 350 },
        { id: "bio_cog", name: "Cognitive performance", val: 96.0, unit: "%", status: "SUPERIOR", min: 80, max: 100 },
        { id: "bio_stress", name: "Stress self-report", val: 24.5, unit: "%", status: "CONTROLLED", min: 0, max: 45 },
        { id: "bio_sleepd", name: "Sleep duration", val: "6.42 hrs", unit: "Circadian Block", status: "ADEQUATE" },
        { id: "bio_sleepq", name: "Sleep quality", val: "82 / 100", unit: "Whoop Metric", status: "RESTFUL" }
      ]},

      // 11. Communication and emergencies (16 items)
      { cat: "comms", catName: "Communication and emergencies", items: [
        { id: "c_radio", name: "Radio status", val: "Dual UHF/VHF Transceiver", unit: "Full Duplex", status: "ONLINE" },
        { id: "c_sig", name: "Signal strength", val: -68, unit: "dBm", status: "EXCELLENT", min: -110, max: -40 },
        { id: "c_uplink", name: "Uplink status", val: "Carrier Locked 2.4GHz", unit: "Bitrate 12 Mbps", status: "ACTIVE" },
        { id: "c_downlink", name: "Downlink status", val: "High Bandwidth Stream", unit: "Bitrate 25 Mbps", status: "ACTIVE" },
        { id: "c_lat", name: "Latency", val: "12 ms (Orbital) / 5.45s (Earth)", unit: "", status: "LOW JITTER" },
        { id: "c_loss", name: "Packet loss", val: 0.00, unit: "%", status: "ZERO LOSS", min: 0, max: 2 },
        { id: "c_mic", name: "Microphone", val: "Capsule A & B Synced", unit: "DSP Noise Cancel", status: "NOMINAL" },
        { id: "c_spk", name: "Speaker", val: "Intelligibility 99.8%", unit: "Acoustic Shield", status: "NOMINAL" },
        { id: "c_ant", name: "Antenna", val: "Steerable Phased Array", unit: "Gain +18 dBi", status: "LOCKED" },
        { id: "c_bcn", name: "Emergency beacon", val: "406 MHz COSPAS-SARSAT", unit: "Armed Standby", status: "READY" },
        { id: "c_telem", name: "Telemetry status", val: "10 Hz Master Rust Burst", unit: "Encryption AES-256", status: "SYNCED" },
        { id: "c_eid", name: "Emergency event ID", val: "NONE // NOM-001", unit: "All Loops Green", status: "NOMINAL" },
        { id: "c_sev", name: "Severity", val: "LEVEL 0: NOMINAL", unit: "No Excursions", status: "CLEAR" },
        { id: "c_aff", name: "Affected subsystem", val: "None", unit: "12 Zones Nominal", status: "ALL OK" },
        { id: "c_ack", name: "Acknowledgement status", val: "Telemetry Sync Confirmed", unit: "Ground & Hab", status: "CONFIRMED" },
        { id: "c_res", name: "Resolution status", val: "All Safety Clearances Active", unit: "Safe to EVA", status: "CLEARED" }
      ]}
    ];

    this.init();
  }

  init() {
    this.renderAnatomicalZones();
    this.renderChecklists();
    this.bindEvents();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = (this.canvas.parentElement && this.canvas.parentElement.clientWidth > 0) ? this.canvas.parentElement.clientWidth : 600;
    this.canvas.height = 90;
  }

  // Get all specific checklist parameters for an anatomical zone
  getZoneParameters(zoneId) {
    const allItems = [];
    this.checklists.forEach(group => {
      group.items.forEach(item => {
        allItems.push(item);
      });
    });

    const findItem = (id) => allItems.find(i => i.id === id);

    switch (zoneId) {
      case 1: { // Head & brain interface
        const headGrp = this.checklists.find(g => g.cat === 'head');
        const list = headGrp ? [...headGrp.items] : [];
        const alert = findItem('bio_alert');
        const cog = findItem('bio_cog');
        const react = findItem('bio_react');
        if (alert && !list.includes(alert)) list.push(alert);
        if (cog && !list.includes(cog)) list.push(cog);
        if (react && !list.includes(react)) list.push(react);
        return list;
      }
      case 2: // Neck & helmet connection
        return [
          findItem('t_nring'), findItem('t_nseal'), findItem('t_hconn'),
          findItem('t_elec'), findItem('t_coolc'), findItem('t_drink'),
          findItem('c_mic'), findItem('c_spk')
        ].filter(Boolean);
      case 3: // Chest & upper torso
        return [
          findItem('t_hut'), findItem('t_cpres'), findItem('t_spres'),
          findItem('t_ctemp'), findItem('t_chum'), findItem('t_inflow'),
          findItem('t_outflow'), findItem('t_o2del'), findItem('t_co2pp'),
          findItem('t_wseal'), findItem('g_blad'), findItem('g_restr')
        ].filter(Boolean);
      case 4: { // Back & life-support backpack
        const bpGrp = this.checklists.find(g => g.cat === 'backpack');
        return bpGrp ? bpGrp.items : [];
      }
      case 5: // Shoulders & upper arms
        return [
          findItem('a_lsh_ang'), findItem('a_rsh_ang'), findItem('a_sh_mob'),
          findItem('a_sh_brg'), findItem('a_uarm_p'), findItem('a_uarm_t'),
          findItem('a_arm_seal'), findItem('a_garm_int')
        ].filter(Boolean);
      case 6: // Elbows & forearms
        return [
          findItem('a_lelb_ang'), findItem('a_elb_mob'), findItem('a_elb_brg'),
          findItem('a_elb_res'), findItem('a_farm_p'), findItem('a_farm_t'),
          findItem('a_strain')
        ].filter(Boolean);
      case 7: { // Wrists, hands & gloves
        const hGrp = this.checklists.find(g => g.cat === 'hands');
        return hGrp ? hGrp.items : [];
      }
      case 8: // Waist & abdomen
        return [
          findItem('w_pres'), findItem('w_brg'), findItem('w_mob'),
          findItem('w_seal'), findItem('t_wseal'), findItem('t_drink'),
          findItem('bio_hydr'), findItem('b_waste')
        ].filter(Boolean);
      case 9: // Hips & pelvis
        return [
          findItem('w_pelv_p'), findItem('w_lhip_ang'), findItem('w_rhip_ang'),
          findItem('w_hip_mob'), findItem('w_hip_res'), findItem('w_hip_brg'),
          findItem('w_hip_garm'), findItem('w_symm')
        ].filter(Boolean);
      case 10: // Thighs & knees
        return [
          findItem('l_lthigh_p'), findItem('l_rthigh_p'), findItem('l_thigh_t'),
          findItem('l_thigh_int'), findItem('l_lknee_ang'), findItem('l_rknee_ang'),
          findItem('l_knee_mob'), findItem('l_knee_brg'), findItem('l_knee_res')
        ].filter(Boolean);
      case 11: // Lower legs & ankles
        return [
          findItem('l_lleg_p'), findItem('l_lleg_t'), findItem('l_ank_ang'),
          findItem('l_ank_mob'), findItem('l_ank_brg'), findItem('l_cool_flow'),
          findItem('g_lcvg_t')
        ].filter(Boolean);
      case 12: { // Feet & boots
        const bGrp = this.checklists.find(g => g.cat === 'boots');
        return bGrp ? bGrp.items : [];
      }
      default:
        return [];
    }
  }

  // Render Interactive Anatomical Reticle Targets over EMU Suit Schematic (NO NUMERICAL CIRCLES)
  renderAnatomicalZones() {
    const container = document.getElementById('suit-hotspots-container');
    const pillsContainer = document.getElementById('suit-zone-selector-pills');
    if (!container) return;

    container.innerHTML = '';
    this.anatomicalZones.forEach(zone => {
      const target = document.createElement('div');
      target.className = `suit-zone-target ${this.selectedZone === zone.id ? 'active' : ''}`;
      target.style.top = zone.pos.top;
      target.style.left = zone.pos.left;
      target.style.width = zone.pos.width;
      target.style.height = zone.pos.height;
      target.setAttribute('data-zone-id', zone.id);
      target.setAttribute('title', `Zone ${zone.id < 10 ? '0' + zone.id : zone.id}: ${zone.name}`);

      target.innerHTML = `
        <span class="corner-bracket corner-tl"></span>
        <span class="corner-bracket corner-tr"></span>
        <span class="corner-bracket corner-bl"></span>
        <span class="corner-bracket corner-br"></span>
        <span class="target-crosshair"></span>
        <div class="zone-target-label"><span class="label-hex">⬡</span> ${zone.name.toUpperCase()}</div>
      `;

      target.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectZone(zone.id);
      });

      container.appendChild(target);
    });

    // Render quick-switch pills in selector strip
    if (pillsContainer) {
      pillsContainer.innerHTML = '';
      const shortNames = [
        "01 HEAD", "02 NECK", "03 CHEST", "04 PLSS", "05 SHOULDERS",
        "06 ELBOWS", "07 HANDS", "08 WAIST", "09 HIPS", "10 THIGHS",
        "11 LEGS", "12 BOOTS"
      ];
      this.anatomicalZones.forEach(zone => {
        const btn = document.createElement('button');
        btn.className = `suit-zone-pill-btn ${this.selectedZone === zone.id ? 'active' : ''}`;
        btn.setAttribute('data-pill-zone-id', zone.id);
        btn.textContent = shortNames[zone.id - 1] || zone.name;
        btn.addEventListener('click', () => {
          this.selectZone(zone.id);
        });
        pillsContainer.appendChild(btn);
      });
    }

    // Render complete details for initial zone
    const currentZone = this.anatomicalZones.find(z => z.id === this.selectedZone) || this.anatomicalZones[0];
    this.renderZoneCompleteDetails(currentZone);
  }

  // Select Zone & Render Complete Details
  selectZone(id) {
    this.selectedZone = id;
    const zone = this.anatomicalZones.find(z => z.id === id);
    if (!zone) return;

    // Highlight target on suit schematic
    document.querySelectorAll('.suit-zone-target').forEach(p => {
      p.classList.toggle('active', parseInt(p.getAttribute('data-zone-id'), 10) === id);
    });

    // Highlight selector pill
    document.querySelectorAll('.suit-zone-pill-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.getAttribute('data-pill-zone-id'), 10) === id);
    });

    // Render complete details station
    this.renderZoneCompleteDetails(zone);

    this.addLog(`Telemetry focus locked onto Zone ${zone.id < 10 ? '0' + zone.id : zone.id}: ${zone.name}`);

    // Synchronize category filter in 188-parameter checklist
    if (zone.cat) {
      this.filterCategory(zone.cat);
    }
  }

  // Render Complete Details Station for Selected Anatomical Zone
  renderZoneCompleteDetails(zone) {
    const cardContainer = document.getElementById('suit-zone-detail-card');
    if (!cardContainer || !zone) return;

    const items = this.getZoneParameters(zone.id);

    cardContainer.innerHTML = `
      <div class="zone-detail-header">
        <div class="zone-detail-title-row">
          <div class="zone-detail-title">
            <span style="color:var(--neon-cyan);">◈</span>
            ZONE ${zone.id < 10 ? '0' + zone.id : zone.id}: ${zone.name.toUpperCase()}
          </div>
          <span class="zone-status-badge" id="zone-detail-status">● HERMETIC SEAL // TELEMETRY NOMINAL</span>
        </div>
        <div class="zone-detail-desc">${zone.desc}</div>
        <div class="zone-actions-bar">
          <button class="btn-zone-action" onclick="window.spaceSuitHud.diagnoseZone(${zone.id})">⚡ RUN ZONE DIAGNOSTIC</button>
          <button class="btn-zone-action" onclick="window.spaceSuitHud.filterAndScroll('${zone.cat}')">VIEW IN 188-PARAM MATRIX ↓</button>
        </div>
      </div>

      <div class="zone-vitals-grid">
        <div class="zone-vital-card">
          <div class="zone-vital-lbl">ZONE PRESSURE</div>
          <div class="zone-vital-val" id="zone-v-psi">${zone.psi.toFixed(2)} <small style="font-size:10px;">PSI</small></div>
          <div class="zone-vital-sub">NORMAL [4.1-4.5]</div>
        </div>
        <div class="zone-vital-card">
          <div class="zone-vital-lbl">ZONE TEMP</div>
          <div class="zone-vital-val" id="zone-v-temp">${zone.temp.toFixed(1)} <small style="font-size:10px;">°C</small></div>
          <div class="zone-vital-sub">THERMAL COMFORT</div>
        </div>
        <div class="zone-vital-card">
          <div class="zone-vital-lbl">STRUCTURAL INTEGRITY</div>
          <div class="zone-vital-val">${zone.integrity.toFixed(1)}%</div>
          <div class="zone-vital-sub">MULTI-LAYER OK</div>
        </div>
        <div class="zone-vital-card">
          <div class="zone-vital-lbl">ARTICULATION / LOAD</div>
          <div class="zone-vital-val" style="font-size:11px;">${zone.mobility}</div>
          <div class="zone-vital-sub" style="font-size:8px;">${zone.keyMetric}</div>
        </div>
      </div>

      <div class="zone-params-title">
        <span>SUBSYSTEM PARAMETERS (${items.length} ACTIVE SENSORS):</span>
        <span style="font-size:9px; color:var(--text-secondary); text-transform:none;">Real-time Telemetry Synced</span>
      </div>

      <div class="zone-params-grid">
        ${items.map(item => this.renderChecklistItem(item)).join('')}
      </div>
    `;
  }

  // Zone rapid sensor telemetry diagnostic
  diagnoseZone(id) {
    const zone = this.anatomicalZones.find(z => z.id === id);
    if (!zone) return;
    const items = this.getZoneParameters(id);
    this.addLog(`>>> [DIAGNOSTIC] Scanning Zone ${zone.id < 10 ? '0' + zone.id : zone.id} (${zone.name})...`);

    const target = document.querySelector(`.suit-zone-target[data-zone-id="${id}"]`);
    if (target) {
      target.style.borderColor = '#ffffff';
      setTimeout(() => {
        if (target) target.style.borderColor = '';
      }, 700);
    }

    setTimeout(() => {
      this.addLog(`[DIAGNOSTIC] ${items.length}/${items.length} sensor transceivers verified. Bus latency: 1.4ms.`);
      this.addLog(`[DIAGNOSTIC] Zone ${zone.id} hermetic pressure: ${zone.psi.toFixed(2)} PSI. Temp: ${zone.temp.toFixed(1)}°C.`);
      this.addLog(`[STATUS: PASS] Zone ${zone.id} integrity rating: ${zone.integrity}%. All systems go.`);

      const statusBadge = document.getElementById('zone-detail-status');
      if (statusBadge) {
        statusBadge.textContent = `● DIAGNOSTIC VERIFIED: 100% NOMINAL (${items.length} SENSORS)`;
        statusBadge.style.color = 'var(--neon-green)';
        statusBadge.style.borderColor = 'var(--neon-green)';
      }
    }, 400);
  }

  // Scroll smoothly to full checklist matrix
  filterAndScroll(cat) {
    this.filterCategory(cat);
    const container = document.getElementById('suit-checklists-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Filter checklists by category or text search
  filterCategory(cat) {
    this.activeCategory = cat;
    document.querySelectorAll('.cat-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cat') === cat);
    });
    this.renderChecklists();
  }

  // Render Checklists with live status pills and meters
  renderChecklists() {
    const listContainer = document.getElementById('suit-checklists-container');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    let totalItems = 0;
    let visibleItems = 0;

    this.checklists.forEach(group => {
      const matchesCat = (this.activeCategory === 'all' || this.activeCategory === group.cat);
      if (!matchesCat) return;

      // Filter items by search query
      const filteredItems = group.items.filter(item => {
        totalItems++;
        if (!this.searchQuery) return true;
        const q = this.searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) ||
               String(item.val).toLowerCase().includes(q) ||
               item.status.toLowerCase().includes(q) ||
               (item.unit && item.unit.toLowerCase().includes(q));
      });

      if (filteredItems.length === 0) return;
      visibleItems += filteredItems.length;

      const groupEl = document.createElement('div');
      groupEl.className = 'checklist-group';

      groupEl.innerHTML = `
        <div class="checklist-group-header">
          <div class="group-title">
            <span>◈</span> ${group.catName.toUpperCase()}
          </div>
          <div class="group-count">${filteredItems.length} PARAMETERS MONITORED</div>
        </div>
        <div class="checklist-items-grid">
          ${filteredItems.map(item => this.renderChecklistItem(item)).join('')}
        </div>
      `;

      listContainer.appendChild(groupEl);
    });

    const countLabel = document.getElementById('suit-checklist-count-label');
    if (countLabel) {
      countLabel.textContent = `DISPLAYING ${visibleItems} OF 188 SPACE SUIT PARAMETERS`;
    }
  }

  renderChecklistItem(item) {
    const isNum = typeof item.val === 'number';
    let pct = 100;
    if (isNum && item.min !== undefined && item.max !== undefined) {
      pct = Math.min(100, Math.max(0, ((item.val - item.min) / (item.max - item.min)) * 100));
    }

    const statusClass = (item.status === 'CRITICAL' || item.status === 'EMERGENCY') ? 'status-danger' :
                        (item.status === 'CAUTION' || item.status === 'WARNING') ? 'status-warning' :
                        'status-nominal';

    return `
      <div class="chk-item-card" id="chk-${item.id}">
        <div class="chk-item-top">
          <span class="chk-item-name">${item.name}</span>
          <span class="chk-item-badge ${statusClass}">${item.status}</span>
        </div>
        <div class="chk-item-body">
          <span class="chk-item-val" id="val-${item.id}">${item.val}</span>
          <span class="chk-item-unit">${item.unit || ''}</span>
        </div>
        ${isNum ? `
          <div class="chk-item-track">
            <div class="chk-item-bar" id="bar-${item.id}" style="width:${pct.toFixed(0)}%;"></div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Periodic real-time fluctuations to keep the checklists responsive and live
  tickResponsiveData(tick) {
    const phase = tick * 0.1;

    // Head pressure & temperature micro-fluctuations
    const headPsi = (4.30 + Math.sin(phase * 0.5) * 0.015).toFixed(2);
    const headTemp = (21.4 + Math.cos(phase * 0.3) * 0.2).toFixed(1);
    this.updateItemVal("h_ipres", headPsi);
    this.updateItemVal("h_temp", headTemp);
    this.updateItemVal("h_airf", (5.8 + Math.sin(phase) * 0.1).toFixed(1));
    this.updateItemVal("h_ppo2", (3.12 + Math.cos(phase * 0.2) * 0.02).toFixed(2));

    // Life support backpack
    this.updateItemVal("b_pwr", (112.4 + Math.sin(phase * 0.8) * 3.5).toFixed(1));
    this.updateItemVal("b_bati", (3.85 + Math.sin(phase * 0.8) * 0.12).toFixed(2));
    this.updateItemVal("b_cflow", (1.82 + Math.cos(phase * 0.4) * 0.04).toFixed(2));
    this.updateItemVal("b_wtemp", (15.8 + Math.sin(phase * 0.1) * 0.2).toFixed(1));
    this.updateItemVal("b_fanspd", Math.round(19450 + Math.sin(phase * 0.5) * 60));

    // Garment & Biometrics
    this.updateItemVal("g_lcvg_t", (18.2 + Math.sin(phase * 0.2) * 0.3).toFixed(1));
    this.updateItemVal("c_sig", Math.round(-68 + Math.sin(phase * 0.3) * 2));

    // Sync active zone vitals if matching
    if (this.selectedZone === 1) {
      const activePsi = document.getElementById('zone-v-psi');
      const activeTemp = document.getElementById('zone-v-temp');
      if (activePsi) activePsi.innerHTML = `${headPsi} <small style="font-size:10px;">PSI</small>`;
      if (activeTemp) activeTemp.innerHTML = `${headTemp} <small style="font-size:10px;">°C</small>`;
    }
  }

  updateItemVal(id, newVal) {
    document.querySelectorAll(`[id="val-${id}"]`).forEach(el => {
      el.textContent = newVal;
    });
  }

  bindEvents() {
    // Search input
    const searchInput = document.getElementById('suit-checklist-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        this.renderChecklists();
      });
    }

    // Category filter pills
    document.querySelectorAll('.cat-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-cat');
        this.filterCategory(cat);
      });
    });

    // Suit Internal Pressure Slider
    const pressureSlider = document.getElementById('suit-pressure-slider');
    const pressureVal = document.getElementById('suit-pressure-val');
    if (pressureSlider && pressureVal) {
      pressureSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value).toFixed(2);
        pressureVal.textContent = `${val} PSI`;
        this.updateItemVal("t_spres", val);
        this.updateItemVal("h_ipres", val);
        this.updateItemVal("t_cpres", val);
        this.addLog(`Suit internal pressure adjusted to ${val} PSI`);
      });
    }

    // Antigravity Field Density Slider
    const fluxSlider = document.getElementById('suit-flux-slider');
    const fluxVal = document.getElementById('suit-flux-val');
    if (fluxSlider && fluxVal) {
      fluxSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value).toFixed(1);
        fluxVal.textContent = `${val}%`;
        this.addLog(`Suit antigravity field density set to ${val}%`);
      });
    }

    // Servo Stabilizer Toggle
    const servoToggle = document.getElementById('suit-servo-toggle');
    if (servoToggle) {
      servoToggle.addEventListener('click', () => {
        servoToggle.classList.toggle('active');
        if (servoToggle.classList.contains('active')) {
          servoToggle.textContent = 'ENGAGED';
          this.addLog('Inertial servo-stabilizers engaged for 0.38G microgravity.');
        } else {
          servoToggle.textContent = 'DISENGAGED';
          this.addLog('WARNING: Suit inertial stabilizers disengaged!');
        }
      });
    }

    // Emergency Purge Button
    const overrideBtn = document.getElementById('suit-override-btn');
    if (overrideBtn) {
      overrideBtn.addEventListener('click', () => {
        alert('EMERGENCY DEPRESSURIZATION PURGE INITIATED // PLSS OXYGEN RESERVE DUMPED');
        this.addLog('CRITICAL: Emergency suit depressurization purge executed.');
      });
    }
  }

  addLog(text) {
    if (!this.logConsole) return;
    const time = new Date().toTimeString().split(' ')[0];
    const p = document.createElement('p');
    p.textContent = `[${time}] ${text}`;
    this.logConsole.insertBefore(p, this.logConsole.firstChild);
    if (this.logConsole.children.length > 12) {
      this.logConsole.removeChild(this.logConsole.lastChild);
    }
  }

  draw() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ctx.fillStyle = 'rgba(0, 10, 25, 0.35)';
    this.ctx.fillRect(0, 0, w, h);

    // Reticle grid
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }

    // Suit ECLSS Telemetry Pulse
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = '#00f0ff';

    this.ctx.beginPath();
    const count = 120;
    const sliceWidth = w / count;
    let x = 0;

    for (let i = 0; i < count; i++) {
      let v = Math.sin((i + this.waveOffset) * 0.12) * 12 +
              Math.sin((i * 0.3 + this.waveOffset) * 0.08) * 8;
      if (i % 25 === 0) v += (Math.random() - 0.5) * 26; // telemetry heartbeat tick

      let y = (h / 2) + v;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
      x += sliceWidth;
    }
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    this.waveOffset += 1.4;
  }
}
