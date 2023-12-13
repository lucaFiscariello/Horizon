const  yaml  = require("js-yaml")
const  yaml_vnf  = require("../yaml/defaul-vnf")
const  yaml_ns  = require("../yaml/defaul-ns")

class NsdOsm {

    constructor(modelNetwork) {        
        this.modelNetwork = modelNetwork  
        this.nsd = yaml.load(yaml_ns); 
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




    


   
    
}

module.exports = NsdOsm
