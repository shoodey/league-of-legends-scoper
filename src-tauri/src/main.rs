// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use std::str;
use regex::Regex;
use std::path::PathBuf;
use tauri::{ Manager, State, Wry };
use tauri_plugin_store::{ with_store, StoreCollection };
use serde_json::json;

const STORE_PATH: &str = ".settings.dat";

#[tauri::command]
fn get_client_data() -> (String, String) {
    let shell_function_name = "ps -A | grep \"LeagueClientUx\"";

    let output = Command::new("sh")
        .arg("-c")
        .arg(format!("{}", shell_function_name))
        .output()
        .expect("Failed to execute command");

    // Convert the output bytes to a String
    let output_string = str
        ::from_utf8(&output.stdout)
        .expect("Failed to convert output to string")
        .trim()
        .to_string();

    let app_port = format!("{}", parse_client_app_port(output_string.clone()));
    let auth_token = format!("{}", parse_client_auth_token(output_string.clone()));

    (app_port, auth_token)
}

fn parse_client_app_port(output_string: String) -> String {
    // Define the regular expression pattern
    let pattern = r"--app-port=[0-9]*";

    // Create a regular expression object
    let re = Regex::new(pattern).expect("Failed to create regex");

    // Find and collect the matched substrings into a Vec<String>
    let mut matches: Vec<String> = Vec::new();
    for match_ in re.find_iter(&output_string) {
        matches.push(match_.as_str().to_string());
    }

    if matches.len() == 0 {
        return String::from("");
    }

    let first_match = matches.first().expect("Failed to get first match").clone();

    let app_port = first_match.replace("--app-port=", "");

    format!("{}", app_port)
}

fn parse_client_auth_token(output_string: String) -> String {
    // Define the regular expression pattern
    let pattern = r"--remoting-auth-token=[0-9a-zA-Z\-]*";

    // Create a regular expression object
    let re = Regex::new(pattern).expect("Failed to create regex");

    // Find and collect the matched substrings into a Vec<String>
    let mut matches: Vec<String> = Vec::new();
    for match_ in re.find_iter(&output_string) {
        matches.push(match_.as_str().to_string());
    }

    if matches.len() == 0 {
        return String::from("");
    }

    let first_match = matches.first().expect("Failed to get first match").clone();

    let app_port = first_match.replace("--remoting-auth-token=", "");

    format!("{}", app_port)
}

fn store_app_port(
    app_handle: tauri::AppHandle,
    path: PathBuf,
    stores: State<'_, StoreCollection<Wry>>,
    app_port: String
) -> Result<(), tauri_plugin_store::Error> {
    if app_port == "0" {
        return Ok(());
    }

    with_store(app_handle, stores, path, |store| {
        store.insert("appPort".into(), json!(app_port))
    })?;

    Ok(())
}

fn store_auth_token(
    app_handle: tauri::AppHandle,
    path: PathBuf,
    stores: State<'_, StoreCollection<Wry>>,
    auth_token: String
) -> Result<(), tauri_plugin_store::Error> {
    if auth_token == "0" {
        return Ok(());
    }

    with_store(app_handle, stores, path, |store| {
        store.insert("authToken".into(), json!(auth_token))
    })?;

    Ok(())
}

fn main() {
    tauri::Builder
        ::default()
        .setup(|app| {
            let path = PathBuf::from(STORE_PATH);
            let stores = app.state::<StoreCollection<Wry>>();

            let (app_port, auth_token) = get_client_data();

            store_app_port(app.handle(), path.clone(), stores.clone(), app_port)?;
            store_auth_token(app.handle(), path.clone(), stores.clone(), auth_token)?;

            // with_store(app.handle(), stores, path, |store| {
            //     store.insert("authToken".into(), json!("myAuthToken"))
            // })?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_client_data])
        .plugin(tauri_plugin_store::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
