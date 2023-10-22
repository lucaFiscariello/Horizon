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

# To DO
- quando aggiungo un st a un gw gia collegato a un sat non ci deve essere cambiamento di colore
- quando aggiungo un entità devo modificare automaticamente l'id
- nell'infrastruttura devo aggiornare gli id delle altre entità. Meglio farlo nalla network entity
- prevedi il caso in cui non c'è nessuno spot o nessun rotta quando ne aggiungi una
- elimina progetto
- doppio click sulla entità apre schermata configurazione
- bottone eliminazione, eliminazione anche multipla delle entità
- eliminazione di un nodo non permessa se prima non si elimina uno spot
- eliminazione spot cliccando sul link
- l'aggiunta di una nuova entità deve comportare l'aggiornamento immediato degli xml

