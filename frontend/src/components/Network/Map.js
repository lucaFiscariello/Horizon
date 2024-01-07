// MapComponent.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup,LayerGroup,Circle,Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Importa il file CSS di Leaflet
import L from 'leaflet'; // Importa la libreria Leaflet
import FullScreenDialogConfigGW from './virtualization-config/GW/FullScreenDialogGW';
import createTheme from 'opensand/utils/theme.ts';
import useMediaQuery from '@mui/material/useMediaQuery';
import {ThemeProvider} from '@mui/material/styles';
import FullScreenDialogConfigST from './virtualization-config/ST/FullScreenDialogST';
import FullScreenDialogConfigSAT from './virtualization-config/SAT/FullScreenDialogSAT';
import { getSpotLocation } from 'client/geometry-costellation/client';
import { getNodeLocation } from 'client/geometry-costellation/client';


const customIcon = new L.Icon({
    iconUrl: "https://static.vecteezy.com/system/resources/previews/019/858/822/original/satellite-flat-color-outline-icon-free-png.png",
    iconSize: [32, 32], // Dimensioni dell'icona
    iconAnchor: [16, 32], // Posizione dell'ancora rispetto all'icona
    popupAnchor: [0, -32], // Posizione del popup rispetto all'icona
  });

  const customIconSat = new L.Icon({
    iconUrl: "https://cdn.icon-icons.com/icons2/2481/PNG/512/satellite_icon_149808.png",
    iconSize: [32, 32], // Dimensioni dell'icona
    iconAnchor: [16, 32], // Posizione dell'ancora rispetto all'icona
    popupAnchor: [0, -32], // Posizione del popup rispetto all'icona
  });


const MapComponent =  (props) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(() => createTheme(prefersDarkMode), [prefersDarkMode]);
  
  const [physicalNodes, setPhysicalNodes] = React.useState([]);
  const [spots, setSpots] = React.useState([]);

  const [center, setCenter] = React.useState([52.505, 4]);
  const [openGW, setOpenGW] = React.useState(false);
  const [openST, setOpenST] = React.useState(false);
  const [openSAT, setOpenSAT] = React.useState(false);


  React.useEffect(async () => {
    let nodes = await getNodeLocation()
    let spots_all = await getSpotLocation(props.projectName)

    for(let node of nodes){
      node.nome=node.nome+"-"+props.projectName
    }

    setPhysicalNodes(nodes)
    setSpots(spots_all)

    console.log(spots_all)
  }, []);

  const handleMarkerClickGW = async() => {
    setOpenGW(true)
  };

  const addSpotToMap = async(spot) => {
      setSpots([...spots,spot])
  };

  const deleteSpotToMap = async(id) => {
    const newSpots = spots.filter((spot) => spot.id !== id);
    setSpots(newSpots)
};

  const handleMarkerClickSAT = () => {
    setOpenSAT(true)
  };

  const handleMarkerClickST = () => {
    setOpenST(true)
  };

  const handleCloseGW =  () => {
    setOpenGW(false);
  };

  const handleCloseSAT =  () => {
    setOpenSAT(false);
  };

  const handleCloseST =  () => {
    setOpenST(false);
  };

  /*
  let x = -0.09 
  React.useEffect(() => {
    const intervalId = setInterval(() => {
        x = x+0.05
        setCenter([52.505,x ]);
      }, 1000);

    // Pulisci l'intervallo quando il componente viene smontato
    return () => clearInterval(intervalId);
  }, []); // Assicurati di passare un array vuoto come dipendenza per eseguire l'effetto solo all'inizio
  */
  

  return (
    <MapContainer center={center} zoom={6} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LayerGroup>

        {spots.map((spot) => (
          <Circle center={[spot.latitudine,spot.longitudine]}  pathOptions={{ fillColor: 'green', color:"green" }} radius={spot.radius} />
        ))}

      </LayerGroup>

      {physicalNodes.map((node) => (
    
        <Marker
          position={[node.latitudine,node.longitudine]}  
          icon={
            node.type == "Satellite"? customIconSat: customIcon 
          }    
          eventHandlers={
            node.type == "Satellite"?{ click: () => handleMarkerClickSAT() }:
            node.type == "Terminal"?{ click: () => handleMarkerClickST() }:{ click: () => handleMarkerClickGW() }
          }
        >
          <Tooltip direction="bottom" offset={[0, 0]} opacity={1} permanent>
            {node.nome}  
          </Tooltip>
        </Marker>

      ))}

    
      <ThemeProvider theme={theme}>
        {physicalNodes.map((node) => (
        
        node.type == "Gateway"? <FullScreenDialogConfigGW open={openGW} handleClose={handleCloseGW} projectName={props.projectName}  nameEntity = {node.nome}></FullScreenDialogConfigGW> :
        node.type == "Satellite"? <FullScreenDialogConfigSAT open={openSAT} handleClose={handleCloseSAT} projectName={props.projectName}  nameEntity = {node.nome} addSpotToMap={addSpotToMap} deleteSpotToMap={deleteSpotToMap}></FullScreenDialogConfigSAT> :
        <FullScreenDialogConfigST open={openST} handleClose={handleCloseST} projectName={props.projectName}  nameEntity = {node.nome}></FullScreenDialogConfigST>
        
        ))}
      </ThemeProvider>

    </MapContainer>
  );
};

export default MapComponent;
