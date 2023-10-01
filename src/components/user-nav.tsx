"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { shallow } from "zustand/shallow";
import { useStore } from "~/lib/store";

export const UserNav = () => {
  const {
    appPort,
    authToken,
    summonerInfo,
    setAppPort,
    setAuthToken,
    setSummonerInfo,
  } = useStore(
    (state) => ({
      appPort: state.appPort,
      authToken: state.authToken,
      summonerInfo: state.summonerInfo,
      setAppPort: state.setAppPort,
      setAuthToken: state.setAuthToken,
      setSummonerInfo: state.setSummonerInfo,
    }),
    shallow
  );

  const { isLoading, data } = useQuery({
    queryKey: [`summonerInfo`],
    queryFn: () => {
      fetch(`/api/summoner-info`, {
        method: "GET",
        headers: {
          "x-app-port": appPort as string,
          "x-auth-token": authToken as string,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setSummonerInfo({
            displayName: data["displayName"],
            summonerId: data["summonerId"],
            summonerLevel: data["summonerLevel"],
            profileIconId: data["profileIconId"],
          });
        })
        .catch((err) => {
          setAppPort("");
          setAuthToken("");
          console.log(err);
        });
    },
    enabled: !!appPort && !!authToken,
  });

  if (!appPort || !authToken) return null;

  return (
    <>
      <nav className="z-50 flex h-24 items-center border-b bg-background px-4 md:px-8">
        <Link className="mr-8 flex flex-row items-center gap-2" href="/">
          <Image
            src="https://raw.communitydragon.org/latest/game/assets/items/icons2d/6676_marksman_t3_thecollector.png"
            alt="logo"
            width={40}
            height={40}
          />
          <span className="text-lg font-bold tracking-tight">{}</span>
        </Link>
        {!isLoading && summonerInfo && (
          <div className="ml-auto flex items-center space-x-4">
            <span className="font-mono bg-lime-400 rounded-md px-2 text-black">
              {summonerInfo?.displayName}
            </span>
            <div className="relative">
              <div className="absolute top-[48px] right-[12px] text-black font-bold font-mono text-sm bg-lime-400 rounded-md px-1">
                {summonerInfo?.summonerLevel}
              </div>
              <Image
                src={`https://raw.communitydragon.org/latest/game/assets/ux/summonericons/profileicon${summonerInfo?.profileIconId}.png`}
                alt="logo"
                width={60}
                height={60}
                className="rounded-full border-[2px] border-lime-400"
              />
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default UserNav;
