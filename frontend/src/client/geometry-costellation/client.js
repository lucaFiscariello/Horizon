
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


