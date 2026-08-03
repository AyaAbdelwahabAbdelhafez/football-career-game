import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import FootballCareerV2 from "./App.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("Football Career — unexpected error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            fontFamily: "'Tajawal', system-ui, sans-serif",
            color: "#EAF0F7",
            background: "#101827",
            border: "1px solid #23304a",
            borderRadius: 16,
            padding: 24,
            maxWidth: 380,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>حدث خطأ غير متوقع</div>
          <div style={{ fontSize: 12.5, color: "#8B97AC", marginBottom: 16 }}>
            حاول إعادة تحميل الصفحة. إذا استمرت المشكلة، يمكنك بدء مسيرة جديدة من الإعدادات.
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "linear-gradient(90deg, #E4B94B, #C98F2E)",
              color: "#070B14",
              border: "none",
              borderRadius: 10,
              padding: "10px 18px",
              fontWeight: 800,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            إعادة التحميل
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <FootballCareerV2 />
    </ErrorBoundary>
  </React.StrictMode>
);
