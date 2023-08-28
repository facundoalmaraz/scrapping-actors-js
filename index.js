import comedy from "comedy";

import { campeonatoActual, campeonatoAnterior } from "./scrappingF1.js";
const actors = comedy;
const anio=2022

class LocalActor {
  showMessage() {
    return campeonatoAnterior(anio);
  }
}

class SecondLocalActor {
  showMessage() {
    return campeonatoActual();
  }
}

class RemoteActor {
  showMessage() {
    return "Soy el actor remoto"
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

    // Crear un segundo actor local 
    const secondLocalActor = await rootActor.createChild(SecondLocalActor);
    const secondLocalMessage = await secondLocalActor.sendAndReceive("showMessage");
    console.log(`Campeonato actual año ${new Date(). getFullYear()}:`, secondLocalMessage);


    // Crear un actor remoto 
    const remoteActor = await rootActor.createChild(RemoteActor, {
      mode: "remote",
      host: "192.168.1.41",
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
