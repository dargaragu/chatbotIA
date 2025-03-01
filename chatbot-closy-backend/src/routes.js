const express = require("express");
const router = express.Router();
const { consultarOpenAI } = require("./openai");
const { buscarStock } = require("./stockService");  // Importamos la función desde el nuevo archivo

// Ruta para manejar las solicitudes del chatbot
router.post("/chat", async (req, res) => {
  const { mensaje } = req.body;

  if (!mensaje) {
    return res.status(400).json({ error: "Falta el mensaje" });
  }

//   Intenta extraer información del mensaje
  const match = mensaje.match(
    /(\b(camiseta|pantalon|sudadera|falda)\b).*?(\bXS|S|M|L|XL\b).*?(\bnegro|blanco|azul|rojo|amarillo|gris|beige\b)/i
  );
    

  if (match) {
    const prenda = match[2].toLowerCase();
    const talla = match[3].toUpperCase();
    const color = match[4].toLowerCase();

    console.log(`Buscando stock para: ${prenda}, ${talla}, ${color}`);

    const stockRespuesta = await buscarStock(prenda, talla, color);
    return res.json({ respuesta: stockRespuesta });
  }

  // Si OpenAI debe responder
  const respuestaAI = await consultarOpenAI(mensaje);
  res.json({ respuesta: respuestaAI });
});

module.exports = router;


