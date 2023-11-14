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
import "assets/css/styleDialog.css"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ExpandedContent from './ExpandedContent';
import { Stack } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialogConfigGW(props) {
  const open = props.open
  const handleClose = props.handleClose
  const nameEntity = props.nameEntity
  const [allGW, setAllGW] = React.useState([]);

  let modelNetwork = props.modelNetwork

  React.useEffect(async ()  => {

    await modelNetwork.loadXMLDefault()
    await modelNetwork.loadModel()

    let virtualGWs = await modelNetwork.getPhisicalMapping(nameEntity)
    setAllGW(virtualGWs)
    

  }, []);

  const handleOnClickDelete = (toDelete) => {
    const updatedList = allGW.filter((string) => string !== toDelete);
    setAllGW(updatedList);
  };

  const handleOnClickAdd = async () => {

    await modelNetwork.loadXMLDefault()
    await modelNetwork.loadModel()

    await props.setCreateOnlyGW(true)
    await props.addListItem()

    setAllGW([...allGW,"newGW"])


  };

  const ExpandedContents = allGW.map((title) => (
    <ExpandedContent title={title} handleDelete = {handleOnClickDelete}  />
  ));


 
  return (
    <div>
    
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
            <Button color="inherit" onClick={handleClose} style={{ color: 'white' }} >
              Save
            </Button>
          </Toolbar>
        </AppBar>
        
        
        <div className="container">
          <Card className="section-white">
            <CardContent>
              <Typography variant="h5" component="div">
                Physical constraint
              </Typography>

              <Stack spacing={2} style={{ marginTop: '16px' }}>
                <TextField id="outlined-basic" label="Max physical bandwidth" variant="outlined" />
                <TextField id="outlined-basic" label="Latitude" variant="outlined" />
                <TextField id="outlined-basic" label="Longitude" variant="outlined" />
                <TextField id="outlined-basic" label="UpLink Attenuation" variant="outlined" />
                <TextField id="outlined-basic" label="DownLink Attenuation" variant="outlined" />
              </Stack>
            
            </CardContent>
          </Card>

          <Card className="section-white">
            <CardContent style={{ maxHeight: '1000px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <Typography variant="h5" component="div">
                  Virtualization
                </Typography>
                <IconButton onClick={handleOnClickAdd} >
                      <AddCircleOutlineIcon />
                </IconButton>
              
              </div>
            
              {ExpandedContents}
            
          
            </CardContent>
          </Card>
        </div>


      </Dialog>
    </div>
  );
}