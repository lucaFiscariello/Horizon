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
import { Box, Grid } from "@chakra-ui/react";
import { configureEntity } from "clientModel/clientModel";
import { addPhysicalEntity } from "clientModel/clientModel";
import { addPhysicalMapping } from "clientModel/clientModel";
import { addRoute } from "clientModel/clientModel";
import { getPhysicalLinks } from "clientModel/clientModel";
import { getPhysicalMapping } from "clientModel/clientModel";
import { deletePhysicalLink } from "clientModel/clientModel";
import { getRoutes } from "clientModel/clientModel";
import { getSpots } from "clientModel/clientModel";
import { deletePhysicalNode } from "clientModel/clientModel";
import { getAllVirtualNode } from "clientModel/clientModel";
import { getPhysicalNode } from "clientModel/clientModel";
import { addSpot } from "clientModel/clientModel";
import { addPhysicalLink } from "clientModel/clientModel";
import { modifyEntity } from "clientModel/clientModel";
import { addEntity } from "clientModel/clientModel";
import CreateProjectButton from "opensand/Model/CreateProjectButton.tsx";

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
      <button onClick={async () => {

        //await modifyEntity("test","sat","192.0.0.1","00:00:00:00:00:02")

        
        await addPhysicalEntity("test","gw","Gateway")
        await configureEntity("test","gw","130.0.0.1","00:00:00:00:00:01")

        await addPhysicalEntity("test","sat","Satellite")
        await configureEntity("test","sat","130.0.0.2","00:00:00:00:00:02")

        await addPhysicalEntity("test","st","Terminal")
        await configureEntity("test","st","130.0.0.4","00:00:00:00:00:04")

        //await addEntity("test","gw2","Gateway")
        //await configureEntity("test","gw2","130.0.0.3","00:00:00:00:00:03")
        //await addPhysicalMapping("test","gw","gw2")

        //await addPhysicalLink("test","gw","sat")
        await addSpot("test","Transparent","Transparent","sat","gw")
        //await addSpot("test","Transparent","Transparent","sat","gw2")
        await addRoute("test","gw","st")
        //await addRoute("test","gw2","st")

        
        let node = await getPhysicalNode("test")
        let link = await getPhysicalLinks("test")
        let entities = await getAllVirtualNode("test")
        let mapping = await getPhysicalMapping("test","gw")
        
        //console.log(mapping)
        //await deletePhysicalNode("test","gw")
        //await deletePhysicalLink("test","gw","sat")

        
        let spot = await getSpots("test","sat")
        let routes = await getRoutes("test")
        console.log(routes)


        }} >  test </button>
    </Box>
  );
}