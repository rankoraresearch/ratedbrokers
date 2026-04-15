/**
 * BrokerTypeButtons — shared components for "Browse by Broker Type" section.
 *
 * Exports:
 *   BrokerTypeProvider  — context + localStorage persist
 *   useBrokerTypeConfig — hook
 *   BrokerTypeSection   — the 8-button grid (for Home.jsx)
 *   BrokerTypeDevBar    — floating DEV toolbar above the Header
 *
 * In production (non-DEV): BrokerTypeSection uses saved config from localStorage
 * or falls back to defaults. Dev bar is not rendered.
 */
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { ArrowRight, TrendingUp, BarChart3, Handshake, Target, Bitcoin, Building2, Layers, Clock } from "lucide-react";

const VERTICALS = [
  { slug: "forex",          name: "Forex Brokers",          path: "/best-forex-brokers",          icon: TrendingUp },
  { slug: "cfd",            name: "CFD Brokers",            path: "/best-cfd-brokers",            icon: BarChart3 },
  { slug: "stocks",         name: "Stock Brokers",          path: "/best-stock-brokers",          icon: Building2 },
  { slug: "crypto",         name: "Crypto Brokers",         path: "/best-crypto-brokers",         icon: Bitcoin },
  { slug: "copy-trading",   name: "Copy Trading Platforms", path: "/best-copy-trading-platforms", icon: Handshake },
  { slug: "spread-betting", name: "Spread Betting Brokers", path: "/best-spread-betting-brokers", icon: Target },
  { slug: "options",        name: "Options Brokers",        path: "/best-options-brokers",        icon: Layers },
  { slug: "futures",        name: "Futures Brokers",        path: "/best-futures-brokers",        icon: Clock },
];

const NAVY = "#0f172a";

/* ────────── SKINS ────────── */
const SKINS = {
  whiteNavy:   { label: "White",          borderColor: "#cbd5e1", edgeColor: "#0f172a", icon: "#0f172a", text: NAVY, castRGBA: "15,23,42",   baseLight: "#ffffff", baseDark: "#f1f5f9", hoverDark: "#e2e8f0", activeTop: "#e2e8f0", activeBot: "#f1f5f9" },
  steelNavy:   { label: "Cool Steel",     borderColor: "#94a3b8", edgeColor: "#1e293b", icon: "#1e293b", text: NAVY, castRGBA: "15,23,42",   baseLight: "#f8fafc", baseDark: "#e2e8f0", hoverDark: "#cbd5e1", activeTop: "#cbd5e1", activeBot: "#e2e8f0" },
  whiteGreen:  { label: "White · Green",  borderColor: "#059669", edgeColor: "#047857", icon: "#059669", text: NAVY, castRGBA: "5,150,105",  baseLight: "#ffffff", baseDark: "#f1f5f9", hoverDark: "#ecfdf5", activeTop: "#ecfdf5", activeBot: "#d1fae5" },
  ivoryGreen:  { label: "Ivory",          borderColor: "#059669", edgeColor: "#065f46", icon: "#047857", text: NAVY, castRGBA: "5,150,105",  baseLight: "#fefdf8", baseDark: "#faf9f4", hoverDark: "#f0fdf4", activeTop: "#f0fdf4", activeBot: "#dcfce7" },
  forestDeep:  { label: "Forest",         borderColor: "#065f46", edgeColor: "#064e3b", icon: "#065f46", text: NAVY, castRGBA: "6,95,70",    baseLight: "#ffffff", baseDark: "#f0fdf4", hoverDark: "#dcfce7", activeTop: "#dcfce7", activeBot: "#bbf7d0" },
  mintFresh:   { label: "Mint",           borderColor: "#10b981", edgeColor: "#059669", icon: "#10b981", text: NAVY, castRGBA: "16,185,129", baseLight: "#ffffff", baseDark: "#ecfdf5", hoverDark: "#d1fae5", activeTop: "#d1fae5", activeBot: "#a7f3d0" },
  sageWarm:    { label: "Sage",           borderColor: "#16a34a", edgeColor: "#15803d", icon: "#15803d", text: NAVY, castRGBA: "22,163,74",  baseLight: "#fafaf0", baseDark: "#f5f5e8", hoverDark: "#ecfccb", activeTop: "#ecfccb", activeBot: "#d9f99d" },
  jadeSoft:    { label: "Jade",           borderColor: "#059669", edgeColor: "#047857", icon: "#047857", text: NAVY, castRGBA: "5,150,105",  baseLight: "#f7fee7", baseDark: "#ecfccb", hoverDark: "#d9f99d", activeTop: "#d9f99d", activeBot: "#bef264" },
  whiteOrange: { label: "White · Orange", borderColor: "#f59e0b", edgeColor: "#d97706", icon: "#d97706", text: NAVY, castRGBA: "245,158,11", baseLight: "#ffffff", baseDark: "#f8fafc", hoverDark: "#fff7ed", activeTop: "#fff7ed", activeBot: "#ffedd5" },
  peachOrange: { label: "Peach",          borderColor: "#f59e0b", edgeColor: "#b45309", icon: "#b45309", text: NAVY, castRGBA: "245,158,11", baseLight: "#fffbf5", baseDark: "#fef3e7", hoverDark: "#fde4c5", activeTop: "#fed7aa", activeBot: "#fdba74" },
};
const SKIN_GROUPS = [
  { name: "Navy",   keys: ["whiteNavy", "steelNavy"] },
  { name: "Green",  keys: ["whiteGreen", "ivoryGreen", "forestDeep", "mintFresh", "sageWarm", "jadeSoft"] },
  { name: "Orange", keys: ["whiteOrange", "peachOrange"] },
];

const baseGrad = (s, state) => {
  if (state === "hover")  return `linear-gradient(180deg, ${s.baseLight} 0%, ${s.hoverDark} 100%)`;
  if (state === "active") return `linear-gradient(180deg, ${s.activeTop} 0%, ${s.activeBot} 100%)`;
  return `linear-gradient(180deg, ${s.baseLight} 0%, ${s.baseDark} 100%)`;
};
const rgbFromHex = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
};

const R = [1.0, 0.82, 0.65, 0.5, 0.38, 0.28];

/* ────────── PACKS (4) ────────── */
const RIBBONS = {
  forex: `<path d='M0,12 Q60,2 120,12 T240,12' opacity='${R[0]}'/><path d='M0,19 Q60,9 120,19 T240,19' opacity='${R[1]}'/><path d='M0,26 Q60,16 120,26 T240,26' opacity='${R[2]}'/><path d='M0,33 Q60,43 120,33 T240,33' opacity='${R[3]}'/><path d='M0,40 Q60,50 120,40 T240,40' opacity='${R[4]}'/><path d='M0,47 Q60,57 120,47 T240,47' opacity='${R[5]}'/>`,
  cfd: `<g transform='rotate(10 120 28)'><path d='M-40,10 Q60,0 160,10 T320,10' opacity='${R[0]}'/><path d='M-40,20 Q60,10 160,20 T320,20' opacity='${R[1]}'/><path d='M-40,30 Q60,20 160,30 T320,30' opacity='${R[2]}'/><path d='M-40,40 Q60,30 160,40 T320,40' opacity='${R[3]}'/><path d='M-40,50 Q60,40 160,50 T320,50' opacity='${R[4]}'/></g>`,
  stocks: `<path d='M-10,22 Q120,-4 250,22' opacity='${R[0]}'/><path d='M-10,28 Q120,6 250,28' opacity='${R[1]}'/><path d='M-10,34 Q120,14 250,34' opacity='${R[2]}'/><path d='M-10,40 Q120,22 250,40' opacity='${R[3]}'/><path d='M-10,46 Q120,30 250,46' opacity='${R[4]}'/><path d='M-10,52 Q120,38 250,52' opacity='${R[5]}'/>`,
  crypto: `<g transform='rotate(20 120 28)' opacity='0.7'><path d='M-80,14 Q60,4 200,14 T440,14' opacity='${R[1]}'/><path d='M-80,28 Q60,18 200,28 T440,28' opacity='${R[2]}'/><path d='M-80,42 Q60,32 200,42 T440,42' opacity='${R[3]}'/></g><g transform='rotate(-20 120 28)' opacity='0.7'><path d='M-80,14 Q60,4 200,14 T440,14' opacity='${R[1]}'/><path d='M-80,28 Q60,18 200,28 T440,28' opacity='${R[2]}'/><path d='M-80,42 Q60,32 200,42 T440,42' opacity='${R[3]}'/></g>`,
  "copy-trading": `<path d='M0,8 Q60,-2 120,8 T240,8' opacity='${R[0]}'/><path d='M0,14 Q60,4 120,14 T240,14' opacity='${R[1]}'/><path d='M0,20 Q60,10 120,20 T240,20' opacity='${R[2]}'/><line x1='0' y1='28' x2='240' y2='28' opacity='0.2' stroke-dasharray='3,3'/><path d='M240,36 Q180,46 120,36 T0,36' opacity='${R[2]}'/><path d='M240,42 Q180,52 120,42 T0,42' opacity='${R[1]}'/><path d='M240,48 Q180,58 120,48 T0,48' opacity='${R[0]}'/>`,
  "spread-betting": `<path d='M0,28 Q120,60 240,58' opacity='${R[0]}'/><path d='M0,28 Q120,50 240,44' opacity='${R[1]}'/><path d='M0,28 Q120,40 240,32' opacity='${R[2]}'/><path d='M0,28 L240,28' opacity='${R[3]}'/><path d='M0,28 Q120,16 240,24' opacity='${R[2]}'/><path d='M0,28 Q120,6 240,12' opacity='${R[1]}'/><path d='M0,28 Q120,-4 240,-2' opacity='${R[0]}'/><circle cx='0' cy='28' r='2' fill='currentColor' stroke='none' opacity='0.5'/>`,
  options: `<path d='M0,8 Q120,28 240,8' opacity='${R[0]}'/><path d='M0,16 Q120,28 240,16' opacity='${R[1]}'/><path d='M0,22 Q120,28 240,22' opacity='${R[2]}'/><line x1='0' y1='28' x2='240' y2='28' opacity='0.15' stroke-dasharray='2,4'/><path d='M0,34 Q120,28 240,34' opacity='${R[2]}'/><path d='M0,40 Q120,28 240,40' opacity='${R[1]}'/><path d='M0,48 Q120,28 240,48' opacity='${R[0]}'/>`,
  futures: `<path d='M0,52 Q80,42 160,30 T240,6' opacity='${R[0]}'/><path d='M0,58 Q80,48 160,36 T240,12' opacity='${R[1]}'/><path d='M0,46 Q80,36 160,24 T240,0' opacity='${R[1]}'/><path d='M0,40 Q80,30 160,18 T240,-6' opacity='${R[2]}'/><path d='M0,34 Q80,24 160,12 T240,-12' opacity='${R[3]}'/><circle cx='40' cy='46' r='1.3' fill='currentColor' stroke='none' opacity='0.5'/><circle cx='120' cy='30' r='1.3' fill='currentColor' stroke='none' opacity='0.5'/><circle cx='200' cy='14' r='1.3' fill='currentColor' stroke='none' opacity='0.5'/>`,
};

