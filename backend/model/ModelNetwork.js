const  ModelEntity  = require("./ModelEntity");
const  xml2js  = require("xml2js");


/**
 * Classe che modella una rete satellitare. Mantiene il riferimento alla lista delle entità che compongono la rete. Ogni entità mantiene a sua volta
 * i riferimenti agli xml di configurazione delle entità.
 */
class ModelNetwork {

    constructor(nameProject) {   
        this.urlTemplate = "http://127.0.0.1:8888/api/project/"
        let topologySTR = "/topology"
        this.nameProject = nameProject
        this.machines = []
        this.urlTopology= this.urlTemplate + this.nameProject+ topologySTR
        this.urlProject = this.urlTemplate + this.nameProject

        this.topology=NaN
        this.profile=NaN

        this.entities = {} 
        this.entitiesByName = {}
        this.maxId = 0         
    }

        /**
     * Crea gli xml di default per la topologia. Questa funzione deve essere invocata appena viene creata una nuova rete.
     */
    async createXMLDefault() {
        const urlTopologyDefault = "http://127.0.0.1:8888/api/project/"+this.nameProject+"/template/topology/Default.xml"
       
        const response = await fetch(urlTopologyDefault)
        const jsonData =  await response.json();

        
        if(jsonData.error)
            return

        const result =  await xml2js.parseStringPromise(jsonData.content, { explicitArray: false });
        this.topology = result
        this.topology.model.root.frequency_plan.spots.item.assignments.gateway_id = -1
        await this.updateXml()

    }


    /**
     * Modifica il file di configurazione "project.xml". Tale file mantiene i nomi degli xml di configurazione per un entità. Tale funzione
     * inserisce i nomi degli xml di default.
     */
    async loadXMLDefault() {

        if(!this.topology)
            await this.createXMLDefault()

        
        let url = "http://127.0.0.1:8888/api/project/" + this.nameProject
        let defaultXml = "Default.xml"
        let builder = new xml2js.Builder();
        let entities;

        //Leggo l'xml project.xml
        const response = await fetch(url)
        const jsonData =  await response.json();
        const result =  await xml2js.parseStringPromise(jsonData.content, { explicitArray: false });

        if(!this.profile){
            // Modifico i parametri infrastructure__template, profile__template,topology__template
            entities = result.model.root.configuration.entities.item
            if(isIterable(entities)){
                for(let entity of entities){
                    entity.infrastructure__template = defaultXml
                    entity.profile__template = defaultXml
                }
                
                result.model.root.configuration.entities.item = entities
            }

            result.model.root.configuration.topology__template = defaultXml


            //Aggiorno project.xml
            const xmlString = builder.buildObject(result);
            const options = {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json"
                },
                body: JSON.stringify({"xml_data" : xmlString})
            };

            await fetch(url,options)
        }

