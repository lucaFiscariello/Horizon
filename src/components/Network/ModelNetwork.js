import { ModelEntity } from "./ModelEntity";

export class ModelNetwork {

    constructor(nameProject) {        
        this.nameProject = nameProject
        this.entities = {}           
    }

    async loadModel(entities) {
        
        
        for (let entity of entities){
            if(entity){
                let entityname = entity["name"]
                let entityModel = new ModelEntity(entityname,this.nameProject,entity["type"])
    
                await entityModel.loadXML()
    
                this.entities[entityname] = entityModel

            }

        }

    }


    
}