const waves = (n, yStart, yStep, amp) => {
  const paths = [];
  for (let i = 0; i < n; i++) {
    const y = yStart + i * yStep;
    const o = Math.max(0.15, 1 - Math.abs((i - n / 2) / (n / 2)) * 0.85);
    const dir = i % 2 === 0 ? 1 : -1;
    paths.push(`<path d='M0,${y} Q60,${y - amp * dir} 120,${y} T240,${y}' opacity='${o.toFixed(2)}'/>`);
  }
  return paths.join("");
};

const FILAMENT = {
  forex: waves(14, 4, 3.4, 5),
  cfd: `<g transform='rotate(10 120 28)'><g>${waves(16, -5, 3.3, 5)}</g></g>`,
  stocks: `<path d='M-20,18 Q120,-6 260,18' opacity='0.4'/><path d='M-20,20 Q120,-3 260,20' opacity='0.5'/><path d='M-20,22 Q120,0 260,22' opacity='0.6'/><path d='M-20,24 Q120,3 260,24' opacity='0.7'/><path d='M-20,26 Q120,6 260,26' opacity='0.8'/><path d='M-20,28 Q120,9 260,28' opacity='0.9'/><path d='M-20,30 Q120,12 260,30'/><path d='M-20,32 Q120,15 260,32' opacity='0.9'/><path d='M-20,34 Q120,18 260,34' opacity='0.8'/><path d='M-20,36 Q120,21 260,36' opacity='0.7'/><path d='M-20,38 Q120,24 260,38' opacity='0.6'/><path d='M-20,40 Q120,27 260,40' opacity='0.5'/><path d='M-20,42 Q120,30 260,42' opacity='0.4'/><path d='M-20,44 Q120,33 260,44' opacity='0.35'/>`,
  crypto: `<g transform='rotate(20 120 28)' opacity='0.6'>${waves(12, 6, 3.5, 6)}</g><g transform='rotate(-20 120 28)' opacity='0.6'>${waves(12, 6, 3.5, 6)}</g>`,
  "copy-trading": `${waves(6, 6, 2.8, 4)}<line x1='0' y1='28' x2='240' y2='28' opacity='0.2' stroke-dasharray='2,3'/><g transform='translate(0,56) scale(1,-1)'>${waves(6, 6, 2.8, 4)}</g>`,
  "spread-betting": `<path d='M0,28 Q120,2 240,-4' opacity='0.35'/><path d='M0,28 Q120,8 240,4' opacity='0.45'/><path d='M0,28 Q120,14 240,10' opacity='0.55'/><path d='M0,28 Q120,18 240,15' opacity='0.65'/><path d='M0,28 Q120,22 240,20' opacity='0.75'/><path d='M0,28 Q120,24 240,24' opacity='0.85'/><path d='M0,28 Q120,26 240,26' opacity='0.95'/><path d='M0,28 L240,28'/><path d='M0,28 Q120,30 240,30' opacity='0.95'/><path d='M0,28 Q120,32 240,32' opacity='0.85'/><path d='M0,28 Q120,34 240,36' opacity='0.75'/><path d='M0,28 Q120,38 240,41' opacity='0.65'/><path d='M0,28 Q120,42 240,46' opacity='0.55'/><path d='M0,28 Q120,48 240,52' opacity='0.45'/><path d='M0,28 Q120,54 240,60' opacity='0.35'/><circle cx='0' cy='28' r='2.5' fill='currentColor' stroke='none' opacity='0.6'/>`,
  options: `<path d='M0,4 Q120,28 240,4' opacity='0.4'/><path d='M0,8 Q120,28 240,8' opacity='0.5'/><path d='M0,12 Q120,28 240,12' opacity='0.6'/><path d='M0,16 Q120,28 240,16' opacity='0.7'/><path d='M0,20 Q120,28 240,20' opacity='0.8'/><path d='M0,24 Q120,28 240,24' opacity='0.9'/><line x1='0' y1='28' x2='240' y2='28' opacity='0.2'/><path d='M0,32 Q120,28 240,32' opacity='0.9'/><path d='M0,36 Q120,28 240,36' opacity='0.8'/><path d='M0,40 Q120,28 240,40' opacity='0.7'/><path d='M0,44 Q120,28 240,44' opacity='0.6'/><path d='M0,48 Q120,28 240,48' opacity='0.5'/><path d='M0,52 Q120,28 240,52' opacity='0.4'/>`,
  futures: `<path d='M0,56 Q80,46 160,34 T240,10' opacity='0.35'/><path d='M0,52 Q80,42 160,30 T240,6' opacity='0.45'/><path d='M0,48 Q80,38 160,26 T240,2' opacity='0.55'/><path d='M0,44 Q80,34 160,22 T240,-2' opacity='0.65'/><path d='M0,40 Q80,30 160,18 T240,-6' opacity='0.75'/><path d='M0,36 Q80,26 160,14 T240,-10' opacity='0.85'/><path d='M0,32 Q80,22 160,10 T240,-14' opacity='0.95'/><path d='M0,28 Q80,18 160,6 T240,-18'/><path d='M0,24 Q80,14 160,2 T240,-22' opacity='0.85'/><path d='M0,20 Q80,10 160,-2 T240,-26' opacity='0.7'/><path d='M0,16 Q80,6 160,-6 T240,-30' opacity='0.5'/><path d='M0,12 Q80,2 160,-10 T240,-34' opacity='0.35'/>`,
};

