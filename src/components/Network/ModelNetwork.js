import { ModelEntity } from "./ModelEntity";
import xml2js from 'xml2js';
import sat from 'assets/img/opensand/sat.png'


/**
 * Classe che modella una rete satellitare. Mantiene il riferimento alla lista delle entità che compongono la rete. Ogni entità mantiene a sua volta
 * i riferimenti agli xml di configurazione delle entità.
 */
export class ModelNetwork {

    constructor(nameProject,machines) {   
        this.urlTemplate = "api/project/"
        let topologySTR = "/topology"
        this.nameProject = nameProject
        this.machines = machines
        this.urlTopology= this.urlTemplate + this.nameProject+ topologySTR
        this.topology={}
        this.entities = {} 
        this.entitiesByName = {}          
    }

    /**
     * Funzione che carica i file di configurazione di tutte le entità della rete 
     */
    async loadModel() {
        
        for (let entity of this.machines){

            if(entity){
                let entityname = entity["name"]
                let entityModel = new ModelEntity(entityname,this.nameProject,entity["type"])
    
                await entityModel.loadXML()
                
                this.entities[entityModel.getID()] = entityModel
                this.entitiesByName[entityname] = entityModel

            }

        }

        const response = await fetch(this.urlTopology)
        const jsonData =  await response.json();

        if(jsonData.error){
            await this.createXMLDefault()
        }else{
            const result =  await xml2js.parseStringPromise(jsonData.content, { explicitArray: false });
            this.topology = result
        }

    }

    /**
     * Modifica il file di configurazione "project.xml". Tale file mantiene i nomi degli xml di configurazione per un entità. Tale funzione
     * inserisce i nomi degli xml di default.
     */
    async loadXMLDefault() {

        let url = "/api/project/" + this.nameProject
        let defaultXml = "Default.xml"
        let builder = new xml2js.Builder();
        let entities;

        //Leggo l'xml project.xml
        const response = await fetch(url)
        const jsonData =  await response.json();
        const result =  await xml2js.parseStringPromise(jsonData.content, { explicitArray: false });


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

    /**
     * Crea gli xml di default per la topologia. Questa funzione deve essere invocata appena viene creata una nuova rete.
     */
    async createXMLDefault() {
        const urlTopologyDefault = "/api/project/"+this.nameProject+"/template/topology/Default.xml"
       
        const response = await fetch(urlTopologyDefault)
        const jsonData =  await response.json();
        const result =  await xml2js.parseStringPromise(jsonData.content, { explicitArray: false });
        this.topology = result

        //Creo uno spot di defaul con valori nulli
        let templateSpot = this.topology.model.root.frequency_plan.spots.item
        templateSpot.assignments.gateway_id = -1
        templateSpot.assignments.sat_id_gw = -1
        templateSpot.assignments.sat_id_st = -1

        this.topology.model.root.frequency_plan.spots.item = templateSpot

        //Creo una rotta di default con valori nulli
        let item = new Object()
        item.terminal_id = -1
        item.gateway_id = -1
        this.topology.model.root.st_assignment.assignments = new Object()
        this.topology.model.root.st_assignment.assignments.item = item

        await this.updateXml()

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

            mapColor[spots[spot].assignments.gateway_id] = spot
        }

        for( let route of routes){
            let link = structuredClone(linkTemplateSat)
            link.source = this.getNameEntityById(route.terminal_id)
            link.target = this.getNameEntityById(searchSatId(route.gateway_id,spots))
            link.color = color[mapColor[route.gateway_id]]
            links.push(link)
        }

        if(links.length==0)
            return links

        if(!links[0].source || !links[0].target)
            return []


        return links

    }

    getNodes(){

        const urlSat = sat
        let nodes = []
    
        for(let nodeInfo of this.machines){
            let templateNode = {"id":"","name":"","svg":"","size":400,"labelPosition": 'bottom', "x":Math.floor(Math.random() * 800) + 100,"y":Math.floor(Math.random() * 300) + 100}
            templateNode.id = nodeInfo["name"]
            templateNode.name = nodeInfo["name"]
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
        else if (allSpots.assignments.sat_id_gw == -1)
            allSpots = templateSpot
        else
            allSpots = [allSpots,templateSpot]

        this.topology.model.root.frequency_plan.spots.item = allSpots
        await this.updateXml()
    }


    async addRoute(idGatewayDefault, terminalId, gatewayId ){
       
        let item = new Object();
        let allItems = this.topology.model.root.st_assignment.assignments.item
        item.terminal_id = terminalId
        item.gateway_id = gatewayId


        if(isIterable(allItems))
            allItems = [...allItems,item]
        else if (allItems.terminal_id == -1)
            allItems = item
        else
            allItems = [allItems,item]


        this.topology.model.root.st_assignment.defaults.default_gateway=idGatewayDefault
        this.topology.model.root.st_assignment.assignments.item = allItems
        
        await this.updateXml()
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