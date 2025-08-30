import { useState } from "react";

export default function RippleButton({ children, className = "" }) {
  const [ripples, setRipples] = useState([]);

  const addRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    // Detect background color from Tailwind utility
    const isDark = button.classList.contains("bg-blue-600") || 
                   button.classList.contains("bg-black") || 
                   button.classList.contains("bg-gray-800");

    const rippleColor = isDark
      ? "rgba(255, 255, 255, 0.5)" // light ripple on dark button
      : "rgba(0, 0, 0, 0.3)";     // dark ripple on light button

    const newRipple = { x, y, size, color: rippleColor, id: Date.now() };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <button
      onClick={addRipple}
      className={`relative overflow-hidden text-white rounded-full ripple transition-colors ${className}`}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            width: ripple.size,
            height: ripple.size,
            left: ripple.x,
            top: ripple.y,
            backgroundColor: ripple.color,
            position: "absolute",
            borderRadius: "50%",
            transform: "scale(0)",
            animation: "ripple 600ms linear",
          }}
        />
      ))}
    </button>
  );
}
