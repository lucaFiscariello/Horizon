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
import { create_ns_node } from "client/osm-wrapper/client-osm-wrapper";
import { enableCollector } from "client/opensad-wrapper/clientModel";
import MapComponent from "components/Network/Map";
import { configureSymbolRateUP } from "client/opensad-wrapper/clientModel";
import { configureSymbolRateDown } from "client/opensad-wrapper/clientModel";
import { configureModulationDown } from "client/opensad-wrapper/clientModel";
import { configureModulationUP } from "client/opensad-wrapper/clientModel";
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

      </Box>
   
  );
}

// su st sudo ip route add 10.20.10.2 via 10.20.10.2
// su gw sudo ip route add 10.10.10.2 via 10.10.10.2
// su ws_gw 	ip route replace 10.20.10.0/24 via 10.10.10.174 dev ens4
// su ws_st 	ip route replace 10.10.10.0/24 via 10.20.10.187 dev ens4