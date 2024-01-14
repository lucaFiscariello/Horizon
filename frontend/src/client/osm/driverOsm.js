import { delete_token, get_NSs, get_VNFDs, get_vims, post_NS, post_NSD, post_NST, post_NST_instance, post_NST_instatiate, post_NS_instatiate, post_action, post_migrate_vnf, post_token, put_NSD, put_NST } from "./api/osmClient"
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
        return id    
    }

    async instance_entity(name,id,vim){
        let id_openstack = await this.get_id_vim_openstack(vim)
        let idNS = await post_NS(this.token,name,id,id_openstack)  
        idNS = idNS.id
        await post_NS_instatiate(this.token,name,idNS,id,id_openstack)  
    }

    async post_NST(){
        let res = await post_NST(this.token)
        return res
    }

    async put_NST(id,data){
        let res = await put_NST(this.token,id,yaml.dump(data))
        return res
    }

    async put_nst_instance(nsiName,nsdID){
        let id_openstack = await this.get_id_vim_openstack()
        let response = await post_NST_instance(this.token,nsiName,nsdID,id_openstack)  
        return await response.json()
    }

    async put_nst_instantiate(nsiName,nsiID){
        let id_openstack = await this.get_id_vim_openstack()
        let response = await post_NST_instatiate(this.token,nsiName,nsiID,id_openstack)
        return response
    }

    async get_NSs(){
        let nss = await get_NSs(this.token)
        return nss
    }    

    async get_VNFs(){
        let vnfs = await get_VNFDs(this.token)
        return vnfs
    } 
    
    async get_id_vim_openstack(vim_name){
        let vims = await get_vims(this.token)
        for(let vim of vims){
            if(vim.name == vim_name)
                return vim._id
        }
        return vims[0]._id
    }

    async migrate_vnf(vnf_id, ns_id){
        let response = post_migrate_vnf(this.token,vnf_id,ns_id)
        return response
    }


    async load_xml(nsId,file_name,data_file){
        let nameAction = "print"
        let vnf_index = "vnf1"

        let configparams = new Object()
        configparams.xml = data_file
        configparams.file_name = file_name

        let response = await post_action(this.token,nameAction,nsId,vnf_index,configparams)
        return response
    }

    async config_network(nsId,EMU_IFACE,LAN_IFACE,TAP_IFACE,TAP_MAC,BR_IFACE,BR_IFACE_IP){
      
        let nameAction = "config-net"
        let vnf_index = "vnf1"
        let configparams = new Object()


        if(EMU_IFACE){
            configparams.EMU_IFACE = EMU_IFACE
            configparams.LAN_IFACE = LAN_IFACE
    
            configparams.TAP_IFACE = TAP_IFACE
            configparams.TAP_MAC = TAP_MAC
            configparams.BR_IFACE = BR_IFACE
            configparams.BR_IFACE_IP = BR_IFACE_IP

            configparams.LAN_NET_OTHER = ""
            configparams.BR_IFACE_IP_OTHER = ""
            configparams.TAP_MAC_OTHER = ""

        }


        return await post_action(this.token,nameAction,nsId,vnf_index,configparams)
    }
       
}
