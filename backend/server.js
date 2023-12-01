const express = require('express');
const ModelNetwork = require("./model/ModelNetwork");
const { mode } = require('@chakra-ui/theme-tools');
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

app.post('/model/project/:id/entity/:nameEntity/modify',async (req, res) => {

    let modelNetwork = new ModelNetwork(req.params.id)
    await modelNetwork.loadModel()
    await modelNetwork.modifyEntity( req.params.nameEntity,req.body.ip,req.body.mac)
    
    return res.json(modelNetwork)

});

app.post('/model/project/:id/entity/physical',async (req, res) => {

    let modelNetwork = new ModelNetwork(req.params.id)
    let entity = new Object()

    await modelNetwork.loadModel()
    await modelNetwork.addEntity(req.body.name,req.body.type)
    
    entity.name = req.body.name
    entity.type = req.body.type
    entity.id = modelNetwork.entitiesByName[req.body.name].getID()
    entity.mapping = [req.body.name]

    await modelNetwork.addPhysicalEntity(entity)
    return res.json(modelNetwork)

});







app.get('/model/project/:id/entity/physical',async (req, res) => {

    let nameProject = req.params.id
    let response = new Object()

    if(!global.modelNetwork)
        return res.json()

    if(nameProject == global.modelNetwork.nameProject){
        physicalNodes = global.modelNetwork.getNodesPhysical()
        response.physicalNodes = physicalNodes
    }
   
    return res.json(response)

});

app.get('/model/project/:id/link/physical',async (req, res) => {

    let nameProject = req.params.id
    let response = new Object()

    if(!global.modelNetwork)
        return res.json()

    if(nameProject == global.modelNetwork.nameProject){
        physicaLinks = global.modelNetwork.getLinksPhysical()
        response.physicaLinks = physicaLinks
    }
   
    return res.json(response)

});

app.delete('/model/project/:id/node/:idNode/physical',async (req, res) => {

    let nameProject = req.params.id

    if(!global.modelNetwork)
        return res.json()

    if(nameProject == global.modelNetwork.nameProject){
        global.modelNetwork.deletePhysicalEntity(req.params.idNode)
    }
   
    return res.json()

});

app.get('/model/project/:id/node/:idNode/physical/mapping',async (req, res) => {

    let nameProject = req.params.id
    let virtualEntity = []
    let response = new Object()

    if(!global.modelNetwork)
        return res.json(response.virtualEntity=[])

    if(nameProject == global.modelNetwork.nameProject){
        virtualEntity = await global.modelNetwork.getPhisicalMapping(req.params.idNode)
    }
   
    return res.json(response.virtualEntity=virtualEntity)

});

app.post('/model/project/:id/node/:idNode/physical/mapping/virtual/:idNodeVirt',async (req, res) => {

    let nameProject = req.params.id
    let nameEntityPhysical = req.params.idNode
    let nameEntityVirtual = req.params.idNodeVirt

    if(!global.modelNetwork)
        return res.json()

    if(nameProject == global.modelNetwork.nameProject){
        await global.modelNetwork.addMappingPhysicalVirual(nameEntityPhysical,nameEntityVirtual)
    }
   
    return res.json()

});

app.delete('/model/project/:id/link/physical',async (req, res) => {

    let nameProject = req.params.id

    if(nameProject == global.modelNetwork.nameProject){
        global.modelNetwork.deletePhysicalLink(req.body.source,req.body.target)
    }
   
    return res.json()

});

app.post('/model/project/:id/link/physical',async (req, res) => {

    let nameProject = req.params.id

    if(nameProject == global.modelNetwork.nameProject){

        let idSource = global.modelNetwork.entitiesByName[req.body.source].getID()
        let idTarget = global.modelNetwork.entitiesByName[req.body.target].getID()
        global.modelNetwork.addPhysicalConnection(idSource,idTarget)
    }
   
    return res.json()

});



app.post('/model/project/:id/node/:idNode/physical',async (req, res) => {

    let nameProject = req.params.id
    if(nameProject == global.modelNetwork.nameProject){
    
        await global.modelNetwork.addEntity(req.params.idNode)
        let new_entity = global.modelNetwork.entitiesByName[req.params.idNode]
        let entity = new Object()

        entity.name = req.params.idNode
        entity.type = new_entity.type
        entity.id = new_entity.getID()
        entity.mapping = [req.params.idNode]

        await global.modelNetwork.addPhysicalEntity(entity)

    }
   
    return res.json()

});

app.get('/model/project/:id/node/:idNode/spots',async (req, res) => {

    console.log("get spots "+req.params.idNode)

    let nameProject = req.params.id
    let spots = []
    let response = new Object()

    if(!global.modelNetwork)
        return res.json(response.spots=[])

    if(nameProject == global.modelNetwork.nameProject){
        spots = await global.modelNetwork.getSpots()
    }
   
    console.log("spot letti: "+ spots)
    return res.json(response.spots=spots)

});

