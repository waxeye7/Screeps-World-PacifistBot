import randomWords from "random-words";

function isInRoom(creep, room) {
    return creep.room.name == room.name;
  }


// function randomName(length) {
//     let result = '';
//     let characters;
//     if(Game.time % 2 == 0) {
//         characters = 'pacifistbotPACIFISTBOT';
//     }
//     else if(Game.time % 2 == 1) {
//         characters = 'waxeye7WAXEYE7';
//     }
//     let charactersLength = characters.length;
//     for (let i = 0; i < length; i++) {
//       result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//    return result;
// }



function getBody(segment:string[], room, bodyMaxLength=50) {
    let body = [];
    let segmentCost = _.sum(segment, s => BODYPART_COST[s]);
    let energyAvailable = room.energyAvailable;

    let maxSegments = Math.floor(energyAvailable / segmentCost);
    _.times(maxSegments, function() {if(segment.length + body.length <= bodyMaxLength){_.forEach(segment, s => body.push(s));}});

    return body;
}


function getCarrierBody(sourceId, values, storage, spawn, room) {

    let targetSource:any = Game.getObjectById(sourceId);
    if(targetSource && targetSource.room.name == room.name) {
        if(Game.time % 11 == 0) {
            delete values.pathLength;
        }
    }
    let pathFromHomeToSource;
    let carriersInRoom = _.filter(Game.creeps, (creep) => creep.memory.role == 'carry' && creep.room.name == room.name);

    if(storage != undefined && !values.pathLength) {
        pathFromHomeToSource = storage.pos.findPathTo(targetSource, {ignoreCreeps: true, ignoreRoads: false});
        values.pathLength = pathFromHomeToSource.length - 1;
    }
    else if (spawn != undefined && !values.pathLength) {
        pathFromHomeToSource = spawn.pos.findPathTo(targetSource, {ignoreCreeps: true, ignoreRoads: false});
        values.pathLength = pathFromHomeToSource.length - 1;
    }

    let threeWorkParts = 6;
    let fiveWorkParts = 10;


    if(carriersInRoom.length == 0 && storage == undefined) {
        return [CARRY,CARRY,MOVE];
    }


    if(targetSource == null || !values.pathLength) {
        return [];
    }

    if(targetSource.room.name == room.name) {
        let ticksPerRoundTrip = (values.pathLength * 2) + 2;
        let energyProducedPerRoundTrip = fiveWorkParts * ticksPerRoundTrip
        let body = [];
        let alternate = 1;
        while (energyProducedPerRoundTrip > 0) {
            body.push(CARRY);
            if((body.length * 50) == room.energyCapacityAvailable && alternate % 2 == 0) {
                return body;
            }
            else if((body.length * 50) == room.energyCapacityAvailable && alternate % 2 == 1) {
                body.pop();
                return body;
            }

            if(alternate % 2 == 1) {
                body.push(MOVE);
                if((body.length * 50) == room.energyCapacityAvailable) {
                    body.pop();
                    body.pop();
                    return body;
                }
            }
            energyProducedPerRoundTrip = energyProducedPerRoundTrip - 50;
            alternate = alternate + 1;
        }
        // console.log(body,room.name)

        return body;
    }
    else {
        if(room.controller.level >= 5) {
            threeWorkParts = fiveWorkParts + 2;
        }
        let ticksPerRoundTrip = (values.pathLength * 2) + 2;
        let energyProducedPerRoundTrip = threeWorkParts * ticksPerRoundTrip
        let body = [];
        let alternate = 1;
        while (energyProducedPerRoundTrip > +100 && (body.length * 50) <= (room.energyCapacityAvailable-100)) {
            body.push(CARRY);
            if(alternate % 2 == 1) {
                body.push(MOVE);
            }
            energyProducedPerRoundTrip -= 50;
            alternate = alternate + 1;
            // if(body.length * 50 + 200 >= energyAvailable) {
            //     console.log("room not enough energy", body);
            //     return body;
            // }
        }
        // console.log(body,room.name)
        return body;
    }
}


