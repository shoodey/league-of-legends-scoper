// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use std::str;
use regex::Regex;

#[tauri::command]
fn get_client_app_port() -> String {
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

    // Define the regular expression pattern
    let pattern = r"--app-port=[0-9]*";

    // Create a regular expression object
    let re = Regex::new(pattern).expect("Failed to create regex");

    // Find and collect the matched substrings into a Vec<String>
    let mut matches: Vec<String> = Vec::new();
    for match_ in re.find_iter(&output_string) {
        matches.push(match_.as_str().to_string());
    }

    format!("{}", matches[0].replace("--app-port=", ""))
}

#[tauri::command]
fn get_client_auth_token() -> String {
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

  // Define the regular expression pattern
  let pattern = r"--remoting-auth-token=[0-9a-zA-Z\-]*";

  // Create a regular expression object
  let re = Regex::new(pattern).expect("Failed to create regex");

  // Find and collect the matched substrings into a Vec<String>
  let mut matches: Vec<String> = Vec::new();
  for match_ in re.find_iter(&output_string) {
      matches.push(match_.as_str().to_string());
  }

  format!("{}",matches[0].replace("--remoting-auth-token=", ""))
}

fn main() {
    tauri::Builder
        ::default()
        .invoke_handler(tauri::generate_handler![get_client_app_port, get_client_auth_token])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
