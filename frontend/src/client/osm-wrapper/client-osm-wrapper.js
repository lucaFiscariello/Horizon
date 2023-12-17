export async function create_ns_gw_st(type,nameEntity,ip){

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

  let response = await fetch("/osm-wrapper/ns/gw-st/template",options_profile)
  let json_res = await response.json()
  return json_res.ns;

}








