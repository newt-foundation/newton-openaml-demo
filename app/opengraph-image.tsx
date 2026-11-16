import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Link preview, 1200 × 630, rendered by next/og (satori).
 *
 * One message and one picture: the promise on the left, OpenAML's four tiers
 * on the right with Fraud matched and "Transfer blocked" under it. Every
 * number is the real count from index/manifest.json, and the copy must stay
 * true of the deployed policy (policy/openaml).
 *
 * Satori rules: every element with more than one child needs display: flex,
 * and anything with a width and padding needs boxSizing: "border-box".
 * Inter comes from the @fontsource/inter package (satori reads woff, not
 * woff2), so the build never depends on a CDN. The image is prerendered at
 * build time. If the files are missing, next/og's default font is used.
 * Weights 400 and 500 only.
 */

export const alt =
  "Newton Protocol × FINOS OpenAML: check a wallet before you pay it. Address labels from OpenAML, enforced by Newton Protocol.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Dark theme, matching the page: black, off-white text, brand-red glow.
const INK = "#FEFDF9";
const MUTED = "#A1A1A6";
const HAIR = "#2A2A2D";
const FIELD = "#1A1A1C";
const RED = "#F2896B";
const EDGE = "#E0552E";
const TINT = "rgba(159, 54, 25, 0.35)";
const GOLD = "#D6B376";

const LOGO_A =
  "M9.88853 0.248964C10.4764 -0.0829879 11.1963 -0.0829879 11.7842 0.248964L20.7229 5.31822C21.3068 5.64518 21.6698 6.26209 21.6728 6.93199V17.0685C21.6698 17.7384 21.3068 18.3543 20.7229 18.6823L11.7842 23.7495C11.1963 24.0835 10.4764 24.0835 9.88853 23.7495L0.949858 18.6803C0.365945 18.3523 0.00299955 17.7364 0 17.0665V6.92799C0.0039994 6.25909 0.365945 5.64318 0.949858 5.31622L9.88853 0.248964ZM10.5504 1.57277L1.48778 16.9845C1.42279 17.0975 1.42379 17.2365 1.48978 17.3475C1.55577 17.4595 1.67775 17.5274 1.80773 17.5244H19.929C20.058 17.5254 20.179 17.4575 20.244 17.3465C20.309 17.2345 20.31 17.0965 20.245 16.9845L11.1863 1.57277C11.1193 1.46079 10.9984 1.3918 10.8674 1.3918C10.7364 1.3918 10.6154 1.46079 10.5484 1.57277H10.5504ZM15.4277 12.1152C15.4277 14.6209 13.364 16.6486 10.8124 16.6486C8.26277 16.6486 6.19708 14.6209 6.19708 12.1152C6.19708 9.6116 8.26277 7.58389 10.8124 7.58389C13.364 7.58389 15.4297 9.6116 15.4297 12.1152H15.4277ZM8.91267 13.669C8.91267 13.753 8.94667 13.833 9.00566 13.892C9.06565 13.951 9.14664 13.984 9.23062 13.983H12.3942C12.4781 13.984 12.5591 13.951 12.6191 13.892C12.6791 13.834 12.7131 13.753 12.7141 13.669V10.5615C12.7141 10.3895 12.5721 10.2495 12.3962 10.2495H9.23062C9.05265 10.2495 8.91267 10.3895 8.91267 10.5615V13.669Z";
