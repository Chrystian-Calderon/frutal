import Tesseract from "tesseract.js";

const PerformOCR = async (image) => {
  try {
    const { data } = await Tesseract.recognize(image, "eng", {
      logger: (info) => console.log(info),
    });

    console.log("Texto detectado:", data.text);
    return data.text;
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    return "";
  }
};

export default PerformOCR;