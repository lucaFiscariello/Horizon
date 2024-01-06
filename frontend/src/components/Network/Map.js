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
  const [center, setCenter] = React.useState([52.505, 4]);

  const [openGW, setOpenGW] = React.useState(false);
  const [openST, setOpenST] = React.useState(false);
  const [openSAT, setOpenSAT] = React.useState(false);

  const pos2 = [52.005, -0.09];
  const pos1 = [52.105, 1.09];
  const spot_pos = [52.505, 0.08];


  const handleMarkerClickGW = async() => {
    setOpenGW(true)
    let res = await getSpotLocation("slice1")
    console.log(res)

    res = await getNodeLocation()
    console.log(res)

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

  let nameGW = props.projectName+"-gw"
  let nameST = props.projectName+"-st"
  let nameSAT = props.projectName+"-sat"

  

  return (
    <MapContainer center={center} zoom={6} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LayerGroup>
        <Circle center={center} pathOptions={{ fillColor: 'green', color:"green" }} radius={400000} />
        <Circle center={spot_pos} pathOptions={{ fillColor: 'green', color:"green" }} radius={100000} />

      </LayerGroup>
      <Marker position={pos1} icon={customIcon} eventHandlers={{ click: () => handleMarkerClickST() }}>
        <Tooltip direction="top" offset={[0, -30]} opacity={1} permanent>
            {nameST}
        </Tooltip>
      </Marker>
      <Marker position={pos2} icon={customIcon} eventHandlers={{ click: () => handleMarkerClickGW() }}>
        <Tooltip direction="bottom" offset={[0, 0]} opacity={1} permanent>
          {nameGW}
        </Tooltip>
      </Marker>
      <Marker position={center} icon={customIconSat} eventHandlers={{ click: () => handleMarkerClickSAT() }}>
        <Tooltip direction="bottom" offset={[0, 0]} opacity={1} permanent>
          {nameSAT}
        </Tooltip>
      </Marker>
      <ThemeProvider theme={theme}>
        <FullScreenDialogConfigGW open={openGW} handleClose={handleCloseGW} projectName={props.projectName}  nameEntity = {nameGW}></FullScreenDialogConfigGW>
        <FullScreenDialogConfigST open={openST} handleClose={handleCloseST} projectName={props.projectName}  nameEntity = {nameST}></FullScreenDialogConfigST>
        <FullScreenDialogConfigSAT open={openSAT} handleClose={handleCloseSAT} projectName={props.projectName}  nameEntity = {nameSAT}></FullScreenDialogConfigSAT>
      </ThemeProvider>

    </MapContainer>
  );
};

export default MapComponent;
