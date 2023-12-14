import React, { useState } from 'react';
import {useParams} from 'react-router-dom';
import {Formik} from 'formik';
import type {FormikProps, FormikHelpers} from 'formik';

import {
    deleteXML,
    getProject,
    listProjectTemplates,
    pingEntity,
    updateProject,
} from 'opensand/api/index.ts';

    
import {useSelector, useDispatch} from 'opensand/redux/index.ts';
import {newError} from 'opensand/redux/error.ts';
import {clearTemplates} from 'opensand/redux/form.ts';
import {clearModel} from 'opensand/redux/model.ts';
import type {MutatorCallback} from 'opensand/utils/actions.ts';
import {getXsdName} from 'opensand/xsd/index.ts';
import {isComponentElement, isListElement, isParameterElement, newItem} from 'opensand/xsd/model.tsx';
import type {Component, Parameter, List} from 'opensand/xsd/index.ts';

import { Portal, Box, useDisclosure,SimpleGrid } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import routes from 'routes.js';
import { useEffect } from 'react';
import { createNetwork } from 'clientModel/clientModel';

type SaveCallback = () => void;


const findMachines = (root?: Component, operation?: (l: List, path: string) => void): List | undefined => {
    if (root) {
        const platformIndex = root.elements.findIndex((e: { element: { id: string; }; }) => isComponentElement(e) && e.element.id === "platform");
        if (platformIndex < 0) { return; }

        const platform = root.elements[platformIndex];
        if (isComponentElement(platform)) {
            const machinesIndex = platform.element.elements.findIndex((e: { element: { id: string; }; }) => isListElement(e) && e.element.id === "machines");
            if (machinesIndex < 0) { return; }

            const machines = platform.element.elements[machinesIndex];

            if (isListElement(machines)) {
                if (operation) {
                    operation(machines.element, `elements.${platformIndex}.element.elements.${machinesIndex}.element`);
                } else {
                    return machines.element;
                }
            }
        }
    }
};

const findMachinesName= (root?: Component, operation?: (l: List, path: string) => void): any | undefined => {
    if (root) {
        const platformIndex = root.elements.findIndex((e: { element: { id: string; }; }) => isComponentElement(e) && e.element.id === "platform");
        if (platformIndex < 0) { return; }

        const platform = root.elements[platformIndex];
        if (isComponentElement(platform)) {
            const machinesIndex = platform.element.elements.findIndex((e: { element: { id: string; }; }) => isListElement(e) && e.element.id === "machines");
            if (machinesIndex < 0) { return; }

            const machines = platform.element.elements[machinesIndex];
            return machines.element
   
        }
    }
};

const findEntities = (root?: Component, operation?: (l: List, path: string) => void): List | undefined => {
    if (root) {
        const configurationIndex = root.elements.findIndex((e: { element: { id: string; }; }) => isComponentElement(e) && e.element.id === "configuration");
        if (configurationIndex < 0) { return; }

        const configuration = root.elements[configurationIndex];
        if (isComponentElement(configuration)) {
            const entitiesIndex = configuration.element.elements.findIndex((e: { element: { id: string; }; }) => isListElement(e) && e.element.id === "entities");
            if (entitiesIndex < 0) { return; }

            const entities = configuration.element.elements[entitiesIndex];

            if (isListElement(entities)) {
                if (operation) {
                    operation(entities.element, `elements.${configurationIndex}.element.elements.${entitiesIndex}.element`);
                } else {
                    return entities.element;
                }
            }
        }
    }
};


const applyOnMachinesAndEntities = (root: Component, operation: (l: List, path: string) => void) => {
    findMachines(root, operation);
    findEntities(root, operation);
};



