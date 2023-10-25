import JSZip from 'jszip';

export async function test_osm(){

    let token = await post_token()
    let vnfs = await get_VNFDs(token)
    let nsds = await get_NSDs(token)
     
    let response = await post_NSD(token)
    let id = response.id
    let blob = await create_zip()
    
    await patch_NSD(token,id,"nome","descrizione")
    await put_NSD(token,id,blob)
    
    await delete_token(token)
        

}

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
    
    let response = await fetch("osm/admin/v1/tokens",options_profile)
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
    
    let response = await fetch("osm/admin/v1/tokens",options_profile)
  

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
    
    let response = await fetch("osm/vnfpkgm/v1/vnf_packages",options_profile)
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
    
    let response = await fetch("osm/nsd/v1/ns_descriptors",options_profile)
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
    
    let response = await fetch("osm/nslcm/v1/ns_instances",options_profile)
    let jsonData = await response.json()
    
    return jsonData

}


async function post_NS(token,nsName,nsdId,vimAccountId){
	
    let body = new Object()
    body.nsName = "my_first_ns"
    body.nsdId = "b81b7bb5-5862-4d54-95ac-b794cb147aa5"
    body.vimAccountId = "961654c4-6239-4666-bd93-734ae34ad510"
    
    //body.nsName = nsName
    //body.nsdId = nsdId
    //body.vimAccountId = vimAccountId
    
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

async function post_NSD(token){
	  
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

async function patch_NSD(token,id,name,description){
	  
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

async function put_NSD(token,id,blob){
	  
    const options_profile = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/zip',
          "Accept": "application/json",
          "Authorization" : 'Bearer '+token   
        },
        body:blob
    };
    
    let response = await fetch("osm/nsd/v1/ns_descriptors/"+id+"/nsd_content",options_profile)
    const jsonData =  await response.json();
    
    return jsonData

}

async function create_zip(){

  const zip = new JSZip();
  const folder = zip.folder('my_first_ns');
  const data = "nsd:\n\
  nsd:\n\
  - description: A very simple network service that deploys 1 VM\n\
    designer: Canonical\n\
    df:\n\
    - id: default-df\n\
      vnf-profile:\n\
      - id: my_first_vnf\n\
        virtual-link-connectivity:\n\
        - constituent-cpd-id:\n\
          - constituent-base-element-id: my_first_vnf\n\
            constituent-cpd-id: vnf-mgmt-ext\n\
          virtual-link-profile-id: mgmtnet\n\
        vnfd-id: my_first_vnf\n\
    id: my_first_ns\n\
    name: my_first_ns\n\
    version: 1.0\n\
    virtual-link-desc:\n\
    - id: mgmtnet\n\
      mgmt-network: true\n\
    vnfd-id:\n\
    - my_first_vnf"
	    
  folder.file('my_first_nsd.yaml', data);
  let blob = await zip.generateAsync({ type: 'blob' })
  
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'myZipFile.tar.gz';
  a.click();
  
  return blob
}