        this.profile = result
        this.machines = this.getEntities()

    }

    /**
     * Funzione che carica i file di configurazione di tutte le entità della rete 
     */
    async loadModel() {
    
        //Carico topologia
        let response = await fetch(this.urlTopology)
        let jsonData =  await response.json();
        let result =  await xml2js.parseStringPromise(jsonData.content, { explicitArray: false });
        this.topology = result

        //carico progetto
        response = await fetch(this.urlProject)
        jsonData =  await response.json();
        result =  await xml2js.parseStringPromise(jsonData.content, { explicitArray: false });
        this.profile = result

        this.machines = this.getEntities()

        //carico configurazioni altre entità
        for (let entity of this.machines){

            if(entity){

                let entityname = entity.entity_name
                let entityModel = new ModelEntity(entityname,this.nameProject,entity.entity_type)
                
                await entityModel.loadXML()                
                let id = entityModel.getID()                
                this.entities[id] = entityModel
                this.entitiesByName[entityname] = entityModel

                //L'id massimo serve per assegnare gli id automaticamente alle nuove entità create nella rete
                if(id>this.maxId)
                    this.maxId = id


            }


        }
        
    }


    async addEntity(name,type) {
        
        await this.loadModel()

        // Aggiungo entità in project.xml
        let machines = this.profile.model.root.platform.machines
        let machine = new Object()
        let item = new Object()

        machine.entity_name = name
        machine.entity_type = type

        if(machines == ''){
            item.item = machine
            machines = item
        }else if (!isIterable(machines.item)){
            machines.item = [machines.item,machine]
        }else{
            machines.item = [...machines.item,machine]
        }

        this.profile.model.root.platform.machines = machines
        this.updateXml()

        // creo xml di deafult per la nuova entità
        let newEntity = new ModelEntity(name,this.nameProject,type)
        await newEntity.createEntity()
        await newEntity.loadXML()

        // aggiorna variabili di istanza
        await newEntity.setID(this.maxId)   
        this.entities[this.maxId] = newEntity
        this.entitiesByName[name] = newEntity
        this.machines = this.getEntities()

        //Aggiorno id massimo 
        this.maxId = this.maxId +1

    }

    getEntities() {
    
        if(this.profile.model.root.platform.machines.item)
            if(isIterable(this.profile.model.root.platform.machines.item))
                return this.profile.model.root.platform.machines.item
            else
                return [this.profile.model.root.platform.machines.item]

        return []
    }

    async configureEntity(nameEntity,ip,mac){
     
        let entity = this.entitiesByName[nameEntity]
        await entity.setIP(ip)
        await entity.setMAC(mac)


        for(let entityInfo of this.machines){
            let oldEntity = this.entitiesByName[entityInfo.entity_name]
            await oldEntity.addEntity(entity.type, entity.getIP(), entity.getMAC(), entity.getID())
        }
            
    }

    async modifyEntity(nameEntity,ip,mac){
        let entity = this.entitiesByName[nameEntity]

        await entity.setIP(ip)
        await entity.setMAC(mac)

        for(let entityInfo of this.machines){
            let oldEntity = this.entitiesByName[entityInfo.entity_name]
            await oldEntity.modifyEntity(entity.type, entity.getIP(), entity.getMAC(), entity.getID())
        }
    }

    async addPhysicalEntity(entity){
        let item = new Object();
        item.entity = entity
        
        if(!this.topology.model.root.physicalEntities){
            this.topology.model.root.physicalEntities = [item]
        }else if (isIterable(this.topology.model.root.physicalEntities)){
            this.topology.model.root.physicalEntities = [...this.topology.model.root.physicalEntities,item]
        }else{
            this.topology.model.root.physicalEntities = [this.topology.model.root.physicalEntities,item]
        }

        await this.updateXml()
    }

    async addMappingPhysicalVirual(entityPhisycalName, entityVirtualName){
       

        if(!this.topology.model.root.physicalEntities)
            return 
        
        if(!isIterable(this.topology.model.root.physicalEntities)){

            let entity = this.topology.model.root.physicalEntities.entity

            if(entity.name == entityPhisycalName ){

                if(typeof entity.mapping !== "string"){
                    entity.mapping = [...entity.mapping,entityVirtualName]
                }else{

                    entity.mapping = [entity.mapping,entityVirtualName]
                }
            }
        } else{

            for(let entity of this.topology.model.root.physicalEntities){

                if(entity.entity.name == entityPhisycalName ){
    
                    if(typeof entity.entity.mapping !== "string"){
                        entity.entity.mapping = [...entity.entity.mapping,entityVirtualName]
                    }else{
    
                        entity.entity.mapping = [entity.entity.mapping,entityVirtualName]
                    }
                
                    break;
                }
    
            }
        }

        await this.updateXml()

    }

    async addPhysicalConnection(source, destination){
       
        console.log("add link fisici: "+source+" "+destination)

        let connection = new Object();        
        connection.source = this.getNameEntityById(source)
        connection.target = this.getNameEntityById(destination)
        connection.color = "black"

        if(!this.topology.model.root.physicaConnection){
            this.topology.model.root.physicaConnection = [connection]
        }else if (isIterable(this.topology.model.root.physicaConnection)){
            this.topology.model.root.physicaConnection = [...this.topology.model.root.physicaConnection,connection]
        }else{
            this.topology.model.root.physicaConnection = [this.topology.model.root.physicaConnection,connection]
        }

        await this.updateXml()
    }

    getPhisicalMapping(entityPhisycalName){
       

        if(!this.topology.model.root.physicalEntities)
            return []

        if(!isIterable(this.topology.model.root.physicalEntities)){

            let entity = this.topology.model.root.physicalEntities.entity

            if(entity.name == entityPhisycalName ){

                if(typeof entity.mapping === "string"){
                    return [entity.mapping] 
                }else{
                    return entity.mapping
                }
            }
        } else{

            for(let entity of this.topology.model.root.physicalEntities){

                if(entity.entity.name == entityPhisycalName ){
    
                    if(typeof entity.entity.mapping === "string"){
                        return [entity.entity.mapping] 
                    }else{
                        return entity.entity.mapping
                    }
                
                }
    
            }
        }


    }


    getSpots() {
        let spots = this.topology.model.root.frequency_plan.spots.item

        if(!spots)
            return []

        if(!isIterable(spots))
            spots = [spots]

        return spots
    }

    getRoutes(){
        let routes = this.topology.model.root.st_assignment.assignments.item

        if(!routes)
            return []

        if(!isIterable(routes))
            routes = [routes]

        return routes
    }

    getLinks(){
        let links = []
        let linkTemplateSat = {"source":"","target":"","color": ''}
        let color = ["black","red","green","grey","blue"]
        let mapColor = new Object()

        let routes = this.getRoutes()
        let spots = this.getSpots()

        for(let spot in spots){

            let link = structuredClone(linkTemplateSat)
            link.source = this.getNameEntityById(spots[spot].assignments.sat_id_gw)
            link.target = this.getNameEntityById(spots[spot].assignments.gateway_id)
            link.color = color[spot]
            links.push(link)

            //permette di associare ai link tra un sat-st-gw lo stesso colore
            mapColor[spots[spot].assignments.gateway_id] = spot
        }

        for( let route of routes){

            //Aggiungo solo se gli id sono validi
            if(route.terminal_id>0 && route.gateway_id>0){
                let link = structuredClone(linkTemplateSat)
                link.source = this.getNameEntityById(route.terminal_id)
                link.target = this.getNameEntityById(searchSatId(route.gateway_id,spots))
                link.color = color[mapColor[route.gateway_id]]
                links.push(link)
            }
        }

        if(links.length==0)
            return links

        if(!links[0].source || !links[0].target)
            return []


        return links

    }

    getLinksPhysical(){
       
        if(!this.topology.model)
            return []

        const link = this.topology.model.root.physicaConnection
        if(!link)
            return []

        if(!isIterable(link))
            return [link]

        return link
    
    }

    getNodesPhysical(){

        const urlSat = ""
        let nodes = []

        if(!this.topology.model)
            return nodes

        let allNodes = this.topology.model.root.physicalEntities
    
        if(!allNodes)
            return nodes

        if(!isIterable(allNodes))
            allNodes=[allNodes]

        for(let nodeInfo of allNodes){
            let templateNode = {"id":"","name":"","svg":"","size":400,"labelPosition": 'bottom', "x":Math.floor(Math.random() * 800) + 100,"y":Math.floor(Math.random() * 300) + 100}
            templateNode.id = nodeInfo.entity.name
            templateNode.name = nodeInfo.entity.name
            templateNode.svg = urlSat
          
            nodes.push(templateNode)
        
          }
    
        return nodes
    }

    getIDByListType(nameEntities,type){
        
        for(let name of  nameEntities){
            let entity = this.entitiesByName[name]
            if(entity.type == type)
                return entity.getID()
        }
    }

    getNameEntityById(id){
        if(this.entities[id])
            return this.entities[id].nameEntity
    }

    async addSpot(forward_regen_level,return_regen_level,gateway_id,sat_id_gw,sat_id_st){
        let allSpots = this.topology.model.root.frequency_plan.spots.item
        let templateSpot

        templateSpot= structuredClone(allSpots[0])
        
        if(!templateSpot)
          templateSpot= structuredClone(allSpots)

        templateSpot.assignments.forward_regen_level = forward_regen_level
        templateSpot.assignments.gateway_id = gateway_id
        templateSpot.assignments.return_regen_level = return_regen_level
        templateSpot.assignments.sat_id_gw = sat_id_gw
        templateSpot.assignments.sat_id_st = sat_id_st

            
        if(isIterable(allSpots))
            allSpots = [...allSpots,templateSpot]
        else if (allSpots.assignments.gateway_id == -1)
            allSpots = templateSpot
        else
            allSpots = [allSpots,templateSpot]

        this.topology.model.root.frequency_plan.spots.item = allSpots
        await this.updateXml()
    }

    async addRoute(idGatewayDefault, terminalId, gatewayId ){
       
        let item = new Object();
        let route = new Object();

        let allItems = this.topology.model.root.st_assignment.assignments.item
        route.terminal_id = terminalId
        route.gateway_id = gatewayId
        item.item = route

        console.log(this.topology.model.root.st_assignment)

        if(this.topology.model.root.st_assignment.assignments == '')
            this.topology.model.root.st_assignment.assignments = item
        else if(isIterable(allItems)){
            allItems = [...allItems,item]
            this.topology.model.root.st_assignment.assignments.item = allItems
        }
        else{
            allItems = [allItems,item]
            this.topology.model.root.st_assignment.assignments.item = allItems
        }


        this.topology.model.root.st_assignment.defaults.default_gateway=idGatewayDefault
        await this.updateXml()
    }

    async deleteEntity(nameEntity){
     
        let entityToDelete = this.entitiesByName[nameEntity]

        if(entityToDelete.type == "Gateway")
            this.removeAllRouteByGW(nameEntity)

        for(let entityInfo of this.machines){
            let entity = this.entitiesByName[entityInfo.entity_name]
            await entity.deleteEntity(entityToDelete.getID(),entityToDelete.type)
        }
            
    }

    /**
     * La rimozione di un entità fisica comporta l'eliminazione delle entità virtuali ad esse associate.
     * Comporta anche la rimozine di tutti i link fisici.
     */
    async deletePhysicalEntity(name){
        
        if(!this.topology.model.root.physicalEntities)
            return 

        await this.deleteAllPhysicalLinkEntity(name)

        if(!isIterable(this.topology.model.root.physicalEntities)){

            for(let virtualEntityname of this.topology.model.root.physicalEntities.entity.mapping){
                await this.deleteEntity(virtualEntityname)
            }

            this.topology.model.root.physicalEntities = null


        } else{

            let i
            let allItems = this.topology.model.root.physicalEntities

            for(i in allItems){
                if(allItems[i].entity.name == name){

                    for(let virtualEntityname of allItems[i].entity.mapping){
                        await this.deleteEntity(virtualEntityname)
                    }

                    break;
                }

            }
            
            allItems.splice(i, 1);
            this.topology.model.root.physicalEntities = allItems

        }


        await this.updateXml()
    }

    async deletePhysicalLink(source,target){
        
        if(!this.topology.model.root.physicaConnection)
            return 

        if(!isIterable(this.topology.model.root.physicaConnection)){
            this.topology.model.root.physicaConnection = null
        } else{

            let i
            let allItems = this.topology.model.root.physicaConnection
            for(i in allItems){
                if((allItems[i].source == source && allItems[i].target== target) || (allItems[i].source == target && allItems[i].source== target)){
                    break;
                }

            }
            
            allItems.splice(i, 1);
            this.topology.model.root.physicaConnection = allItems

        }


        await this.updateXml()
    }

    /**
     * Rimuove tutti i link fisici associati a un entità. Questa funzionalità deve essere
     * invocata quando un entità fisica viene rimossa.
     */
    async deleteAllPhysicalLinkEntity(name){
        
        if(!this.topology.model.root.physicalEntities)
            return 

        if(!isIterable(this.topology.model.root.physicalEntities)){

            for(let virtualEntityname of this.topology.model.root.physicalEntities.entity.mapping){
                await this.deletePhysicalLink(virtualEntityname,name)
            }

            this.topology.model.root.physicalEntities = null
        } else{

            let i
            let allItems = this.topology.model.root.physicalEntities

            for(i in allItems){
                if(allItems[i].entity.name == name){

                    for(let virtualEntityname of allItems[i].entity.mapping){
                        await this.deletePhysicalLink(virtualEntityname,name)
                    }

                    break;
                }

            }
    
        }


        await this.updateXml()

    }

    async removeRoute(entitySource, entityTarget){

        let entity = this.entitiesByName[entitySource]
        let st

        if(entity.type == "Gateway"){
            st = this.entitiesByName[entityTarget]
        }else if (entity.type == "Terminal"){
            st = entity
        }else {
            return
        }

        let allItems = this.topology.model.root.st_assignment.assignments.item

        if(!isIterable(allItems)){
            this.topology.model.root.st_assignment.assignments = ""
        } else{

            let i
            for(i in allItems){
                if(allItems[i].terminal_id == st.getID()){
                    break;
                }

            }
            
            allItems.splice(i, 1);
            this.topology.model.root.st_assignment.assignments.item = allItems

        }

        await this.updateXml()
    }

    /**
     * La rimozione di uno spot comporta la rimozione di tutte le rotte associate
     */
    async removeSpot(entitySource, entityTarget){

        let entity = this.entitiesByName[entitySource]
        let gw_name
        let gw
        let sat

        if(entity.type == "Satellite"){
            gw = this.entitiesByName[entityTarget]
            gw_name = entityTarget
            sat = entity
        }else if (entity.type == "Gateway"){
            gw = entity
            gw_name = entitySource
            sat = this.entitiesByName[entityTarget]
        }else {
            return
        }

        let allItems = this.topology.model.root.frequency_plan.spots.item

        if(!isIterable(allItems)){

            allItems.assignments.gateway_id = -1
            allItems.assignments.sat_id_gw = -1
            allItems.assignments.sat_id_st = -1

            this.topology.model.root.frequency_plan.spots.item = allItems
        } else if(allItems.length){

            let i
            for(i in allItems){
                if(allItems[i].assignments.gateway_id == gw.getID() && allItems[i].assignments.sat_id_gw == sat.getID() ){
                    break;
                }

            }

            allItems.splice(i, 1);
            this.topology.model.root.frequency_plan.spots.item = allItems

        }

        await this.updateXml()
        await this.removeAllRouteByGW(gw_name)


    }

    /**
     * Rimuove tutte le rotte associate a un gateway. Questa funzionalità deve essere
     * invocata quando si elimina uno spot oppure quando si elimina un gateway fisico o viertuale
     */
    async removeAllRouteByGW(nameGW){

        let entity = this.entitiesByName[nameGW]
        let allItems = this.topology.model.root.st_assignment.assignments.item

        if(this.topology.model.root.st_assignment.assignments == "")
            return 

        if(!isIterable(allItems) && allItems.gateway_id == entity.getID()){

            this.topology.model.root.st_assignment.assignments = ""
            await this.updateXml()

        } else{

            let i
            for(i in allItems){
                if(allItems[i].gateway_id == entity.getID() ){
                    allItems.splice(i, 1);
                }

            }

            this.topology.model.root.st_assignment.assignments.item = allItems
            await this.updateXml()

        }



    }


    /**
     * Rimuove tutti gli spot associati a un gw o a un satellite
     */
    async removeAllSpotEntity(name_entity){
        let allItems = this.topology.model.root.frequency_plan.spots.item
        console.log(allItems)
    }

    async updateXml(){

        const builder = new xml2js.Builder();

        const xmlStringTopology = builder.buildObject(this.topology);
        const options_topology = {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              "Accept": "application/json"
            },
            body: JSON.stringify({"xml_data" : xmlStringTopology})
        };

        await fetch(this.urlTopology,options_topology)


        if(this.profile ){
            let xmlStringProfile = builder.buildObject(this.profile);
            let options_profile = {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  "Accept": "application/json"
                },
                body: JSON.stringify({"xml_data" : xmlStringProfile})
            };
    
            await fetch(this.urlTemplate+ this.nameProject,options_profile)
        }


    }


}

/**
 * Funzionalità che serve per verificare se un oggetto è una lista
 */
function isIterable(obj) {
    if(obj)
        return typeof obj[Symbol.iterator] === 'function';
    
    return false
  }

function searchSatId(idGateway, spots){
    for(let spot of spots){
        if(spot.assignments.gateway_id == idGateway)
            return spot.assignments.sat_id_gw
    }
}

module.exports = ModelNetwork