const LOGO_B =
  "M29.9959 3.00044H32.7435L41.6722 15.7546V3.00244H44.6317V20.9998H41.8841L32.9555 8.24968V21.0018H29.9959V3.00044ZM49.1411 8.51964C50.1269 7.95972 51.2587 7.68376 52.5326 7.68376C53.8044 7.68376 54.9622 7.93973 55.948 8.45365C56.9339 8.96958 57.7118 9.69947 58.2777 10.6393C58.8436 11.5792 59.1376 12.687 59.1536 13.9548C59.1536 14.2988 59.1276 14.6507 59.0736 15.0107H48.9671V15.1647C49.0371 16.3145 49.405 17.2224 50.0669 17.8903C50.7308 18.5582 51.6107 18.8941 52.7125 18.8941C53.5844 18.8941 54.3163 18.6942 54.9122 18.2902C55.5041 17.8863 55.898 17.3164 56.09 16.5805H58.9176C58.6916 17.8863 57.9857 19.0601 56.9379 19.872C55.8661 20.7279 54.5263 21.1578 52.9185 21.1578C51.5247 21.1578 50.3049 20.8778 49.267 20.3219C48.2532 19.789 47.4163 18.9711 46.8594 17.9703C46.2915 16.9584 46.0095 15.7846 46.0095 14.4468C46.0095 13.107 46.2835 11.9051 46.8334 10.8853C47.3833 9.86544 48.1512 9.07556 49.1371 8.51964H49.1411ZM55.1122 10.7293C54.4563 10.1894 53.6324 9.91944 52.6365 9.91944C51.7127 9.91944 50.9128 10.1974 50.2409 10.7533C49.569 11.3092 49.1811 12.0531 49.0751 12.977H56.274C56.154 12.0171 55.7661 11.2692 55.1102 10.7273L55.1122 10.7293ZM62.0811 7.83574L65.1467 17.9143L68.2102 7.83574H70.8018L73.7354 17.9143L76.9049 7.83574H79.7845L75.3332 20.9998H72.2976L69.47 12.0531L66.5385 20.9998L63.4749 21.0258L59.1036 7.83574H62.0871H62.0831H62.0811ZM83.8159 4.16028V7.83574H87.0614V10.2754H83.8159V17.1424C83.8159 17.6563 83.9199 18.0203 84.1298 18.2342C84.3378 18.4482 84.6958 18.5562 85.2037 18.5562H87.3514V20.9978H84.6278C83.352 20.9978 82.4281 20.7059 81.8522 20.1239C81.2783 19.542 80.9883 18.6422 80.9883 17.4243V4.15828H83.8159V4.16028ZM88.4312 17.9543C87.8653 16.9344 87.5813 15.7546 87.5813 14.4188C87.5813 13.079 87.8653 11.9291 88.4312 10.9093C88.9871 9.90044 89.823 9.07356 90.8388 8.52964C91.8787 7.96572 93.0685 7.68176 94.4143 7.68176C95.7581 7.68176 96.9499 7.96172 97.9878 8.52964C99.0256 9.09356 99.8275 9.88744 100.395 10.9093C100.963 11.9291 101.245 13.099 101.245 14.4188C101.245 15.7386 100.961 16.9344 100.395 17.9543C99.8415 18.9611 99.0046 19.783 97.9878 20.3179C96.9479 20.8738 95.7561 21.1538 94.4123 21.1538C93.0685 21.1538 91.8767 20.8738 90.8388 20.3179C89.822 19.783 88.9851 18.9611 88.4312 17.9543ZM98.3697 14.4208C98.3697 13.135 98.0058 12.0851 97.2819 11.2712C96.556 10.4554 95.6021 10.0474 94.4143 10.0474C93.2245 10.0474 92.2746 10.4554 91.5607 11.2712C90.8428 12.0851 90.4849 13.135 90.4849 14.4208C90.4849 15.7066 90.8448 16.7544 91.5607 17.5703C92.2766 18.3842 93.2285 18.7921 94.4143 18.7921C95.6001 18.7921 96.556 18.3842 97.2819 17.5703C98.0058 16.7544 98.3677 15.7066 98.3677 14.4208H98.3697ZM115.071 13.7509V21.0018H112.218V13.9049C112.218 12.653 111.948 11.7012 111.406 11.0513C110.864 10.3994 110.07 10.0754 109.024 10.0754C107.906 10.0754 107.03 10.4574 106.393 11.2212C105.755 11.9831 105.437 13.033 105.437 14.3708V21.0038H102.609V7.83574H105.071L105.385 9.55949C106.399 8.30767 107.828 7.68376 109.68 7.68376C111.268 7.68376 112.566 8.16369 113.567 9.12355C114.571 10.0834 115.073 11.6252 115.073 13.7529L115.071 13.7509Z";

