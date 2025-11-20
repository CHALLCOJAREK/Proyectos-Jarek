import React, { useEffect, useState } from "react";

const text = `eSupply es una solución digital desarrollada por iBit que permite optimizar los procesos de compras, abastecimiento y gestión de proveedores mediante el intercambio de información en línea entre empresas B2B. En iBit desarrollamos soluciones transversales y escalables que eliminan tareas operativas y mejoran la eficiencia de todas las áreas del negocio. Por eso, eSupply es una plataforma 100% web, integrada con tu ERP, que brinda trazabilidad, automatización y control total sobre cada etapa del proceso: desde el requerimiento hasta el pago.`;

const KaraokeScroll: React.FC = () => {
  const [coloredLettersCount, setColoredLettersCount] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;

      let progress = scrollTop / maxScroll;
      if (progress > 1) progress = 1;
      if (progress < 0) progress = 0;

      setColoredLettersCount(Math.floor(progress * text.length));
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // para setear al cargar

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      style={{
        background: "#000",
        color: "#444",
        minHeight: "200vh",
        padding: "3rem 2rem",
        fontSize: "1.6rem",
        lineHeight: 1.6,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        userSelect: "none",
      }}
    >
      <p style={{ maxWidth: 800, margin: "auto" }}>
        {Array.from(text).map((char, idx) => (
          <span
            key={idx}
            style={{
              color: idx < coloredLettersCount ? "#1f5a99" : "#444",
              transition: "color 0.3s ease",
              whiteSpace: char === " " ? "pre" : undefined,
            }}
          >
            {char}
          </span>
        ))}
      </p>
    </div>
  );
};

export default KaraokeScroll;