const Project: React.FC<Props> = (props) => {
    const model = useSelector((state: { model: { model: any; }; }) => state.model.model);
    const source = useSelector((state: { ping: { source: any; }; }) => state.ping.source);

    let name = useParams().id;

    const dispatch = useDispatch();
    const [handleNewEntityCreate, setNewEntityCreate] = React.useState<((entity: string, entityType: string) => void) | undefined>(undefined);
    const [pingDestination, setPingDestination] = React.useState<string | null>(null);
    const [machs,setMachs] = useState([]);
    const [nameMachs,setMachsName] = useState<string[]>([]);
    const [dataTables,setDataTables] = useState([])
    const [refresh,setRefresh] = useState(true);

  
    // Scarica la lista delle macchine che verranno graficate nella tabella
    useEffect(() => {
        
        let Allmachs = findMachinesName(model?.root)
        let AllDataTable = []

        if(Allmachs){
            for( let machineID in Allmachs.elements){
                let row = new Object()

                row.name = Allmachs.elements[machineID].elements[1].element.value
                row.type = Allmachs.elements[machineID].elements[2].element.value
                row.ip = Allmachs.elements[machineID].elements[3].element.value
                
                AllDataTable.push(row)
            }

            setDataTables(AllDataTable)

        }
      }, [machs])


    
    const handleOpen = React.useCallback((root: Component, mutator: MutatorCallback, submitForm: SaveCallback) => {
        setNewEntityCreate(() => (entity: string, entityType: string) => {
            const addNewEntity = (l: List) => {
                let hasError = false;
                l.elements.forEach((c: { elements: any[]; }) => {
                    c.elements.forEach((p: { element: { id: string; value: string; }; }) => {
                        if (isParameterElement(p)) {
                            if (p.element.id === "entity_name" && p.element.value === entity) {
                                hasError = true;
                            }
                        }
                    });
                });
                
                if (hasError) {
                    dispatch(newError(`Entity ${entity} already exists in ${l.name}`));
                    return;
                }

                if (l.elements.length < l.maxOccurences) {
                    const newEntity = newItem(l.pattern, l.elements.length);
                    newEntity.elements.forEach((p: { element: { id: string; value: string; type: string; }; }) => {
                        if (isParameterElement(p)) {
                            if (p.element.id === "entity_name") {
                                p.element.value = entity;
                            }
                            if (p.element.id === "entity_type") {
                                p.element.value = entityType;
                            }
                            if (p.element.type.endsWith("_xsd")) {
                                p.element.value = getXsdName(p.element.id, entityType);
                            }
                        }
                    });
                    return newEntity;
                }
            };

            applyOnMachinesAndEntities(root, (l: List, p: string) => mutator(l, p, addNewEntity));
            submitForm();

        });
    }, [dispatch]);


    const handleClose = React.useCallback(() => {
        setNewEntityCreate(undefined);
        setRefresh(!refresh)
    }, []);

    const handleSubmit = React.useCallback((values: Component, helpers: FormikHelpers<Component>) => {
        if (name) {
            dispatch(updateProject({project: name, root: values}));
        }
        helpers.setSubmitting(false);
        
    }, [dispatch, name]);

    const handleDeleteEntity = React.useCallback((root: Component, mutator: (l: List, path: string) => void) => {
        applyOnMachinesAndEntities(root, mutator);
    }, []);


    const handleDelete = React.useCallback((entity: string | undefined, key: string) => {
        if (name) {
            const urlFragment = key + (entity == null ? "" : "/" + entity);
            dispatch(deleteXML({project: name, urlFragment}));
        }
    }, [dispatch, name]);


    const updateName = (model: { root: any; } | undefined) =>{
        let Allmachs = findMachinesName(model?.root)
        let AllnameMachs =[]

        if(Allmachs)
            for(const element of Allmachs.elements)
                AllnameMachs.push(element.elements[1].element.value)

        setMachs(Allmachs)
        setMachsName(AllnameMachs)

    }

    const [entityName, entityType]: [Parameter | undefined, Parameter | undefined] = React.useMemo(() => {
        const entity: [Parameter | undefined, Parameter | undefined] = [undefined, undefined];

        updateName(model)

        findMachines(model?.root, (machines: List) => {
            machines.pattern.elements.forEach((p: { element: { id: string; }; }) => {
                if (isParameterElement(p)) {
                    if (p.element.id === "entity_name") { entity[0] = p.element; }
                    if (p.element.id === "entity_type") { entity[1] = p.element; }
                }
            });
        });
        
        return entity;
    }, [model,refresh]);

    React.useEffect(() => {
        if (name) {
            dispatch(getProject({project: name}));
            dispatch(listProjectTemplates({project: name}));
        }

        return () => {
            dispatch(clearTemplates());
            dispatch(clearModel());
        };
    }, [dispatch, name]);

    React.useEffect(() => {
        if (name && source && pingDestination) {
            dispatch(pingEntity({
                project: name,
                entity: source.name,
                address: source.address,
                destination: pingDestination,
            }));
            setPingDestination(null);
        }
    }, [dispatch, name, source, pingDestination]);
    
    const { ...rest } = props;
	// states and functions
	const [ fixed ] = useState(false);
	const [ toggleSidebar, setToggleSidebar ] = useState(false);
	// functions for changing the states from components
	const getRoute = () => {
		return window.location.pathname !== '/admin/full-screen-maps';
	};

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
        await createNetwork(name)
    }


    document.documentElement.dir = 'ltr';
	const { onOpen } = useDisclosure();
	document.documentElement.dir = 'ltr';



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
                                             
                        <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              minHeight="100vh"
                        >
                            <button className='button' onClick={deploy}>
                                Deploy
                            </button>
                        </Box>

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
