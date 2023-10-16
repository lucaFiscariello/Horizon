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
  const [open, setOpen] = React.useState(false);
  const [openModify, setOpenModify] = React.useState(false);
  const [nodeName, setnodeName] = useState("");
  const [tooltip, setTooltip] = useState('');
  const [addListItem, removeListItem] = useListMutators(props.list, props.actions, props.form, "elements.0.element.elements.1.element");

  React.useEffect(() => {

    const data = {"links":[],"nodes":[]}
    let nodes = []
    let links = []
    let subnets = []

    subnets = searchSubnets(props.nameMachines)  
    nodes = getNodes(props.nameMachines)
    getXmlProject()

    if(areAllSubnetsDefinited(subnets)){
      links = getLinksConnection(subnets)
    }


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

  const onClickNode  = (nodeId) => {
    setTooltip(`Mostra configurazioni del nodo ${nodeId}`);
    setOpenModify(true)
  };


  const onClickGraph = function(event) {
    setTooltip('');
  };


  function AggiungiMacchina() {
        addListItem()
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
          <ThemeProvider theme={theme}>
            <FullScreenDialog openModify={openModify}></FullScreenDialog>
          </ThemeProvider>
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