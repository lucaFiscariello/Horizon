import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import "assets/css/styleDialog.css"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SingleSpotCard from './SingleSpotCard';
import { Dialog, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import AddSpotDialog from '../GW/DialogAddSPot';
import { postSpotLocation } from 'client/geometry-costellation/client';
import { deleteSpotLocation } from 'client/geometry-costellation/client';
import { getNodeLocationInsideSpot } from 'client/geometry-costellation/client';
import { addSpot as addSpotOpensand } from "client/opensad-wrapper/clientModel";
import { addRoute } from 'client/opensad-wrapper/clientModel';

export default function ExpandedContent(props) {
  const [expanded, setExpanded] = React.useState(false);
  const [lat, setLat] = React.useState();
  const [long, setLong] = React.useState();
  const [radius, setRadius] = React.useState();
  const [nameSpot, setNameSpot] = React.useState();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const addSpot = async() => {
    let newSpot = await postSpotLocation(props.projectName,lat,long,radius,props.satName,nameSpot)
    props.addSpotToMap(newSpot)
    
    let nodesInsideSPot= await getNodeLocationInsideSpot(props.projectName,nameSpot)
    let gateway;
    let terminal;

    console.log(nodesInsideSPot)

    if(nodesInsideSPot.length == 2 ){
      if(nodesInsideSPot[0].type == "Gateway"){
        gateway = nodesInsideSPot[0]
        terminal = nodesInsideSPot[1]
      }else{
        gateway = nodesInsideSPot[1]
        terminal = nodesInsideSPot[0]
      }
    }

    

    await addSpotOpensand(props.projectName,"Transparent","Transparent",props.satName,gateway.nome+"-"+props.projectName)
    await addRoute(props.projectName,gateway.nome+"-"+props.projectName,terminal.nome+"-"+props.projectName)

  };


  const deleteSpot = async() => {
    await deleteSpotLocation(props.info)
    props.handleDeleteSpot(props.info.id)
  };

  

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));


  return (

    <div>
    <Card className="section">

        <CardContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <Typography variant="h7" component="div">
                    Configuration {props.title}
                </Typography>

                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                    >
                    <ExpandMoreIcon />
                </ExpandMore>
                
                <IconButton onClick={deleteSpot}>
                    <DeleteIcon ></DeleteIcon>
                </IconButton>

            </div>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Stack spacing={2} style={{ marginTop: '16px' }}>
                    <TextField id="outlined-basic" label="Name" variant="outlined" defaultValue={props.info.name}  onChange={(event) => {setNameSpot(event.target.value)}} />
                    <TextField id="outlined-basic" label="Latitude" variant="outlined" defaultValue={props.info.latitudine}  onChange={(event) => {setLat(event.target.value)}} />
                    <TextField id="outlined-basic" label="Longitude" variant="outlined" defaultValue={props.info.longitudine} onChange={(event) => {setLong(event.target.value)}} />
                    <TextField id="outlined-basic" label="Radius" variant="outlined" defaultValue={props.info.radius} onChange={(event) => {setRadius(event.target.value)}}/>
                    <button className='button' onClick={addSpot} >
                      Save
                    </button>
                </Stack>              


            </Collapse>

        </CardContent>


        
      </Card>


      </div>
    
  );
}

