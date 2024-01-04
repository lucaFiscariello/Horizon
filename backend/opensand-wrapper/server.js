const express = require('express');
const ModelNetwork = require("./model/ModelNetwork");
//const DriverOsm = require("./osm/driverOsm");

const app = express();
const port = 3004; 

let baseUrlProxy = "http://127.0.0.1:3003"
global.modelNetwork ;

// Middleware per il parsing del corpo delle richieste in formato JSON
app.use(express.json());

app.post('/model/project/:id/entity',async (req, res) => {

    let modelNetwork = new ModelNetwork(req.params.id)
    await modelNetwork.loadModel()
    await modelNetwork.addEntity(req.body.nameEntity,req.body.type)
    
    return res.json(modelNetwork)

});

app.post('/model/project/:id/entity/:nameEntity/configure',async (req, res) => {

    let modelNetwork = new ModelNetwork(req.params.id)
    await modelNetwork.loadModel()
    await modelNetwork.configureEntity( req.params.nameEntity,req.body.ip,req.body.mac)
    
    return res.json(modelNetwork)

});

app.post('/model/project/:id/collector/:ip',async (req, res) => {

    let modelNetwork = new ModelNetwork(req.params.id)
    await modelNetwork.loadModel()
    await modelNetwork.enableCollector(req.params.ip)
    
    return res.json(modelNetwork)

});

app.post('/model/project/:id/entity/:nameEntity/modify',async (req, res) => {

    let modelNetwork = new ModelNetwork(req.params.id)
    await modelNetwork.loadModel()
    await modelNetwork.modifyEntity( req.params.nameEntity,req.body.ip,req.body.mac)
    
    return res.json(modelNetwork)

});

app.post('/model/project/:id/entity/physical',async (req, res) => {

    let network = new ModelNetwork(req.params.id)
    let createdEntity;
    let entity = new Object()

    await network.loadModel()
    await network.addEntity(req.body.name,req.body.type)
 
    createdEntity = network.entitiesByName[req.body.name]

    entity.name = createdEntity.nameEntity
    entity.type = createdEntity.type
    entity.id = createdEntity.getID()
    entity.mapping = [createdEntity.nameEntity]


    await network.addPhysicalEntity(entity)
    
    return res.json()

});

app.post('/model/project/:id/entity/physical/:idNode/mapping/virtual/:idNodeVirt',async (req, res) => {

    let nameProject = req.params.id
    let nameEntityPhysical = req.params.idNode
    let nameEntityVirtual = req.params.idNodeVirt

    let modelNetwork = new ModelNetwork(nameProject)
    await modelNetwork.loadModel()
    await modelNetwork.addMappingPhysicalVirual(nameEntityPhysical,nameEntityVirtual)

    return res.json(modelNetwork)

});

app.post('/model/project/:id/link/physical',async (req, res) => {

    let nameProject = req.params.id
    let modelNetwork = new ModelNetwork(nameProject)
    await modelNetwork.loadModel()

    let idSource = modelNetwork.entitiesByName[req.body.source].getID()
    let idTarget = modelNetwork.entitiesByName[req.body.target].getID()

    await modelNetwork.addPhysicalConnection(idSource,idTarget)
    
   
    return res.json()

});

app.post('/model/project/:id/spot',async (req, res) => {

    let nameProject = req.params.id
    let modelNetwork = new ModelNetwork(nameProject)
    await modelNetwork.loadModel()
    
    let f_regen = req.body.f_regen
    let r_regen = req.body.r_regen
    let idGW = modelNetwork.entitiesByName[req.body.idGW].getID()
    let idSat = modelNetwork.entitiesByName[req.body.idSat].getID()
    
    await modelNetwork.addSpot(f_regen,r_regen,idGW,idSat,idSat)
    
   
    return res.json()

});

app.post('/model/project/:id/route',async (req, res) => {

    let nameProject = req.params.id
    let modelNetwork = new ModelNetwork(nameProject)
    await modelNetwork.loadModel()
    
    let idGW = modelNetwork.entitiesByName[req.body.idGW].getID()
    let idSt = modelNetwork.entitiesByName[req.body.idSt].getID()
    
    await modelNetwork.addRoute(idGW, idSt, idGW)
    
   
    return res.json()

});

app.get('/model/project/:id/entity/physical',async (req, res) => {

    let nameProject = req.params.id
    let modelNetwork = new ModelNetwork(nameProject) 
    let response = new Object()

    await modelNetwork.loadModel()

    let physicalNodes = modelNetwork.getNodesPhysical()
    response.physicalNodes = physicalNodes
    
    return res.json(response)

});

app.get('/model/project/:id/link/physical',async (req, res) => {

    let nameProject = req.params.id
    let modelNetwork = new ModelNetwork(nameProject) 
    let response = new Object()

    await modelNetwork.loadModel()

    let physicaLinks = modelNetwork.getLinksPhysical()
    response.physicaLinks = physicaLinks
       
    return res.json(response)

});

app.get('/model/project/:id/entity',async (req, res) => {

    let nameProject = req.params.id
    let modelNetwork = new ModelNetwork(nameProject) 
    let response = new Object()

    await modelNetwork.loadModel()

    let entities = await modelNetwork.getEntities()
    response.entities = entities
    
    return res.json(response)

});

app.get('/model/project/:id/entity/:idNode/physical/mapping',async (req, res) => {

    let nameProject = req.params.id
    let modelNetwork = new ModelNetwork(nameProject) 
    let response = new Object()
    let virtualEntity = []

    await modelNetwork.loadModel()

    virtualEntity = await modelNetwork.getPhisicalMapping(req.params.idNode)
    
   
    return res.json(response.virtualEntity=virtualEntity)

});

app.get('/model/project/:id/entity/:idNode/spots',async (req, res) => {

    let nameProject = req.params.id
    let modelNetwork = new ModelNetwork(nameProject) 
    let response = new Object()

    await modelNetwork.loadModel()

    let spots = await modelNetwork.getSpots()
    response.spots = spots
    
    return res.json(response)

});

app.get('/model/project/:id/route',async (req, res) => {

    let nameProject = req.params.id
    let modelNetwork = new ModelNetwork(nameProject) 
    let response = new Object()

    await modelNetwork.loadModel()

    let routes = await modelNetwork.getRoutes()
    response.routes = routes
    
    return res.json(response)

});

app.get('/model/:id',async (req, res) => {

    let nameProject = req.params.id
    let modelNetwork = new ModelNetwork(nameProject) 
    let response = new Object()

    await modelNetwork.loadModel()
    response.model = modelNetwork
    
    return res.json(response)

});

app.delete('/model/project/:id/entity/:idNode/physical',async (req, res) => {

    let nameProject = req.params.id
    let modelNetwork = new ModelNetwork(nameProject) 

    await modelNetwork.loadModel()
    await modelNetwork.deletePhysicalEntity(req.params.idNode)
    
    return res.json()

});

app.delete('/model/project/:id/link/physical',async (req, res) => {

    let nameProject = req.params.id
    let modelNetwork = new ModelNetwork(nameProject) 

    await modelNetwork.loadModel()
    await modelNetwork.deletePhysicalLink(req.body.source,req.body.target)
    
    return res.json()

});

            
/********************** Avvio server **********************/

app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});




  

