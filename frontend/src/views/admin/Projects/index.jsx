/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, Grid, Stack } from "@chakra-ui/react";
import { configureEntity } from "client/opensad-wrapper/clientModel";
import { addPhysicalEntity } from "client/opensad-wrapper/clientModel";
import { addPhysicalMapping } from "client/opensad-wrapper/clientModel";
import { addRoute } from "client/opensad-wrapper/clientModel";
import { getPhysicalLinks } from "client/opensad-wrapper/clientModel";
import { getPhysicalMapping } from "client/opensad-wrapper/clientModel";
import { deletePhysicalLink } from "client/opensad-wrapper/clientModel";
import { getRoutes } from "client/opensad-wrapper/clientModel";
import { getSpots } from "client/opensad-wrapper/clientModel";
import { deletePhysicalNode } from "client/opensad-wrapper/clientModel";
import { getModel } from "client/opensad-wrapper/clientModel";
import { getAllVirtualNode } from "client/opensad-wrapper/clientModel";
import { getPhysicalNode } from "client/opensad-wrapper/clientModel";
import { addSpot } from "client/opensad-wrapper/clientModel";
import { addPhysicalLink } from "client/opensad-wrapper/clientModel";
import { modifyEntity } from "client/opensad-wrapper/clientModel";
import { addEntity } from "client/opensad-wrapper/clientModel";
import { create_ns_sat } from "client/osm-wrapper/client-osm-wrapper";
import { create_nst } from "client/osm-wrapper/client-osm-wrapper";
import { create_ns_gw_st } from "client/osm-wrapper/client-osm-wrapper";
import { DriverOsm } from "client/osm/driverOsm";
import CreateProjectButton from "opensand/Model/CreateProjectButton.tsx";
import xml2js from "xml2js"
// Custom components

import Projects from "views/admin/Projects/components/Projects";
// Assets


export default function Overview() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}

      <Grid
        mb='20px'
        templateColumns={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
          "1xl": "1.34fr 1.62fr 1fr",
        }}
        templateRows={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
          "2xl": "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}>
        <Projects
          gridArea='1 / 2 / 2 / 2'
          name='Adela Parkson'
          job='Product Designer'
          posts='17'
          followers='9.7k'
          following='274'
        />
     
        
      </Grid>
      <CreateProjectButton></CreateProjectButton>
      <Stack>
        <button onClick={async () => {
          
          
          
          //await modifyEntity("test","sat","192.0.0.1","00:00:00:00:00:02")

          //await addPhysicalEntity("test","gw","Gateway")
          await addEntity("test","gw","Gateway")
          await configureEntity("test","gw","192.168.0.3","00:00:00:00:00:01")

          await addEntity("test","sat","Satellite")
          await configureEntity("test","sat","192.168.0.1","00:00:00:00:00:02")

          await addEntity("test","st","Terminal")
          await configureEntity("test","st","192.168.0.2","00:00:00:00:00:03")

          //await addEntity("test","gw2","Gateway")
          //await configureEntity("test","gw2","130.0.0.3","00:00:00:00:00:03")
          //await addPhysicalMapping("test","gw","gw2")

          //await addPhysicalLink("test","gw","sat")
          await addSpot("test","Transparent","Transparent","sat","gw")
          //await addSpot("test","Transparent","Transparent","sat","gw2")
          await addRoute("test","gw","st")
          //await addRoute("test","gw2","st")

          
          //let node = await getPhysicalNode("test")
          //let link = await getPhysicalLinks("test")
          //let entities = await getAllVirtualNode("test")
          //let mapping = await getPhysicalMapping("test","gw")
          let spot = await getSpots("test","sat")
          let routes = await getRoutes("test")

          console.log(spot)
          console.log(routes)


          //await deletePhysicalNode("test","gw")
          //await deletePhysicalLink("test","gw","sat")
        
          }} >  configura opensad </button>
        
        <button onClick={async () => {
          
          let driverOsm = new DriverOsm()
          await driverOsm.inizialize()

          await driverOsm.get_id_vim_openstack()
          
          let nsd = await create_ns_sat("Satellite","sat","192.168.0.1","192.168.0.0/24")
          let id = await driverOsm.create_entity(nsd)
          id = driverOsm.instance_entity("sat",id,"phy-sat")
          console.log(id)

          await new Promise(r => setTimeout(r, 5000));

          nsd = await create_ns_gw_st("Gateway","gw","192.168.0.3","10.10.10.0/24","192.168.0.0/24","sat")
          id = await driverOsm.create_entity(nsd)
          id = driverOsm.instance_entity("gw",id,"phy-gw")
          console.log(id)

          nsd = await create_ns_gw_st("Terminal","st","192.168.0.2","10.20.10.0/24","192.168.0.0/24","sat")
          id = await driverOsm.create_entity(nsd)
          id = driverOsm.instance_entity("st",id,"phy-st")
          console.log(id)


          

          }} >  creazione rete </button>     


        <button onClick={async () => {
          
          let driverOsm = new DriverOsm()
          await driverOsm.inizialize()
      
          const builder = new xml2js.Builder();
          let nss = await driverOsm.get_NSs()
          let model = await getModel("test")
          let template_ip_br = "192.168.63."
          let i = 1

          for (let ns of nss){
            let entity = model.model.entitiesByName[ns.nsd.id]

            const xmlStringinf = builder.buildObject(entity.infrastructure);
            const xmlStringTop = builder.buildObject(model.model.topology);
            const xmlStringProf = builder.buildObject(entity.profile);
            
            await driverOsm.load_xml(ns._id,"infrastructure.xml",xmlStringinf)
            await driverOsm.load_xml(ns._id,"topology.xml",xmlStringTop)
            await driverOsm.load_xml(ns._id,"profile.xml",xmlStringProf)

            let type = entity.infrastructure.model.root.entity.entity_type
            let mac;
            
            switch(type){

              case "Satellite" :
                  mac= entity.infrastructure.model.root.entity.entity_sat.mac_address
                  break;

              case "Gateway" :
                  mac = entity.infrastructure.model.root.entity.entity_gw.mac_address
                  break;

              case "Terminal" :
                  mac = entity.infrastructure.model.root.entity.entity_st.mac_address
                  break;
            } 

            if(ns.nsd.id != "sat"){
              let res = await driverOsm.config_network(ns._id,"ens4","ens5","opensand_tap",mac,"opensand_br",template_ip_br+i)
              console.log("-----------------")
              console.log(ns._id)
              console.log(mac)
              console.log(ns.nsd.id)
              console.log(template_ip_br+i)
              console.log(entity)
            }

            
            
            i = i+1
          }
            
      
        

          }} >  configura rete </button>


          </Stack>
      </Box>
   
  );
}
