
export async function getSpotLocation(project){

  const options_profile = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
  };

  let response = await fetch("/geometry/spots/"+project,options_profile)
  response = await response.json()
  return response.spots;

}

export async function getWS(ground){

  const options_profile = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
  };

  let response = await fetch("/geometry/WS/"+ground,options_profile)
  response = await response.json()
  return response.nodes;

}

export async function deleteSpotLocation(spot){

  const options_profile = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
  };

  let response = await fetch("/geometry/spots/"+spot.id,options_profile)
  response = await response.json()
  return response.spots;

}

export async function postSpotLocation(project,latitudine,longitudine,radius,satName,name){

  let body = new Object()
  body.project = project
  body.latitudine = latitudine
  body.longitudine = longitudine
  body.radius = radius
  body.satName = satName
  body.name = name

  const options_profile = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
    body:JSON.stringify(body)

  };


  let response = await fetch("/geometry/spots",options_profile)
  response = await response.json()
  return response;

}

export async function postNode(latitudine,longitudine,name,type,ip){

  let body = new Object()
  body.latitudine = latitudine
  body.longitudine = longitudine
  body.type = type
  body.name = name
  body.ip = ip

  const options_profile = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
    body:JSON.stringify(body)

  };

  let response = await fetch("/geometry/nodes",options_profile)
  response = await response.json()
  return response;

}


export async function getNodeLocation(){

  const options_profile = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
  };

  let response = await fetch("/geometry/nodes",options_profile)
  response = await response.json()
  return response.nodes;

}

export async function getNodeLocationInsideSpot(project,spotName){

  const options_profile = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
  };

  let response = await fetch("/geometry/nodes/"+project+"/spots/"+spotName,options_profile)
  response = await response.json()
  return response.nodes;

}