const ROSETTE = {
  forex: `<g transform='translate(120,28)'><ellipse rx='28' ry='10' opacity='${R[0]}'/><ellipse rx='22' ry='8' opacity='${R[1]}' transform='rotate(15)'/><ellipse rx='22' ry='8' opacity='${R[1]}' transform='rotate(-15)'/><ellipse rx='14' ry='5' opacity='${R[2]}'/><ellipse rx='8' ry='3' opacity='${R[3]}'/></g><path d='M0,10 Q60,6 120,10 T240,10' opacity='${R[4]}'/><path d='M0,46 Q60,42 120,46 T240,46' opacity='${R[4]}'/>`,
  cfd: `<g transform='translate(120,28)'><path d='M-24,-14 Q0,0 24,-14' opacity='${R[0]}'/><path d='M-24,14 Q0,0 24,14' opacity='${R[0]}'/><path d='M-18,-10 Q0,0 18,-10' opacity='${R[2]}'/><path d='M-18,10 Q0,0 18,10' opacity='${R[2]}'/><path d='M-12,-6 Q0,0 12,-6' opacity='${R[4]}'/><path d='M-12,6 Q0,0 12,6' opacity='${R[4]}'/></g><path d='M0,6 L240,6' opacity='${R[5]}'/><path d='M0,50 L240,50' opacity='${R[5]}'/>`,
  stocks: `<g transform='translate(120,28)'><circle r='22' opacity='${R[0]}'/><circle r='17' opacity='${R[1]}'/><circle r='12' opacity='${R[2]}'/><circle r='7' opacity='${R[3]}'/><circle r='3' fill='currentColor' stroke='none' opacity='0.4'/></g><path d='M0,8 Q60,2 120,8 T240,8' opacity='${R[4]}'/><path d='M0,48 Q60,42 120,48 T240,48' opacity='${R[4]}'/>`,
  crypto: `<g transform='translate(120,28)'><polygon points='0,-22 19,-11 19,11 0,22 -19,11 -19,-11' opacity='${R[0]}'/><polygon points='0,-16 14,-8 14,8 0,16 -14,8 -14,-8' opacity='${R[1]}'/><polygon points='0,-10 9,-5 9,5 0,10 -9,5 -9,-5' opacity='${R[2]}'/><circle r='3' fill='currentColor' stroke='none' opacity='0.4'/></g><path d='M0,28 L40,28' opacity='${R[4]}'/><path d='M200,28 L240,28' opacity='${R[4]}'/>`,
  "copy-trading": `<g transform='translate(120,28)'><circle cx='-14' r='14' opacity='${R[0]}'/><circle cx='14' r='14' opacity='${R[0]}'/><circle cx='-14' r='9' opacity='${R[1]}'/><circle cx='14' r='9' opacity='${R[1]}'/><circle cx='-14' r='4' opacity='${R[2]}'/><circle cx='14' r='4' opacity='${R[2]}'/></g><path d='M0,28 L60,28' opacity='${R[4]}' stroke-dasharray='2,3'/><path d='M180,28 L240,28' opacity='${R[4]}' stroke-dasharray='2,3'/>`,
  "spread-betting": `<g transform='translate(120,28)'><g opacity='${R[0]}'><line x1='-22' y1='0' x2='22' y2='0'/><line x1='-20' y1='-11' x2='20' y2='11'/><line x1='-11' y1='-19' x2='11' y2='19'/><line x1='0' y1='-22' x2='0' y2='22'/><line x1='11' y1='-19' x2='-11' y2='19'/><line x1='20' y1='-11' x2='-20' y2='11'/></g><circle r='14' opacity='${R[1]}'/><circle r='8' opacity='${R[2]}'/><circle r='3' fill='currentColor' stroke='none' opacity='0.5'/></g>`,
  options: `<g transform='translate(120,28)'><path d='M-30,0 Q0,-14 30,0 Q0,14 -30,0 Z' opacity='${R[0]}'/><path d='M-24,0 Q0,-10 24,0 Q0,10 -24,0 Z' opacity='${R[1]}'/><path d='M-18,0 Q0,-7 18,0 Q0,7 -18,0 Z' opacity='${R[2]}'/><path d='M-10,0 Q0,-4 10,0 Q0,4 -10,0 Z' opacity='${R[3]}'/><circle r='2' fill='currentColor' stroke='none' opacity='0.5'/></g><path d='M0,28 L60,28' opacity='${R[5]}'/><path d='M180,28 L240,28' opacity='${R[5]}'/>`,
  futures: `<g transform='translate(120,28)'><rect x='-28' y='-10' width='56' height='20' opacity='${R[0]}' rx='2'/><rect x='-22' y='-8' width='44' height='16' opacity='${R[1]}' rx='2'/><rect x='-16' y='-6' width='32' height='12' opacity='${R[2]}' rx='2'/><rect x='-8' y='-3' width='16' height='6' opacity='${R[3]}' rx='1'/><line x1='-20' y1='0' x2='20' y2='0' opacity='0.3' stroke-dasharray='2,2'/></g><path d='M0,8 L40,8' opacity='${R[5]}'/><path d='M200,8 L240,8' opacity='${R[5]}'/><path d='M0,48 L40,48' opacity='${R[5]}'/><path d='M200,48 L240,48' opacity='${R[5]}'/>`,
};

const WEAVE = {
  forex: `<g transform='rotate(12 120 28)' opacity='0.65'><path d='M-40,14 Q60,4 160,14 T320,14' opacity='${R[0]}'/><path d='M-40,22 Q60,12 160,22 T320,22' opacity='${R[1]}'/><path d='M-40,30 Q60,20 160,30 T320,30' opacity='${R[2]}'/><path d='M-40,38 Q60,28 160,38 T320,38' opacity='${R[3]}'/></g><g transform='rotate(-12 120 28)' opacity='0.65'><path d='M-40,14 Q60,4 160,14 T320,14' opacity='${R[0]}'/><path d='M-40,22 Q60,12 160,22 T320,22' opacity='${R[1]}'/><path d='M-40,30 Q60,20 160,30 T320,30' opacity='${R[2]}'/><path d='M-40,38 Q60,28 160,38 T320,38' opacity='${R[3]}'/></g>`,
  cfd: `<g transform='rotate(25 120 28)' opacity='0.6'><path d='M-80,14 Q60,4 200,14 T440,14' opacity='${R[1]}'/><path d='M-80,28 Q60,18 200,28 T440,28' opacity='${R[2]}'/><path d='M-80,42 Q60,32 200,42 T440,42' opacity='${R[3]}'/></g><g transform='rotate(-25 120 28)' opacity='0.6'><path d='M-80,14 Q60,4 200,14 T440,14' opacity='${R[1]}'/><path d='M-80,28 Q60,18 200,28 T440,28' opacity='${R[2]}'/><path d='M-80,42 Q60,32 200,42 T440,42' opacity='${R[3]}'/></g>`,
  stocks: `<g opacity='0.7'><path d='M-10,22 Q120,-4 250,22' opacity='${R[0]}'/><path d='M-10,28 Q120,2 250,28' opacity='${R[1]}'/><path d='M-10,34 Q120,8 250,34' opacity='${R[2]}'/></g><g transform='translate(0,56) scale(1,-1)' opacity='0.7'><path d='M-10,22 Q120,-4 250,22' opacity='${R[0]}'/><path d='M-10,28 Q120,2 250,28' opacity='${R[1]}'/><path d='M-10,34 Q120,8 250,34' opacity='${R[2]}'/></g>`,
  crypto: `<g transform='rotate(40 120 28)' opacity='0.55'><path d='M-100,14 Q60,4 220,14 T480,14' opacity='${R[1]}'/><path d='M-100,28 Q60,18 220,28 T480,28' opacity='${R[2]}'/><path d='M-100,42 Q60,32 220,42 T480,42' opacity='${R[3]}'/></g><g transform='rotate(-40 120 28)' opacity='0.55'><path d='M-100,14 Q60,4 220,14 T480,14' opacity='${R[1]}'/><path d='M-100,28 Q60,18 220,28 T480,28' opacity='${R[2]}'/><path d='M-100,42 Q60,32 220,42 T480,42' opacity='${R[3]}'/></g>`,
  "copy-trading": `<g opacity='0.7'><path d='M0,14 Q60,4 120,14 T240,14' opacity='${R[1]}'/><path d='M0,28 Q60,18 120,28 T240,28' opacity='${R[2]}'/><path d='M0,42 Q60,32 120,42 T240,42' opacity='${R[1]}'/></g><g transform='rotate(90 120 28)' opacity='0.5'><path d='M-100,14 Q60,4 220,14 T480,14' opacity='${R[2]}'/><path d='M-100,28 Q60,18 220,28 T480,28' opacity='${R[3]}'/><path d='M-100,42 Q60,32 220,42 T480,42' opacity='${R[4]}'/></g>`,
  "spread-betting": `<g opacity='0.7'><path d='M0,28 Q120,56 240,50'/><path d='M0,28 Q120,48 240,40' opacity='${R[1]}'/><path d='M0,28 Q120,40 240,30' opacity='${R[2]}'/><path d='M0,28 Q120,20 240,20' opacity='${R[1]}'/><path d='M0,28 Q120,10 240,8'/></g><g opacity='0.6'><path d='M240,28 Q120,56 0,50'/><path d='M240,28 Q120,48 0,40' opacity='${R[1]}'/><path d='M240,28 Q120,40 0,30' opacity='${R[2]}'/><path d='M240,28 Q120,20 0,20' opacity='${R[1]}'/><path d='M240,28 Q120,10 0,8'/></g>`,
  options: `<g opacity='0.7'><path d='M0,12 Q120,28 240,12' opacity='${R[0]}'/><path d='M0,20 Q120,28 240,20' opacity='${R[2]}'/><path d='M0,36 Q120,28 240,36' opacity='${R[2]}'/><path d='M0,44 Q120,28 240,44' opacity='${R[0]}'/></g><g transform='rotate(90 120 28)' opacity='0.45'><path d='M-80,12 Q60,28 200,12' opacity='${R[1]}'/><path d='M-80,44 Q60,28 200,44' opacity='${R[1]}'/></g>`,
  futures: `<g opacity='0.7'><path d='M0,52 Q80,42 160,30 T240,6' opacity='${R[0]}'/><path d='M0,46 Q80,36 160,24 T240,0' opacity='${R[1]}'/><path d='M0,40 Q80,30 160,18 T240,-6' opacity='${R[2]}'/></g><g opacity='0.55'><path d='M0,6 Q80,16 160,28 T240,52' opacity='${R[2]}'/><path d='M0,0 Q80,10 160,22 T240,46' opacity='${R[3]}'/></g>`,
};

const PACKS = {
  ribbons:  { label: "Ribbons",  source: RIBBONS },
  filament: { label: "Filament", source: FILAMENT },
  rosette:  { label: "Rosette",  source: ROSETTE },
  weave:    { label: "Weave",    source: WEAVE },
};

