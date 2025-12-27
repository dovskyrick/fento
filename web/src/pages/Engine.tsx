import { useNavigate } from "react-router-dom";

export default function Engine() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#0b0b10",
        color: "white",
        position: "relative",
        fontFamily: "system-ui, sans-serif",
        display: "grid",
        placeItems: "center",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.08)",
          color: "white",
          cursor: "pointer",
        }}
      >
        ← Exterior
      </button>

      <div style={{ textAlign: "center", opacity: 0.92 }}>
        <div style={{ fontSize: 28, fontWeight: 700 }}>Engineering CV</div>
        <div style={{ marginTop: 8, opacity: 0.75 }}>
          Placeholder page (we’ll build the room / UI next)
        </div>
      </div>
    </div>
  );
}