const svgData = async (file: string) => {
  try {
    return "data:image/svg+xml;base64," + (await readFile(join(process.cwd(), "public", file))).toString("base64");
  } catch {
    return undefined;
  }
};

const FONT_FILE = (w: number) => join(process.cwd(), "node_modules/@fontsource/inter/files", `inter-latin-${w}-normal.woff`);

async function loadInter() {
  try {
    const weights = [400, 500] as const;
    const data = await Promise.all(weights.map((w) => readFile(FONT_FILE(w))));
    const fonts: { name: string; data: Buffer; weight: 400 | 500; style: "normal" }[] = weights.map((weight, i) => ({ name: "Inter", data: data[i], weight, style: "normal" as const }));
    // The headline's display face. If it cannot be read, the headline falls back to Inter.
    try {
      fonts.push({ name: "GT Sectra Fine", data: await readFile(join(process.cwd(), "app/gt-sectra-fine-regular.woff")), weight: 400, style: "normal" });
    } catch {}
    return fonts;
  } catch {
    return undefined;
  }
}

const SAND = "#D6B376";

/** A list in the rule, as on the page: red when it blocks. */
function Pill({ name, on }: { name: string; on?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 46,
        padding: "0 16px",
        borderRadius: 23,
        marginRight: 8,
        fontSize: 19,
        fontWeight: 500,
        color: on ? INK : MUTED,
        background: on ? "rgba(159,54,25,0.2)" : "rgba(0,0,0,0)",
        border: `1.5px solid ${on ? "rgba(254,253,249,0.22)" : "rgba(254,253,249,0.14)"}`,
      }}
    >
      <div style={{ width: 10, height: 10, borderRadius: 5, marginRight: 10, background: on ? "#E0552E" : "rgba(0,0,0,0)", border: `2px solid ${on ? "#E0552E" : "#5A5A5E"}` }} />
      {name}
    </div>
  );
}

// The globe, drawn simply: a lit sphere, a few bright and sand dots, the scan ring, four callouts.
const G = 380;
const DOTS: [number, number, number, boolean][] = [
  [92, 118, 7, true], [258, 92, 6, true], [300, 228, 7, true], [150, 268, 9, true], [210, 170, 5, true],
  [120, 190, 3, false], [180, 110, 3, false], [240, 150, 3, false], [270, 290, 3, false], [100, 250, 3, false],
  [200, 310, 3, false], [160, 60, 3, false], [320, 170, 3, false], [60, 170, 3, false], [230, 240, 3, false],
  [140, 140, 3, false], [290, 120, 3, false], [190, 220, 3, false], [110, 310, 3, false], [250, 330, 3, false],
];

function Callout({ name, count, left, top, right, blocked }: { name: string; count: string; left?: number; right?: number; top: number; blocked?: boolean }) {
  return (
    <div style={{ position: "absolute", top, ...(left !== undefined ? { left } : { right }), display: "flex", flexDirection: "column", alignItems: left !== undefined ? "flex-start" : "flex-end" }}>
      <div style={{ display: "flex", alignItems: "baseline", fontSize: 17, fontWeight: 500, color: INK }}>
        {name}
        <span style={{ marginLeft: 8, fontWeight: 400, color: MUTED }}>{count}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 6, flexDirection: left !== undefined ? "row" : "row-reverse" }}>
        <div style={{ width: 92, height: 1, background: "rgba(254,253,249,0.3)" }} />
        <div style={{ width: 9, height: 9, borderRadius: 5, background: blocked ? "#E0552E" : "#010101", border: `1.5px solid ${blocked ? "#E0552E" : "rgba(254,253,249,0.5)"}` }} />
      </div>
    </div>
  );
}