const collectionSurface = (slug, packKey) => (s, state) => {
  const rgb = rgbFromHex(s.edgeColor);
  const alpha = state === "hover" ? 0.32 : 0.22;
  const strokeWidth = packKey === "filament" ? 0.3 : 0.5;
  const inner = PACKS[packKey].source[slug] || "";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='56' viewBox='0 0 240 56'><g fill='none' stroke='rgba(${rgb},${alpha})' stroke-width='${strokeWidth}' stroke-linecap='round' stroke-linejoin='round' color='rgb(${rgb})'>${inner}</g></svg>`;
  const offset = state === "hover" ? 4 : 0;
  return {
    image: `url("data:image/svg+xml;utf8,${svg}"), ${baseGrad(s, state)}`,
    size: "240px 56px, 100% 100%",
    repeat: "repeat-x, no-repeat",
    position: `${offset}px center, 0 0`,
  };
};

/* ────────── Unified finishes ────────── */
const TEXTURES = {
  none: { label: "None", surface: (s, state) => ({ image: baseGrad(s, state) }) },
  f1: {
    label: "F1 · Guilloche",
    surface: (s, state) => {
      const rgb = rgbFromHex(s.edgeColor);
      const alpha = state === "hover" ? 0.26 : 0.18;
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='56' viewBox='0 0 240 56'><g fill='none' stroke='rgba(${rgb},${alpha})' stroke-width='0.4'><path d='M0,28 Q60,8 120,28 T240,28'/><path d='M0,28 Q60,12 120,28 T240,28'/><path d='M0,28 Q60,16 120,28 T240,28'/><path d='M0,28 Q60,20 120,28 T240,28'/><path d='M0,28 Q60,36 120,28 T240,28' opacity='0.6'/><path d='M0,28 Q60,40 120,28 T240,28' opacity='0.4'/></g></svg>`;
      return { image: `url("data:image/svg+xml;utf8,${svg}"), ${baseGrad(s, state)}`, size: "240px 56px, 100% 100%", repeat: "repeat-x, no-repeat", position: state === "hover" ? "4px center, 0 0" : "0 center, 0 0" };
    },
  },
  f2: {
    label: "F2 · Brushed",
    surface: (s, state) => {
      const a = state === "hover" ? 0.10 : 0.06, b = state === "hover" ? 0.05 : 0.03;
      const brush = `repeating-linear-gradient(90deg, rgba(15,23,42,0) 0px, rgba(15,23,42,${a}) 1px, rgba(15,23,42,0) 2px, rgba(15,23,42,${b}) 3px, rgba(15,23,42,0) 4px)`;
      const spot = `radial-gradient(ellipse 70% 55% at 50% 35%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.2) 45%, transparent 70%)`;
      return { image: `${spot}, ${brush}, ${baseGrad(s, state)}`, blend: "screen, normal, normal" };
    },
  },
  f7: {
    label: "F7 · Glass",
    surface: (s, state) => {
      const eX = state === "hover" ? 95 : 80, eY = state === "hover" ? 70 : 60;
      const dome = `radial-gradient(ellipse ${eX}% ${eY}% at 50% -18%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.45) 30%, transparent 60%)`;
      const top = `linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 45%, transparent 100%)`;
      return { image: `${top}, ${dome}, ${baseGrad(s, state)}`, blend: "screen, screen, normal" };
    },
  },
};
const TEXTURE_KEYS = ["none", "f1", "f2", "f7"];

/* ════════════════════════════════════════════════════════════
   SECTION BACKGROUNDS — фон за кнопками
   + tone: "light" | "dark" — подсказывает, какие скины работают
   ════════════════════════════════════════════════════════════ */
const BACKGROUNDS = {
  /* ── LIGHT BRIDGES ── */
  white:    { label: "White",     tone: "light", style: { background: "#ffffff" } },
  soft:     { label: "Soft",      tone: "light", style: { background: "#f8fafc" } },
  slate:    { label: "Slate",     tone: "light", style: { background: "#eef2f7" } },
  cream:    { label: "Cream",     tone: "light", style: { background: "#fefdf8" } },
  stripe:   {
    label: "Stripe", tone: "light",
    style: {
      background: "#f8fafc",
      backgroundImage: "repeating-linear-gradient(135deg, rgba(5,150,105,0.045) 0 1px, transparent 1px 14px)",
    },
  },
  paper:    {
    label: "Paper", tone: "light",
    style: {
      background: "#fafaf9",
      backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.06  0 0 0 0 0.09  0 0 0 0 0.16  0 0 0 0.04 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
    },
  },

  /* ── ACCENTED LIGHT ── */
  shelf:    {
    label: "Shelf", tone: "light",
    style: { background: "#f8fafc", boxShadow: "inset 0 3px 0 #0f172a, inset 0 5px 0 #059669" },
  },
  gradient: {
    label: "Gradient", tone: "light",
    style: { background: "linear-gradient(180deg, #ffffff 0%, #e2e8f0 100%)" },
  },

  /* ── DARK BRIDGES (Barbara pick + variations) ── */
  navyBridge: {
    label: "Navy Bridge", tone: "dark",
    style: {
      background: "linear-gradient(180deg, #0f172a 0%, #111d36 55%, #0f172a 72%, #ffffff 100%)",
      borderTop: "1px solid rgba(255,255,255,0.06)",
    },
  },
  premiumDark: {
    label: "Premium Dark", tone: "dark",
    style: {
      background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
      backgroundImage:
        "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px), linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
      borderTop: "1px solid rgba(255,255,255,0.06)",
    },
  },
  split: {
    label: "Split", tone: "dark",
    style: {
      background: "linear-gradient(180deg, #0f172a 0%, #0f172a 38%, #f8fafc 62%, #ffffff 100%)",
      borderTop: "1px solid rgba(255,255,255,0.06)",
    },
  },
  navySolid: {
    label: "Navy", tone: "dark",
    style: {
      background: "#0f172a",
      backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 12px)",
      borderTop: "1px solid rgba(255,255,255,0.06)",
    },
  },
};
const BG_GROUPS = [
  { name: "Light",   keys: ["white", "soft", "slate", "cream", "stripe", "paper"] },
  { name: "Accent",  keys: ["shelf", "gradient"] },
  { name: "Dark",    keys: ["navyBridge", "premiumDark", "split", "navySolid"] },
];

/* ════════════════════════════════════════════════════════════
   BRAND INVARIANTS (Barbara analysis) — shared across all 5 renderers
   Сверка с Primary Orange + Secondary Green + .link-green
   ════════════════════════════════════════════════════════════ */
const MOTION = {
  brand:  { dur: "0.25s", ease: "cubic-bezier(0.4, 0, 0.2, 1)", arrowDur: "0.15s", arrowEase: "ease" },
  snappy: { dur: "0.15s", ease: "ease",                          arrowDur: "0.12s", arrowEase: "ease" },
  gentle: { dur: "0.35s", ease: "cubic-bezier(0.4, 0, 0.2, 1)", arrowDur: "0.2s",  arrowEase: "ease" },
};
const SHADOW_FAMILY = {
  neutral: { rest: "0 2px 8px rgba(15,23,42,0.06)",  hover: "0 8px 24px rgba(15,23,42,0.12)" },
  glow:    { rest: "0 2px 8px rgba(5,150,105,0.15)", hover: "0 8px 24px rgba(5,150,105,0.28)" },
  none:    { rest: "none",                            hover: "none" },
};
const LIFT = {
  none:    "none",
  subtle:  "translateY(-1px)",  // brand default
  medium:  "translateY(-2px)",
};

/* ════════════════════════════════════════════════════════════
   CONTEXT + STORAGE
   ════════════════════════════════════════════════════════════ */
const DEFAULT = {
  skin: "whiteGreen",
  shape: "rounded",
  edge: 3,
  texture: "f1",
  mode: "collection",
  pack: "ribbons",
  showArrow: true,
  bg: "soft",
  style: "unified",       // unified | convex | glass | tile | pill
  motion: "brand",        // brand | snappy | gentle
  shadowFam: "neutral",   // neutral | glow | none
  lift: "subtle",         // none | subtle | medium
  showQuickLinks: false,  // Quick Links pill strip above the 8 buttons (dev toggle)
  frame: "editorial",     // section framing: none | editorial | inset | darkFrame | cream
  // ── Architectural knobs (Barbara round 4) ──
  cadence:  "standard",   // vertical cadence: compact | standard | expansive | monumental
  header:   "fieldLabel", // header variant (non-Editorial): fieldLabel | numeric | tagline | range | silent
  meta:     "off",        // bottom meta strip: off | credentials | counters | process
  anchor:   "compact",    // Editorial left anchor: compact | full | numbered
  accent:   "warm",       // orange accent intensity: off | subtle | warm | bold
};

/* Barbara-curated knob mappings */
const CADENCE = { compact: 56, standard: 96, expansive: 128, monumental: 160 };

