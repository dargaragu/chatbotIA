const pool = require("./db");

// Función para buscar stock en la base de datos
async function buscarStock(prenda, talla, color) {
  try {
    const result = await pool.query(
      "SELECT cantidad FROM stock WHERE prenda=$1 AND talla=$2 AND color=$3",
      [prenda, talla, color]
    );

    if (result.rows.length > 0) {
      return `Hay ${result.rows[0].cantidad} unidades de ${prenda} (${talla}, ${color}) en stock.`;
    } else {
      return `No hay stock disponible para ${prenda} (${talla}, ${color}).`;
    }
  } catch (error) {
    console.error("Error en la consulta:", error);
    return "Hubo un error al consultar el stock.";
  }
}

module.exports = { buscarStock };
