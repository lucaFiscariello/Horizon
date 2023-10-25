### Configurazioni
- npm install timer-browserify
- npm install stream-browserify
- npm install react-app-rewired --save-dev
- modifica il file node_modules/react-scripts/config/webpack.config.js 

### Modifica


resolve: \{
      fallback: \{ 
        "timers": require.resolve("timers-browserify"),
        "stream": require.resolve("stream-browserify")
      \}
      ...
\}

Tutto è stato poi automatizzato nel file config-overrides.js

# Lanciare opensand server a mano
- sudo apt-get install opensand 
- opensand -g /var/opensand/www -> crea gli xsd
- sudo python3 /var/opensand/opensand-conf/backend.py -> fa partire server http


I file dei progetti sono salvati di default dal server in /var/opensand/www
Ricorda la versione di node 18.16.1 -> installato tramite nvm

# Lancio horizon
- manca d3-drag
- manca d3-force
- manca d3-zoom
- manca d3-shape
- manca d3-brush
- manca d3
