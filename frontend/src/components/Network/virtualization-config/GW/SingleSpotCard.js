import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import "assets/css/styleDialog.css"
import DeleteIcon from '@mui/icons-material/Delete';
import TableSpot from './Table';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import AlertDialog from './DialogAddSPot';




export default function SingleSpotCard(props) {
  const [expandedSpot, setExpandedSpot] = React.useState(false);


  const handleExpandClickSpot = () => {
    setExpandedSpot(!expandedSpot);
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h10" component="div">
                      {props.title}
                  </Typography>

                  <ExpandMore
                      expand={expandedSpot}
                      onClick={handleExpandClickSpot}
                      aria-expanded={expandedSpot}
                      aria-label="show more"
                      >
                      <ExpandMoreIcon />
                  </ExpandMore>

                  <IconButton onClick={()=> props.handleDelete(props.title)}>
                      <DeleteIcon ></DeleteIcon>
                  </IconButton>

                </div>

                <Collapse in={expandedSpot} timeout="auto" unmountOnExit>
                  <TableSpot></TableSpot>
                </Collapse>


            </div>


   
    
  );
}