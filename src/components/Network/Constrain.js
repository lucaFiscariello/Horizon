

/**
 * Funzione che verifica i vincoli per la creazione di connessioni tra le entità della rete. 
 * Sono stati implementati vincoli per collegare 2,3 o più entità contemporaneamente
 */
export async function addConnection(select_machines,modelNetwork) {


    //Connetto un st a un gw che a su volta è connesso a sat
    if(verify_st_gw_sat(select_machines,modelNetwork)){
        let idSat = modelNetwork.getIDByListType(select_machines,"Satellite") 
        let idGw = modelNetwork.getIDByListType(select_machines,"Gateway") 
        let idSt = modelNetwork.getIDByListType(select_machines,"Terminal") 
    
        await modelNetwork.addSpot("Transparent","Transparent",idGw,idSat,idSat)
        await modelNetwork.addRoute(idGw,idSt,idGw)
        return
    }

    //Connetto un sat a un gw
    if(verify_gw_sat(select_machines,modelNetwork)){
        let idSat = modelNetwork.getIDByListType(select_machines,"Satellite") 
        let idGw = modelNetwork.getIDByListType(select_machines,"Gateway") 
    
        await modelNetwork.addSpot("Transparent","Transparent",idGw,idSat,idSat)
        return
    }

    //Connetto un st a un gw
    if(verify_st_gw(select_machines,modelNetwork)){
        let idGw = modelNetwork.getIDByListType(select_machines,"Gateway") 
        let idSt = modelNetwork.getIDByListType(select_machines,"Terminal") 
    
        await modelNetwork.addRoute(idGw,idSt,idGw)
        return
    }

    //Connetto più gw a un sat
    if(verify_sat_more_gw(select_machines,modelNetwork)){
        let idSat = modelNetwork.getIDByListType(select_machines,"Satellite") 

        for(let entityName of select_machines){
            let entiy = modelNetwork.entitiesByName[entityName]

            if(entiy.type == "Gateway"){
                await modelNetwork.addSpot("Transparent","Transparent",entiy.getID(),idSat,idSat)
            }
        }

        return
    }

    //Connetto più st a un gw
    if(verify_gw_more_st(select_machines,modelNetwork)){
        let idGw = modelNetwork.getIDByListType(select_machines,"Gateway") 

        for(let entityName of select_machines){
            let entiy = modelNetwork.entitiesByName[entityName]

            if(entiy.type == "Terminal"){
                await modelNetwork.addRoute(idGw,entiy.getID(),idGw)
            }
        }

        return
    }
    

}

/**
 *  Funzione che verifica se voglio connettere esattamente un gw, un sat e un st
 */
function verify_st_gw_sat(select_machines,modelNetwork){

    if(select_machines.length == 3){

        let map_entity = count_entity(select_machines,modelNetwork)
        if(map_entity.Terminal && map_entity.Gateway && map_entity.Satellite)
            return true
    }

    return false
}


/**
 *  Funzione che verifica se voglio connettere esattamente un gw e un sat
 */
function verify_gw_sat(select_machines,modelNetwork){

    if(select_machines.length == 2){

        let map_entity = count_entity(select_machines,modelNetwork)
        if( map_entity.Gateway && map_entity.Satellite)
            return true
    }

    return false
}

/**
 *  Funzione che verifica se voglio connettere esattamente un gw e un st
 */
function verify_st_gw(select_machines,modelNetwork){

    if(select_machines.length == 2){

        let map_entity = count_entity(select_machines,modelNetwork)
        if( map_entity.Gateway && map_entity.Terminal)
            return true
    }

    return false
}


/**
 *  Funzione che verifica se voglio connettere più  gw a un sat
 */
function verify_sat_more_gw(select_machines,modelNetwork){

    if(select_machines.length >= 3){

        let map_entity = count_entity(select_machines,modelNetwork)

        if( map_entity.Gateway && !map_entity.Terminal && map_entity.Satellite )
            if(map_entity.Gateway >=2 && map_entity.Satellite == 1)
                return true
    }

    return false
}


/**
 *  Funzione che verifica se voglio connettere più  st a un gw
 */
function verify_gw_more_st(select_machines,modelNetwork){

    if(select_machines.length >= 3){

        let map_entity = count_entity(select_machines,modelNetwork)

        if( map_entity.Gateway && map_entity.Terminal && !map_entity.Satellite )
            if(map_entity.Gateway ==1 && map_entity.Terminal >= 2)
                return true
    }

    return false
}

/**
 * Funziona che conta le tipologie di entità che devono essere connesse.
 */
function count_entity(select_machines,modelNetwork){

    let map_entity = {}

    for(let machineName of select_machines){
        
        let entity = modelNetwork.entitiesByName[machineName]
        
        if(map_entity[entity.type]){
            map_entity[entity.type]++
        }
        else{
            map_entity[entity.type] = 1
        }

    }

    return map_entity
}