

export async function post_token(){

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
    
    let response = await fetch("osm/admin/v1/tokens",options_profile)
    const jsonData =  await response.json();

    return jsonData.id

}

export async function delete_token(token){

    const options_profile = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization" : 'Bearer '+token
          
        }
    };
    
    let response = await fetch("osm/admin/v1/tokens",options_profile)
    return response

}

export async function get_VNFDs(token){

    const options_profile = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization" : 'Bearer '+token
          
        }
    };
    
    let response = await fetch("osm/vnfpkgm/v1/vnf_packages",options_profile)
    const jsonData =  await response.json();
    
    return jsonData

}

export async function get_NSDs(token){


    const options_profile = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization" : 'Bearer '+token
        }
    };
    
    let response = await fetch("osm/nsd/v1/ns_descriptors",options_profile)
    const jsonData =  await response.json();
    
    return jsonData

}

export async function get_NSs(token){

    const options_profile = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization" : 'Bearer '+token
          
        }
    };
    
    let response = await fetch("osm/nslcm/v1/ns_instances",options_profile)
    let jsonData = await response.json()
    
    return jsonData

}

export async function post_NS(token,nsName,nsdId,vimAccountId){
	
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
    
    let response = await fetch("osm/nslcm/v1/ns_instances/",options_profile)
    const jsonData =  await response.json();
    return jsonData

}

export async function post_NS_instatiate(token,nsName,nsId,nsdId,vimAccountId){
	
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
  
  let response = await fetch("osm/nslcm/v1/ns_instances/"+nsId+"/instantiate",options_profile)
  const jsonData =  await response.json();
  console.log(jsonData)
  return jsonData

}

export async function post_NSD(token){
	  
    const options_profile = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization" : 'Bearer '+token   
        },
    };
    
    let response = await fetch("osm/nsd/v1/ns_descriptors",options_profile)
    const jsonData =  await response.json();
    
    return jsonData

}

export async function patch_NSD(token,id,name,description){
	  
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
    
    let response = await fetch("osm/nsd/v1/ns_descriptors/"+id,options_profile)

    return response
}

export async function put_NSD(token,id,data){

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
  
  let response = await fetch("/osm/nsd/v1/ns_descriptors/"+id+"/nsd_content",options_profile)  
  return response


}

export async function get_vims(token){

  const options_profile = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
        "Authorization" : 'Bearer '+token
        
      }
  };
  
  let response = await fetch("osm/admin/v1/vims",options_profile)
  let jsonData = await response.json()
  
  return jsonData

}

export async function post_migrate_vnf(token,vnfId,nsId){

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
  
  let response = await fetch("osm/nslcm/v1/ns_instances/"+nsId+"/migrate",options_profile)
  let jsonData = await response.json()
  
  return jsonData

}

export async function post_action(token,nameAction,nsId,configparams,vnf_index){

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
  
  let response = await fetch("osm/nslcm/v1/ns_instances/"+nsId+"/action",options_profile)
  let jsonData = await response.json()
  
  return jsonData

}





export async function post_NST(token){
	  
  const options_profile = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
        "Authorization" : 'Bearer '+token   
      },
  };
  
  let response = await fetch("osm/nst/v1/netslice_templates",options_profile)
  const jsonData =  await response.json();
  
  return jsonData

}

export async function put_NST(token,id,data){

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

  let response = await fetch("/osm/nst/v1/netslice_templates/"+id+"/nst_content",options_profile)
  const jsonData =  await response.json();

  return jsonData


}

export async function post_NST_instance(token,nsiName,nstId,vimAccountId){
	
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

export async function post_NST_instatiate(token,nsName,nsId,vimAccountId){

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



