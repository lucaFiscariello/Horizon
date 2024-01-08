import React, { useState } from 'react';
import {useParams} from 'react-router-dom';
import {Formik} from 'formik';
import type {FormikProps, FormikHelpers} from 'formik';
import {
    columnsDataComplex,
  } from "views/admin/dashboard/variables/columnsData.js";
import tableDataComplex from "views/admin/dashboard/variables/tableDataComplex.json";

import {
    deleteXML,
    getProject,
    listProjectTemplates,
    pingEntity,
    updateProject,
} from 'opensand/api/index.ts';

    
import {useSelector, useDispatch} from 'opensand/redux/index.ts';
import {clearTemplates} from 'opensand/redux/form.ts';
import {clearModel} from 'opensand/redux/model.ts';
import {isComponentElement, isListElement, isParameterElement, newItem} from 'opensand/xsd/model.tsx';
import type {Component, Parameter, List} from 'opensand/xsd/index.ts';

import { Portal, Box, useDisclosure,SimpleGrid, Stack } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import routes from 'routes.js';
import { useEffect } from 'react';
import { DriverOsm } from 'client/osm/driverOsm';
import { create_ns_sat } from 'client/osm-wrapper/client-osm-wrapper';
import { create_ns_gw_st } from 'client/osm-wrapper/client-osm-wrapper';
import { create_ns_node } from 'client/osm-wrapper/client-osm-wrapper';
import { getModel } from 'client/opensad-wrapper/clientModel';
import ComplexTable from 'views/admin/dashboard/components/ComplexTable';


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
        
        console.log(entities)
        for(let entity of entities){
            appendToLog("* " +entity.nameEntity)
            entity.name = entity.nameEntity
            entity.status = "Disable"
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

                /*
                let ip = entity.ip
                let cidr = ipToCidr(ip)

                let nsd = await create_ns_sat("Satellite",entity.nameEntity,ip,cidr)
                let id = await driverOsm.create_entity(nsd)
                id = driverOsm.instance_entity(entity.nameEntity,id,"phy-sat")

                await new Promise(r => setTimeout(r, 5000));*/
                appendToLog("Satellite allocation..")

            }

            if(entity.type == "Gateway"){

                /*
                let ip = entity.ip
                let cidr = ipToCidr(ip)

                let nsd = await create_ns_gw_st("Gateway",entity.nameEntity,ip,"10.10.10.0/24",cidr,sat.nameEntity)
                let id = await driverOsm.create_entity(nsd)
                id = driverOsm.instance_entity(entity.nameEntity,id,"phy-gw")*/
                appendToLog("Gateway allocation..")
            }

            if(entity.type == "Terminal"){

                /*
                let ip = entity.ip
                let cidr = ipToCidr(ip)

                let nsd = await create_ns_gw_st("Terminal",entity.nameEntity,ip,"10.20.10.0/24",cidr,sat.nameEntity)
                let id = await driverOsm.create_entity(nsd)
                id = driverOsm.instance_entity(entity.nameEntity,id,"phy-st")*/
                appendToLog("Terminal allocation..")
            }



            
        }

        appendToLog("Wait..")


        /*
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

        await new Promise(r => setTimeout(r, 5000));

        nsd = await create_ns_node("node-st","10.20.10.2","10.20.10.0/24","st")
        id = await driverOsm.create_entity(nsd)
        id = driverOsm.instance_entity("node-st",id,"generic")
        console.log(id)

        nsd = await create_ns_node("node-gw","10.10.10.2","10.10.10.0/24","gw")
        id = await driverOsm.create_entity(nsd)
        id = driverOsm.instance_entity("node-gw",id,"generic")
        console.log(id)
        */
    }

    function ipToCidr(ip: string) {
        // Dividi l'indirizzo IP e ottieni gli ottetti
        var octets = ip.split('.');
    
        // Assicurati che ci siano 4 ottetti
        if (octets.length !== 4) {
            throw new Error('Indirizzo IP non valido');
        }
    
        // Converti gli ottetti in formato numerico
        var numericOctets = octets.map(function (octet) {
            return parseInt(octet, 10);
        });
    
        // Ottieni la notazione CIDR per la subnet
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

                        <div className='center-div-table'>
                            <Stack>
                                <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap='20px' mb='20px'>
                                        <ComplexTable
                                        columnsData={columnsDataComplex}
                                        tableData={entitiesState}
                                        />
                                </SimpleGrid>
                                <button className='button' onClick={deploy}>
                                    Deploy
                                </button>
                                <button className='button' onClick={deploy}>
                                    Configure
                                </button>
                            </Stack>
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
