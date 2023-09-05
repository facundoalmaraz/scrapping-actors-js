const comedy = require("comedy");
const { campeonatoActual, campeonatoAnterior } = require("./scrappingF1.js");
const actors = comedy;
const anio = 2022;

class LocalActor {
  showMessage() {
    return campeonatoAnterior(anio);
  }
}

class RemoteActor {
  showMessage() {
    return this.scrapRemoto();
  }

  async scrapRemoto() {
    const axios = require("axios");
    const cheerio = require("cheerio");
    try {
      const { data } = await axios.get(
        "https://lat.motorsport.com/f1/standings/2023/?type=Driver&class="
      );
      const $ = cheerio.load(data);
      const selector = "[class=ms-table_row]";

      const pilotos = [];

      $(selector).each((index, element) => {
        const pos = $(element).find("td:nth-child(1)").text().trim();
        const nombreWithSpace = $(element)
          .find("td:nth-child(2)")
          .text()
        .trim();
        const nombre = nombreWithSpace.replace(/\n.*$/, "");
        const puntos = $(element).find("td:nth-child(3)").text().trim();

        const puntosValidos = puntos !== "" ? puntos : "0";

        if (pos && nombre) {
          pilotos.push({ pos, nombre, puntos: puntosValidos });
        }
      });
      console.log(pilotos);
      return pilotos;
    } catch (error) {
      console.log(error);
      throw new Error("Ha ocurrido un error");
    }
  }
}

async function main() {
  const actorSystem = actors();

  try {
    const rootActor = await actorSystem.rootActor();

    // Crear un actor local
    const localActor = await rootActor.createChild(LocalActor);
    const localMessage = await localActor.sendAndReceive("showMessage");
    console.log(`Campeonato del año: ${anio}`, localMessage);

    // Crear un actor remoto
    const remoteActor = await rootActor.createChild(RemoteActor, {
      mode: "remote",
      host: "192.168.1.33",
    });
    const remoteMessage = await remoteActor.sendAndReceive("showMessage");
    console.log(`Remote Actor Message:`, remoteMessage);
  } catch (err) {
    console.error(err);
  } finally {
    actorSystem.destroy();
  }
}

main();