function spawn_energy_miner(resourceData, room) {
    let outputLabs = [];


    if(room.controller.level >= 6 && room.memory.labs && room.memory.labs.status.currentOutput == RESOURCE_UTRIUM_OXIDE) {
        let outputLab1;
        let outputLab2;
        let outputLab3;
        let outputLab4;
        let outputLab5;
        let outputLab6;
        let outputLab7;
        let outputLab8;

        if(room.memory.labs.outputLab1) {
            outputLab1 = Game.getObjectById(room.memory.labs.outputLab1)
            outputLabs.push(outputLab1)
        }
        if(room.memory.labs.outputLab2) {
            outputLab2 = Game.getObjectById(room.memory.labs.outputLab2)
            outputLabs.push(outputLab2)
        }
        if(room.memory.labs.outputLab3) {
            outputLab3 = Game.getObjectById(room.memory.labs.outputLab3)
            outputLabs.push(outputLab3)
        }
        if(room.memory.labs.outputLab4) {
            outputLab4 = Game.getObjectById(room.memory.labs.outputLab4)
            outputLabs.push(outputLab4)
        }
        if(room.memory.labs.outputLab5) {
            outputLab5 = Game.getObjectById(room.memory.labs.outputLab5)
            outputLabs.push(outputLab5)
        }
        if(room.memory.labs.outputLab6) {
            outputLab6 = Game.getObjectById(room.memory.labs.outputLab6)
            outputLabs.push(outputLab6)
        }
        if(room.memory.labs.outputLab7) {
            outputLab7 = Game.getObjectById(room.memory.labs.outputLab7)
            outputLabs.push(outputLab7)
        }
        if(room.memory.labs.outputLab8) {
            outputLab8 = Game.getObjectById(room.memory.labs.outputLab8)
            outputLabs.push(outputLab8)
        }
    }
    if(outputLabs.length > 1) {
        outputLabs.sort((a,b) => b.store[room.memory.labs.status.currentOutput] - a.store[room.memory.labs.status.currentOutput]);
    }

    _.forEach(resourceData, function(data, targetRoomName){
        _.forEach(data.energy, function(values, sourceId) {
            if (Game.time - (values.lastSpawn || 0) > CREEP_LIFE_TIME) {
                let newName = 'EnergyMiner-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
                if(targetRoomName == room.name) {
                    if(room.memory.danger && values.pathLength && values.pathLength >= 12) {
                        return;
                    }
                    if(room.energyCapacityAvailable >= 650) {
                        if(room.controller.level >= 6 && !room.memory.danger) {
                            if(outputLabs && outputLabs.length > 0 && outputLabs[0].store[RESOURCE_UTRIUM_OXIDE] > 90) {
                                room.memory.spawn_list.unshift([WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,WORK,CARRY,MOVE], newName,
                                    {memory: {role: 'EnergyMiner', sourceId, targetRoom: targetRoomName, homeRoom: room.name}});
                            }
                            else {
                                room.memory.spawn_list.unshift([WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,WORK,CARRY,MOVE], newName,
                                    {memory: {role: 'EnergyMiner', sourceId, targetRoom: targetRoomName, homeRoom: room.name}});
                            }
                            // [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,MOVE]
                        }
                        else {
                            room.memory.spawn_list.unshift([WORK,WORK,WORK,WORK,WORK,WORK,MOVE], newName,
                                {memory: {role: 'EnergyMiner', sourceId, targetRoom: targetRoomName, homeRoom: room.name}});
                        }
                        console.log('Adding Energy Miner to Spawn List: ' + newName);
                        values.lastSpawn = Game.time;
                    }

                    else if(room.energyCapacityAvailable >= 550) {
                        if(room.controller.level >= 6) {
                            room.memory.spawn_list.unshift([WORK,WORK,WORK,WORK,WORK,MOVE], newName,
                                {memory: {role: 'EnergyMiner', sourceId, targetRoom: targetRoomName, homeRoom: room.name}});
                        }
                        else {
                            room.memory.spawn_list.unshift([WORK,WORK,WORK,WORK,WORK,MOVE], newName,
                                {memory: {role: 'EnergyMiner', sourceId, targetRoom: targetRoomName, homeRoom: room.name}});
                        }
                        console.log('Adding Energy Miner to Spawn List: ' + newName);
                        values.lastSpawn = Game.time;
                    }

                    else {
                        room.memory.spawn_list.unshift(getBody([WORK,WORK,MOVE], room, 9), newName, {memory: {role: 'EnergyMiner', sourceId, targetRoom: targetRoomName, homeRoom: room.name}});
                        console.log('Adding Energy Miner to Spawn List: ' + newName);
                        values.lastSpawn = Game.time;
                        return;
                    }
                }

                else {
                    if(targetRoomName != room.name && room.memory.danger) {
                        return;
                    }
                    let storage = Game.getObjectById(room.memory.storage) || room.findStorage();

                    if(!Game.rooms[targetRoomName] || Game.rooms[targetRoomName] == undefined || Game.rooms[targetRoomName].memory.has_hostile_creeps == true) {
                        room.memory.spawn_list.push([WORK,WORK,MOVE], newName,
                            {memory: {role: 'EnergyMiner', sourceId, targetRoom: targetRoomName, homeRoom: room.name}});
                        console.log('Adding Energy Miner to Spawn List: ' + newName);
                        values.lastSpawn = Game.time-120;
                    }

                    else if(room.controller.level >= 5 && storage && storage.store[RESOURCE_ENERGY] > 25000) {
                        room.memory.spawn_list.unshift([WORK,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK,MOVE], newName,
                            {memory: {role: 'EnergyMiner', sourceId, targetRoom: targetRoomName, homeRoom: room.name}});
                        console.log('Adding Energy Miner to Spawn List: ' + newName);
                        values.lastSpawn = Game.time-20;
                    }
                    else if(room.energyCapacityAvailable >= 500) {
                        room.memory.spawn_list.unshift([WORK,WORK,MOVE,WORK,WORK,MOVE], newName,
                            {memory: {role: 'EnergyMiner', sourceId, targetRoom: targetRoomName, homeRoom: room.name}});
                        console.log('Adding Energy Miner to Spawn List: ' + newName);
                        values.lastSpawn = Game.time-20;
                    }
                    else {
                        room.memory.spawn_list.unshift([WORK,WORK,MOVE], newName,
                            {memory: {role: 'EnergyMiner', sourceId, targetRoom: targetRoomName, homeRoom: room.name}});
                        console.log('Adding Energy Miner to Spawn List: ' + newName);
                        values.lastSpawn = Game.time-50;
                    }
                }
            }

            if(Game.time - (values.lastSpawn || 0) > CREEP_LIFE_TIME*3) {
                let newName = 'EnergyMiner-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
                room.memory.spawn_list.unshift([WORK,WORK,MOVE], newName,
                    {memory: {role: 'EnergyMiner', sourceId, targetRoom: targetRoomName, homeRoom: room.name}});
                console.log('Adding Energy Miner to Spawn List: ' + newName);
                values.lastSpawn = Game.time;
            }


            if(!values.lastSpawn && Game.time < CREEP_LIFE_TIME) {
                let newName = 'EnergyMiner-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
                room.memory.spawn_list.unshift([WORK,WORK,MOVE], newName,
                    {memory: {role: 'EnergyMiner', sourceId, targetRoom: targetRoomName, homeRoom: room.name}});
                console.log('Adding Energy Miner to Spawn List: ' + newName);
                values.lastSpawn = Game.time;
            }
        });
    });
}


function spawn_carrier(resourceData, room, spawn, storage) {
    _.forEach(resourceData, function(data, targetRoomName){
        _.forEach(data.energy, function(values, sourceId) {
            if(!Game.rooms[targetRoomName] || room.name != targetRoomName && room.memory.danger || Game.rooms[targetRoomName] && Game.rooms[targetRoomName].memory.has_hostile_creeps) {
                return;
            }
            if (Game.time - (values.lastSpawnCarrier || 0) > CREEP_LIFE_TIME) {
                let newName = 'Carrier-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
                room.memory.spawn_list.push(getCarrierBody(sourceId, values, storage, spawn, room), newName,
                    {memory: {role: 'carry', sourceId, targetRoom: targetRoomName, homeRoom: room.name}});
                console.log('Adding Carrier to Spawn List: ' + newName);
                if(Game.rooms[targetRoomName] && Game.rooms[targetRoomName].controller != undefined && Game.rooms[targetRoomName].controller.level >= 6 && targetRoomName == room.name) {
                    values.lastSpawnCarrier = 5000000000;
                }
                else {
                    values.lastSpawnCarrier = Game.time;
                }
            }

            if(Game.time - (values.lastSpawnCarrier || 0) > CREEP_LIFE_TIME*2) {
                let newName = 'Carrier-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
                room.memory.spawn_list.push([MOVE,CARRY,CARRY], newName,
                    {memory: {role: 'carry', sourceId, targetRoom: targetRoomName, homeRoom: room.name}});
                console.log('Adding Carrier to Spawn List: ' + newName);
                values.lastSpawnCarrier = Game.time-700;
            }

            if(!values.lastSpawnCarrier && Game.time < CREEP_LIFE_TIME) {
                let newName = 'Carrier-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
                room.memory.spawn_list.push([MOVE,CARRY,CARRY], newName,
                    {memory: {role: 'carry', sourceId, targetRoom: targetRoomName, homeRoom: room.name}});
                console.log('Adding Carrier to Spawn List: ' + newName);
                values.lastSpawnCarrier = Game.time-600;
            }
        });
    });
}

function spawn_remote_repairer(resourceData, room) {
    _.forEach(resourceData, function(data, targetRoomName){
        _.forEach(data.energy, function(values, sourceId) {
            if(Game.time - (values.lastSpawnRemoteRepairer || 0) > CREEP_LIFE_TIME * 2) {
                let newName = 'RemoteRepairer-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
                if(targetRoomName != room.name && Game.rooms[targetRoomName] && !Game.rooms[targetRoomName].memory.has_hostile_creeps) {

                    if(room.memory.danger) {
                        return;
                    }

                    if(room.controller.level >= 6) {
                        room.memory.spawn_list.push(getBody([WORK,CARRY,MOVE], room, 23), newName,
                            {memory: {role: 'RemoteRepair', targetRoom: targetRoomName, homeRoom: room.name}});
                        console.log('Adding RemoteRepairer to Spawn List: ' + newName);
                        if(Game.rooms[targetRoomName].find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
                            values.lastSpawnRemoteRepairer = Game.time - 100;
                        }
                        else {
                            values.lastSpawnRemoteRepairer = Game.time + 700;
                        }
                    }

                    else if(room.energyCapacityAvailable >= 600) {
                        room.memory.spawn_list.push([WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE], newName,
                            {memory: {role: 'RemoteRepair', targetRoom: targetRoomName, homeRoom: room.name}});
                        console.log('Adding RemoteRepairer to Spawn List: ' + newName);
                        if(Game.rooms[targetRoomName].find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
                            values.lastSpawnRemoteRepairer = Game.time - 300;
                        }
                        else {
                            values.lastSpawnRemoteRepairer = Game.time + 600;
                        }
                    }

                    else if(room.energyCapacityAvailable >= 400) {
                        room.memory.spawn_list.push([WORK,CARRY,MOVE,WORK,CARRY,MOVE], newName,
                            {memory: {role: 'RemoteRepair', targetRoom: targetRoomName, homeRoom: room.name}});
                        console.log('Adding RemoteRepairer to Spawn List: ' + newName);
                        if(Game.rooms[targetRoomName].find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
                            values.lastSpawnRemoteRepairer = Game.time - 400;
                        }
                        else {
                            values.lastSpawnRemoteRepairer = Game.time + 400;
                        }
                    }
                    else {
                        room.memory.spawn_list.push([WORK,CARRY,MOVE], newName,
                            {memory: {role: 'RemoteRepair', targetRoom: targetRoomName, homeRoom: room.name}});
                        console.log('Adding RemoteRepairer to Spawn List: ' + newName);
                        values.lastSpawnRemoteRepairer = Game.time-500;
                    }
                }
            }
        });
    });
}

