import { typeOf } from 'react-is';
import xml2js from 'xml2js';


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

    async loadXML() {

        const response_inf = await fetch(this.urlInfrastructure)
        const jsonData_inf =  await response_inf.json();
        if(!jsonData_inf.error){
            const result_inf =  await xml2js.parseStringPromise(jsonData_inf.content, { explicitArray: false });
            this.infrastructure = result_inf
        }
       
        const response_tp = await fetch(this.urlTopology)
        const jsonData_tp =  await response_tp.json();
        if(!jsonData_tp.error){
            const result_tp =  await xml2js.parseStringPromise(jsonData_tp.content, { explicitArray: false });
            this.topology = result_tp
        }

        const response_pr = await fetch(this.urlProfile)
        const jsonData_pr =  await response_pr.json();
        if(!jsonData_pr.error){
            const result_pr =  await xml2js.parseStringPromise(jsonData_pr.content, { explicitArray: false });
            this.profile = result_pr
        }

        await this.loadXMLDefault()

    }

    // /api/project/test/template/topology/Default.xml
    // /api/project/test/template/infrastructure/Default.xml
    // http://localhost/api/project/ecco/template/profile_st/Default.xml
    // http://localhost/api/project/ecco/template/profile_sat/Default.xml
    // http://localhost/api/project/ecco/template/profile_gw/Default.xml


    async loadXMLDefault() {
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

        const response_tp = await fetch(urlTopologyDefault)
        const jsonData_tp =  await response_tp.json();
        const result_tp =  await xml2js.parseStringPromise(jsonData_tp.content, { explicitArray: false });
        this.topology = result_tp

        const response_pr = await fetch(urlprofileDefault)
        const jsonData_pr =  await response_pr.json();
        const result_pr =  await xml2js.parseStringPromise(jsonData_pr.content, { explicitArray: false });
        this.profile = result_pr

        await this.updateXml()

    }

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

    async addSpot(forward_regen_level,return_regen_level,gateway_id,sat_id_gw,sat_id_st){
        let allSpots = this.topology.model.root.frequency_plan.spots.item
        let templateSpot

        if (Array.isArray(allSpots))
            templateSpot= structuredClone(allSpots[0])
        else
            templateSpot= structuredClone(allSpots)

        console.log(templateSpot)

        templateSpot.assignments.forward_regen_level = forward_regen_level
        templateSpot.assignments.gateway_id = gateway_id
        templateSpot.assignments.return_regen_level = return_regen_level
        templateSpot.assignments.sat_id_gw = sat_id_gw
        templateSpot.assignments.sat_id_st = sat_id_st

        if (Array.isArray(allSpots)){
            allSpots.push(templateSpot)
            console.log("sono array")
        }
        else{
            allSpots = [templateSpot,allSpots]
            console.log("no array")
        }

        console.log(typeOf(allSpots))
        this.topology.model.root.frequency_plan.spots.item = allSpots

        await this.updateXml()
    }





    
}




