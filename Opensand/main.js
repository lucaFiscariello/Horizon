const {DriverOsm} = require("./osm/driverOsm");
const fs = require('fs');

async function main() {
    
  const nomeFile = './config/default/topology.xml';

  try {
    const contenutoFile = fs.readFileSync(nomeFile, 'utf-8');
    console.log('Contenuto del file:', contenutoFile);
  } catch (errore) {
    console.error('Errore durante la lettura del file:', errore.message);
  }

  let driverOsm = new DriverOsm();

  await driverOsm.inizialize();
  let nss = await driverOsm.get_NSs();
  console.log(nss);
    
}
  
main();   

/*
    const xmlStringinf = builder.buildObject(entity.infrastructure);
    const xmlStringTop = builder.buildObject(model.model.topology);
    const xmlStringProf = builder.buildObject(entity.profile);
    
    await driverOsm.load_xml(ns._id,"infrastructure.xml",xmlStringinf)
    await driverOsm.load_xml(ns._id,"topology.xml",xmlStringTop)
    await driverOsm.load_xml(ns._id,"profile.xml",xmlStringProf)

*/