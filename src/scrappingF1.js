const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const app = express();

async function obtenerDatos(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const selector = "[class=ms-table_row]";

    const pilotos = [];

    $(selector).each((index, element) => {
      const pos = $(element).find("td:nth-child(1)").text().trim();
      const nombreWithSpace = $(element).find("td:nth-child(2)").text().trim();
      const nombre = nombreWithSpace.replace(/\n.*$/, "");
      const puntos = $(element).find("td:nth-child(3)").text().trim();

      const puntosValidos = puntos !== '' ? puntos : '0';

      if (pos && nombre) {
        pilotos.push({ pos, nombre, puntos: puntosValidos });
      }
    });

    return pilotos;
  } catch (error) {
    console.log(error);
    throw new Error("Ha ocurrido un error");
  }
}

const campeonatoAnterior = async (anio) => {
  const url = `https://lat.motorsport.com/f1/standings/${anio}/?type=Driver&class=`;
  return obtenerDatos(url);
};

const campeonatoActual = async () => {
  const url =
    "https://lat.motorsport.com/f1/standings/2023/?type=Driver&class=";
  return obtenerDatos(url);
};

// Exportar las funciones
module.exports = {
  campeonatoAnterior,
  campeonatoActual
};

app.get("/", async (req, res) => {
  try {
    const anioAnterior = 2020; // Cambiar el año anterior según necesites

    const pilotosActual = await campeonatoActual();
    const pilotosAnterior = await campeonatoAnterior(anioAnterior);

    // Aquí puedes realizar comparaciones entre los arreglos pilotosActual y pilotosAnterior

    res.json({ pilotosActual, pilotosAnterior });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => console.log("Servidor en puerto " + PORT));
