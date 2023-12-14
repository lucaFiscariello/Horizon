const  xml2js  = require("xml2js");

/**
 * Classe modella un'entità di una rete satellitare. Offre funzionalità per modificare e ottenere parametri dei tre xml: topology, infrastruttura, profile
 */
class ModelEntity {

    constructor(nameEntity,nameProject,type) {        
        this.urlTemplate = "http://127.0.0.1:8888/api/project/"
        this.nameProject = nameProject
        this.nameEntity = nameEntity;
        this.type = type
        this.topology = {}
        this.infrastructure = {}
        this.profile = {}

        let infrastructureSTR = "/infrastructure/"
        let topologySTR = "/topology"
        let profileSTR = "/profile/"

        this.urlInfrastructure = this.urlTemplate + this.nameProject+ infrastructureSTR + this.nameEntity
        this.urlProfile= this.urlTemplate + this.nameProject+ profileSTR + this.nameEntity
        this.urlTopology= this.urlTemplate + this.nameProject+ topologySTR
               
    }


    /**
     * Crea gli xml di default per un entità. Questa funzione deve essere invocata appena viene creata una nuova entità.
     */
    async createEntity() {
        const urlInfrastructureDefault = this.urlTemplate+this.nameProject+"/template/infrastructure/Default.xml"
        let urlprofileDefault = ""

        switch(this.type){
            case "Satellite" :
                urlprofileDefault = this.urlTemplate+this.nameProject+"/template/profile_sat/Default.xml"
                break;
            case "Gateway" :
                urlprofileDefault = this.urlTemplate+this.nameProject+"/template/profile_gw/Default.xml"
                break;
            case "Terminal" :
                urlprofileDefault = this.urlTemplate+this.nameProject+"/template/profile_st/Default.xml"
                break;
        }

        const response_inf = await fetch(urlInfrastructureDefault)
        const jsonData_inf =  await response_inf.json();
        const result_inf =  await xml2js.parseStringPromise(jsonData_inf.content, { explicitArray: false });
        this.infrastructure = result_inf

        const response_pr = await fetch(urlprofileDefault)
        const jsonData_pr =  await response_pr.json();
        const result_pr =  await xml2js.parseStringPromise(jsonData_pr.content, { explicitArray: false });
        this.profile = result_pr

        this.setType()

        await this.updateXml()

    }

    /**
     * Carica i tre xml di un entità
     */
    async loadXML() {

        const response_inf = await fetch(this.urlInfrastructure)
        const jsonData_inf =  await response_inf.json();
        const result_inf =  await xml2js.parseStringPromise(jsonData_inf.content, { explicitArray: false });
        this.infrastructure = result_inf

        const response_pr = await fetch(this.urlProfile)
        const jsonData_pr =  await response_pr.json();
        const result_pr =  await xml2js.parseStringPromise(jsonData_pr.content, { explicitArray: false });
        this.profile = result_pr

    }
    
    /**
     * Aggiorna gli xml in seguito a delle modifiche locali. Le modifiche sono passate al server opensand
     */
    async updateXml(){

        const builder = new xml2js.Builder();

        const xmlString = builder.buildObject(this.infrastructure);
        const options = {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              "Accept": "application/json"
            },
            body: JSON.stringify({"xml_data" : xmlString})
        };

        await fetch(this.urlInfrastructure,options)


