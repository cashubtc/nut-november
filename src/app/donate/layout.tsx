import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate to Nut November",
  description: "Send sats to the Nut November 2026 prize pool.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
