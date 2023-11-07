const express = require('express');
const fs = require('fs');
const tar = require('tar');
const app = express();
const port = 3003; 

let baseUrlOsm = "http://127.0.0.1:80"
let baseUrlOpensand = "http://127.0.0.1:8888"

// Middleware per il parsing del corpo delle richieste in formato JSON
app.use(express.json());


/********************** Middleware opensand **********************/

app.use('/api/:value*', async (req, res) => {
  let response = await forwarding_to_server(baseUrlOpensand,req)
  const jsonData =  await response.json();
  return res.json(jsonData);  
});


/********************** Middleware osm **********************/

app.use('/osm/:value*', async (req, res,next) => {

  if(req.method == "PUT" &&  req.originalUrl.includes("nsd_content")){

    next()

  }
  else{

    let response = await forwarding_to_server(baseUrlOsm,req)
    const jsonData =  await response.json();
    return res.json(jsonData);   // Esegui il passaggio successivo
  
  }
 });

app.put('/osm/nsd/v1/ns_descriptors/:id/nsd_content',async (req, res) => {

  folderName = req.body.name
  fileName = folderName+"/"+req.body.name+".yaml"
  fileContent = req.body.data

  fs.mkdir(folderName, (err) => {
    if (err) {
      console.error(`Si è verificato un errore durante la creazione della cartella: ${err}`);
    } else {
      console.log(`Cartella ${folderName} creata con successo.`);
    }
  });

  fs.writeFile(fileName, fileContent, (err) => {
    if (err) {
      console.error(`Si è verificato un errore durante la creazione del file: ${err}`);
    } else {
      console.log(`File ${fileName} creato con successo.`);
    }
  });

  const sourceDirectory = folderName; 
  const outputFileName = 'archive.tar.gz'; 

  // Crea un file tar dall'intera directory
  await tar.c(
    {
      gzip: true, 
      file: outputFileName,
    },
    [sourceDirectory]
  )
    
  fs.readFile(outputFileName, async (err, data) => {
      if(err) {

        console.error('Si è verificato un errore durante la lettura del file:', err);

      }else {
     
        const blob = new Blob([data], { type: "application/gzip" })
        let token = req.body.token

        const options_profile = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/gzip',
            "Accept": "application/json",
            "Authorization" : 'Bearer '+token   
          },
          body:blob
        };

        let response = await fetch(baseUrlOsm+req.originalUrl,options_profile)
        return res.json(response);
    }
  });

});


/********************** Avvio server **********************/

app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});


async function forwarding_to_server(baseUrl,req){

    let options_profile;

    if(req.headers["content-length"]>0){
        options_profile = {
            method: req.method,
            headers: {
              'Content-Type': req.headers['content-type'],
              "Accept": req.headers.accept,
              "Authorization" : req.headers.authorization
            },
            body: JSON.stringify(req.body)
        };
    }else{
        options_profile = {
            method: req.method,
            headers: {
              'Content-Type': req.headers['content-type'],
              "Accept": req.headers.accept,
              "Authorization" : req.headers.authorization
            },
        };
    }

    let response = await fetch(baseUrl+req.originalUrl,options_profile)
    return response
  
  }


  

