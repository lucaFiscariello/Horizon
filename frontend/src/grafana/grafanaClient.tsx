import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import "./style.css"

import useMediaQuery from '@mui/material/useMediaQuery';
import {ThemeProvider} from '@mui/material/styles';
import createTheme from 'opensand/utils/theme.ts';




const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(() => createTheme(prefersDarkMode), [prefersDarkMode]);


  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>

      <div>
        <Button variant="outlined" onClick={handleClickOpen} >
          Open metrics
        </Button>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Metrics
              </Typography>
            </Toolbar>
          </AppBar>
          
          <div className="grid-container">
          <div className="grid-item">
              <div className="iframe-container">
                <iframe src="http://localhost:3000/d-solo/aaabdb02-e026-4353-804a-ed438fea6ef2/test?orgId=1&from=1687936858485&to=1687958458485&panelId=1" width="450" height="200" frameBorder="0"></iframe> 
              </div>
          </div>
          <div className="grid-item">
              <div className="iframe-container">
                <iframe src="http://localhost:3000/d-solo/aaabdb02-e026-4353-804a-ed438fea6ef2/test?orgId=1&from=1687938873122&to=1687960473122&panelId=1" width="450" height="200" frameBorder="0"></iframe>
              </div>
          </div>
      </div>
      
        </Dialog>
      </div>

    </ThemeProvider>

  );
}