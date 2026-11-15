# ASTRA – Complete Step-by-Step Beginner Guide in VS Code

Welcome to **ASTRA (Astronaut Survival & Telemetry Response Architecture)**, developed for the **NASA Space Apps Challenge**.

---

## 1. Programming Languages & Architecture Used

This system uses a **modern high-performance hybrid architecture**:

| Component | Language / Tech | Why it was chosen |
| :--- | :--- | :--- |
| **On-board Calculation Engine** | **Rust** | Ultra-fast, zero-overhead mathematical calculations for DSP (digital signal processing), ECG peak detection, SpO₂ optical ratios, EEG frequency bands, decompression rates, and medical triage. |
| **Telemetry Network Broadcaster** | **Rust (Tokio + Axum + WebSockets)** | Concurrently streams live vitals to multiple devices (helmet HUD, flight surgeon tablet, mission control terminal) without latency. |
| **Cyberpunk HUD Visual Interface** | **HTML5 & Modern CSS3** | High-contrast sci-fi cyberpunk telemetry interface with glassmorphism, glow filters, and responsive widget layout. |
| **Real-Time Bio-Waveform Rendering** | **JavaScript & HTML5 Canvas** | Renders the live P-Q-R-S-T ECG oscilloscope waveform and the 3D rotating holographic neural brain at 60 frames per second. |

---

## 2. How to View the Output Page Immediately (Right Now!)

You can view the full working interactive interface right now in your web browser:

1. Open your File Explorer and navigate to:  
   `C:\Users\saiki\OneDrive\Desktop\ASTRA H`
2. Look for the file named **`index.html`** (this is your output page!).
3. **Double-click `index.html`** (or right-click → *Open with Google Chrome / Microsoft Edge*).
4. **The Cyberpunk HUD will immediately launch!**
   - Click any vital sub-division on the left menu (Physical Health, Cardiovascular, Neurological, Environment, Spacesuit, etc.).
   - Watch the live **ECG wave** pulse in neon amber.
   - Watch the **3D Holographic Brain** rotate and display live Gamma, Beta, Alpha, Theta, and Delta frequency bands.
   - Watch the **Distance from Home Planet (Earth)** increment in real time with communications light delay.

---

## 3. How to Open and Work in Visual Studio Code (Step-by-Step)

### Step 1: Open the Project in VS Code
1. Open **Visual Studio Code**.
2. Click **File** in the top-left menu → click **Open Folder...**
3. Select the folder: `C:\Users\saiki\OneDrive\Desktop\ASTRA H`
4. Click **Select Folder**.
5. You will see the project file tree in the left sidebar:
   - `index.html` (The output web page)
   - `Cargo.toml` (Rust workspace definition)
   - `crates/` (The 5 Rust sub-libraries)
   - `static/` (CSS, JS, and HUD assets)

---

### Step 2: Install Recommended VS Code Extensions
In VS Code, click the **Extensions** icon on the far left bar (or press `Ctrl + Shift + X`):
1. **Live Server** (by *Ritwick Dey*): Lets you right-click `index.html` and click **"Open with Live Server"** to view live reloading changes.
2. **rust-analyzer** (by *The Rust Programming Language*): Provides autocomplete, type inspection, and error checking for Rust.
3. **Even Better TOML** (by *tamasfe*): Syntax highlighting for `Cargo.toml`.

---

### Step 3: Installing the Rust Toolchain on Windows (First-Time Setup)

If you have not installed Rust yet:
1. Visit the official Rust site: **[https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)**
2. Download and run **`rustup-init.exe`**.
3. It will prompt you to install the **Visual Studio C++ Build Tools** (press `1` for default installation).
4. Once completed, restart VS Code.

To verify your installation in the VS Code terminal (`Ctrl + ~`):
```powershell
cargo --version
rustc --version
```

---

### Step 4: Running the Rust Telemetry Server & Broadcasting

In the VS Code Terminal (`Ctrl + ~`):

1. Build and run the main server crate:
   ```powershell
   cargo run -p astra-server
   ```
2. You will see the **ASTRA Cyberpunk ASCII startup banner**:
   ```
   ======================================================================
        █████╗ ███████╗████████╗██████╗  █████╗     ██╗  ██╗
       ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔══██╗    ██║  ██║
       ███████║███████╗   ██║   ██████╔╝███████║    ███████║
       ██╔══██║╚════██║   ██║   ██╔══██╗██╔══██║    ██╔══██║
       ██║  ██║███████║   ██║   ██║  ██║██║  ██║    ██║  ██║
       ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝  ╚═╝
    ASTRONAUT SURVIVAL & TELEMETRY RESPONSE ARCHITECTURE (NASA SPACE APPS)
   ======================================================================
   [+] ASTRA HTTP & WebSocket Server listening on: http://127.0.0.1:8080
   [+] Multi-Device Network Access: http://<YOUR_LOCAL_IP>:8080
   [+] WebSocket Real-time Feed: ws://127.0.0.1:8080/ws/telemetry
   ```
3. Open your browser to: **`http://127.0.0.1:8080`**
4. The top header will turn bright green: **`SYNCED TO RUST ENGINE`** streaming live 10 Hz telemetry calculated directly on-board!

---

### Step 5: Connecting Other Devices (Tablets, Phones, Mission Control)

To monitor the astronaut from a tablet, phone, or another laptop on the same Wi-Fi network:
1. Find your computer's local IP address by typing in PowerShell:
   ```powershell
   ipconfig
   ```
   Look for `IPv4 Address` (e.g. `192.168.1.45`).
2. On your iPad, smartphone, or teammate's laptop, open Chrome or Safari and enter:
   ```
   http://192.168.1.45:8080
   ```
3. Both screens will now be synchronized! The astronaut HUD and the flight surgeon tablet will receive the identical live telemetry broadcast simultaneously!

---

## 4. Hardware Peripheral Integration Map

When connecting physical microcontroller boards (ESP32, Arduino, Raspberry Pi, STM32):

| Sensor | Purpose | Connection Protocol | Crate Location |
| :--- | :--- | :--- | :--- |
| **MAX30102** | Heart Rate & SpO₂ | I²C (`0x57`) | `crates/astra-sensors/src/max30102.rs` |
| **MAX30205** | Clinical Body Temperature | I²C (`0x48`) | `crates/astra-sensors/src/max30205.rs` |
| **BMP280** | Cabin/Suit Barometric Pressure | I²C (`0x76`) / SPI | `crates/astra-sensors/src/bmp280.rs` |
| **ADS1299** | 8-Channel 24-Bit EEG Brainwaves | SPI High-Speed | `crates/astra-sensors/src/ads1299.rs` |
| **AD8232** | Single-Lead ECG Heart Rhythm | Analog ADC + LO+/LO- | `crates/astra-sensors/src/ad8232.rs` |
| **MH-Z19B** | NDIR CO₂ Concentration | UART Serial (9600 baud) | `crates/astra-sensors/src/mhz19b.rs` |
| **Galvanic Cell** | Oxygen Concentration (%) | Analog 0–50 mV | `crates/astra-sensors/src/analog_sensors.rs` |
| **Transducer** | High-Pressure Suit & O₂ Tank | 0.5V – 4.5V Ratiometric | `crates/astra-sensors/src/analog_sensors.rs` |
| **PT100 RTD** | Deep Space External Temp | Resistance Bridge | `crates/astra-sensors/src/analog_sensors.rs` |
| **Digital BP** | Systolic / Diastolic Cuff | UART Serial Packet | `crates/astra-sensors/src/analog_sensors.rs` |
