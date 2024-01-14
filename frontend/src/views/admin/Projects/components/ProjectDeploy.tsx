import React, { useState } from 'react';
import {useParams} from 'react-router-dom';
import {
    columnsDataComplex,
  } from "views/admin/dashboard/variables/columnsData.js";


import {useSelector} from 'opensand/redux/index.ts';
import xml2js from "xml2js"

import { Portal, Box, useDisclosure,SimpleGrid, Stack } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import routes from 'routes.js';
import { DriverOsm } from 'client/osm/driverOsm';
import { create_ns_sat } from 'client/osm-wrapper/client-osm-wrapper';
import { create_ns_gw_st } from 'client/osm-wrapper/client-osm-wrapper';
import { create_ns_node } from 'client/osm-wrapper/client-osm-wrapper';
import { getModel } from 'client/opensad-wrapper/clientModel';
import ComplexTable from 'views/admin/dashboard/components/ComplexTable';
import Card from 'components/card/Card';
import { getWS } from 'client/geometry-costellation/client';


const Project: React.FC<Props> = (props) => {
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

    const deploy = async () => {
        
       
        appendToLog("Start allocation...")

        let driverOsm = new DriverOsm()
        await driverOsm.inizialize()

        let sat = entitiesState[0]

        for(let entity of entitiesState){
            if(entity.type == "Satellite"){

                
                let ip = entity.ip
                let cidr = ipToCidr(ip)

                let nsd = await create_ns_sat("Satellite",entity.nameEntity,ip,cidr)
                let id = await driverOsm.create_entity(nsd)
                id = driverOsm.instance_entity(entity.nameEntity,id,"phy-sat")

                await new Promise(r => setTimeout(r, 5000));
                appendToLog("Satellite allocation..")

            }

            if(entity.type == "Gateway"){

                console.log("gateway..")

                let ip = entity.ip
                let cidr = ipToCidr(ip)

                let ws = await getWS(entity.nameEntity)

                if(ws.length>0){
                    ws = ws[0]

                    let nsd = await create_ns_gw_st("Gateway",entity.nameEntity,ip,ipToCidr(ws.ip),cidr,sat.nameEntity)
                    let id = await driverOsm.create_entity(nsd)
                    id = driverOsm.instance_entity(entity.nameEntity,id,"phy-gw")
                    appendToLog("Gateway allocation..")
                    
                    
                    await new Promise(r => setTimeout(r, 5000));

                    console.log("dopo promise gateway")

                    nsd = await create_ns_node(ws.nome,ws.ip, ipToCidr(ws.ip),entity.nameEntity)
                    id = await driverOsm.create_entity(nsd)
                    id = driverOsm.instance_entity(ws.nome,id,"generic")

                    appendToLog("Allocation station "+ws.nome)

                }else{
                    let nsd = await create_ns_gw_st("Gateway",entity.nameEntity,ip,"10.10.10.0/24",cidr,sat.nameEntity)
                    let id = await driverOsm.create_entity(nsd)
                    id = driverOsm.instance_entity(entity.nameEntity,id,"phy-gw")
                    appendToLog("Gateway allocation..")
                }
                
            }

            if(entity.type == "Terminal"){

                console.log("terminal..")

                let ip = entity.ip
                let cidr = ipToCidr(ip)

               
                let ws = await getWS(entity.nameEntity)

                if(ws.length>0){
                    ws = ws[0]

                    let nsd = await create_ns_gw_st("Terminal",entity.nameEntity,ip,ipToCidr(ws.ip),cidr,sat.nameEntity)
                    let id = await driverOsm.create_entity(nsd)
                    id = driverOsm.instance_entity(entity.nameEntity,id,"phy-st")
                    appendToLog("Terminal allocation..")

                    await new Promise(r => setTimeout(r, 5000));
                    console.log("dopo terminal..")

                    nsd = await create_ns_node(ws.nome,ws.ip, ipToCidr(ws.ip),entity.nameEntity)
                    id = await driverOsm.create_entity(nsd)
                    id = driverOsm.instance_entity(ws.nome,id,"generic")

                    appendToLog("Allocation station "+ws.nome)

                }else{

                    let nsd = await create_ns_gw_st("Terminal",entity.nameEntity,ip,"10.20.10.0/24",cidr,sat.nameEntity)
                    let id = await driverOsm.create_entity(nsd)
                    id = driverOsm.instance_entity(entity.nameEntity,id,"phy-st")
                    appendToLog("Terminal allocation..")
    
                }

            }
          
        }

        appendToLog("Wait..")
        await new Promise(r => setTimeout(r, 1000));

        let nss = await driverOsm.get_NSs()
        let entities = entitiesState.slice()


        for(let ns of nss){
            for(let entity of entities){
                if(ns.name == entity.name){
                    entity.status = ns["config-status"]
                }
            }
        }
        
        appendToLog("Wait allocation ..")
        setEntities(entities)

        
    }

    const configure = async () => {
        let driverOsm = new DriverOsm()
        await driverOsm.inizialize()

        appendToLog("Start configuration network ..")

        const builder = new xml2js.Builder();
          let nss = await driverOsm.get_NSs()
          let model = await getModel(name)
          let template_ip_br = "192.168.63."
          let i = 1

          for (let ns of nss){
            let entity = model.model.entitiesByName[ns.nsd.id]
            
            if(entity){

                const xmlStringinf = builder.buildObject(entity.infrastructure);
                const xmlStringTop = builder.buildObject(model.model.topology);
                const xmlStringProf = builder.buildObject(entity.profile);
                
                await driverOsm.load_xml(ns._id,"infrastructure.xml",xmlStringinf)
                await driverOsm.load_xml(ns._id,"topology.xml",xmlStringTop)
                await driverOsm.load_xml(ns._id,"profile.xml",xmlStringProf)
                
                appendToLog("Loading configuration inside "+ns.nsd.id)

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

                await new Promise(r => setTimeout(r, 20000));
            

                if(ns.nsd.id.includes("GW")){
                    await driverOsm.config_network(ns._id,"ens4","ens5","opensand_tap",mac,"opensand_br",template_ip_br+i)
                    appendToLog("Start opensand in "+ns.nsd.id )
                    
                }else if(ns.nsd.id.includes("ST")){
                    await driverOsm.config_network(ns._id,"ens4","ens5","opensand_tap",mac,"opensand_br",template_ip_br+i)
                    appendToLog("Start opensand in "+ns.nsd.id )

                }
                else{
                    await driverOsm.config_network(ns._id)
                    appendToLog("Configure Satellite ")

                } 
            
            }
            
            i = i+1
          }
            
      
          appendToLog("OK! ")

    }
    function ipToCidr(ip: string) {
        var octets = ip.split('.');
    
        if (octets.length !== 4) {
            throw new Error('Indirizzo IP non valido');
        }
    
        var numericOctets = octets.map(function (octet) {
            return parseInt(octet, 10);
        });
    
        var cidr = numericOctets.slice(0, 3).join('.') + '.0/24';
    
        return cidr;
    }




    return (
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

                        <div className='center-div-log'>
                                <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap='20px' mb='20px'>
                                <Card overflowX={{ sm: "scroll", lg: "hidden" }}>
                                    <div className="logging-container">
                                        <div className="title-bar">
                                            Log Allocation
                                        </div>
                                        <div className="content-container">
                                            <div className="log-container">
                                            <ul>
                                                {log.map((message, index) => (
                                                <li key={index}>{message}</li>
                                                ))}
                                            </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                                </SimpleGrid>

                        </div>
            
                        
                        <div className='center-div-table'>
                                <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap='20px' mb='20px'>
                                        <ComplexTable
                                        columnsData={columnsDataComplex}
                                        tableData={entitiesState}
                                        />
                                </SimpleGrid>

                        </div>
                         
                        <div className='center-button'>
                            <button className='button' onClick={deploy}>
                                    Deploy
                            </button>
                            <button className='button' onClick={configure}>
                                    Configure
                            </button>
                        </div>


						<Box>
							<Footer />
						</Box>
					</Box>
				</SidebarContext.Provider>
			</Box>
		</Box>

    );
};


interface Props {
}


export default Project;
