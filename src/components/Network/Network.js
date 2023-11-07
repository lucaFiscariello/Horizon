import * as React from 'react';
import { Graph } from "react-d3-graph";
import "assets/css/style.css"
import config from "./config";
import { useState } from 'react';
import { Button, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import {useListMutators} from 'opensand/utils/hooks.tsx';
import useMediaQuery from '@mui/material/useMediaQuery';
import {ThemeProvider} from '@mui/material/styles';
import createTheme from 'opensand/utils/theme.ts';
import { getXmlProject, areAllSubnetsDefinited, getLinksConnection, getNodes, searchSubnets } from './subnet';
import net from 'assets/img/opensand/net.png'
import { ModelNetwork } from './ModelNetwork';
import { addConnection, removeConnection } from './Constrain';

import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Slide from '@mui/material/Slide';
import FullScreenDialog from './FullScreenDialog';
import {
  Link,
} from "@chakra-ui/react";



export default function Network(props) {


  const netName = "NET"
  const urlNET = net
  let projectDeploy = "#/deploy/"


  const [dataState, setData] = useState({});
  const [newEntity, setNewEntity] = useState(false);
  const [clickNodes, setClickNodes] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [nodeName, setnodeName] = useState("");
  const [addListItem, removeListItem] = useListMutators(props.list, props.actions, props.form, "elements.0.element.elements.1.element");

  let entityNetwork = new ModelNetwork(props.nameProject,props.nameMachines)


  React.useEffect(async () => {

    const data = {"links":[],"nodes":[]}
    let nodes = []
    let links = []

    await entityNetwork.loadXMLDefault()
    await entityNetwork.loadModel(newEntity)
   
    nodes = entityNetwork.getNodes()
    links = entityNetwork.getLinks()

    data.nodes = nodes
    data.links = links

    setData(data)
    setNewEntity(false)

  }, [props.nameMachines]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose =  () => {
    setOpen(false);
  };

  const handleElimination = () =>{

    for(let name of clickNodes){
      const indice = dataState.nodes.findIndex(elemento => elemento.id == name);
      removeListItem(indice)

    }

    setClickNodes([])

  }
    
  const onDoubleClickNode  = (clickedNodeId) => {
    handleClickOpen()
    setnodeName(clickedNodeId)
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

    await entityNetwork.loadXMLDefault()
    await entityNetwork.loadModel()


    let data = {"links":[],"nodes":[]} 
    data.nodes = entityNetwork.getNodes()
    data.links = entityNetwork.getLinks()

    setClickNodes([])
    setData(data) 
  };

  const onClickLink = async function(source,target){

    await entityNetwork.loadXMLDefault()
    await entityNetwork.loadModel()

    await removeConnection(source,target,entityNetwork)

    let data = {"links":[],"nodes":[]} 
    data.nodes = entityNetwork.getNodes()
    data.links = entityNetwork.getLinks()

    setClickNodes([])
    setData(data) 
 

  }


  async function AggiungiMacchina() {
      addListItem()
      setNewEntity(true)
  };

  async function AddConnection() {

    await entityNetwork.loadXMLDefault()
    await entityNetwork.loadModel()

    await addConnection(clickNodes,entityNetwork)

    let data = {"links":[],"nodes":[]} 
    data.nodes = entityNetwork.getNodes()
    data.links = entityNetwork.getLinks()

    setClickNodes([])
    setData(data)
  

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

        {open && <FullScreenDialog open={open} handleClose={handleClose} nameEntity = {nodeName}></FullScreenDialog> }

        </ThemeProvider>

        </div>

    

    
      


      
    );
}