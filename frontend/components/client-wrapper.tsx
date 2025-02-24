"use client";

import { WagmiProvider, createConfig, http, useClient } from "wagmi";
import { sepolia, localhost } from "wagmi/chains";
import { metaMask } from "@wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NavBar from "./navbar";
import Footer from "./footer";
import { useEffect, useState } from "react";

const config = createConfig({
  chains: [sepolia, localhost],
  transports: {
    [sepolia.id]: http(
      `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`
    ),
    [localhost.id]: http("http://127.0.0.1:8545"),
  },
  connectors: [metaMask()],
});

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return;
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <NavBar />
        {children}
        <Footer />
      </WagmiProvider>
    </QueryClientProvider>
  );
}