function spawn_reserver(resourceData, room, storage) {
    _.forEach(resourceData, function(data, targetRoomName){
        _.forEach(data.energy, function(values, sourceId) {
            let newName = 'Reserver-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;

            if(Memory.CanClaimRemote && Game.rooms[targetRoomName] && Game.rooms[targetRoomName].controller && !Game.rooms[targetRoomName].controller.my && Game.rooms[targetRoomName].controller.reservation && Game.rooms[targetRoomName].controller.reservation.ticksToEnd <= 750) {
                if(room.memory.danger) {
                    return;
                }
                room.memory.spawn_list.push([CLAIM,MOVE], newName,
                    {memory: {role: 'reserve', targetRoom: targetRoomName, homeRoom: room.name, claim: true}});
                console.log('Adding Reserver to Spawn List: ' + newName);
                values.lastSpawnReserver = Game.time;
                Memory.CanClaimRemote = false;
                return;
            }

            else if(targetRoomName != room.name && Game.rooms[targetRoomName] != undefined && !Game.rooms[targetRoomName].memory.has_hostile_creeps && !Game.rooms[targetRoomName].controller.my) {
                if(Game.rooms[targetRoomName] != undefined && Game.rooms[targetRoomName].controller.reservation && Game.rooms[targetRoomName].controller.reservation.ticksToEnd <= 1000 && Game.time - (values.lastSpawnReserver || 0) > CREEP_LIFE_TIME/2 ||
                Game.rooms[targetRoomName] != undefined && !Game.rooms[targetRoomName].controller.reservation && Game.time - (values.lastSpawnReserver || 0) > CREEP_LIFE_TIME/4) {

                    if(room.memory.danger || (storage && storage.store[RESOURCE_ENERGY] < 25000)) {
                        return;
                    }

                    if(room.controller.level == 5) {
                        room.memory.spawn_list.push([CLAIM,MOVE,CLAIM,MOVE], newName,
                            {memory: {role: 'reserve', targetRoom: targetRoomName, homeRoom: room.name}});
                        console.log('Adding Reserver to Spawn List: ' + newName);
                        values.lastSpawnReserver = Game.time;
                    }
                    else if(room.controller.level == 6) {
                        room.memory.spawn_list.push([CLAIM,MOVE,CLAIM,MOVE,CLAIM,MOVE], newName,
                            {memory: {role: 'reserve', targetRoom: targetRoomName, homeRoom: room.name}});
                        console.log('Adding Reserver to Spawn List: ' + newName);
                        values.lastSpawnReserver = Game.time;
                    }
                    else if(room.controller.level == 7) {
                        room.memory.spawn_list.push([CLAIM,MOVE,CLAIM,MOVE,CLAIM,MOVE,CLAIM,MOVE,CLAIM,MOVE,CLAIM,MOVE,CLAIM,MOVE], newName,
                            {memory: {role: 'reserve', targetRoom: targetRoomName, homeRoom: room.name}});
                        console.log('Adding Reserver to Spawn List: ' + newName);
                        values.lastSpawnReserver = Game.time;
                    }
                    else if(room.controller.level == 8) {
                        room.memory.spawn_list.push([CLAIM,MOVE,CLAIM,MOVE,CLAIM,MOVE,CLAIM,MOVE,CLAIM,MOVE,CLAIM,MOVE,CLAIM,MOVE,CLAIM,MOVE], newName,
                            {memory: {role: 'reserve', targetRoom: targetRoomName, homeRoom: room.name}});
                        console.log('Adding Reserver to Spawn List: ' + newName);
                        values.lastSpawnReserver = Game.time;
                    }
                }
            }
        });
    });
}



