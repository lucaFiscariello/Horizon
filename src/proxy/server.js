const express = require('express');
const fs = require('fs');
const tar = require('tar');
const app = express();
const port = 3003; 

// Middleware per il parsing del corpo delle richieste in formato JSON
app.use(express.json());

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

        let response = await fetch(baseUrl+req.originalUrl,options_profile)
        return res.json(response);
    }
  });

  

});

app.post('/osm/admin/v1/tokens',async (req, res) => {
    let response = await forwarding_to_server(req)
    const jsonData =  await response.json();
    return res.json(jsonData);
});

app.delete('/osm/admin/v1/tokens',async (req, res) => {
  let response = await forwarding_to_server(req)
  const jsonData =  await response.json();
  return res.json(jsonData);
});

app.get('/osm/vnfpkgm/v1/vnf_packages',async (req, res) => {
  let response = await forwarding_to_server(req)
  const jsonData =  await response.json();
  return res.json(jsonData);
});

app.get('/osm/nsd/v1/ns_descriptors',async (req, res) => {
  let response = await forwarding_to_server(req)
  const jsonData =  await response.json();
  return res.json(jsonData);
});

app.post('/osm/nsd/v1/ns_descriptors',async (req, res) => {
  let response = await forwarding_to_server(req)
  const jsonData =  await response.json();
  return res.json(jsonData);
});

app.get('/osm/nslcm/v1/ns_instances',async (req, res) => {
  let response = await forwarding_to_server(req)
  const jsonData =  await response.json();
  return res.json(jsonData);
});

app.get('/osm/nslcm/v1/ns_instances',async (req, res) => {
  let response = await forwarding_to_server(req)
  const jsonData =  await response.json();
  return res.json(jsonData);
});

app.post('/osm/nslcm/v1/ns_instances',async (req, res) => {
  let response = await forwarding_to_server(req)
  const jsonData =  await response.json();
  return res.json(jsonData);
});

app.patch('/osm/nsd/v1/ns_descriptors/:id',async (req, res) => {

  let response = await forwarding_to_server(req)
  return res.json(response);
});



// Avvio del server
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});


let baseUrl = "http://127.0.0.1:80"
async function forwarding_to_server(req){

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
  

