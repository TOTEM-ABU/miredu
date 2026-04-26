import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(3, 7, 18, 0.7)",
              backdropFilter: "blur(8px)",
              zIndex: 1000,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-40%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-40%" }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              width: "100%",
              maxWidth: "550px",
              zIndex: 1001,
              padding: "1rem",
            }}
          >
            <div
              className="auth-card"
              style={{ padding: "2rem", position: "relative" }}
            >
              <button
                onClick={onClose}
                type="button"
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>

              {title && (
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 900,
                      color: "#f1f5f9",
                    }}
                  >
                    {title}
                  </h2>
                </div>
              )}

              {children}
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
