import React, { useRef } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import PerformOCR from "../../components/admin/performOCR";
import imagen from '/img/registro1.jpeg';

const CapturarCamara = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const text = await PerformOCR(imagen);
    console.log(text);
    const rows = text.split("\n");
    const forms = rows.map((row) => {
      const columns = row.split(/\s+/);
      return {
        helado: columns[0] || "",
        barquillo: columns[1] || "",
        cono: columns[2] || "",
        canasta: columns[3] || "",
        estrella: columns[4] || "",
        ac: columns[5] || "",
        total: columns[6] || "",
      };
    });
    // navigate("/admin/newSale", { state: { ocrData: forms } });
  };

  return (
    <div>
      <h1>Cámara</h1>
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={handleCapture}>Capturar y Procesar</button>
      <button onClick={() => navigate("/admin/sales")}>Cancelar</button>
    </div>
  );
};

export default CapturarCamara;