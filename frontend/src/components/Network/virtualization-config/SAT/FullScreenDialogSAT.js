import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import "assets/css/styleDialog.css"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ExpandedContent from './ExpandedContent';
import { Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { addEntity } from 'client/opensad-wrapper/clientModel';
import { configureEntity } from 'client/opensad-wrapper/clientModel';
import { getSpotLocation } from 'client/geometry-costellation/client';
import { enableCollector as enableCollectorOpensand } from "client/opensad-wrapper/clientModel";
import { getModel } from 'client/opensad-wrapper/clientModel';
import DataTable from './Table';
import { configureModulationUP } from 'client/opensad-wrapper/clientModel';
import { configureModulationDown } from 'client/opensad-wrapper/clientModel';
import { configureSymbolRateDown } from 'client/opensad-wrapper/clientModel';
import { configureSymbolRateUP } from 'client/opensad-wrapper/clientModel';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialogConfigSAT(props) {
  const open = props.open
  const handleClose = props.handleClose
  const nameEntity = props.nameEntity
  const [mac, setMac] = React.useState('');
  const [ip, setIP] = React.useState('');
  const [rateDown, setRateDown] = React.useState('');
  const [rateUP, setRateUP] = React.useState('');
  const [waveDown, setWaveDown] = React.useState('');
  const [waveUP, setWaveUP] = React.useState('');
  const [spots, setSpots] = React.useState([]);
  const [enableCollector, setEnableCollector] = React.useState(true);

  React.useEffect(async ()  => {

    let spots = await getSpotLocation(props.projectName)
    setSpots(spots)

    let res =await  getModel(props.projectName)
  }, []);

  const handleMacChange = (event) => {
    setMac(event.target.value);
  };

  const handleIpChange = (event) => {
    setIP(event.target.value);
  };

  const handleRateDown = (event) => {
    setRateDown(event.target.value);
  };

  const handleRateUP = (event) => {
    setRateUP(event.target.value);
  };

  const handleWaveDown = (wave) => {
    setWaveDown(wave);
  };

  const handleWaveUP = (wave) => {
    setWaveUP(wave);
  };

  const handleSave = async () => {
    if(ip  && mac){
      await addEntity(props.projectName,props.nameEntity,"Satellite")
      await configureEntity(props.projectName,props.nameEntity,ip,mac)
      }

    if(enableCollector){
      await enableCollectorOpensand(props.projectName,ip)
    }

    if(waveUP)
      await configureModulationUP(props.projectName,waveUP)

    if(waveDown)
      await configureModulationDown(props.projectName,waveDown)

    if(rateDown)
      await configureSymbolRateDown(props.projectName,rateDown)

    if(rateUP)
      await configureSymbolRateUP(props.projectName,rateUP)

    props.handleClose()
  };

  const addSpotTemp = async () => {
    setSpots([...spots,[]])
  }

  const handleAddSpot = async (spot) => {

    //Elimino elemento temporaneo e aggiungo il definitivo
    setSpots([...spots.slice(0, -1),spot])
    props.addSpotToMap(spot)
  }

  const handleDeleteSpot = async (id) => {
    const newSpots = spots.filter((spot) => spot.id !== id);
    setSpots(newSpots)
    props.deleteSpotToMap(id)
  }


  return (
    
      <Dialog style={{ width: '50%', marginLeft: 'auto'}}
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar style={{ backgroundColor: '#334380' }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div" style={{ color: 'white' }}>
              Configure {nameEntity}
            </Typography>
            <Button color="inherit" onClick={handleSave} style={{ color: 'white' }} >
              Save
            </Button>
          </Toolbar>
        </AppBar>
        
        
        <div className="container">
          <Card className="section-white">
            <CardContent>
              <Typography variant="h5" component="div">
                Network
              </Typography>

              <Stack spacing={2} style={{ marginTop: '16px' }}>
                <TextField id="outlined-basic" label="Ip" variant="outlined"  value={ip} onChange={handleIpChange}/>
                <TextField id="outlined-basic" label="Mac" variant="outlined" value={mac} onChange={handleMacChange} />
                <FormGroup>
                  <FormControlLabel control={<Checkbox  checked={enableCollector} onChange={(event) => {setEnableCollector(event.target.checked)}}/>} label="Enable Collector" /> 
                </FormGroup>

             </Stack>
            
            </CardContent>
          </Card>

          <Card className="section-white">
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',marginTop: '16px',marginBottom:"16px"  }}>
                  
                  <Typography variant="h5" component="div">
                      Spot
                  </Typography>
                  <IconButton >
                      <AddCircleOutlineIcon onClick={addSpotTemp}/>
                  </IconButton>
            
              </div>

            
              {spots.map((spot) => (
        
                <ExpandedContent addSpotToMap={handleAddSpot} handleDeleteSpot={handleDeleteSpot} projectName={props.projectName} title={spot.name} info={spot} satName={props.nameEntity}></ExpandedContent>
              
              ))}
              
            </CardContent>
          </Card>

          <Card className="section-white">
            <CardContent>
            <Stack spacing={2} style={{ marginTop: '16px' }}>
              <Typography variant="h5" component="div">
                Modulation Up link
              </Typography>

              <DataTable projectName={props.projectName} handeWave={handleWaveUP}></DataTable>
              <TextField id="outlined-basic" label="Symbol rate" variant="outlined" value={rateUP} onChange={handleRateUP}/>
              
            </Stack>
            </CardContent>
          </Card>


          <Card className="section-white">
            <CardContent>
            <Stack spacing={2} style={{ marginTop: '16px' }}>
              <Typography variant="h5" component="div">
                Modulation Down link
              </Typography>

              <DataTable projectName={props.projectName} handeWave={handleWaveDown}></DataTable>
              <TextField id="outlined-basic" label="Symbol rate" variant="outlined" value={rateDown} onChange={handleRateDown} />

            </Stack>
            </CardContent>
          </Card>

        </div>


      </Dialog>
  );
}