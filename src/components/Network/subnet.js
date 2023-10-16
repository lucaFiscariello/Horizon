import sat from 'assets/img/opensand/sat.png'
import xml2js from 'xml2js';


export class Subnet {

    constructor(ip) {
        this.ip = ip;
        this.sat = []
        this.gw = []
        this.st = []

        if(ip)
            this.ipIsDefinited =true
        else
            this.ipIsDefinited = false

        this.isSameSubnet = function (ipNew) {
            if(ipNew)
                return ipNew[0] == this.ip[0] && ipNew[1] == this.ip[1] 
                
            return false 
        };
    }
}
  

export function isNewSubnet(subnets,subnet){

    for( let id in subnets){
      if ( subnets[id].isSameSubnet(subnet["ip"]))
        return id
    }
      
    return -1
}

export function searchSubnets(machines){
    const Allsubnets = []
    const gw =  "Gateway"
    const st = "Terminal"
    const sat =  "Satellite"

    for(let nodeInfo of machines){

        let subnet = new Subnet(nodeInfo["ip"])
        let idExstSubnet = isNewSubnet(Allsubnets,subnet)

        if(Allsubnets.length == 0 || idExstSubnet == -1) {
            Allsubnets.push(subnet)
            idExstSubnet=0
        }
            

        let subnetExsit = Allsubnets[idExstSubnet]

        switch (nodeInfo["type"]) {
            case gw:
                subnetExsit.gw.push(nodeInfo)
                break;

            case st:
                subnetExsit.st.push(nodeInfo)
                break;

            case sat:
                subnetExsit.sat.push(nodeInfo)
                break;
        
            default:
                console.log('Error.');
        }
        
        
    }

    return Allsubnets
}

export function getLinksConnection(subnets){
    let links = []
    let linkTemplate = {"source":"","target":"","color": '#FF5733'}
    let linkTemplateSat = {"source":"","target":""}

    for( let subnet of subnets){
        let gw = subnet.gw[0]
        let sat = subnet.sat[0]

        for(let st of subnet.st){

            let newLink = linkTemplate
            newLink.source = st["name"]
            newLink.target = sat["name"]
            links.push(newLink)
            console.log(st["name"])
        }


        let newLinkSat = linkTemplateSat
        newLinkSat.source = gw["name"]
        newLinkSat.target = sat["name"]
        links.push(newLinkSat)
        
    }
 
    return links
}

export function getNodes(machines){

    const urlSat = sat
    let nodes = []

    for(let nodeInfo of machines){
        let templateNode = {"id":"","name":"","svg":"","size":400,"labelPosition": 'bottom', "x":Math.floor(Math.random() * 800) + 100,"y":Math.floor(Math.random() * 300) + 100}
        templateNode.id = nodeInfo["name"]
        templateNode.name = nodeInfo["name"]
        templateNode.svg = urlSat
      
        nodes.push(templateNode)
    
      }

    return nodes
}

export function areAllSubnetsDefinited(subnets){

    for(let subnet of subnets){
        if(!subnet.ipIsDefinited)
            return false
      }

    return true
}

export async function getXmlProject(){
    const response = await fetch('api/project/test/infrastructure/st3');
    const jsonData = await response.json();
    const result = await xml2js.parseStringPromise(jsonData.content, { explicitArray: false });

    console.log(result.model)
    
}