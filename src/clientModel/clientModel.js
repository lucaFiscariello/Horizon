import sat from 'assets/img/opensand/sat.png'

export async function inizializeModel(name, entities){

    let body = new Object()
    body.entities = entities

    const options_profile = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
      },
      body:JSON.stringify(body)
    };

    let response = await fetch("/model/project/"+name+"/inizialize",options_profile)
    return response;

}

export async function getPhysicalNode(nameProject){

    const options_profile = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
      },
    };

    let response = await fetch("/model/project/"+nameProject+"/node/physical",options_profile)
    const jsonData =  await response.json();

    if(!jsonData.physicalNodes)
        return []

    for(let entity of jsonData.physicalNodes)
        entity.svg = sat

    return jsonData.physicalNodes
   

}

export async function deletePhysicalNode(nameProject,nameEntity){

    const options_profile = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
      },
    };

    let response = await fetch("/model/project/"+nameProject+"/node/"+nameEntity+"/physical",options_profile)
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

export async function addPhysicalLink(nameProject,clickedNodes){

  if(clickedNodes.length != 2)
    return 

  let body = new Object()
  body.source = clickedNodes[0]
  body.target = clickedNodes[1]

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

export async function setIdNewNode(nameProject,nameNode){

    const options_profile = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
      },
    };

    let response = await fetch("/model/project/"+nameProject+"/node/"+nameNode+"/id",options_profile)
    const jsonData =  await response.json();
    return jsonData

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

    let response = await fetch("/model/project/"+nameProject+"/node/"+nameNode+"/physical",options_profile)
    const jsonData =  await response.json();
    return jsonData

}