function add_creeps_to_spawn_list(room, spawn) {
    let EnergyMiners = 0;
    let EnergyMinersInRoom = 0;

    let carriers = 0;
    let carriersInRoom = 0;

    let reservers = 0;

    let EnergyManagers = 0;

    let MineralMiners = 0;

    let builders = 0;
    let upgraders = 0;
    let fillers = 0;
    let repairers = 0;

    let defenders = 0;

    let RemoteRepairers = 0;

    let Dismantlers = 0;
    let scouts = 0;

    let claimers = 0;
    let RemoteDismantlers = 0;

    let attackers = 0;
    let RangedAttackers = 0;

    let containerbuilders = 0;

    let DrainTowers = 0;
    let healers = 0;

    let sweepers = 0;

    let annoyers = 0;

    let billtongs = 0;

    let rams = 0;
    let signifers = 0;

    let RampartDefenders = 0;

    let goblins = 0;

    _.forEach(Game.creeps, function(creep) {
        // console.log(creep.memory.role)
        switch(creep.memory.role) {

            case "EnergyMiner":
                if(isInRoom(creep, room)) {
                    EnergyMinersInRoom ++;
                    EnergyMiners ++;
                    break;
                }

            case "EnergyMiner":
                EnergyMiners ++;
                break;

            case "carry":
                if(isInRoom(creep, room)) {
                    carriersInRoom ++;
                    carriers ++;
                    break;
                }

            case "carry":
                carriers ++;
                break;

            case "reserve":
                reservers ++;
                break;

            case "RemoteRepair":
                RemoteRepairers ++;
                break;

            case "EnergyManager":
                if(isInRoom(creep, room)) {
                    EnergyManagers ++;
                    break;
                }

            case "MineralMiner":
                if(isInRoom(creep, room)) {
                    MineralMiners ++;
                    break;
                }

            case "builder":
                if(isInRoom(creep, room)) {
                    builders ++;
                    break;
                }

            case "upgrader":
                if(isInRoom(creep, room)) {
                    upgraders ++;
                    break;
                }

            case "filler":
                if(isInRoom(creep, room)) {
                    fillers ++;
                    break;
                }

            case "repair":
                if(isInRoom(creep, room)) {
                    repairers ++;
                    break;
                }

            case "defender":
                if(isInRoom(creep, room)) {
                    defenders ++;
                    break;
                }

            case "RampartDefender":
                if(isInRoom(creep, room)) {
                    RampartDefenders ++;
                    break;
                }

            case "Dismantler":
                if(isInRoom(creep, room)) {
                    Dismantlers ++;
                    break;
                }

            case "scout":
                scouts ++;
                break;

            case "claimer":
                claimers ++;
                break;

            case "attacker":
                if(creep.memory.homeRoom == room.name) {
                    attackers ++;
                }
                break;

            case "billtong":
                if(creep.memory.homeRoom == room.name) {
                    billtongs ++;
                }
                break;

            case "RangedAttacker":
                if(creep.memory.homeRoom == room.name) {
                    RangedAttackers ++;
                }
                break;

            case "buildcontainer":
                if(creep.memory.homeRoom == room.name) {
                    containerbuilders ++;
                }
                break;

            case "DrainTower":
                DrainTowers ++;
                break;

            case "healer":
                healers ++;
                break;

            case "RemoteDismantler":
                RemoteDismantlers ++;
                break;

            case "annoy":
                annoyers ++;
                break;

            case "ram":
                if(creep.memory.homeRoom == room.name) {
                    rams ++;
                }
                break;

            case "signifer":
                if(creep.memory.homeRoom == room.name) {
                    signifers ++;
                }
                break;

            case "sweeper":
                if(isInRoom(creep, room)) {
                    sweepers ++;
                    break;
                }

            case "goblin":
                if(creep.memory.homeRoom == room.name) {
                    goblins ++;
                }
                break;


            case "SquadCreepA":
                if(creep.memory.homeRoom == room.name) {
                    room.memory.spawning_squad.creepA = true;
                }
                break;
            case "SquadCreepB":
                if(creep.memory.homeRoom == room.name) {
                    room.memory.spawning_squad.creepB = true;
                }
                break;
            case "SquadCreepY":
                if(creep.memory.homeRoom == room.name) {
                    room.memory.spawning_squad.creepY = true;
                }
                break;
            case "SquadCreepZ":
                if(creep.memory.homeRoom == room.name) {
                    room.memory.spawning_squad.creepZ = true;
                }
                break;
        }

    });


    console.log("Room-" + room.name + " has " + builders + " Builders " + upgraders +
    " Upgraders " + repairers + " Repairers " + fillers
    + " Filler", EnergyManagers, "EnergyManager", sweepers, "Sweeper");
    console.log("[" + EnergyMiners + " Energy-Miners]" + " [" + carriers +
    " Carriers] [" +  RemoteRepairers, "RemoteRepairers] [" + reservers + " Reservers] " + "[" + attackers + " Attackers]" + " [" + RangedAttackers +  " RangedAttackers]" + " [" + containerbuilders +  " Container Builders]" + " [" + claimers +  " Claimers]");
    // console.log(DrainTowers, "tower drainers ;)")

    let upgraderTargetAmount = _.get(room.memory, ['census', 'upgrader'], 1);

    let preRCL5UpgraderTarget = _.get(room.memory, ['census', 'upgrader'], 3);

    let builderTargetAmount = _.get(room.memory, ['census', 'builder'], 2);
    let builderPreRCL4TargetAmount = _.get(room.memory, ['census', 'builder'], 5);

    let fillerTargetAmount = _.get(room.memory, ['census', 'filler'], 1);
    let fillerRCL6TargetAmount = _.get(room.memory, ['census', 'filler'], 2);

    let repairerTargetAmount = _.get(room.memory, ['census', 'repair'], 1);

    let sites = room.find(FIND_CONSTRUCTION_SITES);

    let storage = Game.getObjectById(room.memory.storage) || room.findStorage();

    let resourceData = _.get(room.memory, ['resources']);

    spawn_energy_miner(resourceData, room);

    spawn_carrier(resourceData, room, spawn, storage);

    spawn_remote_repairer(resourceData, room);

    spawn_reserver(resourceData, room, storage);


    // if(!room.memory.spawning_squad.status) {
    //     room.memory.spawning_squad.status = true;
    // }

    let attack_room = "E47N59";
    // if(attack_room && room.memory.spawning_squad && !room.memory.spawning_squad.status) {
    //     room.memory.spawning_squad.status = true;
    //     room.memory.spawning_squad.creepA = false;
    //     room.memory.spawning_squad.creepB = false;
    //     room.memory.spawning_squad.creepY = false;
    //     room.memory.spawning_squad.creepZ = false;
    // }
    if(room.controller.level >= 6 && room.memory.spawning_squad && room.memory.spawning_squad.status) {
        if(!room.memory.spawning_squad.creepA) {
            let newName = 'SquadCreepA-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
            room.memory.spawn_list.push([RANGED_ATTACK,MOVE], newName, {memory: {role: 'SquadCreepA', homeRoom: room.name}});
            console.log('Adding SquadCreepA to Spawn List: ' + newName);
        }
        if(!room.memory.spawning_squad.creepB) {
            let newName = 'SquadCreepB-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
            room.memory.spawn_list.push([RANGED_ATTACK,MOVE], newName, {memory: {role: 'SquadCreepB', homeRoom: room.name}});
            console.log('Adding SquadCreepB to Spawn List: ' + newName);
        }
        if(!room.memory.spawning_squad.creepY) {
            let newName = 'SquadCreepY-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
            room.memory.spawn_list.push([HEAL,MOVE], newName, {memory: {role: 'SquadCreepY', homeRoom: room.name}});
            console.log('Adding SquadCreepY to Spawn List: ' + newName);
        }
        if(!room.memory.spawning_squad.creepZ) {
            let newName = 'SquadCreepZ-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
            room.memory.spawn_list.push([HEAL,MOVE], newName, {memory: {role: 'SquadCreepZ', homeRoom: room.name}});
            console.log('Adding SquadCreepZ to Spawn List: ' + newName);
        }
        room.memory.spawning_squad.status = false;
        room.memory.spawning_squad.creepA = true;
        room.memory.spawning_squad.creepB = true;
        room.memory.spawning_squad.creepY = true;
        room.memory.spawning_squad.creepZ = true;

    }


    if (scouts < 0) {
        let newName = 'Scout-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.push([MOVE], newName, {memory: {role: 'scout'}});
        console.log('Adding Scout to Spawn List: ' + newName);
    }

    if (MineralMiners < 1 && room.controller.level >= 6 && room.memory.extractor && !room.memory.danger && storage && storage.store[RESOURCE_ENERGY] > 100000) {
        let mineral = Game.getObjectById(room.memory.mineral) || room.findMineral();
        if(mineral.mineralAmount > 0) {
            let newName = 'MineralMiner-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
            room.memory.spawn_list.push(getBody([WORK,CARRY,MOVE], room, 50), newName, {memory: {role: 'MineralMiner'}});
            console.log('Adding Mineral Miner to Spawn List: ' + newName);
        }
    }

    if(room.controller.level <= 3 && sites.length > 0 && builders < builderPreRCL4TargetAmount && carriers > 1 && EnergyMinersInRoom > 1) {
        let newName = 'Builder-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.push(getBody([WORK,CARRY,MOVE], room), newName, {memory: {role: 'builder'}});
        console.log('Adding Builder to Spawn List: ' + newName);
    }

    if(sites.length > 0 && builders < builderTargetAmount && EnergyMinersInRoom > 1 && storage && storage.store[RESOURCE_ENERGY] > 15000 && room.controller.level >= 4) {
        let newName = 'Builder-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.push(getBody([WORK,CARRY,CARRY,CARRY,MOVE], room, 50), newName, {memory: {role: 'builder'}});
        console.log('Adding Builder to Spawn List: ' + newName);
    }

    if(EnergyMinersInRoom > 1 && upgraders < upgraderTargetAmount && room.controller.level >= 7 && !room.memory.danger) {
        let newName = 'Upgrader-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        if(storage && storage.store[RESOURCE_ENERGY] > 450000) {
            room.memory.spawn_list.push(getBody([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE], room, 8), newName, {memory: {role: 'upgrader'}});
        }
        else if (storage && storage.store[RESOURCE_ENERGY] > 300000) {
            room.memory.spawn_list.push(getBody([WORK,WORK,WORK,WORK,CARRY,MOVE], room, 6), newName, {memory: {role: 'upgrader'}});
        }
        else {
            room.memory.spawn_list.push(getBody([WORK,WORK,CARRY,MOVE], room, 4), newName, {memory: {role: 'upgrader'}});
        }
        console.log('Adding Upgrader to Spawn List: ' + newName);
    }

    else if(storage && storage.store[RESOURCE_ENERGY] > 525000 && upgraders < upgraderTargetAmount && EnergyMinersInRoom > 1 && room.controller.level >= 7 && !room.memory.danger) {
        let newName = 'Upgrader-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.push(getBody([WORK,WORK,WORK,CARRY,MOVE], room, 20), newName, {memory: {role: 'upgrader'}});
        console.log('Adding Upgrader to Spawn List: ' + newName);
    }

    else if(EnergyMinersInRoom > 1 && upgraders < upgraderTargetAmount ||
        storage && storage.store[RESOURCE_ENERGY] > 500000 && upgraders < upgraderTargetAmount + 7 && EnergyMinersInRoom > 1 && !room.memory.danger ||
        room.controller.level <= 4 && upgraders < preRCL5UpgraderTarget && carriers > 1 && EnergyMinersInRoom > 1 && storage && storage.store[RESOURCE_ENERGY] > 50000 && !room.memory.danger ||
        room.controller.level <= 4 && upgraders < preRCL5UpgraderTarget && carriers > 1 && EnergyMinersInRoom > 1 && storage == undefined && !room.memory.danger ||
        room.controller.level <= 4 && upgraders < preRCL5UpgraderTarget && carriers > 1 && EnergyMinersInRoom > 1 && storage && storage.store.getFreeCapacity() <= 2000 && !room.memory.danger) {
        let newName = 'Upgrader-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.push(getBody([WORK,CARRY,MOVE], room, 40), newName, {memory: {role: 'upgrader'}});
        console.log('Adding Upgrader to Spawn List: ' + newName);
    }
    else if(EnergyMinersInRoom > 1 && storage && storage.store.getFreeCapacity() < 200 && !room.memory.danger && upgraders < 10) {
        let newName = 'Upgrader-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.push(getBody([WORK,CARRY,MOVE], room, 25), newName, {memory: {role: 'upgrader'}});
        console.log('Adding Upgrader to Spawn List: ' + newName, "because storage is full");
    }

    if((repairers < repairerTargetAmount && room.controller.level > 1) ||
    (storage && storage.store[RESOURCE_ENERGY] > 550000 && repairers < repairerTargetAmount + 1) ||
    (room.memory.danger == true && repairers < 6 && room.controller.level > 4 && storage && storage.store[RESOURCE_ENERGY] > 50000)) {
        if(EnergyMinersInRoom > 1) {
            let newName = 'Repair-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
            if(storage && storage.store[RESOURCE_ENERGY] > 750000 || room.memory.danger) {
                room.memory.spawn_list.push(getBody([WORK,CARRY,MOVE], room, 50), newName, {memory: {role: 'repair', homeRoom: room.name}});
            }
            else if(room.controller.level >= 6 && Game.time % 3000 < 1000) {
                room.memory.spawn_list.push(getBody([WORK,CARRY,MOVE], room, 50), newName, {memory: {role: 'repair', homeRoom: room.name}});
            }
            else if(room.controller.level <= 5) {
                room.memory.spawn_list.push(getBody([WORK,CARRY,MOVE], room, 12), newName, {memory: {role: 'repair', homeRoom: room.name}});
            }
            console.log('Adding Repairer to Spawn List: ' + newName);
        }
    }

    if(room.memory.danger == true && room.memory.danger_timer >= 25 && RampartDefenders < 6 && fillers >= 1 && repairers > 2 && room.find(FIND_HOSTILE_CREEPS).length > 1 || room.memory.danger == true && room.memory.danger_timer >= 25 && RampartDefenders < 1 && fillers >= 2 && repairers > 2) {
        let addtolist = true;
        let HostileCreeps = room.find(FIND_HOSTILE_CREEPS);
        let found = false;
        for(let enemyCreep of HostileCreeps) {
            for(let part of enemyCreep.body) {
                if(part.type == ATTACK || part.tyle == WORK) {
                    found = true;
                }
            }
        }
        if(found == false && RampartDefenders == 1) {
            addtolist = false;
        }
        if(addtolist) {
            let newName = 'RampartDefender-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
            if(room.controller.level >= 7) {
                let body;
                if(found == false) {
                    body = [ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
                }
                if(found == true) {
                    body = [ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                }
                room.memory.spawn_list.push(body, newName, {memory: {role: 'RampartDefender', homeRoom: room.name}});
            }
            else {
                let body = getBody([ATTACK,ATTACK,ATTACK,ATTACK,MOVE], room, 50)
                room.memory.spawn_list.push(body, newName, {memory: {role: 'RampartDefender', homeRoom: room.name}});
            }
            console.log('Adding RampartDefender to Spawn List: ' + newName);
        }
    }

    if(room.memory.danger == true && defenders < 4 && RampartDefenders >= 4 || RampartDefenders == 1 && room.memory.danger == true && defenders < 6) {
        let HostileCreeps = room.find(FIND_HOSTILE_CREEPS);
        let found = false;
        for(let enemyCreep of HostileCreeps) {
            for(let part of enemyCreep.body) {
                if(part.type == ATTACK) {
                    found = true;
                }
            }
        }
        if(found == false && defenders < 6) {
            let newName = 'Defender-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
            room.memory.spawn_list.push(getBody([RANGED_ATTACK,RANGED_ATTACK,MOVE], room, 50), newName, {memory: {role: 'defender', homeRoom: room.name}});
            console.log('Adding Defender to Spawn List: ' + newName);
        }
        else if (found == true && RampartDefenders >= 4) {
            let newName = 'Defender-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
            room.memory.spawn_list.push(getBody([RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,MOVE], room, 50), newName, {memory: {role: 'defender', homeRoom: room.name}});
            console.log('Adding Defender to Spawn List: ' + newName);
        }
    }

    let target_colonise = "E33N59";
    if(Memory.CanClaimRemote && claimers < 1 && room.controller.level >= 4 && storage && storage.store[RESOURCE_ENERGY] > 10000 && Game.map.getRoomLinearDistance(room.name, target_colonise) <= 8 && ((Game.rooms[target_colonise] && !Game.rooms[target_colonise].controller.my) || Game.rooms[target_colonise] == undefined && Game.time % 8000 < 1000)) {
        let newName = 'Claimer-' + randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.push([MOVE,CLAIM], newName, {memory: {role: 'claimer', targetRoom: target_colonise, homeRoom:room.name}});
        console.log('Adding Claimer to Spawn List: ' + newName);
    }
// 16,14


// reformat this part into loop through my rooms and then see if it has a spawn and if not if it has a spawn construction site then spawn builders
    // _.forEach(Game.rooms, function(NonSpawnRoom) {
    //     if(everyRoom && everyRoom.memory && !everyRoom.memory.danger && everyRoom.find(FIND_MY_CONSTRUCTION_SITES).length == 0) {
    //         everyRoom.memory.keepTheseRoads = [];
    //     }
    // });
    if(containerbuilders < 1 && room.controller.level >= 4 && storage && storage.store[RESOURCE_ENERGY] > 10000 && Game.map.getRoomLinearDistance(room.name, target_colonise) <= 12 && Game.rooms[target_colonise] && Game.rooms[target_colonise].find(FIND_MY_SPAWNS).length == 0 && Game.rooms[target_colonise].controller.level >= 1) {
        let newName = 'ContainerBuilder-' + randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.push(getBody([WORK,CARRY,MOVE], room, 30), newName, {memory: {role: 'buildcontainer', targetRoom: target_colonise, homeRoom: room.name}});
        console.log('Adding ContainerBuilder to Spawn List: ' + newName);
    }

    if(billtongs < 1 && Game.cpu.bucket > 5000 && room.controller.level >= 4 && storage && storage.store[RESOURCE_ENERGY] > 400000 && !room.memory.danger) {
        let newName = 'Billtong-' + randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.push(getBody([WORK,CARRY,MOVE], room, 6), newName, {memory: {role: 'billtong', homeRoom:room.name}});
        console.log('Adding Billtong to Spawn List: ' + newName);
    }


    let richRoom = "E32N59";
    if(goblins < 1 && room.controller.level >= 4 && storage && Game.map.getRoomLinearDistance(room.name, richRoom) <= 5 && storage.store[RESOURCE_ENERGY] > 30000 && !room.memory.danger ||
    goblins < 2 && Game.cpu.bucket > 6000 && room.controller.level >= 4 && storage && Game.map.getRoomLinearDistance(room.name, richRoom) <= 5 && storage.store[RESOURCE_ENERGY] > 30000 && !room.memory.danger) {
        let newName = 'Goblin-' + randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.push(getBody([CARRY,CARRY,CARRY,CARRY,MOVE], room, 50), newName, {memory: {role: 'goblin', homeRoom:room.name, targetRoom:richRoom}});
        console.log('Adding Goblin to Spawn List: ' + newName);
    }

    if(DrainTowers < 0 && room.energyCapacityAvailable > 5200 && Game.map.getRoomLinearDistance(room.name, "E15S37") <= 5) {
        let newName = 'rewotreniard-' + randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.push([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,
                                HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,
                                HEAL,HEAL,HEAL,HEAL,HEAL], newName,
            {memory: {role: 'DrainTower', targetRoom: "E15S38", homeRoom: room.name}});
        console.log('Adding Tower Drainer to Spawn List: ' + newName);
    }


    if(RemoteDismantlers < 0 && room.controller.level >= 4 && storage && storage.store[RESOURCE_ENERGY] > 30000 && Game.map.getRoomLinearDistance(room.name, "E25N57") <= 12) {
        let newName = 'RemoteDismantler-' + randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.push([MOVE,MOVE,WORK,WORK], newName, {memory: {role: 'RemoteDismantler', targetRoom: "E25N57", homeRoom: room.name}});
        console.log('Adding RemoteDismantler to Spawn List: ' + newName);
    }

    if(room.controller.level <= 4 && Dismantlers < 0) {
        let newName = 'Dismantler-' + randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.push(getBody([WORK,WORK,WORK,WORK,MOVE], room), newName, {memory: {role: 'Dismantler'}});
        console.log('Adding Dismantler to Spawn List: ' + newName);
    }

    if(healers < 0) {
        let newName = 'Healer-' + randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.push([HEAL,HEAL,HEAL,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'healer', targetRoom: "E14S36"}});
        console.log('Adding Healer to Spawn List: ' + newName);
    }


    if(annoyers < 1 && Game.time % 6000 < 1000 && Game.map.getRoomLinearDistance(room.name, "E47N59") <= 3) {
        let newName = 'Annoy-' + randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.push([ATTACK,MOVE], newName, {memory: {role: 'annoy', targetRoom: "E48N59"}});
        console.log('Adding Annoyer to Spawn List: ' + newName);
    }

    // if(annoyers < 1 && room.memory.danger && room.find(FIND_MY_CREEPS).length <= 2) {
    //     let newName = 'Annoy-' + randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
    //     room.memory.spawn_list.unshift([ATTACK,ATTACK,MOVE,MOVE], newName, {memory: {role: 'annoy', targetRoom: room.name, homeRoom: room.name}});
    //     console.log('Adding Annoyer to Spawn List: ' + newName);
    //     return;
    // }


    // if(room.controller.level > 5 && sweepers < 3 && room.memory.danger == false && (room.find(FIND_DROPPED_RESOURCES).length + room.find(FIND_TOMBSTONES, {filter: tombstone => tombstone.store[RESOURCE_ENERGY] > 0}).length) > 4) {
    //     let newName = 'Sweeper-' + randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
    //     room.memory.spawn_list.push([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], newName, {memory: {role: 'sweeper'}});
    //     console.log('Adding Sweeper to Spawn List: ' + newName);
    // }
    let droppedPLUStombs = (room.find(FIND_DROPPED_RESOURCES).length + room.find(FIND_TOMBSTONES, {filter: tombstone => tombstone.store[RESOURCE_ENERGY] > 0}).length + 1);
    if(room.controller.level >= 4 && storage && room.memory.danger == false && sweepers < Math.floor(droppedPLUStombs/3)) {
        let newName = 'Sweeper-' + randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.push([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], newName, {memory: {role: 'sweeper'}});
        console.log('Adding Sweeper to Spawn List: ' + newName);
    }

    // if(RangedAttackers < 1) {
    //     let newName = 'RangedAttacker-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
    //     room.memory.spawn_list.push([TOUGH,TOUGH,TOUGH,TOUGH,
    //                                 MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
    //                                 RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,
    //                                 RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,
    //                                 HEAL,HEAL], newName, {memory: {role: 'RangedAttacker', targetRoom: "E12S38", homeRoom: room.name}});
    //     console.log('Adding Defending-Ranged-Attacker to Spawn List: ' + newName);
    // }


    _.forEach(resourceData, function(data, targetRoomName) {
        if(room.controller.level >= 5) {
            if(!room.memory.danger && Memory.tasks.wipeRooms.killCreeps.includes(targetRoomName) && RangedAttackers < 1) {
                let newName = 'RangedAttacker-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
                let body = getBody([RANGED_ATTACK,MOVE], room, 20);
                room.memory.spawn_list.push(body, newName, {memory: {role: 'RangedAttacker', targetRoom: targetRoomName, homeRoom: room.name}});
                console.log('Adding Defending Ranged-Attacker to Spawn List: ' + newName);
            }
        }
        else {
            if(!room.memory.danger && Memory.tasks.wipeRooms.killCreeps.includes(targetRoomName) && attackers < 1) {
                let newName = 'Attacker-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
                let body = getBody([MOVE,ATTACK,ATTACK], room, 18);
                room.memory.spawn_list.push(body, newName, {memory: {role: 'attacker', targetRoom: targetRoomName, homeRoom:room.name}});
                console.log('Adding Defending-Attacker to Spawn List: ' + newName);
            }
        }
    });

    _.forEach(Game.rooms, function(thisRoom) {
        _.forEach(resourceData, function(data, targetRoomName) {
            if(thisRoom.name == targetRoomName && !room.memory.danger) {
                if(thisRoom.memory.has_hostile_structures && !thisRoom.memory.has_hostile_creeps && !thisRoom.memory.has_attacker && thisRoom.controller && !thisRoom.controller.my && attackers < 2) {
                    let newName = 'Attacker-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
                    room.memory.spawn_list.push(getBody([ATTACK,ATTACK,MOVE], room, 15), newName, {memory: {role: 'attacker', targetRoom: thisRoom.name, homeRoom:room.name}});
                    console.log('Adding Defending-Attacker to Spawn List: ' + newName);
                    thisRoom.memory.has_hostile_structures = false;
                }


                if(room.controller.level <= 4 && thisRoom.memory.has_safe_creeps && !thisRoom.memory.has_attacker && thisRoom.controller && !thisRoom.controller.my && RangedAttackers < 1 && thisRoom.find(FIND_HOSTILE_CREEPS).length == 1) {
                    let newName = 'RangedAttacker-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
                    room.memory.spawn_list.push([MOVE,RANGED_ATTACK], newName, {memory: {role: 'RangedAttacker', targetRoom: thisRoom.name, homeRoom: room.name}});
                    console.log('Adding Annoying-Ranged-Attacker to Spawn List: ' + newName);
                    thisRoom.memory.has_safe_creeps = false;
                }
                else if(room.controller.level <= 4 && thisRoom.memory.has_safe_creeps && !thisRoom.memory.has_attacker && thisRoom.controller && !thisRoom.controller.my && attackers < 1 && thisRoom.find(FIND_HOSTILE_CREEPS).length > 1) {
                    let newName = 'Attacker-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
                    room.memory.spawn_list.push([MOVE,ATTACK], newName, {memory: {role: 'attacker', targetRoom: thisRoom.name, homeRoom: room.name}});
                    console.log('Adding Annoying-Attacker to Spawn List: ' + newName);
                    thisRoom.memory.has_safe_creeps = false;
                }


                // if(thisRoom.memory.has_hostile_creeps && !thisRoom.memory.has_attacker && thisRoom.controller && !thisRoom.controller.my && RangedAttackers < 1) {
                //     let newName = 'RangedAttacker-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
                //     room.memory.spawn_list.push(getBody([MOVE,RANGED_ATTACK,RANGED_ATTACK], room, 20), newName, {memory: {role: 'RangedAttacker', targetRoom: thisRoom.name, homeRoom: room.name}});
                //     console.log('Adding Defending-Ranged-Attacker to Spawn List: ' + newName);
                //     thisRoom.memory.has_hostile_creeps = false;
                // }

                // if(room.controller.level >= 7 && thisRoom.memory.has_hostile_creeps && !thisRoom.memory.has_attacker && thisRoom.controller && !thisRoom.controller.my && RangedAttackers < 1) {
                //     let newName = 'RangedAttacker-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
                //     room.memory.spawn_list.push([TOUGH,TOUGH,TOUGH,TOUGH,
                //                                 MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                //                                 RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,
                //                                 RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,
                //                                 HEAL,HEAL,HEAL], newName, {memory: {role: 'RangedAttacker', targetRoom: thisRoom.name, homeRoom: room.name}});
                //     console.log('Adding Defending-Ranged-Attacker to Spawn List: ' + newName);
                //     thisRoom.memory.has_hostile_creeps = false;
                // }
            }
        });
    });
                // if(thisRoom.memory.has_hostile_creeps && !thisRoom.memory.has_attacker && thisRoom.controller && !thisRoom.controller.my && RangedAttackers < 1) {
                //     let newName = 'RangedAttacker-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
                //     room.memory.spawn_list.push(getBody([MOVE,RANGED_ATTACK], room, 20), newName, {memory: {role: 'RangedAttacker', targetRoom: thisRoom.name, homeRoom: room.name}});
                //     console.log('Adding Defending-Ranged-Attacker to Spawn List: ' + newName);
                //     thisRoom.memory.has_hostile_creeps = false;
                // }
                // else if(thisRoom.memory.has_hostile_creeps && !thisRoom.memory.has_attacker && thisRoom.controller && !thisRoom.controller.my && RangedAttackers < 3 && Game.time - thisRoom.memory.first_offence > 200) {
                // if(Game.map.getRoomLinearDistance(room.name, thisRoom.name) <= 2) {
                //     let newName = 'RangedAttacker-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
                //     room.memory.spawn_list.push([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL], newName, {memory: {role: 'RangedAttacker', targetRoom: thisRoom.name, homeRoom: room.name}});
                //     console.log('Adding Defending-Ranged-Attacker to Spawn List: ' + newName);
                //     thisRoom.memory.has_hostile_creeps = false;
                //     }
                // }

    let attackRoom = false;

    if(attackRoom && room.controller.level >= 6 && rams < 1 && Game.map.getRoomLinearDistance(room.name, attackRoom) <= 3) {
        let newName = 'Ram-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.push([ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE],
            newName, {memory: {role: 'ram', targetRoom: attackRoom, homeRoom: room.name}});
        console.log('Adding Ram to Spawn List: ' + newName);
    }

    // [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
    //     ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
    //     ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
    //     ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
    //     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]

    // [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,HEAL,HEAL,HEAL,HEAL,HEAL,
    //     HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,
    //     HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,
    //     HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,
    //     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]

    if(attackRoom && room.controller.level >= 6 && signifers < 1 && Game.map.getRoomLinearDistance(room.name, attackRoom) <= 3) {
        let newName = 'Signifer-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.push([MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL],
            newName, {memory: {role: 'signifer', targetRoom: attackRoom, homeRoom: room.name}});
        console.log('Adding Signifer to Spawn List: ' + newName);
    }


    let outputLab:any;
    if(room.controller.level >= 6 && room.memory.labs && room.memory.labs.outputLab) {
        outputLab = room.memory.labs.outputLab;
        if(outputLab) {
            outputLab = Game.getObjectById(outputLab);
        }
    }
    // || EnergyManagers < 4 && room.controller.level >= 6 && Object.keys(room.memory.labs).length == 4 && firstLab && firstLab.store[RESOURCE_UTRIUM] <= 500
    if(storage && EnergyManagers < 1 && room.controller.level >= 6 || storage && storage.store[RESOURCE_ENERGY] < 60000 && EnergyManagers < 2 && room.controller.level >= 6 || storage && EnergyManagers < 2 && room.memory.danger && outputLab) {
        let newName = 'EnergyManager-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        if(room.memory.danger) {
            room.memory.spawn_list.unshift([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'EnergyManager'}});
        }
        else if(storage && storage.store[RESOURCE_ENERGY] < 10000) {
            room.memory.spawn_list.unshift([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], newName, {memory: {role: 'EnergyManager'}});
        }
        else {
            room.memory.spawn_list.unshift([CARRY,CARRY,CARRY,CARRY,MOVE], newName, {memory: {role: 'EnergyManager'}});
        }
        console.log('Adding Energy Manager to Spawn List: ' + newName);
    }


    if(room.controller.level < 4 && fillers < fillerTargetAmount && storage && storage.store[RESOURCE_ENERGY] != 0) {
        let newName = 'Filler-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.unshift([CARRY,MOVE], newName, {memory: {role: 'filler'}});
        console.log('Adding filler to Spawn List: ' + newName);
    }

    else if(room.controller.level == 5 && fillers < 1 && storage && storage.store[RESOURCE_ENERGY] != 0) {
        let newName = 'Filler-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.unshift([CARRY,MOVE], newName, {memory: {role: 'filler'}});
        console.log('Adding filler to Spawn List: ' + newName);
    }
    else if(room.controller.level == 5 && fillers < 2 && storage && storage.store[RESOURCE_ENERGY] != 0) {
        let newName = 'Filler-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.unshift([CARRY,CARRY,MOVE], newName, {memory: {role: 'filler'}});
        console.log('Adding filler to Spawn List: ' + newName);
    }

    else if((room.controller.level >= 4 && room.controller.level <= 5 && fillers < 1 && storage && storage.store[RESOURCE_ENERGY] != 0) ||
        (room.controller.level >= 4 && room.controller.level <= 5 && fillers < 2 && storage && storage.store[RESOURCE_ENERGY] != 0 && room.energyAvailable < room.energyCapacityAvailable)) {
        let newName = 'Filler-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.unshift([CARRY,MOVE], newName, {memory: {role: 'filler'}});
        console.log('Adding filler to Spawn List: ' + newName);
    }
    else if(room.memory.danger && fillers < 4 && room.energyAvailable < room.energyCapacityAvailable && storage && storage.store[RESOURCE_ENERGY] != 0) {
        let newName = 'Filler-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;
        room.memory.spawn_list.unshift([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], newName, {memory: {role: 'filler'}});
        console.log('Adding filler to Spawn List: ' + newName);
    }

    else if (room.controller.level >= 6 && storage && storage.store[RESOURCE_ENERGY] != 0 && (fillers < 2 && room.energyAvailable < room.energyCapacityAvailable || fillers < 1)) {
        let newName = 'Filler-'+ randomWords({exactly:2,wordsPerString:1,join: '-'}) + "-" + room.name;

        if(fillers == 0) {
            room.memory.spawn_list.unshift([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], newName, {memory: {role: 'filler'}});
        }
        else if(fillers == 1) {
            room.memory.spawn_list.unshift([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], newName, {memory: {role: 'filler'}});

        }
        console.log('Adding filler to Spawn List: ' + newName);
    }
}




