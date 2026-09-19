export const rra = {
  ink: "#12110F",
  ink800: "#1C1B18",
  ink700: "#2A2824",
  stone: "#6F6A62",
  rule: "#D8D2C6",
  bone: "#F4F1EA",
  paper: "#FAF7F1",
  brass: "#C5A572",
  brassLight: "#D4B88A",
  brassDeep: "#6E5428",
  recovered: "#2F5A40",
  recoveredSoft: "#E3EDE6",
  leak: "#8F2E28",
  leakSoft: "#F3E4E2",
} as const;

export const rraRgb = {
  ink: "18, 17, 15",
  ink800: "28, 27, 24",
  ink700: "42, 40, 36",
  stone: "111, 106, 98",
  rule: "216, 210, 198",
  bone: "244, 241, 234",
  paper: "250, 247, 241",
  brass: "197, 165, 114",
  brassLight: "212, 184, 138",
  brassDeep: "110, 84, 40",
  recovered: "47, 90, 64",
  recoveredSoft: "227, 237, 230",
  leak: "143, 46, 40",
  leakSoft: "243, 228, 226",
} as const;

export const fonts = {
  display: "Newsreader",
  displayFallback: "Libre Baskerville",
  body: "Source Sans 3",
  bodyFallback: "Source Sans Pro",
  mono: "Source Code Pro",
  canvaDisplay: "Newsreader",
  canvaDisplayAlt: "Libre Baskerville",
  canvaBody: "Source Sans 3",
  canvaBodyAlt: "Source Sans Pro",
} as const;

export type RraColor = keyof typeof rra;
