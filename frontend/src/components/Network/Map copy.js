import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';

function App() {
  const [circles, setCircles] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [currentCircle, setCurrentCircle] = useState(null);
  const defaultCenter = [51.505, -0.09]; // Posizione di default della mappa

  const handleMapClick = (event) => {
    if (drawing) {
      const newCircle = {
        center: [event.latlng.lat, event.latlng.lng],
        radius: 0,
      };

      console.log("clicco")
      setCircles((prevCircles) => [...prevCircles, newCircle]);
      setCurrentCircle(newCircle);
    }
  };

  const handleMouseDown = () => {
    setDrawing(true);
  };

  const handleMouseMove = (event) => {
    if (drawing && currentCircle) {
      const { lat, lng } = event.latlng;
      const newRadius = Math.sqrt(
        Math.pow(lat - currentCircle.center[0], 2) + Math.pow(lng - currentCircle.center[1], 2)
      );

      setCurrentCircle((prevCircle) => ({
        ...prevCircle,
        radius: newRadius,
      }));
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
    setCurrentCircle(null);
  };

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      style={{ height: '500px', width: '100%' }}
      eventHandlers={{ click: () => handleMapClick() }}
      click={handleMapClick}
      mouseDown={handleMouseDown}
      mouseMove={handleMouseMove}
      mouseUp={handleMouseUp}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {circles.map((circle, index) => (
        <Circle
          key={index}
          center={circle.center}
          pathOptions={{ fillColor: 'green', color: 'green' }}
          radius={circle.radius}
        />
      ))}

      {currentCircle && (
        <Circle
          center={currentCircle.center}
          pathOptions={{ fillColor: 'green', color: 'green' }}
          radius={currentCircle.radius}
        />
      )}
    </MapContainer>
  );
}

export default App;
