use std::net::SocketAddr;
use std::sync::Arc;
use std::time::Duration;

use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        State,
    },
    response::{IntoResponse, Json},
    routing::{get, post},
    Router,
};
use futures_util::{SinkExt, StreamExt};
use tower_http::cors::CorsLayer;
use tower_http::services::ServeDir;

use astra_analytics::MedicalAiAdvisor;
use astra_core::packet::TelemetryPacket;
use astra_sensors::simulator::TelemetrySimulator;
use astra_telemetry::{ConnectedDevice, TelemetryHub};

struct AppState {
    hub: TelemetryHub,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    println!(r#"
    ======================================================================
         █████╗ ███████╗████████╗██████╗  █████╗     ██╗  ██╗
        ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔══██╗    ██║  ██║
        ███████║███████╗   ██║   ██████╔╝███████║    ███████║
        ██╔══██║╚════██║   ██║   ██╔══██╗██╔══██║    ██╔══██║
        ██║  ██║███████║   ██║   ██║  ██║██║  ██║    ██║  ██║
        ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝  ╚═╝
     ASTRONAUT SURVIVAL & TELEMETRY RESPONSE ARCHITECTURE (NASA SPACE APPS)
    ======================================================================
    [+] Initializing 12 Survival Parameter Systems Engine (Rust Core)...
    [+] Subsystems Loaded:
        1. Physical Body & Body Composition
        2. Cardiovascular System (P-Q-R-S-T ECG & Vascular Dynamics)
        3. Respiratory System (Airway & Alveolar Gas Exchange)
        4. Neurological & Brain Function (ADS1299 5-Band EEG & Synaptic Cognition)
        5. Mental & Psychological Health (Deep Space Solitary Confinement)
        6. Sleep & Biological Rhythms (Circadian Phases & Whoop/Oura Metrics)
        7. Metabolic & Endocrine Systems (Hormonal Loops, Glucose, Blood pH)
        8. Digestive, Nutritional & Hydration Systems (Peristalsis & Gastric Villi)
        9. Immune, Cellular & Genetic Health (T-Cells, Cytokines, DNA Repair)
        10. Sensory & Musculoskeletal Systems (SANS IOP, Bone Loss, Vestibular)
        11. Earth Atmosphere & Environmental Conditions (Hab Gas & Geiger Radiation)
        12. External Survival Resources & Safety (EVA Spacesuit & ECLSS Triage)
    "#);

    let hub = TelemetryHub::new(128);

    // Register local device
    hub.register_device(ConnectedDevice::new(
        "DEV-LOCAL-HUD-01".to_string(),
        "Commander Helmet HUD".to_string(),
        "EVA Astronaut".to_string(),
        "127.0.0.1".to_string(),
    ))
    .await;

    let app_state = Arc::new(AppState { hub: hub.clone() });

    // Spawn 10 Hz Background Telemetry & Calculation Loop
    let hub_clone = hub.clone();
    tokio::spawn(async move {
        let mut simulator = TelemetrySimulator::new();
        let mut current_packet = TelemetryPacket::default();
        let mut interval = tokio::time::interval(Duration::from_millis(100)); // 10 Hz

        loop {
            interval.tick().await;

            let mut raw = simulator.next_packet(&current_packet);
            MedicalAiAdvisor::evaluate(&mut raw);
            current_packet = raw.clone();
            hub_clone.broadcast_packet(raw).await;
        }
    });

    let app = Router::new()
        .route("/api/vitals", get(get_vitals))
        .route("/api/devices", get(get_devices))
        .route("/api/action/acknowledge", post(acknowledge_alert))
        .route("/ws/telemetry", get(ws_handler))
        .nest_service("/", ServeDir::new("static"))
        .layer(CorsLayer::permissive())
        .with_state(app_state);

    let port = 8080;
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    println!("[+] ASTRA HTTP & WebSocket Server: http://127.0.0.1:{}", port);
    println!("[+] Multi-Device Network Access: http://<YOUR_LOCAL_IP>:{}", port);

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind TCP port 8080");
    axum::serve(listener, app.into_make_service_with_connect_info::<SocketAddr>())
        .await
        .unwrap();
}

async fn get_vitals(State(state): State<Arc<AppState>>) -> Json<TelemetryPacket> {
    let packet = state.hub.get_latest_packet().await;
    Json(packet)
}

async fn get_devices(State(state): State<Arc<AppState>>) -> Json<Vec<ConnectedDevice>> {
    let devices = state.hub.list_devices().await;
    Json(devices)
}

async fn acknowledge_alert() -> Json<serde_json::Value> {
    Json(serde_json::json!({ "status": "acknowledged" }))
}

async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(socket, state))
}

async fn handle_socket(socket: WebSocket, state: Arc<AppState>) {
    let (mut sender, mut receiver) = socket.split();
    let mut rx = state.hub.subscribe();

    let dev_id = format!("DEV-REMOTE-{}", chrono::Utc::now().timestamp_subsec_millis());
    state
        .hub
        .register_device(ConnectedDevice::new(
            dev_id.clone(),
            "Remote Telemetry Observer".to_string(),
            "Flight Surgeon / Ground Station".to_string(),
            "Client".to_string(),
        ))
        .await;

    let latest = state.hub.get_latest_packet().await;
    if let Ok(json_str) = serde_json::to_string(&latest) {
        let _ = sender.send(Message::Text(json_str)).await;
    }

    let mut send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if sender.send(Message::Text(msg)).await.is_err() {
                break;
            }
        }
    });

    let hub_for_cleanup = state.hub.clone();
    let dev_id_clone = dev_id.clone();
    let mut recv_task = tokio::spawn(async move {
        while let Some(Ok(msg)) = receiver.next().await {
            if let Message::Close(_) = msg {
                break;
            }
        }
        hub_for_cleanup.unregister_device(&dev_id_clone).await;
    });

    tokio::select! {
        _ = (&mut send_task) => recv_task.abort(),
        _ = (&mut recv_task) => send_task.abort(),
    };

    state.hub.unregister_device(&dev_id).await;
}