function spawnFirstInLine(room, spawn) {
    if(room.memory.spawn_list.length >= 1) {
        let spawnAttempt = spawn.spawnCreep(room.memory.spawn_list[0],room.memory.spawn_list[1], room.memory.spawn_list[2]);
        if(spawnAttempt == 0) {
            console.log("spawning", room.memory.spawn_list[1], "creep", room.name);
            room.memory.spawn_list.shift();
            room.memory.spawn_list.shift();
            room.memory.spawn_list.shift();
            return "spawning";
        }
        else {
            console.log("spawning", room.memory.spawn_list[1], "creep error", spawnAttempt, room.name);
            let segment:string[] = room.memory.spawn_list[0]
            if(spawnAttempt == -6 && Game.time % 2 == 0) {
                if(room.memory.spawn_list[0].length >= 4
                && !room.memory.spawn_list[1].startsWith("Carrier")
                && !room.memory.spawn_list[1].startsWith("EnergyMiner")
                // && !room.memory.spawn_list[1].startsWith("RemoteRepairer")
                // && !room.memory.spawn_list[1].startsWith("Reserver")
                || _.sum(segment, s => BODYPART_COST[s]) > room.energyCapacityAvailable
                || room.memory.spawn_list[1].startsWith("Defender")) {

                    room.memory.spawn_list.shift();
                    room.memory.spawn_list.shift();
                    room.memory.spawn_list.shift();

                }
                else if(room.memory.lastTimeSpawnUsed > 205 && room.memory.spawn_list[1].startsWith("Carrier") && room.energyAvailable < room.memory.spawn_list[0].length * 50 && room.memory.spawn_list[0].length > 3 ||
                room.memory.lastTimeSpawnUsed > 205 && room.memory.spawn_list[1].startsWith("EnergyMiner") && room.energyAvailable < room.memory.spawn_list[0].length * 100  && room.memory.spawn_list[0].length > 3) {
                room.memory.lastTimeSpawnUsed > 105 && room.memory.spawn_list[1].startsWith("Reserver") && room.memory.spawn_list[0].length > 1 ||
                // room.memory.lastTimeSpawnUsed > 205 && room.memory.spawn_list[1].startsWith("RemoteRepairer") && room.energyAvailable < room.memory.spawn_list[0].length * 100  && room.memory.spawn_list[0].length > 3) {
                    room.memory.spawn_list[0].shift();
                    // change to delete last one
                }
            }
            if(spawnAttempt == -3 || spawnAttempt == -14 || spawnAttempt == -10) {
                room.memory.spawn_list.shift();
                room.memory.spawn_list.shift();
                room.memory.spawn_list.shift();
            }

            return "not spawning";
        }
    }
    else {
        return "list empty";
    }

}



