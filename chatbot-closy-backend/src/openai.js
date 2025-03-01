const { OpenAI } = require("openai");
require("dotenv").config();
const { buscarStock } = require("./stockService");  

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function consultarOpenAI(mensaje) {
  try {
    // console.log("Consultando OpenAI con mensaje:", mensaje);

    const respuesta = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un asistente de inventario para una tienda online. Si te preguntan por stock, usa la función 'buscar_stock'."
        },
        { role: "user", content: mensaje }
      ],
      functions: [
        {
            "name": "buscar_stock",
            "description": "Busca la cantidad en stock de una prenda, talla y color específicos.",
            "parameters": {
              "type": "object",
              "properties": {
                "prenda": {
                  "type": "string",
                  "description": "Nombre de la prenda, por ejemplo, 'camiseta'. Solo puede tomar los siguiente valores {'camiseta', 'pantalon', 'sudadera', 'falda'}"
                },
                "talla": {
                  "type": "string",
                  "description": "Talla de la prenda, por ejemplo, 'M'. Solo puede tomar los siguiente valores {'XS', 'S', 'M', 'L', 'XL'}"
                },
                "color": {
                  "type": "string",
                  "description": "Color de la prenda, por ejemplo, 'negro'. Solo puede tomar los siguiente valores {'negro', 'blanco', 'azul', 'rojo', 'amarillo', 'gris', 'beige'}"
                }
              },
              "required": [
                "prenda",
                "talla",
                "color"
              ],
              "additionalProperties": false
            }
          }
      ],
      function_call: "auto",
      temperature: 0.7,
    });

    // Si OpenAI llama a la función buscar_stock
    if (respuesta.choices[0].message.function_call) {
      const { name, arguments } = respuesta.choices[0].message.function_call;

      if (name === "buscar_stock") {
        const { prenda, talla, color } = JSON.parse(arguments);
        console.log(`OpenAI solicitó stock de: ${prenda}, ${talla}, ${color}`);

        const stockRespuesta = await buscarStock(prenda, talla, color);
        return stockRespuesta;
      }
    }

    // console.log("Respuesta OpenAI:", respuesta.choices[0].message.content);
    return respuesta.choices[0].message.content;
  } catch (error) {
    console.error("Error consultando OpenAI:", error);
    return "Error al obtener la respuesta de OpenAI.";
  }
}

module.exports = { consultarOpenAI };



