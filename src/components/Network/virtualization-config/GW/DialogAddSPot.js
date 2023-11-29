import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogActions, TextField } from '@mui/material';
import "assets/css/style.css"

export default function AlertDialog(props) {
  const [nameSpot, setNameSpot] = React.useState("");

  const handleTextFieldChange = (event) => {
    setNameSpot(event.target.value);
  };
  
  return (
    <React.Fragment>
      <Dialog open={props.open} onClose={props.handleClose} >
        <DialogTitle >Add a new Entity in your Platform</DialogTitle>
          <DialogContent>

              <DialogContentText>
                  Please give a name and select the role of your machine!
              </DialogContentText>
              <TextField onChange={handleTextFieldChange} id="outlined-basic" label="Satellite name" variant="outlined"  />
          </DialogContent>

        <DialogActions>
            <button onClick={() => props.handeSetNameSpot(nameSpot)} className='button'>Save</button>
        </DialogActions>

        
      </Dialog>
    </React.Fragment>
  );
}