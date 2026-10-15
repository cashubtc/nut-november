import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a project to Nut November",
  description: "Send in your Nut November 2026 project.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
