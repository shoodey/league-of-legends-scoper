"use client";

import { invoke } from "@tauri-apps/api";
import { shallow } from "zustand/shallow";
import { Button } from "~/components/ui/button";
import { useStore } from "~/lib/store";

export default function Home() {
  const { appPort, authToken, setAppPort, setAuthToken } = useStore(
    (state) => ({
      appPort: state.appPort,
      authToken: state.authToken,
      setAppPort: state.setAppPort,
      setAuthToken: state.setAuthToken,
    }),
    shallow
  );

  const getClientData = () => {
    invoke("get_client_data").then((data) => {
      const values = data as string[];
      setAppPort(values[0]);
      setAuthToken(values[1]);
    });
  };

  if (!appPort || !authToken) {
    return (
      <div className="flex items-center flex-col flex-1 min-h-full justify-center gap-4">
        <p className="text-xl text-red-400">
          Please make sure League of Legends is running...
        </p>
        <Button variant="destructive" onClick={getClientData}>
          Refresh Client
        </Button>
      </div>
    );
  }

  return (
    <div>
      <p>
        Riot LCU Running on: <code>https://127.0.0.1:{appPort}</code>
      </p>
      <p>
        Authorization header: <code>Basic {btoa(`riot:${authToken}`)}</code>
      </p>
      <Button variant="default" onClick={getClientData}>
        Refresh Client
      </Button>
    </div>
  );
}
