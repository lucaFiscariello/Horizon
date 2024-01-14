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
import * as React from 'react';


// Chakra imports
import {
  Box,
  Collapse,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import {DownOutlined as ExpandMoreIcon} from '@ant-design/icons';

import useMediaQuery from '@mui/material/useMediaQuery';
import {ThemeProvider} from '@mui/material/styles';
import createTheme from 'opensand/utils/theme.ts';

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(() => createTheme(prefersDarkMode), [prefersDarkMode]);
  const customStyle = {
    backgroundColor: 'white', // Colore di sfondo personalizzato
    color: 'black', 
  };

  return (

    <ThemeProvider theme={theme}>

      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>

      <Accordion >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
            style={customStyle}
          >
            Satellite
          </AccordionSummary>
          <AccordionDetails>

          <iframe
                title="Grafana Dashboard"
                src={`http://192.168.123.150:3000/d/rYdddlPWk/node-exporter-full?orgId=1&theme=light&var-node=192.168.123.138:9100&from=now-5m&refresh=5s&kiosk`}
                width="100%"
                height="1500px"
                frameBorder={0}
            ></iframe>

          </AccordionDetails>
        </Accordion>

        <Accordion >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
            style={customStyle}
          >
            Gateway
          </AccordionSummary>
          <AccordionDetails>

          <iframe
                title="Grafana Dashboard"
                src={`http://192.168.123.150:3000/d/rYdddlPWk/node-exporter-full?orgId=1&theme=light&var-node=192.168.123.187:9100&from=now-5m&kiosk`}
                width="100%"
                height="1500px"
                frameBorder={0}
            ></iframe>

          </AccordionDetails>
        </Accordion>


        <Accordion >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
            style={customStyle}
          >
            Terminal
          </AccordionSummary>
          <AccordionDetails>

          <iframe
                title="Grafana Dashboard"
                src={`http://192.168.123.150:3000/d/rYdddlPWk/node-exporter-full?orgId=1&theme=light&var-node=192.168.123.207:9100&from=now-5m&kiosk`}
                width="100%"
                height="1500px"
                frameBorder={0}
            ></iframe>

          </AccordionDetails>
        </Accordion>


  

       
    

      

      </Box>
    </ThemeProvider> 

  );
}
