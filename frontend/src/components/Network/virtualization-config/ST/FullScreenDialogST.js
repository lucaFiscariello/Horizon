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
import ExpandedContent from '../SAT/ExpandedContent';
import { Stack } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { addEntity } from 'client/opensad-wrapper/clientModel';
import { configureEntity } from 'client/opensad-wrapper/clientModel';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialogConfigST(props) {
  const open = props.open
  const handleClose = props.handleClose
  const nameEntity = props.nameEntity
  const [mac, setMac] = React.useState('');
  const [ip, setIP] = React.useState('');

  const handleMacChange = (event) => {
    setMac(event.target.value);
  };

  const handleIpChange = (event) => {
    setIP(event.target.value);
  };

  const handleSave = async () => {
    if(ip  && mac){
      await addEntity(props.projectName,props.nameEntity,"Terminal")
      await configureEntity(props.projectName,props.nameEntity,ip,mac)
      }
    props.handleClose()
  };
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
             </Stack>
            
            </CardContent>
          </Card>

        </div>


      </Dialog>
  );
}