function spawning(room: any) {

    if(!room.memory.spawn_list) {
        room.memory.spawn_list = [];
    }

    if(!room.memory.lastTimeSpawnUsed || room.memory.lastTimeSpawnUsed == 0) {
        room.memory.lastTimeSpawnUsed = Game.time;
    }

    if(Game.time % 100 == 0 && Game.time - room.memory.lastTimeSpawnUsed > 1000) {
        room.memory.spawn_list = [];
    }

    // console.log(room.memory.spawn_list.length/3, "creeps in spawn queue in room", room.name);

    let spawn: any = Game.getObjectById(room.memory.spawn)
    if(spawn && spawn.spawning && spawn.spawning.remainingTime == 1 && room.memory.spawn_list.length == 0) {
        room.memory.lastTimeSpawnUsed = Game.time;
    }


    spawn = Game.getObjectById(room.memory.spawn) || room.findSpawn();

    if(spawn == undefined) {
        delete room.memory.spawn;
        return;
    }

    if(spawn.spawning) {
        spawn = room.findSpawn();
        if(spawn == undefined) {
            return;
        }
    }

    let status = spawnFirstInLine(room, spawn);
    if(status == "spawning") {
        return;
    }

    // console.log(Game.time - room.memory.lastTimeSpawnUsed, "ticks since last time spawn was active ⛄", room.name)

    if(room.memory.spawn_list.length == 0 && Game.time - room.memory.lastTimeSpawnUsed == 2 ||
        !room.memory.danger && room.memory.spawn_list.length == 0 && (Game.time - room.memory.lastTimeSpawnUsed) % 35 == 0 && room.controller.level >= 6 ||
        !room.memory.danger && room.memory.spawn_list.length == 0 && (Game.time - room.memory.lastTimeSpawnUsed) % 20 == 0 && room.controller.level <= 5 ||
        !room.memory.danger && room.memory.spawn_list.length >= 1 && (Game.time - room.memory.lastTimeSpawnUsed) % 500 == 0 ||
        room.memory.danger && (Game.time - room.memory.lastTimeSpawnUsed) % 7 == 0 && room.memory.spawn_list.length == 0) {

    // if(room.memory.spawn_list.length == 0 && Game.time - room.memory.lastTimeSpawnUsed == 3 ||
    //     room.memory.spawn_list.length == 0 && (Game.time - room.memory.lastTimeSpawnUsed) % 47 == 0 ||
    //     room.memory.spawn_list.length >= 1 && (Game.time - room.memory.lastTimeSpawnUsed) % 2600 == 0 ) {
            add_creeps_to_spawn_list(room, spawn);
    }
}
export default spawning;


        // console.log('Carry Ran in', Game.cpu.getUsed() - start, 'ms')

        // let worker_people = [];
        // for(let creep in Game.creeps) {
        //     if(Game.creeps[creep].memory.role == 'worker' && Game.creeps[creep].memory.homeRoom == room.name) {
        //         worker_people.push(Game.creeps[creep]);
        //    }
        // }

        // let totalWorkPartsOnWorkers = 0;
        // for(let worker in worker_people) {
        //     for (let part in worker_people[worker].body)
        //     if((worker_people[worker].body[part].type) == "work") {
        //         totalWorkPartsOnWorkers = totalWorkPartsOnWorkers + 1;
        //     }
        // }

        // console.log(totalWorkPartsOnWorkers + " in room " + room.name)
