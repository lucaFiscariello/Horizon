export async function create_ns_gw_st(type,nameEntity,ip,cidr){

  let body = new Object()
  body.type = type
  body.nameEntity = nameEntity
  body.ip = ip
  body.cidr = cidr

  const options_profile = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
    body:JSON.stringify(body)
  };

  let response = await fetch("/osm-wrapper/ns/gw-st/template",options_profile)
  let json_res = await response.json()
  return json_res.ns;

}

export async function create_ns_sat(type,nameEntity,ip){

  let body = new Object()
  body.type = type
  body.nameEntity = nameEntity
  body.ip = ip

  const options_profile = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
    body:JSON.stringify(body)
  };

  let response = await fetch("/osm-wrapper/ns/sat/template",options_profile)
  let json_res = await response.json()
  return json_res.ns;

}

export async function create_nst(nameProject,entities){

  let body = new Object()
  body.project = nameProject
  body.entities = entities

  const options_profile = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
    body:JSON.stringify(body)
  };

  let response = await fetch("/osm-wrapper/nst",options_profile)
  let json_res = await response.json()
  return json_res.nst;

}








