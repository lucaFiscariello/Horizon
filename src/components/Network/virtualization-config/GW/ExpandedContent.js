import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import "assets/css/styleDialog.css"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SingleSpotCard from './SingleSpotCard';




export default function ExpandedContent(props) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
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

  const allSpots = ["Spot1", "Spot2","Spot3"]
  const ExpandedSpots = allSpots.map((title) => (
    <SingleSpotCard title={title} />
  ));

  return (

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
                
                <IconButton onClick={()=> props.handleDelete(props.title)}>
                    <DeleteIcon ></DeleteIcon>
                </IconButton>

            </div>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Stack spacing={2} style={{ marginTop: '16px' }}>
                    <TextField id="outlined-basic" label="Name" variant="outlined" placeholder={props.title} />
                    <TextField id="outlined-basic" label="Bandwidth" variant="outlined" />
                    <TextField id="outlined-basic" label="Delay" variant="outlined" />
                </Stack>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',marginTop: '16px',marginBottom:"16px"  }}>
                
                    <Typography variant="h7" component="div">
                        Spot
                    </Typography>
                    <IconButton >
                        <AddCircleOutlineIcon />
                    </IconButton>
              
                </div>

                {ExpandedSpots}


            </Collapse>

        </CardContent>

        
      </Card>
    
  );
}