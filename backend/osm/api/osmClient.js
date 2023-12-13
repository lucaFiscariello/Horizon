
const fs = require('fs');
const tar = require('tar');

let baseUrlOsm = "http://127.0.0.1:80/"

exports.post_token = async function post_token(){

    let body = new Object();

    body.username = "admin"
    body.password = "admin"
    body.project_id = "admin"

    const options_profile = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json"
        },
        body: JSON.stringify(body)
    };
    
    let response = await fetch(baseUrlOsm+"osm/admin/v1/tokens",options_profile)
    const jsonData =  await response.json();

    return jsonData.id

}

exports.delete_token = async function delete_token(token){

    const options_profile = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization" : 'Bearer '+token
          
        }
    };
    
    let response = await fetch(baseUrlOsm+"osm/admin/v1/tokens",options_profile)
    return response

}

exports.get_VNFDs = async function get_VNFDs(token){

    const options_profile = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization" : 'Bearer '+token
          
        }
    };
    
    let response = await fetch(baseUrlOsm+"osm/vnfpkgm/v1/vnf_packages",options_profile)
    const jsonData =  await response.json();
    
    return jsonData

}

exports.get_NSDs = async function get_NSDs(token){


    const options_profile = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization" : 'Bearer '+token
        }
    };
    
    let response = await fetch(baseUrlOsm+"osm/nsd/v1/ns_descriptors",options_profile)
    const jsonData =  await response.json();
    
    return jsonData

}

exports.get_NSs = async function get_NSs(token){

    const options_profile = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization" : 'Bearer '+token
          
        }
    };
    
    let response = await fetch(baseUrlOsm+"osm/nslcm/v1/ns_instances",options_profile)
    let jsonData = await response.json()
    
    return jsonData

}

exports.post_NS = async function post_NS(token,nsName,nsdId,vimAccountId){
	
    let body = new Object()
    body.nsName = nsName
    body.nsdId = nsdId
    body.vimAccountId = vimAccountId 
    
    const options_profile = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization" : 'Bearer '+token   
        },
        body: JSON.stringify(body),
    };
    
    let response = await fetch(baseUrlOsm+"osm/nslcm/v1/ns_instances/",options_profile)
    const jsonData =  await response.json();
    return jsonData

}

exports.post_NS_instatiate = async function post_NS_instatiate(token,nsName,nsId,nsdId,vimAccountId){
	
  let body = new Object()
  let vld = new Object()

  body.nsName = nsName
  body.nsdId = nsdId
  body.vimAccountId = vimAccountId 

  body.vld=[
   {"name": "test2",
    "ip-profile": {"ip-version": "ipv4" ,
                    "subnet-address": "10.168.100.0/24",
                  }
    }
  ]
  
  const options_profile = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
        "Authorization" : 'Bearer '+token   
      },
      body: JSON.stringify(body),
  };

  console.log(body)
  
  let response = await fetch(baseUrlOsm+"osm/nslcm/v1/ns_instances/"+nsId+"/instantiate",options_profile)
  const jsonData =  await response.json();
  console.log(jsonData)
  return jsonData

}

exports.post_NSD = async function post_NSD(token){
	  
    const options_profile = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization" : 'Bearer '+token   
        },
    };
    
    let response = await fetch(baseUrlOsm+"osm/nsd/v1/ns_descriptors",options_profile)
    const jsonData =  await response.json();
    
    return jsonData

}

exports.patch_NSD = async function patch_NSD(token,id,name,description){
	  
    let body = new Object()
    body.name = name 
    body.id = id
    body.description = description
    
    const options_profile = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization" : 'Bearer '+token   
        },
        body:JSON.stringify(body),
    };
    
    let response = await fetch(baseUrlOsm+"osm/nsd/v1/ns_descriptors/"+id,options_profile)

    return response
}

exports.put_NSD = async function put_NSD(token,id,data){

  /*
  let body = new Object()
  body.data = data 
  body.name = "nsd_dir"
  body.token = token
  body.id = id


  const options_profile = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json"   
    },
    body:JSON.stringify(body)
  };
  
  console.log(baseUrlOsm)
  let response = await fetch(baseUrlOsm+"osm/nsd/v1/ns_descriptors/"+id+"/nsd_content",options_profile)  
  return response
*/

  folderName = "nsd_dir"
  fileName = folderName+"/"+folderName+".yaml"
  fileContent = data

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

        const options_profile = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/gzip',
            "Accept": "application/json",
            "Authorization" : 'Bearer '+token   
          },
          body:blob
        };

        let response = await fetch(baseUrlOsm+"osm/nsd/v1/ns_descriptors/"+id+"/nsd_content",options_profile)  
        return response;
    }
});




}

exports.get_vims = async function get_vims(token){

  const options_profile = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
        "Authorization" : 'Bearer '+token
        
      }
  };
  
  let response = await fetch(baseUrlOsm+"osm/admin/v1/vims",options_profile)
  let jsonData = await response.json()
  
  return jsonData

}

exports.post_migrate_vnf = async function post_migrate_vnf(token,vnfId,nsId){

  let body = new Object()
  body.vnfInstanceId = vnfId
 
  const options_profile = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
        "Authorization" : 'Bearer '+token
        
      },
      body: JSON.stringify(body),

  };
  
  let response = await fetch(baseUrlOsm+"osm/nslcm/v1/ns_instances/"+nsId+"/migrate",options_profile)
  let jsonData = await response.json()
  
  return jsonData

}

exports.post_action = async function post_action(token,nameAction,nsId,configparams,vnf_index){

  let body = new Object()
  body.primitive = nameAction
  body.primitive_params = configparams
  body.member_vnf_index = vnf_index

  const options_profile = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
        "Authorization" : 'Bearer '+token
        
      },
      body: JSON.stringify(body),

  };
  
  let response = await fetch(baseUrlOsm+"osm/nslcm/v1/ns_instances/"+nsId+"/action",options_profile)
  let jsonData = await response.json()
  
  return jsonData

}









