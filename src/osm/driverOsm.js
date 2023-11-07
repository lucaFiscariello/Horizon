import { delete_token, post_NS, post_NSD, post_NS_instatiate, post_token, put_NSD } from "./api/osmClient"
import yaml from 'js-yaml';
import { yaml_ns } from "./yaml/defaul-ns";
import { yaml_vnf } from "./yaml/defaul-vnf";

export class DriverOsm {

    constructor(modelNetwork) {        
        this.token = ""
        this.modelNetwork = modelNetwork  
        this.nsd = "" 
    }

    async inizialize() {
        await this.modelNetwork.loadXMLDefault()
        await this.modelNetwork.loadModel(false)
        let parsedData = yaml.load(yaml_ns);

        this.token = await post_token()
        this.nsd = parsedData
    }

    async refresh_token() {
        await delete_token(this.token)
        this.token = await post_token()
    }

    set_id(id){
        this.nsd.nsd.nsd[0].id=id
    }

    set_name(name){
        this.nsd.nsd.nsd[0].name=name
    }

    set_network(name){
        this.nsd.nsd.nsd[0]["virtual-link-desc"][0].id=name
    }

    set_description(description){
        this.nsd.nsd.nsd[0].description=description
    }

    add_vnf(id,network){
        let parsedData = yaml.load(yaml_vnf);
        let newVnf = parsedData["vnf-profile"][0]

        newVnf.id = id
        newVnf["virtual-link-connectivity"][0]["virtual-link-profile-id"] = network

        if(this.nsd.nsd.nsd[0].df[0]["vnf-profile"] == null ){
            this.nsd.nsd.nsd[0].df[0]["vnf-profile"] = []
        }

        this.nsd.nsd.nsd[0].df[0]["vnf-profile"].push(newVnf)
        
    }


    async create_NS(){
        let response = await post_NSD(this.token)
        let id = response.id

        for( let machine of this.modelNetwork.machines){
            this.add_vnf(machine.name,"test")
        }


        let data = yaml.dump(this.nsd);
        await put_NSD(this.token,id,data)
        
        let idNS = await post_NS(this.token,this.nsd.nsd.nsd[0].name,id,"961654c4-6239-4666-bd93-734ae34ad510")  
        idNS = idNS.id
    
        await post_NS_instatiate(this.token,this.nsd.nsd.nsd[0].name,idNS,id,"961654c4-6239-4666-bd93-734ae34ad510")  
        
    }

    

   
    
}
