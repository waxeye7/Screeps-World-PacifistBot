function roomDefence(room) {
    // cache the towers.
    let towers = room.find(FIND_MY_STRUCTURES, { filter: {structureType: STRUCTURE_TOWER}});
    if(towers.length) {
        let towerCount = -1;
        let currentTickModTowers = Game.time % towers.length;
        _.forEach(towers, function(tower) {

            towerCount = towerCount + 1;

            if(Game.time % 4 == 0) {
                let damagedCreeps = _.filter(Game.creeps, (damagedCreep) => damagedCreep.hits < damagedCreep.hitsMax && damagedCreep.room.name == room.name);
                if(damagedCreeps.length > 0) {
                    tower.heal(damagedCreeps[0]);
                    return;
                }
            }


            let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
                return;
            }


// cache here locked need TODO maybe, might not be worth.
            if(currentTickModTowers == towerCount) {
                buildingsToRepair = room.find(FIND_STRUCTURES, {filter: building => building.hits < building.hitsMax && building.hits < (building.hitsMax-8000) && building.hits < 100000});
                buildingsToRepair.sort((a,b) => a.hits - b.hits);
                if(buildingsToRepair.length > 0) {
                    tower.repair(buildingsToRepair[0])
                    return;
                }
            }

       });
    }

    if(Game.time % 16 == 1) {
        let HostileCreeps = room.find(FIND_HOSTILE_CREEPS);
        if(HostileCreeps.length > 0) {
            room.memory.danger = true;
            let MyRamparts = room.find(FIND_MY_STRUCTURES, {filter: structure => structure.structureType == STRUCTURE_RAMPART});
    
            let currentLowestRange = 100;
            let currentRampart;
    
            _.forEach(MyRamparts, function(rampart) {
                let closestHostileToRampart = rampart.pos.findClosestByRange(HostileCreeps);
                let rangeToEnemy = rampart.pos.getRangeTo(closestHostileToRampart)
                if(currentLowestRange > rangeToEnemy) {
                    currentLowestRange = rangeToEnemy;
                    currentRampart = rampart;
                    room.memory.rampartToMan = currentRampart.id;        
                }
            });
    
        }
        else {
            room.memory.danger = false;
            room.memory.rampartToMan = false
        }
    }
}

module.exports = roomDefence