        const xmlStringPrf = builder.buildObject(this.profile);
        const options_profile = {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              "Accept": "application/json"
            },
            body: JSON.stringify({"xml_data" : xmlStringPrf})
        };

        await fetch(this.urlProfile,options_profile)

    }

    getID(){

        switch(this.type){
            case "Satellite" :
                return this.infrastructure.model.root.entity.entity_sat.entity_id

            case "Gateway" :
                return this.infrastructure.model.root.entity.entity_gw.entity_id

            case "Terminal" :
                return this.infrastructure.model.root.entity.entity_st.entity_id
                
        }
    }

    getIP(){

        switch(this.type){
            case "Satellite" :
                return this.infrastructure.model.root.entity.entity_sat.emu_address

            case "Gateway" :
                return this.infrastructure.model.root.entity.entity_gw.emu_address

            case "Terminal" :
                return this.infrastructure.model.root.entity.entity_st.emu_address
                
        }
    }

    getMAC(){

        switch(this.type){
            case "Satellite" :
                return this.infrastructure.model.root.entity.entity_sat.mac_address

            case "Gateway" :
                return this.infrastructure.model.root.entity.entity_gw.mac_address

            case "Terminal" :
                return this.infrastructure.model.root.entity.entity_st.mac_address
                
        }
    }

    async setIP(ip){

        switch(this.type){
            case "Satellite" :
                this.infrastructure.model.root.entity.entity_sat.emu_address = ip
                break;

            case "Gateway" :
                this.infrastructure.model.root.entity.entity_gw.emu_address = ip
                break;

            case "Terminal" :
                this.infrastructure.model.root.entity.entity_st.emu_address = ip
                break;
        }

        await this.updateXml()

    }

    async setMAC(mac){

        switch(this.type){
            case "Satellite" :
                this.infrastructure.model.root.entity.entity_sat.mac_address = mac
                break;

            case "Gateway" :
                this.infrastructure.model.root.entity.entity_gw.mac_address = mac
                break;

            case "Terminal" :
                this.infrastructure.model.root.entity.entity_st.mac_address = mac
                break;
        }

        await this.updateXml()

    }

    async setID(id){

        switch(this.type){
            case "Satellite" :
                this.infrastructure.model.root.entity.entity_sat.entity_id = id
                break;

            case "Gateway" :
                this.infrastructure.model.root.entity.entity_gw.entity_id = id
                break;

            case "Terminal" :
                this.infrastructure.model.root.entity.entity_st.entity_id = id
                break;
        }

        await this.updateXml()

    }

    async setType(){
    
        this.infrastructure.model.root.entity.entity_type = this.type
        await this.updateXml()

    }

    async addEntity(type,ip,mac,id){

        let entity = new Object()
        let item = new Object()

        entity.entity_id = id
        entity.emu_adress = ip
        entity.mac_adress = mac

        item.item = entity


        let entities
        switch(type){
            case "Satellite" :
                entities = this.infrastructure.model.root.infrastructure.satellites
                break;

            case "Gateway" :
                entities = this.infrastructure.model.root.infrastructure.gateways
                break;

            case "Terminal" :
                entities = this.infrastructure.model.root.infrastructure.terminals
                break;
        }


        if (entities == ''){
            entities = item
        } else if(!isIterable(entities.item)){
            entities.item = [entities.item,entity]
        }else{
            entities.item = [...entities.item,entity]
        }

        
        switch(type){
            case "Satellite" :
                this.infrastructure.model.root.infrastructure.satellites = entities
                break;

            case "Gateway" :
                this.infrastructure.model.root.infrastructure.gateways = entities
                break;

            case "Terminal" :
                this.infrastructure.model.root.infrastructure.terminals = entities
                break;
        }


        this.updateXml()


    }

    async modifyEntity(type,ip,mac,id){

        let entity = new Object()
        let item = new Object()

        entity.entity_id = id
        entity.emu_adress = ip
        entity.mac_adress = mac

        item.item = entity


        let entities
        switch(type){
            case "Satellite" :
                entities = this.infrastructure.model.root.infrastructure.satellites
                break;

            case "Gateway" :
                entities = this.infrastructure.model.root.infrastructure.gateways
                break;

            case "Terminal" :
                entities = this.infrastructure.model.root.infrastructure.terminals
                break;
        }


        if (entities == ''){
            entities = item
        } else if(!isIterable(entities.item)){

            if(entities.item.entity_id == id){
                entities.item = entity
            }

        }else{

            for(let oldEntityId in entities.item){
                if(entities.item[oldEntityId].entity_id==id)
                    entities.item[oldEntityId]= entity
            }
        }

        
        switch(type){
            case "Satellite" :
                this.infrastructure.model.root.infrastructure.satellites = entities
                break;

            case "Gateway" :
                this.infrastructure.model.root.infrastructure.gateways = entities
                break;

            case "Terminal" :
                this.infrastructure.model.root.infrastructure.terminals = entities
                break;
        }


        this.updateXml()


    }

    async deleteEntity(id,type){

        let entities
        switch(type){
            case "Satellite" :
                entities = this.infrastructure.model.root.infrastructure.satellites
                break;

            case "Gateway" :
                entities = this.infrastructure.model.root.infrastructure.gateways
                break;

            case "Terminal" :
                entities = this.infrastructure.model.root.infrastructure.terminals
                break;
        }


        if (entities == ''){
            return
        } else if(!isIterable(entities.item)){

            if(entities.item.entity_id == id){
                entities = ''
            }

        }else{


            let i
            for(i in entities.item){
                if(entities.item[i].entity_id == id){
                    break;
                }

            }
            
            entities.item.splice(i, 1);            
            
        }

        
        switch(type){
            case "Satellite" :
                this.infrastructure.model.root.infrastructure.satellites = entities
                break;

            case "Gateway" :
                this.infrastructure.model.root.infrastructure.gateways = entities
                break;

            case "Terminal" :
                this.infrastructure.model.root.infrastructure.terminals = entities
                break;
        }


        this.updateXml()


    }
    
    
}

function isIterable(obj) {
    if(obj)
        return typeof obj[Symbol.iterator] === 'function';
    
    return false
  }


module.exports = ModelEntity





