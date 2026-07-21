import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Graphite 3D — Denis Masquet, graphiste 3D généraliste";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Image de partage générée au build, aux couleurs du site.
 * Sans elle, un lien partagé sur LinkedIn ou WhatsApp s'affiche nu.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#14161a",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#ff7f50",
          }}
        >
          Graphite 3D
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 82, color: "#f2f2f0" }}>
            Denis Masquet
          </div>
          <div style={{ display: "flex", fontSize: 46, color: "#8b9199" }}>
            Graphiste 3D généraliste
          </div>
        </div>

        <div
          style={{
            display: "flex",
            borderTop: "1px solid #3c4148",
            paddingTop: "28px",
            fontSize: 26,
            color: "#f2f2f0",
          }}
        >
          Visites virtuelles 3D immersives et ultra-performantes
        </div>
      </div>
    ),
    size
  );
}
