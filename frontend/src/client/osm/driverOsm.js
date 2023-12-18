import { delete_token, get_NSs, get_VNFDs, get_vims, post_NS, post_NSD, post_NS_instatiate, post_action, post_migrate_vnf, post_token, put_NSD } from "./api/osmClient"
import yaml from 'js-yaml';

export class DriverOsm {

    constructor() {        
        this.token = ""
    }

    async inizialize() {
        this.token = await post_token()
    }

    async refresh_token() {
        await delete_token(this.token)
        this.token = await post_token()
    }

    async create_entity(data){
 
        let response = await post_NSD(this.token)
        let id = response.id

        await put_NSD(this.token,id,yaml.dump(data))    
    }

    async instance_entity(name,id){
        let id_openstack = await this.get_id_vim_openstack()
        let idNS = await post_NS(this.token,name,id,id_openstack)  
        idNS = idNS.id
        await post_NS_instatiate(this.token,name,idNS,id,id_openstack)  
    }



    async get_NSs(){
        let nss = await get_NSs(this.token)
        return nss
    }    

    async get_VNFs(){
        let vnfs = await get_VNFDs(this.token)
        return vnfs
    } 
    
    async get_id_vim_openstack(){
        let vims = await get_vims(this.token)
        return vims[0]._id
    }

    async migrate_vnf(vnf_id, ns_id){
        let response = post_migrate_vnf(this.token,vnf_id,ns_id)
        return response
    }


    async load_xml(nameAction,nsId,vnf_index,file_name,data_file){
        //let nameAction = "print"
        //let nsId = "6e411994-b644-4e61-a6d2-94f5ed6b86b6"
        //let vnf_index = "my_first_vnf"

        let configparams = new Object()
        configparams.xml = data_file
        configparams.file_name = file_name

        let response = post_action(this.token,nameAction,nsId,configparams,vnf_index)
        return response
    }
   
    
}
