import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "./components/Portfolio";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0d0f13",
            border: "1px solid rgba(0, 229, 255, 0.25)",
            color: "#e7e9ee",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.78rem",
          },
        }}
      />
    </div>
  );
}

export default App;