const HEADER_OVERLINES = {
  fieldLabel: { overline: "By broker type",         kicker: null },
  numeric:    { overline: "Section 02 · Browse",    kicker: null },
  tagline:    { overline: "Eight verticals. One standard.", kicker: null },
  range:      { overline: "01 — 08",                kicker: null },
  silent:     null,
};

const META_CONTENT = {
  off:         null,
  credentials: "Independent · Verified by licensing registries · Updated Q2 2026",
  counters:    "51 brokers tested · 293 rankings · 8 verticals",
  process:     "Methodology → Testing → Expert review → Publication",
};

/* Preset combos — единый язык за один клик */
const PRESETS = [
  { id: "prod",           label: "★ Production",      patch: { style: "unified", bg: "soft",        skin: "whiteGreen", motion: "brand",  shadowFam: "neutral", lift: "subtle", showArrow: true  } },
  { id: "hero-match",     label: "Hero Match",        patch: { style: "glass",   bg: "premiumDark", skin: "whiteGreen", motion: "brand",  shadowFam: "neutral", lift: "subtle", showArrow: true  } },
  { id: "howwerate-match",label: "How-We-Rate Match", patch: { style: "tile",    bg: "premiumDark", skin: "whiteGreen", motion: "brand",  shadowFam: "none",    lift: "subtle", showArrow: true  } },
  { id: "minimal-nav",    label: "Minimal Nav",       patch: { style: "pill",    bg: "soft",        skin: "whiteNavy",  motion: "snappy", shadowFam: "none",    lift: "subtle", showArrow: false } },
  { id: "convex-light",   label: "Convex Light",      patch: { style: "convex",  bg: "soft",        skin: "whiteGreen", motion: "brand",  shadowFam: "neutral", lift: "subtle", showArrow: false } },
  { id: "editorial-authority", label: "★ Editorial Authority",
    patch: { style: "unified", frame: "editorial", rhythm: "3+3+2", cadence: "expansive", anchor: "full", meta: "credentials", showArrow: true } },
];
const LS_KEY = "rb-broker-types-config-v2";
const BrokerTypeContext = createContext({ cfg: DEFAULT, set: () => {} });

export function BrokerTypeProvider({ children }) {
  const [cfg, setCfg] = useState(() => {
    if (typeof window === "undefined") return DEFAULT;
    try {
      const raw = window.localStorage.getItem(LS_KEY);
      if (raw) return { ...DEFAULT, ...JSON.parse(raw) };
    } catch {}
    return DEFAULT;
  });
  useEffect(() => {
    try { window.localStorage.setItem(LS_KEY, JSON.stringify(cfg)); } catch {}
  }, [cfg]);
  const set = (patch) => setCfg(prev => ({ ...prev, ...patch }));
  return <BrokerTypeContext.Provider value={{ cfg, set }}>{children}</BrokerTypeContext.Provider>;
}

export const useBrokerTypeConfig = () => useContext(BrokerTypeContext);

/* ════════════════════════════════════════════════════════════
   BUTTON + SECTION
   ════════════════════════════════════════════════════════════ */
function ConvexBtn({ v, cfg }) {
  const IconCmp = v.icon;
  const s = SKINS[cfg.skin] || SKINS.whiteGreen;
  const radius = cfg.shape === "pill" ? 999 : 12;
  const edgeDepth = cfg.edge;
  const surfaceFn = cfg.mode === "collection" ? collectionSurface(v.slug, cfg.pack) : TEXTURES[cfg.texture].surface;

  const rest   = surfaceFn(s, "rest");
  const hover  = surfaceFn(s, "hover");
  const active = surfaceFn(s, "active");

  const applyBg = (el, layer) => {
    el.style.backgroundImage    = layer.image;
    el.style.backgroundSize     = layer.size     || "100% 100%";
    el.style.backgroundPosition = layer.position || "0 0";
    el.style.backgroundRepeat   = layer.repeat   || "no-repeat";
    el.style.backgroundBlendMode = layer.blend   || "normal";
  };

  const hardEdge       = `0 ${edgeDepth}px 0 ${s.edgeColor}`;
  const hardEdgeHover  = `0 ${edgeDepth + 1}px 0 ${s.edgeColor}`;
  const hardEdgeActive = `0 1px 0 ${s.edgeColor}`;
  const cast           = `rgba(${s.castRGBA},0.14)`;
  const castHover      = `rgba(${s.castRGBA},0.28)`;

  const restShadow   = `inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(15,23,42,0.04), ${hardEdge},  0 ${edgeDepth + 3}px ${edgeDepth * 2 + 10}px ${cast}`;
  const hoverShadow  = `inset 0 1px 0 rgba(255,255,255,1),    inset 0 -1px 0 rgba(15,23,42,0.05), ${hardEdgeHover}, 0 ${edgeDepth + 6}px ${edgeDepth * 3 + 16}px ${castHover}`;
  const activeShadow = `inset 0 1px 0 rgba(255,255,255,0.7),  inset 0 -1px 0 rgba(15,23,42,0.06), ${hardEdgeActive}, 0 2px 6px rgba(15,23,42,0.10)`;

  return (
    <Link to={v.path}
      ref={el => { if (el) applyBg(el, rest); }}
      style={{
        display: "flex", alignItems: "center",
        justifyContent: cfg.showArrow ? "space-between" : "center",
        gap: 10, padding: "16px 20px",
        border: `1.5px solid ${s.borderColor}`,
        borderRadius: radius,
        color: s.text, textDecoration: "none",
        fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15,
        letterSpacing: "-0.01em", textAlign: "center",
        boxShadow: restShadow,
        transition: "box-shadow 0.25s, transform 0.1s, background-position 0.6s ease-out",
        cursor: "pointer", minHeight: 56,
        userSelect: "none", overflow: "hidden", position: "relative",
      }}
      onMouseEnter={e => { applyBg(e.currentTarget, hover);  e.currentTarget.style.boxShadow = hoverShadow;  e.currentTarget.style.transform = "translateY(-1px)"; const ar = e.currentTarget.querySelector(".bt-arr"); if (ar) ar.style.transform = "translateX(3px)"; }}
      onMouseLeave={e => { applyBg(e.currentTarget, rest);   e.currentTarget.style.boxShadow = restShadow;   e.currentTarget.style.transform = "none"; const ar = e.currentTarget.querySelector(".bt-arr"); if (ar) ar.style.transform = "none"; }}
      onMouseDown={e => { applyBg(e.currentTarget, active);  e.currentTarget.style.boxShadow = activeShadow; e.currentTarget.style.transform = `translateY(${edgeDepth}px)`; }}
      onMouseUp={e   => { applyBg(e.currentTarget, hover);   e.currentTarget.style.boxShadow = hoverShadow;  e.currentTarget.style.transform = "translateY(-1px)"; }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
        <IconCmp size={18} color={s.icon} strokeWidth={2} style={{ flexShrink: 0 }} />
        <span>{v.name}</span>
      </span>
      {cfg.showArrow && <ArrowRight className="bt-arr" size={16} color={s.icon} strokeWidth={2.25} style={{ flexShrink: 0, transition: "transform 0.2s", position: "relative", zIndex: 1 }} />}
    </Link>
  );
}

/* ──────────────── UNIFIED (Barbara's brand-invariant recipe) ────────────────
   Ровно тот же motion/shadow/radius/lift/arrow, что у Primary и Secondary CTA. */
function UnifiedBtn({ v, cfg }) {
  const IconCmp = v.icon;
  const s = SKINS[cfg.skin] || SKINS.whiteGreen;
  const m = MOTION[cfg.motion] || MOTION.brand;
  const sh = SHADOW_FAMILY[cfg.shadowFam] || SHADOW_FAMILY.neutral;
  const liftPx = LIFT[cfg.lift] || LIFT.subtle;
  const accent = s.edgeColor;
  const accentHover = s.edgeColor === "#059669" ? "#047857" : s.edgeColor;

  return (
    <Link to={v.path}
      style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        padding: "14px 18px", minHeight: 52,
        background: "#ffffff",
        border: "1.5px solid #e2e8f0",
        borderLeft: `3px solid ${accent}`,
        borderRadius: cfg.shape === "pill" ? 999 : 10,
        boxShadow: sh.rest,
        color: NAVY, textDecoration: "none",
        fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15,
        letterSpacing: "-0.01em",
        transition: `all ${m.dur} ${m.ease}`,
        cursor: "pointer",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "#cbd5e1";
        e.currentTarget.style.borderLeftColor = accentHover;
        e.currentTarget.style.boxShadow = sh.hover;
        e.currentTarget.style.transform = liftPx;
        const ic = e.currentTarget.querySelector(".u-ic");
        if (ic) ic.style.color = accentHover;
        const ar = e.currentTarget.querySelector(".u-arr");
        if (ar) { ar.style.color = accent; ar.style.transform = "translateX(3px)"; }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "#e2e8f0";
        e.currentTarget.style.borderLeftColor = accent;
        e.currentTarget.style.boxShadow = sh.rest;
        e.currentTarget.style.transform = "none";
        const ic = e.currentTarget.querySelector(".u-ic");
        if (ic) ic.style.color = accent;
        const ar = e.currentTarget.querySelector(".u-arr");
        if (ar) { ar.style.color = "#94a3b8"; ar.style.transform = "none"; }
      }}
    >
      <IconCmp className="u-ic" size={18} color={accent} strokeWidth={1.75}
        style={{ flexShrink: 0, transition: `color ${m.arrowDur} ${m.arrowEase}` }} />
      <span style={{ flex: 1 }}>{v.name}</span>
      {cfg.showArrow && (
        <ArrowRight className="u-arr" size={14} color="#94a3b8" strokeWidth={2.25}
          style={{ flexShrink: 0, transition: `transform ${m.arrowDur} ${m.arrowEase}, color ${m.arrowDur} ${m.arrowEase}` }} />
      )}
    </Link>
  );
}

