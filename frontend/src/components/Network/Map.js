// MapComponent.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup,LayerGroup,Circle,Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Importa il file CSS di Leaflet
import L from 'leaflet'; // Importa la libreria Leaflet
import FullScreenDialogConfigGW from './virtualization-config/GW/FullScreenDialogGW';
import createTheme from 'opensand/utils/theme.ts';
import useMediaQuery from '@mui/material/useMediaQuery';
import {ThemeProvider} from '@mui/material/styles';


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


const MapComponent = (props) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(() => createTheme(prefersDarkMode), [prefersDarkMode]);
  const [center, setCenter] = React.useState([52.505, -0.09]);
  const [open, setOpen] = React.useState(false);

  const pos2 = [50.905, -0.09];
  const pos1 = [51.505, -0.09];

  const handleMarkerClick = () => {
    console.log('Marker clicked!');
    setOpen(true)
  };

  const handleClose =  () => {
    setOpen(false);
  };

  let x = -0.09 
  React.useEffect(() => {
    const intervalId = setInterval(() => {
        x = x+0.05
        setCenter([52.505,x ]);
      }, 1000);

    // Pulisci l'intervallo quando il componente viene smontato
    return () => clearInterval(intervalId);
  }, []); // Assicurati di passare un array vuoto come dipendenza per eseguire l'effetto solo all'inizio



  return (
    <MapContainer center={center} zoom={6} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LayerGroup>
        <Circle center={center} pathOptions={{ fillColor: 'green', color:"green" }} radius={500000} />
      </LayerGroup>
      <Marker position={pos1} icon={customIcon} eventHandlers={{ click: () => handleMarkerClick() }}>
        <Tooltip direction="top" offset={[0, -30]} opacity={1} permanent>
            ST
        </Tooltip>
      </Marker>
      <Marker position={pos2} icon={customIcon} eventHandlers={{ click: () => handleMarkerClick() }}>
        <Tooltip direction="bottom" offset={[0, 0]} opacity={1} permanent>
            GW
        </Tooltip>
      </Marker>
      <Marker position={center} icon={customIconSat} eventHandlers={{ click: () => handleMarkerClick() }}>
      </Marker>
      <ThemeProvider theme={theme}>
        <FullScreenDialogConfigGW open={open} handleClose={handleClose} projectName={props.projectName}  nameEntity = "gw"></FullScreenDialogConfigGW>
      </ThemeProvider>

    </MapContainer>
  );
};

export default MapComponent;
