

async function post_token(){

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
    
    let response = await fetch("http://127.0.0.1:80/osm/admin/v1/tokens",options_profile)
    const jsonData =  await response.json();

    return jsonData.id

}

async function delete_token(token){

    const options_profile = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization" : 'Bearer '+token
          
        }
    };
    
    let response = await fetch("http://127.0.0.1:80/osm/admin/v1/tokens",options_profile)
    return response

}

async function get_VNFDs(token){

    const options_profile = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization" : 'Bearer '+token
          
        }
    };
    
    let response = await fetch("http://127.0.0.1:80/osm/vnfpkgm/v1/vnf_packages",options_profile)
    const jsonData =  await response.json();
    
    return jsonData

}

async function get_NSDs(token){


    const options_profile = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization" : 'Bearer '+token
        }
    };
    
    let response = await fetch("http://127.0.0.1:80/osm/nsd/v1/ns_descriptors",options_profile)
    const jsonData =  await response.json();
    
    return jsonData

}

async function get_NSs(token){

    const options_profile = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization" : 'Bearer '+token
          
        }
    };
    
    let response = await fetch("http://127.0.0.1:80/osm/nslcm/v1/ns_instances",options_profile)
    let jsonData = await response.json()
    
    return jsonData

}

async function post_NS(token,nsName,nsdId,vimAccountId){
	
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
    
    let response = await fetch("http://127.0.0.1:80/osm/nslcm/v1/ns_instances/",options_profile)
    const jsonData =  await response.json();
    return jsonData

}

async function post_NS_instatiate(token,nsName,nsId,nsdId,vimAccountId){
	
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
  
  let response = await fetch("http://127.0.0.1:80/osm/nslcm/v1/ns_instances/"+nsId+"/instantiate",options_profile)
  const jsonData =  await response.json();
  console.log(jsonData)
  return jsonData

}

async function post_NSD(token){
	  
    const options_profile = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization" : 'Bearer '+token   
        },
    };
    
    let response = await fetch("http://127.0.0.1:80/osm/nsd/v1/ns_descriptors",options_profile)
    const jsonData =  await response.json();
    
    return jsonData

}

async function put_NSD(token,id,data){

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
  
  let response = await fetch("http://127.0.0.1:80/osm/nsd/v1/ns_descriptors/"+id+"/nsd_content",options_profile)  
  return response


}

async function get_vims(token){

  const options_profile = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
        "Authorization" : 'Bearer '+token
        
      }
  };
  
  let response = await fetch("http://127.0.0.1:80/osm/admin/v1/vims",options_profile)
  let jsonData = await response.json()
  
  return jsonData

}

async function post_migrate_vnf(token,vnfId,nsId){

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
  
  let response = await fetch("http://127.0.0.1:80/osm/nslcm/v1/ns_instances/"+nsId+"/migrate",options_profile)
  let jsonData = await response.json()
  
  return jsonData

}

async function post_action(token,nameAction,nsId,vnf_index,configparams){

  let body = new Object()
  body.primitive = nameAction

  if(configparams)
    body.primitive_params = configparams

  body.member_vnf_index = vnf_index
  body.vdu_id = "dataVM"
  const options_profile = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
        "Authorization" : 'Bearer '+token
        
      },
      body: JSON.stringify(body),

  };
  
  let response = await fetch("http://127.0.0.1:80/osm/nslcm/v1/ns_instances/"+nsId+"/action",options_profile)
  let jsonData = await response.json()
  console.log(jsonData)

  return jsonData

}

async function post_NST(token){
	  
  const options_profile = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
        "Authorization" : 'Bearer '+token   
      },
  };
  
  let response = await fetch("http://127.0.0.1:80/osm/nst/v1/netslice_templates",options_profile)
  const jsonData =  await response.json();
  
  return jsonData

}

async function put_NST(token,id,data){

  let body = new Object()
  body.data = data 
  body.name = "nst_dir"
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

  let response = await fetch("http://127.0.0.1:80/osm/nst/v1/netslice_templates/"+id+"/nst_content",options_profile)
  const jsonData =  await response.json();

  return jsonData


}

async function post_NST_instance(token,nsiName,nstId,vimAccountId){
	
  let body = new Object()
  body.nsiName = nsiName
  body.nstId = nstId
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
  
  let response = await fetch("osm/nsilcm/v1/netslice_instances/",options_profile)
  return response

}

async function post_NST_instatiate(token,nsName,nsId,vimAccountId){

  let body = new Object()
  body.nsiName = nsName
  body.nstId = nsId
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

  let response = await fetch("osm/nsilcm/v1/netslice_instances/"+nsId+"/instantiate",options_profile)
  return response

}

module.exports = { get_NSDs,delete_token, get_NSs, get_VNFDs, get_vims, post_NS, post_NSD, post_NST, post_NST_instance, post_NST_instatiate, post_NS_instatiate, post_action, post_migrate_vnf, post_token, put_NSD, put_NST};

