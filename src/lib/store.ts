import { Store } from "tauri-plugin-store-api";
import { create } from "zustand";
import { z } from "zod";

const tauriStore = new Store(".settings.dat");

interface SummonerInfo {
  displayName: string;
  summonerId: string;
  summonerLevel: number;
  profileIconId: number;
}

interface SettingsStore {
  // Summoner Info
  summonerInfo: SummonerInfo | null;
  setSummonerInfo: (summonerInfo: SummonerInfo) => void;

  // Client Info
  appPort: string | null;
  authToken: string | null;
  setAppPort: (appPort: string) => Promise<void>;
  setAuthToken: (authToken: string) => Promise<void>;
  _hydrated: boolean;
}

export const useStore = create<SettingsStore>()((set) => ({
  // Summoner Info
  summonerInfo: null,
  setSummonerInfo: (summonerInfo) => set({ summonerInfo }),

  // Client Info
  appPort: null,
  authToken: null,
  setAppPort: async (appPort: string) => {
    set({ appPort });
    await tauriStore.set("appPort", appPort);
    await tauriStore.save();
  },
  setAuthToken: async (authToken: string) => {
    set({ authToken });
    await tauriStore.set("authToken", authToken);
    await tauriStore.save();
  },
  _hydrated: false,
}));

const hydrate = async () => {
  const appPort = await tauriStore.get("appPort");
  const authToken = await tauriStore.get("authToken");

  const parsedAppPort = z.string().nonempty().safeParse(appPort);
  const parsedAuthToken = z.string().nonempty().safeParse(authToken);

  if (parsedAppPort.success) {
    useStore.setState({ appPort: parsedAppPort.data });
  }

  if (parsedAuthToken.success) {
    useStore.setState({ authToken: parsedAuthToken.data });
  }

  useStore.setState({ _hydrated: true });
};

hydrate();