export default async function OpengraphImage() {
  const [fonts, finosIcon, finosWord] = await Promise.all([loadInter(), svgData("finos-icon-white.svg"), svgData("finos-wordmark-white.svg")]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#010101",
          backgroundImage: "radial-gradient(circle at 76% 56%, rgba(254,253,249,0.09) 0%, rgba(254,253,249,0.03) 30%, rgba(0,0,0,0) 56%)",
          padding: "60px 76px",
          boxSizing: "border-box",
          fontFamily: fonts ? "Inter" : undefined,
        }}
      >
        {/* The nav lockup: Newton | FINOS OpenAML */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="134" height="28" viewBox="0 0 115.073 24" fill="none">
            <path d={LOGO_A} fill={INK} />
            <path d={LOGO_B} fill={INK} />
          </svg>
          <div style={{ width: 1, height: 30, background: "rgba(254,253,249,0.22)", margin: "0 22px" }} />
          {finosIcon && <img src={finosIcon} width={18} height={30} alt="" />}
          {finosWord ? <img src={finosWord} width={73} height={16.5} alt="" style={{ marginLeft: 10 }} /> : <span style={{ fontSize: 24, fontWeight: 500, color: INK }}>FINOS</span>}
          <span style={{ fontSize: 23, color: INK, marginLeft: 12 }}>OpenAML</span>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", width: 570 }}>
            <div style={{ display: "flex", flexDirection: "column", fontSize: 78, lineHeight: 1.04, fontWeight: 400, color: INK, letterSpacing: -1.5, fontFamily: fonts ? "GT Sectra Fine, Inter" : undefined }}>
              <span>Check a wallet</span>
              <span>before you pay it.</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", fontSize: 21, lineHeight: 1.45, color: MUTED, marginTop: 24 }}>
              <span>Screened against 364,486 wallets labeled by OpenAML.</span>
              <span>Signed by Newton Protocol operators.</span>
            </div>
            <div style={{ display: "flex", fontSize: 17, fontWeight: 500, color: MUTED, marginTop: 36 }}>Block if the wallet is</div>
            <div style={{ display: "flex", marginTop: 12 }}>
              <Pill name="Sanctioned" on />
              <Pill name="Blocked" on />
              <Pill name="Fraud" on />
              <Pill name="Flagged" />
            </div>
          </div>

          <div style={{ position: "relative", display: "flex", width: 440, height: 440, alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                position: "relative",
                display: "flex",
                width: G,
                height: G,
                borderRadius: G / 2,
                border: "1px solid rgba(254,253,249,0.1)",
                backgroundImage: "radial-gradient(circle at 34% 30%, rgba(254,253,249,0.09) 0%, rgba(254,253,249,0.03) 55%, rgba(0,0,0,0) 100%)",
              }}
            >
              {DOTS.map(([x, y, r, bright], i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: x - r / 2,
                    top: y - r / 2,
                    width: r,
                    height: r,
                    borderRadius: r,
                    background: bright ? "#E0552E" : INK,
                    opacity: bright ? 1 : 0.4,
                    ...(bright ? { boxShadow: "0 0 12px rgba(224,85,46,0.7)" } : null),
                  }}
                />
              ))}
              <div style={{ position: "absolute", left: 70, top: 222, width: 240, height: 130, borderRadius: "50%", border: `2px solid ${INK}`, opacity: 0.6 }} />
            </div>
            <Callout name="Sanctioned" count="182" left={-30} top={36} blocked />
            <Callout name="Blocked" count="564" right={-30} top={36} blocked />
            <Callout name="Fraud" count="576" left={-30} top={362} blocked />
            <Callout name="Flagged" count="363,271" right={-30} top={362} />
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
