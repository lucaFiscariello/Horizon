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
import FullScreenDialog from 'components/Network/FullScreenDialog.js';
import { getXmlProject, areAllSubnetsDefinited, getLinksConnection, getNodes, searchSubnets } from './subnet';
import net from 'assets/img/opensand/net.png'
import { ModelEntity } from './ModelEntity';
import { ModelNetwork } from './ModelNetwork';


// Dialog per eliminare un nodo
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};



export default function Network(props) {


  const netName = "NET"
  const urlNET = net

  const [dataState, setData] = useState({});
  const [clickNodes, setClickNodes] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openModify, setOpenModify] = React.useState(false);
  const [nodeName, setnodeName] = useState("");
  const [tooltip, setTooltip] = useState('');
  const [addListItem, removeListItem] = useListMutators(props.list, props.actions, props.form, "elements.0.element.elements.1.element");

  let entityNetwork = new ModelNetwork(props.nameProject,props.nameMachines)

  React.useEffect(async () => {

    const data = {"links":[],"nodes":[]}
    let nodes = []
    let links = []

    await entityNetwork.loadXMLDefault()
    await entityNetwork.loadModel()

    if(props.nameMachines.length>0){
      let name_new_entity = props.nameMachines[props.nameMachines.length-1].name

      let new_entity = entityNetwork.entitiesByName[name_new_entity]
      new_entity.setID(props.nameMachines.length-1)

      console.log(new_entity)
      await new_entity.updateXml()
    }

   
    nodes = entityNetwork.getNodes()
    links = entityNetwork.getLinks()

    data.nodes = nodes
    data.links = links
    setData(data)



  }, [props.nameMachines]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleElimination = () =>{
    const indice = dataState.nodes.findIndex(elemento => elemento.id == nodeName);

    handleClose()
    removeListItem(indice)
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


  const onClickGraph = function(event) {
    setTooltip('');
  };


  async function AggiungiMacchina() {
        addListItem()
  };

  async function AggiungiSpot() {

    await entityNetwork.loadXMLDefault()
    await entityNetwork.loadModel()

    let idSat = entityNetwork.getIDByListType(clickNodes,"Satellite") 
    let idGw = entityNetwork.getIDByListType(clickNodes,"Gateway") 
    let idSt = entityNetwork.getIDByListType(clickNodes,"Terminal") 

    await entityNetwork.addSpot("Transparent","Transparent",idGw,idSat,idSat)
    await entityNetwork.addRoute(idGw,idSt,idGw)

    let data = {"links":[],"nodes":[]} 
    data.nodes = entityNetwork.getNodes()
    data.links = entityNetwork.getLinks()

    setClickNodes([])
    setData(data)

  };


  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(() => createTheme(prefersDarkMode), [prefersDarkMode]);

    return (

      
      <Stack>
        <div className="main-container">
            
            <div className='white-box'>
                <Graph id="graph" config={config} data={dataState} onDoubleClickNode={onDoubleClickNode} onClickNode={onClickNode} onClickGraph={onClickGraph} />  
            </div>
              
        </div>
        
        <div className='center-div'>
          <button className='button' onClick={AggiungiMacchina}>
            Add Machine
          </button>
          <button className='button' onClick={AggiungiSpot}>
            Add Spot
          </button>
        </div>


        <ThemeProvider theme={theme}>

          <BootstrapDialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
            >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
              Nodo {nodeName}
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>
                Confermare l'eliminazione del nodo?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button  onClick={handleElimination}>
                Conferma
              </Button>
            </DialogActions>
          </BootstrapDialog>
        
        </ThemeProvider>

        
      </Stack>

    

    
      


      
    );
}