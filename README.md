### Configurazioni
- npm install timer-browserify
- npm install stream-browserify
- modifica il file node_modules/react-scripts/config/webpack.config.js 

### Modifica

resolve: \{
      fallback: \{ 
        "timers": require.resolve("timers-browserify"),
        "stream": require.resolve("stream-browserify")
      \}
      ...
\}