/* ──────────────── GLASS (Hero-match) ────────────────
   Frosted-glass с цветным left-border. Авто-адаптируется под light/dark фон. */
function GlassBtn({ v, cfg }) {
  const IconCmp = v.icon;
  const s = SKINS[cfg.skin] || SKINS.whiteGreen;
  const accent = s.edgeColor;
  const rgb = rgbFromHex(accent);
  const dark = BACKGROUNDS[cfg.bg]?.tone === "dark";

  // tone-aware tokens
  const baseInk   = dark ? "255,255,255" : "15,23,42";
  const text      = dark ? "#f8fafc"     : NAVY;
  const bgRest    = `rgba(${baseInk},${dark ? 0.08 : 0.04})`;
  const bgHover   = `rgba(${baseInk},${dark ? 0.13 : 0.08})`;
  const borderRest  = `rgba(${baseInk},${dark ? 0.14 : 0.10})`;
  const borderHover = `rgba(${baseInk},${dark ? 0.24 : 0.18})`;
  const arrowRest   = dark ? "rgba(255,255,255,0.35)" : "#94a3b8";
  const shadowRest  = dark ? "0 1px 3px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)"
                           : "0 2px 8px rgba(15,23,42,0.06)";
  const shadowHover = dark ? `0 4px 16px rgba(0,0,0,0.35), -2px 0 10px rgba(${rgb},0.20), inset 0 1px 0 rgba(255,255,255,0.1)`
                           : `0 8px 24px rgba(15,23,42,0.12), -2px 0 10px rgba(${rgb},0.18)`;

  return (
    <Link to={v.path}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "0 18px", height: 52,
        background: bgRest,
        backdropFilter: "blur(10px)",
        borderTop:    `1px solid ${borderRest}`,
        borderRight:  `1px solid ${borderRest}`,
        borderBottom: `1px solid ${borderRest}`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: 10, boxShadow: shadowRest,
        textDecoration: "none", transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = bgHover;
        e.currentTarget.style.borderTopColor = borderHover;
        e.currentTarget.style.borderRightColor = borderHover;
        e.currentTarget.style.borderBottomColor = borderHover;
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = shadowHover;
        const a = e.currentTarget.querySelector(".gl-arr");
        if (a) { a.style.color = accent; a.style.transform = "translateX(3px)"; }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = bgRest;
        e.currentTarget.style.borderTopColor = borderRest;
        e.currentTarget.style.borderRightColor = borderRest;
        e.currentTarget.style.borderBottomColor = borderRest;
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = shadowRest;
        const a = e.currentTarget.querySelector(".gl-arr");
        if (a) { a.style.color = arrowRest; a.style.transform = "none"; }
      }}
    >
      <IconCmp size={17} strokeWidth={1.75} style={{ color: accent, flexShrink: 0, opacity: 0.9 }} />
      <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, color: text, flex: 1, letterSpacing: "-0.01em" }}>{v.name}</span>
      <span className="gl-arr" style={{ fontSize: 14, color: arrowRest, transition: "color 0.15s ease, transform 0.15s ease", fontWeight: 700 }}>→</span>
    </Link>
  );
}

/* ──────────────── TILE (How-We-Rate match) ────────────────
   Translucent card + orange icon-box. Tone-adaptive. */
function TileBtn({ v, cfg }) {
  const IconCmp = v.icon;
  const dark = BACKGROUNDS[cfg.bg]?.tone === "dark";
  const baseInk = dark ? "255,255,255" : "15,23,42";
  const text = dark ? "#fff" : NAVY;
  const arrowRest = dark ? "rgba(255,255,255,0.45)" : "#94a3b8";
  const bgRest = dark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.025)";
  const borderRest = dark ? "rgba(255,255,255,0.10)" : "rgba(15,23,42,0.08)";

  return (
    <Link to={v.path}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "16px 18px",
        background: bgRest,
        border: `1px solid ${borderRest}`,
        borderRadius: 10,
        textDecoration: "none",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "#f59e0b";
        e.currentTarget.style.background = "rgba(245,158,11,0.08)";
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = `0 8px 24px rgba(${baseInk},0.10)`;
        const a = e.currentTarget.querySelector(".tl-arr");
        if (a) { a.style.color = "#f59e0b"; a.style.transform = "translateX(3px)"; }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = borderRest;
        e.currentTarget.style.background = bgRest;
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
        const a = e.currentTarget.querySelector(".tl-arr");
        if (a) { a.style.color = arrowRest; a.style.transform = "none"; }
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: "rgba(245,158,11,0.12)",
        border: "1px solid rgba(245,158,11,0.28)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <IconCmp size={18} color={dark ? "#fbbf24" : "#d97706"} strokeWidth={1.75} />
      </div>
      <span style={{ flex: 1, fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, color: text, letterSpacing: "-0.01em" }}>{v.name}</span>
      <span className="tl-arr" style={{ fontSize: 14, color: arrowRest, transition: "color 0.15s ease, transform 0.15s ease", fontWeight: 700 }}>→</span>
    </Link>
  );
}

/* ──────────────── PILL (Minimal Nav) ────────────────
   Белая pill + 1.5px navy border. Стиль Filter pills из RankingPage. */
function PillBtn({ v, cfg }) {
  const IconCmp = v.icon;
  return (
    <Link to={v.path}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
        padding: "12px 18px", minHeight: 48,
        background: "#ffffff",
        border: "1.5px solid #0f172a",
        borderRadius: 999,
        color: NAVY, textDecoration: "none",
        fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14,
        letterSpacing: "-0.01em", textAlign: "center",
        transition: "all 0.15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = NAVY;
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.transform = "translateY(-1px)";
        const ic = e.currentTarget.querySelector(".pi-ic");
        if (ic) ic.style.color = "#fff";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "#fff";
        e.currentTarget.style.color = NAVY;
        e.currentTarget.style.transform = "none";
        const ic = e.currentTarget.querySelector(".pi-ic");
        if (ic) ic.style.color = NAVY;
      }}
    >
      <IconCmp className="pi-ic" size={16} color={NAVY} strokeWidth={2} style={{ flexShrink: 0, transition: "color 0.15s" }} />
      <span>{v.name}</span>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════
   FRAMES — architectural containers (Barbara round 3)
   Дают секции роль, не декор. 4 структурных приёма + none.
   ══════════════════════════════════════════════════════════════ */

function buttonGridEl(Renderer, cfg, mob) {
  const key = `${cfg.skin}-${cfg.shape}-${cfg.edge}-${cfg.mode}-${cfg.pack}-${cfg.texture}-${cfg.showArrow}-${cfg.bg}-${cfg.style}-${cfg.frame}`;
  // Locked: 4×2 desktop, 2×4 mobile
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: mob ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
      gap: mob ? 8 : 12,
    }}>
      {VERTICALS.map(item => <Renderer key={`${item.slug}-${key}`} v={item} cfg={cfg} />)}
    </div>
  );
}

/* ──────────── ACCENT INTENSITY — оранжевые acенты во фреймах ──────────── */
const ACCENT = {
  off:    { line: "transparent",       halo: "0 0 0 transparent",                text: "#64748b", bar: 0, barColor: "transparent" },
  subtle: { line: "rgba(245,158,11,0.25)", halo: "0 8px 24px rgba(245,158,11,0.05)", text: "#d97706", bar: 0, barColor: "transparent" },
  warm:   { line: "rgba(245,158,11,0.5)",  halo: "0 10px 32px rgba(245,158,11,0.08)", text: "#d97706", bar: 2, barColor: "#f59e0b" },
  bold:   { line: "#f59e0b",               halo: "0 16px 40px rgba(245,158,11,0.15)", text: "#d97706", bar: 3, barColor: "#f59e0b" },
};

/* ────────── Meta Strip — footer под grid'ом ────────── */
function MetaStrip({ cfg, dark = false }) {
  const content = META_CONTENT[cfg.meta];
  if (!content) return null;
  return (
    <div style={{
      marginTop: 20,
      fontSize: 13, lineHeight: 1.5,
      color: dark ? "rgba(255,255,255,0.55)" : "#64748b",
      fontFamily: "'Outfit',sans-serif", fontWeight: 500,
      letterSpacing: "0.01em",
    }}>
      {content}
    </div>
  );
}

/* ────────── Header (non-Editorial) ────────── */
function FrameHeader({ cfg, accent = "#64748b", marginBottom }) {
  const h = HEADER_OVERLINES[cfg.header];
  if (!h) return null;
  return (
    <div style={{
      fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
      color: accent, fontWeight: 700, marginBottom: marginBottom ?? 24,
      fontFamily: "'Outfit',sans-serif",
    }}>
      {h.overline}
    </div>
  );
}

