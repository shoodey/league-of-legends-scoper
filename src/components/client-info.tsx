"use client";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

export default function ClientInfo() {
  const [appPort, setAppPort] = useState<string>("");
  const [authToken, setAuthToken] = useState<string>("");

  useEffect(() => {
    invoke<string>("get_client_app_port").then(setAppPort).catch(console.error);
    invoke<string>("get_client_auth_token")
      .then(setAuthToken)
      .catch(console.error);
  }, []);

  // Necessary because we will have to use Greet as a component later.
  return (
    <pre>
      {appPort} -{" "}
      {Buffer.from(`riot:${authToken}`, "binary").toString("base64")} -{" "}
      {authToken}
    </pre>
  );
}
