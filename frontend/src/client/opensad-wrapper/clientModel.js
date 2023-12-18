import sat from 'assets/img/opensand/sat.png'


export async function addEntity(project,nameEntity,type){

  let body = new Object()
  body.nameEntity = nameEntity
  body.type = type

  const options_profile = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
    body:JSON.stringify(body)
  };

  let response = await fetch("/model/project/"+project+"/entity",options_profile)
  return response;

}

export async function configureEntity(project,nameEntity,ip,mac){

  let body = new Object()
  body.ip = ip
  body.mac = mac

  const options_profile = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
    body:JSON.stringify(body)
  };

  let response = await fetch("/model/project/"+project+"/entity/"+nameEntity+"/configure",options_profile)
  return response;

}

export async function modifyEntity(project,nameEntity,ip,mac){

  let body = new Object()
  body.ip = ip
  body.mac = mac

  const options_profile = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
    body:JSON.stringify(body)
  };

  let response = await fetch("/model/project/"+project+"/entity/"+nameEntity+"/modify",options_profile)
  return response;

}

export async function addPhysicalEntity(nameProject,nameNode,typeNode){

  let body = new Object()

  body.name = nameNode
  body.type = typeNode

  const options_profile = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
    body:JSON.stringify(body)

  };

  let response = await fetch("/model/project/"+nameProject+"/entity/physical",options_profile)
  const jsonData =  await response.json();
  return jsonData

}

export async function addPhysicalMapping(nameProject,nameEntityPhysical,nameEntityVirt){

  const options_profile = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
  };

  let response = await fetch("/model/project/"+nameProject+"/entity/physical/"+nameEntityPhysical+"/mapping/virtual/"+nameEntityVirt,options_profile)
  const jsonData =  await response.json()
  return jsonData;

}

export async function addPhysicalLink(nameProject,source,target){

  let body = new Object()
  body.source = source
  body.target = target

  const options_profile = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
    body: JSON.stringify(body)
  };

  let response = await fetch("/model/project/"+nameProject+"/link/physical",options_profile)
  const jsonData =  await response.json()
  return jsonData;

}

export async function addSpot(nameProject,f_regen,r_regen,idSat,idGW){

  let body = new Object()

  body.f_regen = f_regen
  body.r_regen = r_regen
  body.idGW = idGW
  body.idSat = idSat

  const options_profile = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
    body: JSON.stringify(body)
  };

  let response = await fetch("/model/project/"+nameProject+"/spot",options_profile)
  const jsonData =  await response.json()
  return jsonData;

}

export async function addRoute(nameProject,nameGw,nameSt){

  let body = new Object()
  body.idGW = nameGw
  body.idSt = nameSt

  const options_profile = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
    body: JSON.stringify(body)
  };

  let response = await fetch("/model/project/"+nameProject+"/route",options_profile)
  const jsonData =  await response.json()
  return jsonData;

}

export async function getPhysicalNode(nameProject){

  const options_profile = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
  };

  let response = await fetch("/model/project/"+nameProject+"/entity/physical",options_profile)
  const jsonData =  await response.json();

  if(!jsonData.physicalNodes)
      return []

  for(let entity of jsonData.physicalNodes)
      entity.svg = sat

  return jsonData.physicalNodes
 

}

export async function getAllVirtualNode(nameProject){

  const options_profile = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
  };

  let response = await fetch("/model/project/"+nameProject+"/entity",options_profile)
  const jsonData =  await response.json();

  if(!jsonData.entities)
      return []

  return jsonData.entities
 

}

export async function getPhysicalLinks(nameProject){

  const options_profile = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
  };

  let response = await fetch("/model/project/"+nameProject+"/link/physical",options_profile)
  const jsonData =  await response.json();

  if (jsonData.physicaLinks)
   return jsonData.physicaLinks 
  return []

}

export async function getPhysicalMapping(nameProject,nameEntity){

  const options_profile = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
  };

  let response = await fetch("/model/project/"+nameProject+"/entity/"+nameEntity+"/physical/mapping",options_profile)
  const jsonData =  await response.json()
  return jsonData;

}


export async function getModel(nameProject){

  const options_profile = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
  };

  let response = await fetch("/model/"+nameProject,options_profile)
  const jsonData =  await response.json()
  return jsonData;

}

export async function getSpots(nameProject,nameSat){

  const options_profile = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
  };

  let response = await fetch("/model/project/"+nameProject+"/entity/"+nameSat+"/spots",options_profile)
  const jsonData =  await response.json();
  if(!jsonData)
      return []


  return jsonData
 

}

export async function getRoutes(nameProject){

  const options_profile = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
  };

  let response = await fetch("/model/project/"+nameProject+"/route",options_profile)
  const jsonData =  await response.json();
  if(!jsonData)
      return []


  return jsonData
 

}

export async function deletePhysicalNode(nameProject,nameEntity){

  const options_profile = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
  };

  let response = await fetch("/model/project/"+nameProject+"/entity/"+nameEntity+"/physical",options_profile)
  const jsonData =  await response.json()
  return jsonData;

}

export async function deletePhysicalLink(nameProject,source,target){

  let body = new Object()
  body.source = source
  body.target = target

  const options_profile = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
    body: JSON.stringify(body)
  };

  let response = await fetch("/model/project/"+nameProject+"/link/physical",options_profile)
  const jsonData =  await response.json()
  return jsonData;

}

export async function createNetwork(nameProject){

  const options_profile = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
  };

  let response = await fetch("/model/project/"+nameProject+"/instantiate",options_profile)
  const jsonData =  await response.json()
  return jsonData;

}