/* ────────── Editorial Left Anchor ────────── */
function EditorialAnchor({ cfg }) {
  if (cfg.anchor === "numbered") {
    return (
      <div style={{ borderLeft: "2px solid #0f172a", paddingLeft: 16 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 300, fontSize: 64, lineHeight: 1, color: NAVY, letterSpacing: "-0.04em" }}>02</div>
        <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#64748b", fontWeight: 700, marginTop: 8, fontFamily: "'Outfit',sans-serif" }}>
          Browse
        </div>
      </div>
    );
  }
  if (cfg.anchor === "full") {
    return (
      <div style={{ borderLeft: "2px solid #0f172a", paddingLeft: 16 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#64748b", fontWeight: 700, marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>
          Section 02 · Browse
        </div>
        <div style={{ fontSize: 19, lineHeight: 1.25, color: NAVY, fontWeight: 700, fontFamily: "'Outfit',sans-serif", letterSpacing: "-0.02em", marginBottom: 10 }}>
          Explore by asset class
        </div>
        <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.55, fontFamily: "'Outfit',sans-serif" }}>
          We separate brokers by what they actually trade. Start with your primary market.
        </div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(15,23,42,0.1)" }} />
          <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>8 / 8</span>
        </div>
      </div>
    );
  }
  // compact
  return (
    <div style={{ borderLeft: "2px solid #0f172a", paddingLeft: 16 }}>
      <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#64748b", fontWeight: 600, marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>
        Section 02 · Browse
      </div>
      <div style={{ fontSize: 15, lineHeight: 1.45, color: NAVY, fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>
        By broker type
      </div>
      <div style={{ fontSize: 13, color: "#64748b", marginTop: 6, lineHeight: 1.5, fontFamily: "'Outfit',sans-serif" }}>
        Eight verticals, same methodology.
      </div>
      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, height: 1, background: "rgba(15,23,42,0.1)" }} />
        <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>8 / 8</span>
      </div>
    </div>
  );
}

const padBlock = (mob, cfg) => {
  const val = CADENCE[cfg.cadence] ?? 96;
  return mob ? Math.max(24, Math.round(val * 0.6)) : val;
};

/* A — None (current behaviour, honours cfg.bg) */
function NoneFrame({ cfg, mob, grid }) {
  const bg = BACKGROUNDS[cfg.bg] || BACKGROUNDS.white;
  const pad = padBlock(mob, cfg);
  return (
    <div style={{ ...bg.style, padding: mob ? `${Math.round(pad/2)}px 16px` : `${Math.round(pad/2)}px 28px` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "0 4px" : "0 32px" }}>
        <FrameHeader cfg={cfg} marginBottom={20} />
        {grid}
        <MetaStrip cfg={cfg} />
      </div>
    </div>
  );
}

/* B — Editorial Two-Column (Barbara's top pick, WSJ/FT style) */
function EditorialFrame({ cfg, mob, grid }) {
  const pad = padBlock(mob, cfg);
  const anchorWidth = cfg.anchor === "full" ? 300 : cfg.anchor === "numbered" ? 200 : 220;
  return (
    <section style={{
      background: "#ffffff",
      borderTop: "1px solid #e2e8f0",
      padding: mob ? `${Math.round(pad*0.7)}px 16px` : `${pad}px 24px`,
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : `${anchorWidth}px 1fr`,
        gap: mob ? 24 : 48,
        alignItems: "start",
      }}>
        <EditorialAnchor cfg={cfg} />
        <div>
          {grid}
          <MetaStrip cfg={cfg} />
        </div>
      </div>
    </section>
  );
}

/* C — Inset Canvas (Linear/Stripe float) */
function InsetFrame({ cfg, mob, grid }) {
  const pad = padBlock(mob, cfg);
  return (
    <section style={{ background: "#ffffff", padding: mob ? `${Math.round(pad*0.4)}px 0` : `${Math.round(pad*0.6)}px 0` }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: mob ? "28px 16px 32px" : "40px 40px 44px",
        background: "#f8fafc",
        borderRadius: mob ? 0 : 16,
      }}>
        <FrameHeader cfg={cfg} marginBottom={mob ? 20 : 28} />
        {grid}
        <MetaStrip cfg={cfg} />
      </div>
    </section>
  );
}

/* D — Dark Frame (navy inset with orange eyebrow) */
function DarkFrame({ cfg, mob, grid }) {
  const pad = padBlock(mob, cfg);
  const h = HEADER_OVERLINES[cfg.header];
  return (
    <section style={{ background: "#ffffff", padding: mob ? `${Math.round(pad*0.5)}px 16px` : `${Math.round(pad*0.7)}px 24px` }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        background: "linear-gradient(180deg, #0f172a 0%, #0a2018 100%)",
        borderRadius: 16,
        padding: mob ? "24px 16px" : "36px 40px",
        boxShadow: "0 12px 40px rgba(15,23,42,0.12)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)",
        }} />
        <div style={{ position: "relative" }}>
          {h && (
            <div style={{
              fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
              color: "#f59e0b", fontWeight: 700, marginBottom: mob ? 20 : 28,
              fontFamily: "'Outfit',sans-serif",
            }}>
              {h.overline}
            </div>
          )}
          {grid}
          <MetaStrip cfg={cfg} dark />
        </div>
      </div>
    </section>
  );
}

/* E — Warm Cream Band (Robinhood territory) */
function CreamFrame({ cfg, mob, grid }) {
  const pad = padBlock(mob, cfg);
  const h = HEADER_OVERLINES[cfg.header];
  return (
    <section style={{
      background: "#fbf8f1",
      padding: mob ? `${Math.round(pad*0.7)}px 16px` : `${pad}px 24px`,
      borderTop: "1px solid rgba(15,23,42,0.06)",
      borderBottom: "1px solid rgba(15,23,42,0.06)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {h && (
          <div style={{
            display: "flex", alignItems: "baseline", gap: 12,
            marginBottom: mob ? 20 : 28,
          }}>
            <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#64748b", fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>
              {h.overline}
            </div>
            <div style={{ flex: 1, height: 1, background: "rgba(15,23,42,0.1)" }} />
            <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>
              8 / 8
            </div>
          </div>
        )}
        {grid}
        <MetaStrip cfg={cfg} />
      </div>
    </section>
  );
}

/* ──────────── ORANGE-THEMED FRAMES (round 5) ──────────── */

