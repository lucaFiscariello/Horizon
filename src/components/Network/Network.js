import * as React from 'react';
import { Graph } from "react-d3-graph";
import "assets/css/style.css"
import config from "./config";
import { useState } from 'react';
import { Stack } from '@mui/material';
import {useListMutators} from 'opensand/utils/hooks.tsx';
import useMediaQuery from '@mui/material/useMediaQuery';
import {ThemeProvider} from '@mui/material/styles';
import createTheme from 'opensand/utils/theme.ts';
import net from 'assets/img/opensand/net.png'
import { ModelNetwork } from './model/ModelNetwork';
import { addConnectionPhysical } from './Constrain';
import Slide from '@mui/material/Slide';
import FullScreenDialogConfigGW from './virtualization-config/GW/FullScreenDialogGW';
import {
  Link,
} from "@chakra-ui/react";
import FullScreenDialogConfigST from './virtualization-config/ST/FullScreenDialogST';
import { inizializeModel } from 'clientModel/clientModel';
import { getPhysicalNode } from 'clientModel/clientModel';
import { getPhysicalLinks } from 'clientModel/clientModel';
import { deletePhysicalNode } from 'clientModel/clientModel';
import { deletePhysicalLink } from 'clientModel/clientModel';
import { addPhysicalLink } from 'clientModel/clientModel';



export default function Network(props) {


  const netName = "NET"
  const urlNET = net
  let projectDeploy = "#/deploy/"


  const [dataState, setData] = useState({});
  const [newEntity, setNewEntity] = useState(false);
  const [clickNodes, setClickNodes] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [nodeName, setnodeName] = useState("");
  const [typeNodeClicked, setTypeNodeClicked] = useState("");
  const [addListItem, removeListItem] = useListMutators(props.list, props.actions, props.form, "elements.0.element.elements.1.element");
  
  const {nameMachines,nameProject,newPhysicalEntity} = props;
  let entities = React.useMemo(() => nameMachines, [nameMachines]);
  const projectName = React.useMemo(() => nameProject, [nameProject]);
  const newPhysicalEntityUpdate = React.useMemo(() => newPhysicalEntity, [newPhysicalEntity]);

  let entityNetwork = new ModelNetwork(props.nameProject,entities)

  React.useEffect(async ()  => {

    const data = {"links":[],"nodes":[]}
    let nodes = []
    let links = []

    await inizializeModel(projectName,entities)

    nodes = await getPhysicalNode(projectName)
    links = await getPhysicalLinks(projectName)
    console.log(links)
    data.nodes = nodes
    data.links = links

    setData(data)

  }, [newPhysicalEntityUpdate,entities,clickNodes]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose =  () => {
    setOpen(false);
  };

  const handleElimination = async () =>{

    for(let name of clickNodes){

      await deletePhysicalNode(props.nameProject,name)
      const indice = dataState.nodes.findIndex(elemento => elemento.id == name);
      removeListItem(indice)

      entities = entities.filter(function (entity) {
        return entity.name !== name;
      });

    }

    setClickNodes([])

  }
    
  const onDoubleClickNode  = (clickedNodeId) => {
    handleClickOpen()

    for(let machine of props.nameMachines){
      if ( machine.name == clickedNodeId )
        setTypeNodeClicked(machine.type)
    }
  
    setnodeName(clickedNodeId)
    props.handleSetgwPhysical(clickedNodeId)
  };

  const onClickNode  = (nodeId,node) => {

    let sizeClick = 500
    node.size = (node.size == 400)? sizeClick:400

    if (node.size == sizeClick){

      let tempNodes = clickNodes
      tempNodes.push(nodeId)
      setClickNodes(tempNodes)

    }else{
      
      let tempNodes = clickNodes
      const indiceElemento = tempNodes.indexOf(nodeId);

      if (indiceElemento !== -1) {
        tempNodes.splice(indiceElemento, 1);
      }

      setClickNodes(tempNodes)

    }

  };


  const onClickGraph = async function(event) {
    setClickNodes([]);
  };

  const onClickLink = async function(source,target){

    await deletePhysicalLink(props.nameProject,source,target)
    setClickNodes([])
 
  }


  async function AggiungiMacchina() {
      addListItem()
  };

  async function AddConnection() {

    await addPhysicalLink(props.nameProject,clickNodes)
    setClickNodes([])
  
  };


  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(() => createTheme(prefersDarkMode), [prefersDarkMode]);
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

    return (

      <div>
        <Stack>
          <div className="main-container">
              
              <div className='white-box'>
                  <Graph id="graph" config={config} data={dataState} onDoubleClickNode={onDoubleClickNode} onClickNode={onClickNode} onClickGraph={onClickGraph} onClickLink={onClickLink}/>  
              </div>
                
          </div>
          
          <div className='center-div'>
            <button className='button' onClick={AggiungiMacchina}>
              Add Entity
            </button>
            <button className='button' onClick={handleElimination}>
              Delete Entity
            </button>
            <button className='button' onClick={AddConnection}>
              Add Connection
            </button>

            <Link href={projectDeploy.concat(props.nameProject)}>
              <button className='button'>
                Deploy
              </button>
            </Link>
           
          </div>
          
        </Stack>

        <ThemeProvider theme={theme}>

        {open && typeNodeClicked == 'Gateway' && <FullScreenDialogConfigGW open={open} handleClose={handleClose} handleCloseAddGw = {props.handleCloseAddGw} nameEntity = {nodeName} entities={entities} setCreateOnlyGW = {props.setCreateOnlyGW} addListItem={addListItem} projectName = {projectName} entities={entities}></FullScreenDialogConfigGW> }
        {open && typeNodeClicked != 'Gateway' && <FullScreenDialogConfigST open={open} handleClose={handleClose} nameEntity = {nodeName} modelNetwork={entityNetwork}></FullScreenDialogConfigST> }

        </ThemeProvider> 

        </div>

    

    
      


      
    );
}