app.get('/test',async (req, res) => {

    
    let network = new ModelNetwork("test")
    let entity = new Object()
    let entitysat = new Object()
    let gw;
    let sat;
    let st;
    let gw2;

    //let model = new ModelEntity("gw","test","Gateway")
    //await model.createEntity()
    //await model.loadXML()
    //await model.setID(10)
    //await model.setIP("127.0.0.1")
    //wait model.setMAC("00:00:00:00:00:00")
    //await model.addEntity("Terminal","127.0.0.2","00:00:00:00:00:02",1)
    //await model.addEntity("Gateway","127.0.0.2","00:00:00:00:00:02",1)
    //await model.addEntity("Satellite","127.0.0.2","00:00:00:00:00:02",9)


    //await network.createXMLDefault()
    //await network.loadXMLDefault()
    await network.loadModel()
    
    await network.addEntity("gw","Gateway")
    await network.addEntity("gw2","Gateway")
    await network.addEntity("st","Terminal")
    await network.addEntity("sat","Satellite")

    await network.configureEntity("gw","192.168.0.3","00:00:00:00:00:01")
    await network.configureEntity("gw2","192.168.0.4","00:00:00:00:00:04")
    await network.configureEntity("st","192.168.0.2","00:00:00:00:00:02")
    await network.configureEntity("sat","192.168.0.1","00:00:00:00:00:03")

    await network.modifyEntity("sat","127.168.0.1","00:00:00:00:00:03")


    gw2 = network.entitiesByName["gw2"]
    gw = network.entitiesByName["gw"]
    sat = network.entitiesByName["sat"]
    st = network.entitiesByName["st"]

    entity.name = gw.nameEntity
    entity.type = gw.type
    entity.id = gw.getID()
    entity.mapping = [gw.nameEntity]

    entitysat.name = sat.nameEntity
    entitysat.type = sat.type
    entitysat.id = sat.getID()
    entitysat.mapping = [sat.nameEntity]

    await network.addPhysicalEntity(entity)
    await network.addPhysicalEntity(entitysat)
    await network.addMappingPhysicalVirual("gw","gw2")
    await network.addPhysicalConnection(sat.getID(),gw.getID())
    await network.addPhysicalConnection(st.getID(),gw.getID())


    gw = network.entitiesByName["gw"]
    sat = network.entitiesByName["sat"]
    st = network.entitiesByName["st"]

    await network.addSpot("Transparent","Transparent",gw.getID(),sat.getID(),sat.getID())
    await network.addRoute(gw.getID(), st.getID(),gw.getID())

    //await network.deletePhysicalLink("gw","gw2")
    //await network.deleteAllPhysicalLinkEntity("gw")

    await network.deletePhysicalEntity(sat.nameEntity)

    //await network.removeRoute(gw.nameEntity, st.nameEntity)
    //await network.removeSpot(gw.nameEntity,sat.nameEntity)
    //await network.removeAllSpotEntity("sat")

    let entities = await network.getEntities()
    let link =  network.getLinksPhysical()
    let node =  network.getNodesPhysical()
    let mapping = network.getPhisicalMapping("gw")
    let spot = network.getSpots()
    let route = network.getRoutes()

    console.log(entities)
    console.log(link)
    console.log(node)
    console.log(mapping)
    console.log(spot)
    console.log(route)




    /*

    let gw = network.entitiesByName["gw"]
    let st = network.entitiesByName["st"]
    let sat = network.entitiesByName["sat"]

    await gw.setIP("192.168.0.3")
    await st.setIP("192.168.0.2")
    await sat.setIP("192.168.0.1")

    await gw.setMAC("00:00:00:00:00:01")
    await st.setMAC("00:00:00:00:00:02")
    await sat.setMAC("00:00:00:00:00:03")

    await gw.addEntity(st.type, st.getIP(), st.getMAC(), st.getID())
    await gw.addEntity(sat.type, sat.getIP(), sat.getMAC(), sat.getID())
    await gw.addEntity(gw.type, gw.getIP(), gw.getMAC(), gw.getID())

    await st.addEntity(gw.type, gw.getIP(), gw.getMAC(), gw.getID())
    await st.addEntity(sat.type, sat.getIP(), sat.getMAC(), sat.getID())
    await st.addEntity(st.type, st.getIP(), st.getMAC(), st.getID())

    await sat.addEntity(st.type, st.getIP(), st.getMAC(), st.getID())
    await sat.addEntity(gw.type, gw.getIP(), gw.getMAC(), gw.getID())
    await sat.addEntity(sat.type, sat.getIP(), sat.getMAC(), sat.getID())

    await sat.setIP("127.168.0.1")
    await gw.modifyEntity(sat.type, sat.getIP(), sat.getMAC(), sat.getID())
    */

   


    return res.json()
  
});
            



/********************** Avvio server **********************/

app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});




  