/* F — Amber Wash — тёплый диагональный gradient `#fffaf0 ↔ white` с оранжевыми hairlines */
function AmberFrame({ cfg, mob, grid }) {
  const pad = padBlock(mob, cfg);
  const ac = ACCENT[cfg.accent] || ACCENT.warm;
  return (
    <section style={{
      background: "linear-gradient(135deg, #fffaf0 0%, #ffffff 50%, #fffaf0 100%)",
      padding: mob ? `${Math.round(pad*0.7)}px 16px` : `${pad}px 24px`,
      borderTop:    `${ac.bar}px solid ${ac.barColor}`,
      borderBottom: `1px solid ${ac.line}`,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FrameHeader cfg={cfg} accent={ac.text} marginBottom={mob ? 20 : 28} />
        {grid}
        <MetaStrip cfg={cfg} />
      </div>
    </section>
  );
}

/* G — Sunrise — мягкий вертикальный gradient #fffbeb → #fef3c7 с тонкой orange линией сверху */
function SunriseFrame({ cfg, mob, grid }) {
  const pad = padBlock(mob, cfg);
  const ac = ACCENT[cfg.accent] || ACCENT.warm;
  return (
    <section style={{
      background: "linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%)",
      padding: mob ? `${Math.round(pad*0.7)}px 16px` : `${pad}px 24px`,
      borderTop:    `${ac.bar}px solid ${ac.barColor}`,
      borderBottom: `${ac.bar}px solid ${ac.barColor}`,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FrameHeader cfg={cfg} accent={ac.text} marginBottom={mob ? 20 : 28} />
        {grid}
        <MetaStrip cfg={cfg} />
      </div>
    </section>
  );
}

/* H — Gold Band — cream фон, 3px оранжевые bookends сверху и снизу */
function GoldBandFrame({ cfg, mob, grid }) {
  const pad = padBlock(mob, cfg);
  const ac = ACCENT[cfg.accent] || ACCENT.warm;
  const bar = Math.max(2, ac.bar);
  return (
    <section style={{
      background: "#fffaf0",
      padding: mob ? `${Math.round(pad*0.7)}px 16px` : `${pad}px 24px`,
      borderTop:    `${bar}px solid ${ac.barColor || "#f59e0b"}`,
      borderBottom: `${bar}px solid ${ac.barColor || "#f59e0b"}`,
      boxShadow: ac.halo,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "flex", alignItems: "baseline", gap: 12,
          marginBottom: mob ? 20 : 28,
        }}>
          {HEADER_OVERLINES[cfg.header] && (
            <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: ac.text, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>
              {HEADER_OVERLINES[cfg.header].overline}
            </div>
          )}
          <div style={{ flex: 1, height: 1, background: ac.line }} />
          <div style={{ fontSize: 11, color: ac.text, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>
            8 / 8
          </div>
        </div>
        {grid}
        <MetaStrip cfg={cfg} />
      </div>
    </section>
  );
}

/* I — Hero Echo — мини-копия Hero gradient (navy→green) с orange accents на белом page bg */
function HeroEchoFrame({ cfg, mob, grid }) {
  const pad = padBlock(mob, cfg);
  const h = HEADER_OVERLINES[cfg.header];
  return (
    <section style={{ background: "#ffffff", padding: mob ? `${Math.round(pad*0.5)}px 16px` : `${Math.round(pad*0.7)}px 24px` }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fffbeb 100%)",
        borderRadius: 16,
        padding: mob ? "24px 16px" : "36px 40px",
        border: "1px solid rgba(245,158,11,0.2)",
        boxShadow: "0 12px 40px rgba(245,158,11,0.08)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "repeating-linear-gradient(135deg, rgba(245,158,11,0.04) 0px, rgba(245,158,11,0.04) 1px, transparent 1px, transparent 14px)",
        }} />
        <div style={{ position: "relative" }}>
          {h && (
            <div style={{
              fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
              color: "#d97706", fontWeight: 700, marginBottom: mob ? 20 : 28,
              fontFamily: "'Outfit',sans-serif",
            }}>
              {h.overline}
            </div>
          )}
          {grid}
          <MetaStrip cfg={cfg} />
        </div>
      </div>
    </section>
  );
}

/* J — Orange Rail — белый фон + вертикальная 4px оранжевая полоса слева во всю высоту */
function OrangeRailFrame({ cfg, mob, grid }) {
  const pad = padBlock(mob, cfg);
  const ac = ACCENT[cfg.accent] || ACCENT.warm;
  const barW = ac.bar > 0 ? (ac.bar + 1) : 3;
  return (
    <section style={{
      background: "#ffffff",
      padding: mob ? `${Math.round(pad*0.7)}px 16px` : `${pad}px 24px`,
      position: "relative",
      borderTop: "1px solid #f1f5f9",
    }}>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: barW,
        background: `linear-gradient(180deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)`,
      }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", paddingLeft: mob ? 16 : 24 }}>
        <FrameHeader cfg={cfg} accent={ac.text} marginBottom={mob ? 20 : 28} />
        {grid}
        <MetaStrip cfg={cfg} />
      </div>
    </section>
  );
}

const FRAMES = {
  none:       { label: "None",       Wrapper: NoneFrame       },
  editorial:  { label: "Editorial",  Wrapper: EditorialFrame  },
  inset:      { label: "Inset",      Wrapper: InsetFrame      },
  darkFrame:  { label: "Dark",       Wrapper: DarkFrame       },
  cream:      { label: "Cream",      Wrapper: CreamFrame      },
  amber:      { label: "Amber",      Wrapper: AmberFrame      },
  sunrise:    { label: "Sunrise",    Wrapper: SunriseFrame    },
  goldBand:   { label: "Gold Band",  Wrapper: GoldBandFrame   },
  heroEcho:   { label: "Hero Echo",  Wrapper: HeroEchoFrame   },
  orangeRail: { label: "Orange Rail",Wrapper: OrangeRailFrame },
};
const FRAME_KEYS = Object.keys(FRAMES);

export function BrokerTypeSection() {
  const { cfg } = useBrokerTypeConfig();
  const { mob, tab } = useMedia();
  const Renderer = cfg.style === "unified" ? UnifiedBtn
                 : cfg.style === "glass"   ? GlassBtn
                 : cfg.style === "tile"    ? TileBtn
                 : cfg.style === "pill"    ? PillBtn
                 : ConvexBtn;
  const grid = buttonGridEl(Renderer, cfg, mob);
  const Wrapper = FRAMES[cfg.frame]?.Wrapper || FRAMES.none.Wrapper;
  return <Wrapper cfg={cfg} mob={mob} tab={tab} grid={grid} />;
}

/* ════════════════════════════════════════════════════════════
   DEV TOOLBAR (выше Header)
   ════════════════════════════════════════════════════════════ */
function Seg({ value, onChange, options, label, small }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      {label && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase" }}>{label}</span>}
      <div style={{ display: "inline-flex", padding: 2, borderRadius: 999, background: "#f1f5f9", border: "1px solid #e2e8f0" }}>
        {options.map(o => (
          <button key={String(o.value)} onClick={() => onChange(o.value)}
            style={{
              padding: small ? "4px 8px" : "5px 10px", borderRadius: 999, cursor: "pointer", border: "none",
              background: value === o.value ? NAVY : "transparent",
              color: value === o.value ? "#fff" : "#64748b",
              fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 11, whiteSpace: "nowrap",
            }}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}
function SkinBtn({ skinKey, active, onSelect }) {
  const s = SKINS[skinKey];
  const isActive = active === skinKey;
  const gradient = `linear-gradient(180deg, ${s.baseLight} 0%, ${s.baseDark} 100%)`;
  return (
    <button onClick={() => onSelect(skinKey)}
      title={s.label}
      style={{
        padding: "3px 8px", borderRadius: 6, cursor: "pointer",
        border: isActive ? `1.5px solid ${s.edgeColor}` : "1px solid #e2e8f0",
        background: isActive ? gradient : "#fff", backgroundImage: isActive ? gradient : undefined,
        color: NAVY,
        fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 10.5,
        display: "inline-flex", alignItems: "center", gap: 5,
        boxShadow: isActive ? `0 2px 0 ${s.edgeColor}` : "none",
      }}>
      <span style={{ width: 8, height: 8, borderRadius: 2, background: s.edgeColor, flexShrink: 0 }} />
      {s.label}
    </button>
  );
}

export function BrokerTypeDevBar() {
  const { cfg, set } = useBrokerTypeConfig();
  const ref = useRef(null);

  // Publish height as CSS var so Header shifts down
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const publish = () => {
      document.documentElement.style.setProperty("--rb-devbar-h", `${el.offsetHeight}px`);
    };
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <style>{`header { top: var(--rb-devbar-h, 0) !important; }`}</style>
      <div ref={ref}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1001,
          background: "#fff", borderBottom: "2px solid #f59e0b",
          padding: "6px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          fontFamily: "'Outfit',sans-serif",
        }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ padding: "2px 6px", background: "#f59e0b", color: NAVY, borderRadius: 3, fontSize: 10, fontWeight: 800 }}>DEV</span>
            <Seg label="Quick Links" value={cfg.showQuickLinks} onChange={v => set({ showQuickLinks: v })} options={[
              { value: true,  label: "Show" }, { value: false, label: "Hide" },
            ]} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase" }}>Frame</span>
            <div style={{ display: "inline-flex", gap: 4, flexWrap: "wrap" }}>
              {FRAME_KEYS.map(k => (
                <button key={k} onClick={() => set({ frame: k })}
                  style={{
                    padding: "4px 8px", borderRadius: 6, cursor: "pointer",
                    border: cfg.frame === k ? "1.5px solid #0f172a" : "1px solid #e2e8f0",
                    background: cfg.frame === k ? NAVY : "#fff",
                    color: cfg.frame === k ? "#fff" : "#475569",
                    fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 10.5,
                  }}>
                  {FRAMES[k].label}
                </button>
              ))}
            </div>
            <button onClick={() => set(PRESETS.find(p => p.id === "editorial-authority").patch)}
              style={{
                padding: "4px 10px", borderRadius: 6, cursor: "pointer", border: "1px solid #059669",
                background: "#fff", color: "#047857",
                fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 10.5, marginLeft: "auto",
              }}>
              ★ Editorial Authority
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", paddingTop: 4, borderTop: "1px dashed #e2e8f0" }}>
            <Seg label="Accent" value={cfg.accent} onChange={v => set({ accent: v })} options={[
              { value: "off",    label: "Off"    },
              { value: "subtle", label: "Subtle" },
              { value: "warm",   label: "Warm"   },
              { value: "bold",   label: "Bold"   },
            ]} />
            <Seg label="Cadence" value={cfg.cadence} onChange={v => set({ cadence: v })} options={[
              { value: "compact",    label: "56" },
              { value: "standard",   label: "96" },
              { value: "expansive",  label: "128" },
              { value: "monumental", label: "160" },
            ]} />
            <Seg label="Header" value={cfg.header} onChange={v => set({ header: v })} options={[
              { value: "fieldLabel", label: "Field" },
              { value: "numeric",    label: "Numeric" },
              { value: "tagline",    label: "Tagline" },
              { value: "range",      label: "Range" },
              { value: "silent",     label: "Silent" },
            ]} />
            <Seg label="Meta" value={cfg.meta} onChange={v => set({ meta: v })} options={[
              { value: "off",         label: "Off" },
              { value: "credentials", label: "Creds" },
              { value: "counters",    label: "Counts" },
              { value: "process",     label: "Process" },
            ]} />
            {cfg.frame === "editorial" && (
              <Seg label="Anchor" value={cfg.anchor} onChange={v => set({ anchor: v })} options={[
                { value: "compact",  label: "Compact" },
                { value: "full",     label: "Full" },
                { value: "numbered", label: "Numbered" },
              ]} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
