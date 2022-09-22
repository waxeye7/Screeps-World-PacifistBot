/**
 * A little description of this function 
 * @param {Creep} creep
 **/

const run = function (creep) {
    if(creep.notifyWhenAttacked == true) {
        creep.notifyWhenAttacked(false);
    }
    if(creep.memory.targetRoom && creep.memory.targetRoom !== creep.room.name) {
        let enemyCreeps = creep.room.find(FIND_HOSTILE_CREEPS);

        if(enemyCreeps.length > 0) {
            let closestEnemyCreep = creep.pos.findClosestByRange(enemyCreeps);

            if(creep.attack(closestEnemyCreep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestEnemyCreep);
                return;
            }
            if(creep.attack(closestEnemyCreep) == 0) {
                creep.moveTo(closestEnemyCreep);
                return;
            }
        }
        
        return creep.moveToRoom(creep.memory.targetRoom);
    }
    else {
        let enemyCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
        let Structures;

        if(creep.room.controller && creep.room.controller.my) {
            Structures = creep.room.find(FIND_HOSTILE_STRUCTURES, {
                filter: object => object.structureType != STRUCTURE_CONTROLLER && object.structureType != STRUCTURE_ROAD && object.structureType != STRUCTURE_WALL && object.structureType != STRUCTURE_CONTAINER &&  !object.my
            });
        }

        else if(creep.room.controller && !creep.room.controller.my) {
            Structures = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.structureType != STRUCTURE_CONTROLLER && object.structureType != STRUCTURE_ROAD && object.structureType != STRUCTURE_CONTAINER &&  !object.my
            });
        }

        else {
            Structures = creep.room.find(FIND_HOSTILE_STRUCTURES, {
                filter: object => object.structureType != STRUCTURE_CONTROLLER && object.structureType != STRUCTURE_KEEPER_LAIR});

        }


        if(enemyCreeps.length > 0) {
            let closestEnemyCreep = creep.pos.findClosestByPath(enemyCreeps);
            console.log((creep.pos.findPathTo(closestEnemyCreep)).length)
            if((creep.pos.findPathTo(closestEnemyCreep)).length <= 51) {
                if(creep.pos.isNearTo(closestEnemyCreep)) {
                    creep.attack(closestEnemyCreep);
                }
                else {
                    creep.moveTo(closestEnemyCreep);
                }
    
                if(creep.attack(closestEnemyCreep) == 0) {
                    creep.moveTo(closestEnemyCreep);
                    return;
                }
                return;
            }
        }

        if(Structures.length > 0) {
            let closestStructure = creep.pos.findClosestByRange(Structures);
            if(creep.pos.isNearTo(closestStructure)) {
                creep.attack(closestStructure);
                
            }
            else{
                creep.moveTo(closestStructure);
            }
            return;
        }

        if(enemyCreeps.length > 0) {
        let closestEnemyCreep = creep.pos.findClosestByRange(enemyCreeps);
            if(creep.pos.isNearTo(closestEnemyCreep)) {
                creep.attack(closestEnemyCreep);
            }
            else {
                creep.moveTo(closestEnemyCreep);
            }

            if(creep.attack(closestEnemyCreep) == 0) {
                creep.moveTo(closestEnemyCreep);
                return;
            }
            return;
        }


        else {
            if(Memory.tasks.wipeRooms.destroyStructures.length > 0) {
                creep.memory.targetRoom = Memory.tasks.wipeRooms.destroyStructures[0];
            }
        }
    }
}


const roleAttacker = {
    run,
    //run: run,
    //function2,
    //function3
};

module.exports = roleAttacker;
