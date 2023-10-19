import xml2js from 'xml2js';

/**
 * Classe modella un'entità di una rete satellitare. Offre funzionalità per modificare e ottenere parametri dei tre xml: topology, infrastruttura, profile
 */
export class ModelEntity {

    constructor(nameEntity,nameProject,type) {        
        this.urlTemplate = "api/project/"
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
     * Carica i tre xml di un entità
     */
    async loadXML() {

        const response_inf = await fetch(this.urlInfrastructure)
        const jsonData_inf =  await response_inf.json();

        // Se la lettura dell'xml fallisce vuol dire che l'entità è appena stata creata. Pertanto è necessario creare gli xml di defaul
        if(jsonData_inf.error){
            await this.createXMLDefault()
        }
        else{
            const result_inf =  await xml2js.parseStringPromise(jsonData_inf.content, { explicitArray: false });
            this.infrastructure = result_inf

            const response_pr = await fetch(this.urlProfile)
            const jsonData_pr =  await response_pr.json();
            const result_pr =  await xml2js.parseStringPromise(jsonData_pr.content, { explicitArray: false });
            this.profile = result_pr
        }

    }


    /**
     * Crea gli xml di default per un entità. Questa funzione deve essere invocata appena viene creata una nuova entità.
     */
    async createXMLDefault() {
        const urlTopologyDefault = "/api/project/test/template/topology/Default.xml"
        const urlInfrastructureDefault = "/api/project/test/template/infrastructure/Default.xml"
        let urlprofileDefault = ""

        switch(this.type){
            case "Satellite" :
                urlprofileDefault = "/api/project/ecco/template/profile_sat/Default.xml"
                break;
            case "Gateway" :
                urlprofileDefault = "/api/project/ecco/template/profile_gw/Default.xml"
                break;
            case "Terminal" :
                urlprofileDefault = "/api/project/ecco/template/profile_st/Default.xml"
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

        await this.updateXml()

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


    async setGatewayID(id){
        this.infrastructure.model.root.entity.entity_gw.entity_id = id
        await this.updateXml()
    }

    async setGatewayIP(ip){
        this.infrastructure.model.root.entity.entity_gw.emu_address = ip
        await this.updateXml()
    }

    async setGatewayMAC(mac){
        this.infrastructure.model.root.entity.entity_gw.mac_address = mac
        await this.updateXml()
    }

    async setTerminalID(id){
        this.infrastructure.model.root.entity.entity_st.entity_id = id
        await this.updateXml()
    }

    async setGatewayIP(ip){
        this.infrastructure.model.root.entity.entity_st.emu_address = ip
        await this.updateXml()
    }

    async setGatewayMAC(mac){
        this.infrastructure.model.root.entity.entity_st.mac_address = mac
        await this.updateXml()
    }

    async setSatelliteID(id){
        this.infrastructure.model.root.entity.entity_sat.entity_id = id
        await this.updateXml()
    }

    async setSatelliteIP(ip){
        this.infrastructure.model.root.entity.entity_sat.emu_address = ip
        await this.updateXml()
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
    
}






