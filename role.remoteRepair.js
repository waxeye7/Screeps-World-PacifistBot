/**
 * A little description of this function 
 * @param {Creep} creep
 **/
 const run = function (creep) {
    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
        creep.memory.working = true;
    }
    if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.working = false;
    }

    if(creep.memory.working) {
        const buildingsToRepair = creep.room.find(FIND_STRUCTURES, {filter: object => object.hits < object.hitsMax 
            && (object.structureType == STRUCTURE_ROAD || object.structureType == STRUCTURE_CONTAINER)});

        let buildingsToBuild = creep.room.find(FIND_CONSTRUCTION_SITES);


        if(buildingsToRepair.length > 0) {
            let closestBuildingToRepair = creep.pos.findClosestByRange(buildingsToRepair);
            if(creep.pos.isNearTo(closestBuildingToRepair)) {
                creep.repair(closestBuildingToRepair);
            }
            else {
                creep.moveTo(closestBuildingToRepair);
            }
        }

        if(buildingsToBuild.length > 0) {
            let closestBuildingtoBuild = creep.pos.findClosestByRange(buildingsToBuild);
            if(creep.pos.isNearTo(closestBuildingtoBuild)) {
                creep.build(closestBuildingtoBuild);
            }
            else {
                creep.moveTo(closestBuildingtoBuild);
            }
            return;
        }


    }

    else {
        if(creep.memory.targetRoom && creep.memory.targetRoom !== creep.room.name) {
            return creep.moveToRoom(creep.memory.targetRoom);
        }
        creep.acquireEnergyWithContainersAndOrDroppedEnergy();
    }
}

const roleRemoteRepair = {
    run,
    //run: run,
    //function2,
    //function3
};

module.exports = roleRemoteRepair;