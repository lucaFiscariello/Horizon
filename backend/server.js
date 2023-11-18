const express = require('express');
const ModelNetwork = require("./model/ModelNetwork")
const app = express();
const port = 3004; 

let baseUrlProxy = "http://127.0.0.1:3003"
global.modelNetwork ;

// Middleware per il parsing del corpo delle richieste in formato JSON
app.use(express.json());

app.post('/model/project/:id/inizialize',async (req, res) => {

    console.log("inizializzo")

    if(req.body.entities.length >0){
        global.modelNetwork = new ModelNetwork(req.params.id,req.body.entities)
        await global.modelNetwork.loadXMLDefault()
        await global.modelNetwork.loadModel()
    }

    return res.json(global.modelNetwork)

});

app.get('/model/project/:id/node/physical',async (req, res) => {

    console.log("get nodi fisici")

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

    console.log("get link")

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

    console.log("delete nodo fisico "+req.params.id)

    let nameProject = req.params.id

    if(!global.modelNetwork)
        return res.json()

    if(nameProject == global.modelNetwork.nameProject){
        global.modelNetwork.deletePhysicalEntity(req.params.idNode)
    }
   
    return res.json()

});

app.get('/model/project/:id/node/:idNode/physical/mapping',async (req, res) => {

    console.log("get mapping nodo fisico "+req.params.idNode)

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

    console.log("post mapping nodo fisico virtuale "+req.params.idNode+" "+req.params.idNodeVirt)

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
    console.log("rimuovo link chiamata api: "+req.body.source + " "+ req.body.target)
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


app.put('/model/project/:id/node/:idNode/id',async (req, res) => {

    console.log("set id nodo: "+req.params.id)

    let nameProject = req.params.id

    if(!global.modelNetwork)
        return res.json()

    if(nameProject == global.modelNetwork.nameProject){
        
        while(!global.modelNetwork.entitiesByName[req.params.idNode])
            await global.modelNetwork.loadModel()

        await global.modelNetwork.addNewEntityId(req.params.idNode)

    }
   
    return res.json()

});

app.post('/model/project/:id/node/:idNode/physical',async (req, res) => {

    console.log("Add nodo fisico"+req.params.idNode)

    let nameProject = req.params.id

    if(!global.modelNetwork){
        global.modelNetwork = new ModelNetwork(req.params.id,[req.body])
        await global.modelNetwork.loadXMLDefault()
        await global.modelNetwork.loadModel()
    }

    if(nameProject == global.modelNetwork.nameProject){
        
        while(!global.modelNetwork.entitiesByName[req.params.idNode])
            await global.modelNetwork.loadModel()

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


            



/********************** Avvio server **********************/

app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});




  

