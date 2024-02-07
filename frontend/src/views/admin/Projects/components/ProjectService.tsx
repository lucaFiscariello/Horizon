import React, { useState } from 'react';
import {useParams} from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';

import {useSelector} from 'opensand/redux/index.ts';
import { Portal, Box, useDisclosure,SimpleGrid, Stack } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import routes from 'routes.js';
import { DriverOsm } from 'client/osm/driverOsm';
import { getModel } from 'client/opensad-wrapper/clientModel';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import {DownOutlined as ExpandMoreIcon} from '@ant-design/icons';
import {ThemeProvider} from '@mui/material/styles';
import createTheme from 'opensand/utils/theme.ts';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';


const Project: React.FC<Props> = (props) => {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const theme = React.useMemo(() => createTheme(prefersDarkMode), [prefersDarkMode]);
 
    const source = useSelector((state: { ping: { source: any; }; }) => state.ping.source);

    let name = useParams().id;

    const [log, setLog] = useState<string[]>([]);
    const [entitiesState, setEntities] = useState<any[]>([]);

    const { ...rest } = props;
	const [ fixed ] = useState(false);
	const [ toggleSidebar, setToggleSidebar ] = useState(false);
	
    document.documentElement.dir = 'ltr';
	const { onOpen } = useDisclosure();
	document.documentElement.dir = 'ltr';

    const appendToLog = async (message: string) => {
        setLog((prevLog) => [...prevLog, message]); 
   };

    React.useEffect(async () => {
        let model = await getModel(name)
        model = model.model

        appendToLog("Loading entities..")

        let entities: any[] = []

        // Posizione il satellite come prima entità da allocare
        for(let idEntity in model.entities){

            let entity = model.entities[idEntity]
            if(entity.type == "Satellite"){
                entities = [entity,...entities]
            }else{
                entities.push(entity)
            }
        }

        appendToLog("List entities: ")
        
        for(let entity of entities){
            appendToLog("* " +entity.nameEntity)
            entity.name = entity.nameEntity
            entity.status = "Disable"
        }

        let driverOsm = new DriverOsm()
        await driverOsm.inizialize()
        let nss = await driverOsm.get_NSs()
        
        if(nss.length >0){

            for(let ns of nss)
                for(let entity of entities)
                    if(ns.name == entity.name)
                        entity.status = ns["config-status"]
                            
        }

        setEntities(entities)

    }, []); 

 
	const getActiveRoute = (routes: string | any[],nameProject: undefined | string): any => {
		let activeRoute = nameProject;
		for (let i = 0; i < routes.length; i++) {
			if (routes[i].collapse) {
				let collapseActiveRoute = getActiveRoute(routes[i].items,nameProject);
				if (collapseActiveRoute !== activeRoute) {
					return collapseActiveRoute;
				}
			} else if (routes[i].category) {
				let categoryActiveRoute = getActiveRoute(routes[i].items,nameProject);
				if (categoryActiveRoute !== activeRoute) {
					return categoryActiveRoute;
				}
			} else {
				if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
					return routes[i].name;
				}
			}
		}
		return activeRoute;
	};

	const getActiveNavbar = (routes: string | any[]) : any => {
		let activeNavbar = false;

		for (let i = 0; i < routes.length; i++) {
			if (routes[i].collapse) {
				let collapseActiveNavbar = getActiveNavbar(routes[i].items);
				if (collapseActiveNavbar !== activeNavbar) {
					return collapseActiveNavbar;
				}
			} else if (routes[i].category) {
				let categoryActiveNavbar = getActiveNavbar(routes[i].items);
				if (categoryActiveNavbar !== activeNavbar) {
					return categoryActiveNavbar;
				}
			} else {
				if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
					return routes[i].secondary;
				}
			}
		}
		return activeNavbar;
	};

	const getActiveNavbarText = (routes: string | any[]): any => {
		let activeNavbar = false;
		for (let i = 0; i < routes.length; i++) {
			if (routes[i].collapse) {
				let collapseActiveNavbar = getActiveNavbarText(routes[i].items);
				if (collapseActiveNavbar !== activeNavbar) {
					return collapseActiveNavbar;
				}
			} else if (routes[i].category) {
				let categoryActiveNavbar = getActiveNavbarText(routes[i].items);
				if (categoryActiveNavbar !== activeNavbar) {
					return categoryActiveNavbar;
				}
			} else {
				if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
					return routes[i].messageNavbar;
				}
			}
		}
		return activeNavbar;
	};

 
    const customStyle = {
        backgroundColor: 'white', // Colore di sfondo personalizzato
        color: 'black', 
      };
  




    return (
        <ThemeProvider theme={theme}>

    	<Box>
            <Box>
				<SidebarContext.Provider
					value={{
						toggleSidebar,
						setToggleSidebar
					}}>
					<Sidebar routes={routes} display='none' {...rest} />
					<Box
						float='right'
						minHeight='100vh'
						height='100%'
						overflow='auto'
						position='relative'
						maxHeight='100%'
						w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
						maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
						transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
						transitionDuration='.2s, .2s, .35s'
						transitionProperty='top, bottom, width'
						transitionTimingFunction='linear, linear, ease'>
						<Portal>
							<Box>
								<Navbar
									onOpen={onOpen}
									logoText={'Horizon UI Dashboard PRO'}
									brandText={getActiveRoute(routes,name)}
									secondary={getActiveNavbar(routes)}
									message={getActiveNavbarText(routes)}
									fixed={fixed}
									{...rest}
								/>

							</Box>
						</Portal>

                        

                        <div className='center-div-service'>
                        
                            <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
                                <Stack spacing={0} style={{ marginTop: '-50px' }}>

                                    <Accordion defaultExpanded={true}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3-content"
                                        id="panel3-header"
                                        style={customStyle}
                                    >
                                        Gateway
                                    </AccordionSummary>

                                    	<AccordionDetails>
											<Accordion >
												<AccordionSummary
												expandIcon={<ExpandMoreIcon />}
												aria-controls="panel3-content"
												id="panel3-header"
												style={customStyle}
												>
													Server Flute
												</AccordionSummary>
												<AccordionDetails>
												<Stack spacing={2} style={{ marginTop: '20px' }}>
													<TextField id="outlined-basic" label="Ip multicast" variant="outlined" />
													<TextField id="outlined-basic" label="Url file" variant="outlined" />
													<TextField id="outlined-basic" label="OTI" variant="outlined" />
													<TextField id="outlined-basic" label="TSI" variant="outlined" />

													<button className='button' >
														Start
													</button>
													<button className='button' >
														Stop
													</button>
												</Stack>
										</AccordionDetails>
										</Accordion>


										<Accordion>
										<AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3-content"
                                        id="panel3-header"
                                        style={customStyle}
										>
											Client Flute
										</AccordionSummary>
										<AccordionDetails>										
										<Stack spacing={2} style={{ marginTop: '20px' }}>
											<TextField id="outlined-basic" label="Ip multicast" variant="outlined" />
											<TextField id="outlined-basic" label="Port" variant="outlined" />
											<TextField id="outlined-basic" label="TSI" variant="outlined" />
											<TextField id="outlined-basic" label="Buffer dimention" variant="outlined" />
											<button className='button' >
												Start
											</button>
											<button className='button' >
												Stop
											</button>
										</Stack>
										</AccordionDetails>
										</Accordion>

										<Accordion >
										<AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3-content"
                                        id="panel3-header"
                                        style={customStyle}
										>
											MQTT Publischer
										</AccordionSummary>
										<AccordionDetails>	
										<Stack spacing={2} style={{ marginTop: '20px' }}>
											<TextField id="outlined-basic" label="Topic" variant="outlined" />
											<TextField id="outlined-basic" label="Broken Adress" variant="outlined" />
											<TextField id="outlined-basic" label="Frequency" variant="outlined" />
											<button className='button' >
												Start
											</button>
											<button className='button' >
												Stop
											</button>
										</Stack>
										</AccordionDetails>
										</Accordion>


										<Accordion >
										<AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3-content"
                                        id="panel3-header"
                                        style={customStyle}
										>
											MQTT Subscriber
										</AccordionSummary>
										<AccordionDetails>	
										<Stack spacing={2} style={{ marginTop: '20px' }}>
											<TextField id="outlined-basic" label="Topic" variant="outlined" />
											<TextField id="outlined-basic" label="Broken Adress" variant="outlined" />
											<button className='button' >
												Start
											</button>
											<button className='button' >
												Stop
											</button>
										</Stack>
										</AccordionDetails>
										</Accordion>

										<Accordion >
										<AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3-content"
                                        id="panel3-header"
                                        style={customStyle}
										>
											Quic Client
										</AccordionSummary>
										<AccordionDetails>	
										<Stack spacing={2} style={{ marginTop: '20px' }}>
											<TextField id="outlined-basic" label="Server IP" variant="outlined" />
											<button className='button' >
												Start
											</button>
											<button className='button' >
												Stop
											</button>
										</Stack>
										</AccordionDetails>
										</Accordion>
										

										<Accordion >
										<AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3-content"
                                        id="panel3-header"
                                        style={customStyle}
										>
											Quic Server
										</AccordionSummary>
										<AccordionDetails>	
										<Stack spacing={2} style={{ marginTop: '20px' }}>
											<TextField id="outlined-basic" label="Server IP" variant="outlined" />
											<button className='button' >
												Start
											</button>
											<button className='button' >
												Stop
											</button>
										</Stack>
										</AccordionDetails>
										</Accordion>
                                    </AccordionDetails>
                                    </Accordion>


									<Accordion defaultExpanded={true}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3-content"
                                        id="panel3-header"
                                        style={customStyle}
                                    >
                                        Terminal
                                    </AccordionSummary>

                                    	<AccordionDetails>
											<Accordion >
												<AccordionSummary
												expandIcon={<ExpandMoreIcon />}
												aria-controls="panel3-content"
												id="panel3-header"
												style={customStyle}
												>
													Server Flute
												</AccordionSummary>
												<AccordionDetails>
												<Stack spacing={2} style={{ marginTop: '20px' }}>
													<TextField id="outlined-basic" label="Ip multicast" variant="outlined" />
													<TextField id="outlined-basic" label="Url file" variant="outlined" />
													<TextField id="outlined-basic" label="OTI" variant="outlined" />
													<TextField id="outlined-basic" label="TSI" variant="outlined" />

													<button className='button' >
														Start
													</button>
													<button className='button' >
														Stop
													</button>
												</Stack>
										</AccordionDetails>
										</Accordion>


										<Accordion>
										<AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3-content"
                                        id="panel3-header"
                                        style={customStyle}
										>
											Client Flute
										</AccordionSummary>
										<AccordionDetails>										
										<Stack spacing={2} style={{ marginTop: '20px' }}>
											<TextField id="outlined-basic" label="Ip multicast" variant="outlined" />
											<TextField id="outlined-basic" label="Port" variant="outlined" />
											<TextField id="outlined-basic" label="TSI" variant="outlined" />
											<TextField id="outlined-basic" label="Buffer dimention" variant="outlined" />
											<button className='button' >
												Start
											</button>
											<button className='button' >
												Stop
											</button>
										</Stack>
										</AccordionDetails>
										</Accordion>

										<Accordion >
										<AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3-content"
                                        id="panel3-header"
                                        style={customStyle}
										>
											MQTT Publischer
										</AccordionSummary>
										<AccordionDetails>	
										<Stack spacing={2} style={{ marginTop: '20px' }}>
											<TextField id="outlined-basic" label="Topic" variant="outlined" />
											<TextField id="outlined-basic" label="Broken Adress" variant="outlined" />
											<TextField id="outlined-basic" label="Frequency" variant="outlined" />
											<button className='button' >
												Start
											</button>
											<button className='button' >
												Stop
											</button>
										</Stack>
										</AccordionDetails>
										</Accordion>


										<Accordion >
										<AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3-content"
                                        id="panel3-header"
                                        style={customStyle}
										>
											MQTT Subscriber
										</AccordionSummary>
										<AccordionDetails>	
										<Stack spacing={2} style={{ marginTop: '20px' }}>
											<TextField id="outlined-basic" label="Topic" variant="outlined" />
											<TextField id="outlined-basic" label="Broken Adress" variant="outlined" />
											<button className='button' >
												Start
											</button>
											<button className='button' >
												Stop
											</button>
										</Stack>
										</AccordionDetails>
										</Accordion>

										<Accordion >
										<AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3-content"
                                        id="panel3-header"
                                        style={customStyle}
										>
											Quic Client
										</AccordionSummary>
										<AccordionDetails>	
										<Stack spacing={2} style={{ marginTop: '20px' }}>
											<TextField id="outlined-basic" label="Server IP" variant="outlined" />
											<button className='button' >
												Start
											</button>
											<button className='button' >
												Stop
											</button>
										</Stack>
										</AccordionDetails>
										</Accordion>
										

										<Accordion >
										<AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3-content"
                                        id="panel3-header"
                                        style={customStyle}
										>
											Quic Server
										</AccordionSummary>
										<AccordionDetails>	
										<Stack spacing={2} style={{ marginTop: '20px' }}>
											<TextField id="outlined-basic" label="Server IP" variant="outlined" />
											<button className='button' >
												Start
											</button>
											<button className='button' >
												Stop
											</button>
										</Stack>
										</AccordionDetails>
										</Accordion>
                                    </AccordionDetails>
                                    </Accordion>

                                </Stack>
                            </Box>

                        </div>
                        
                        
						<Box>
							<Footer />
						</Box>
					</Box>
				</SidebarContext.Provider>
			</Box>
		</Box>
        </ThemeProvider> 


    );
};


interface Props {
}


export default Project;
