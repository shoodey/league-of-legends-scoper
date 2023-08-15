"use client";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

export default function ClientInfo() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    invoke<string>("greet", { name: "Johnny" })
      .then(setMessage)
      .catch(console.error);
  }, []);

  // Necessary because we will have to use Greet as a component later.
  return <>{message}</>;
}
