import type { PrizeKey } from "../../context/DonationsContext";

export interface PrizeCardData {
  key: PrizeKey;
  /** Big knockout word on the sticker. */
  word: string;
  title: string;
  blurb: string;
  track: string;
  number: string;
  art: string;
  palette: { base: string; c1: string; c2: string; c3: string };
}

export const prizeCards: PrizeCardData[] = [
  {
    key: "golden",
    word: "GOLDEN",
    title: "The Golden Nut",
    blurb: "Best overall project. The build that pushes Cashu furthest forward.",
    track: "Overall",
    number: "01",
    art: "/prize-art/goldennut.png",
    palette: { base: "#ff9a00", c1: "#ffe066", c2: "#ff5e00", c3: "#fff4c2" },
  },
  {
    key: "hardest",
    word: "HARDEST",
    title: "Hardest Nut to Crack",
    blurb: "Toughest technical breakthrough, or the gnarliest bug finally fixed.",
    track: "Technical",
    number: "02",
    art: "/prize-art/hardestnut.png",
    palette: { base: "#6f8297", c1: "#eef3f8", c2: "#33475e", c3: "#ff8a3d" },
  },
  {
    key: "nuttiest",
    word: "NUTTY",
    title: "The Nuttiest Idea",
    blurb: "Wildest experimental concept. Unhinged. Actually brilliant.",
    track: "Wildcard",
    number: "03",
    art: "/prize-art/nuttiestidea.png",
    palette: { base: "#ff4d6d", c1: "#ffc300", c2: "#8f4dff", c3: "#ff8fab" },
  },
  {
    key: "design",
    word: "DESIGN",
    title: "Best Design Nut",
    blurb: "Making ecash actually usable, accessible and delightful.",
    track: "Design",
    number: "04",
    art: "/prize-art/uxnut.png",
    palette: { base: "#2f5bff", c1: "#ff4fa3", c2: "#ffd23f", c3: "#00c8ff" },
  },
  {
    key: "fresh",
    word: "FRESH",
    title: "Freshly Minted Nut",
    blurb: "Best first-time contributor. Welcome to the shell game.",
    track: "Newcomer",
    number: "05",
    art: "/prize-art/freshnut.png",
    palette: { base: "#5fb845", c1: "#e8f76a", c2: "#1fa59a", c3: "#ffb347" },
  },
];
