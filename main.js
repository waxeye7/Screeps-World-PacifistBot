let roleWorker = require('role.worker');
let roleBuilder = require('role.builder');
let roleUpgrader = require('role.upgrader');
let roleRemoteWorker = require('role.remoteWorker');
let roleAttacker = require('role.attacker');
let roleClaimer = require('role.claimer');
let roleDefender = require('role.defender');
let roleBuildContainer = require('role.buildcontainer');
let roleCarry = require('role.carry');

module.exports.loop = function () {

    // Game.rooms["E12S38"].find(FIND_HOSTILE_CREEPS)
    // Game.rooms["E12S38"].createConstructionSite( 6, 14, STRUCTURE_CONTAINER );

    // Game.spawns['Spawn1'].room.createConstructionSite( 33, 33, STRUCTURE_EXTENSION );
    // Game.spawns['Spawn1'].room.createConstructionSite( 30, 33, STRUCTURE_EXTENSION );
    // Game.spawns['Spawn1'].room.createConstructionSite( 29, 33, STRUCTURE_EXTENSION );
    // Game.spawns['Spawn1'].room.createConstructionSite( 31, 33, STRUCTURE_EXTENSION );
    // Game.spawns['Spawn1'].room.createConstructionSite( 32, 33, STRUCTURE_EXTENSION );

    // Game.spawns['Spawn1'].room.createConstructionSite( 30, 32, STRUCTURE_TOWER );

    // Game.spawns['Spawn1'].room.createConstructionSite( 15, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 16, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 17, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 18, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 19, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 20, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 21, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 22, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 23, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 24, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 25, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 26, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 27, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 28, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 29, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 30, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 31, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 32, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 33, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 34, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 35, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 36, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 37, 35, STRUCTURE_WALL );
    // Game.spawns['Spawn1'].room.createConstructionSite( 38, 35, STRUCTURE_WALL );

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // console.log(creep.room.find(FIND_STRUCTURES, structure.structureType == STRUCTURE_SPAWN));
    // let extension = Game.getObjectById('62fda5bc4bcfd1857d3af39f');
    // console.log(extension.isActive());

    let tower1 = Game.getObjectById('62fd8cfff176f6d96c7ce2ee');
    if(tower1) {
        let closestHostile = tower1.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower1.attack(closestHostile);
        }
    }

    let tower2 = Game.getObjectById('63001fe6ac9df43b4fe93b5b');
    if(tower2) {
        let closestHostile = tower2.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower2.attack(closestHostile);
        }
    }

        // let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        //     filter: (structure) => (structure.hits < structure.hitsMax && structure.hitsMax - structure.hits >= 800)
        // });
        // // console.log(closestDamagedStructure);
        // if(closestDamagedStructure && tower.energy >= 810 && (closestDamagedStructure.hitsMax - closestDamagedStructure.hits >= 800)) {
        //     tower.repair(closestDamagedStructure);
        // }
    
    let workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker');
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    let remoteWorkers = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteworker');
    let attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
    let claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
    let defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    let containerbuilders = _.filter(Game.creeps, (creep) => creep.memory.role == 'buildcontainer');
    let carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carry');


    // let enemyCreeps = Game.rooms["E12S39"].find(FIND_HOSTILE_CREEPS);
    // let enemyCreeps2 = Game.rooms["E12S38"].find(FIND_HOSTILE_CREEPS);

    // console.log(enemyCreeps2)
    // console.log(enemyCreeps2.length);

    console.log(workers.length + " Workers and " + builders.length + " Builders and " + upgraders.length + " Upgraders and "
    + remoteWorkers.length + " Remote-Workers and " + attackers.length + " Attackers and " + claimers.length + " Claimers and "
    + defenders.length + " Defenders and " + containerbuilders.length + " Container-Builders and " + carriers.length + " Carriers");

    if(workers.length < 4) {
        let newName = 'Worker' + Game.time;
        console.log('Spawning new worker: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,CARRY, CARRY,MOVE,MOVE,MOVE], newName, 
            {memory: {role: 'worker'}});        
    }

    // add the extensionfiller and make everyone drop energy at storage!

    // else if(enemyCreeps.length > 0 && defenders.length <= 3) {
    //     let newName = 'Defender' + Game.time;
    //     console.log('Spawning new defender: ' + newName);
    //     Game.spawns['Spawn1'].spawnCreep([ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
    //         {memory: {role: 'defender'}});  
    // }

    // else if(attackers.length < 0) {
    //     let newName = 'Attacker' + Game.time;
    //     console.log('Spawning new attacker: ' + newName);
    //     Game.spawns['Spawn1'].spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
    //         {memory: {role: 'attacker'}});        
    // }

    else if(builders.length < 1) {
        let newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'builder'}});        
    }


    else if(upgraders.length < 5) {
        let newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,CARRY, CARRY, CARRY,CARRY, MOVE, MOVE], newName, 
            {memory: {role: 'upgrader'}});        
    }

    else if(remoteWorkers.length < 1) {
        let newName = 'RemoteWorker' + Game.time;
        console.log('Spawning new remote-worker: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK,WORK,WORK,MOVE,MOVE], newName, 
            {memory: {role: 'remoteworker'}});        
    }

    else if(carriers.length < 1) {
        let newName = 'Carrier' + Game.time;
        console.log('Spawning new carrier: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
            {memory: {role: 'carry'}});        
    }

    // && (Game.rooms["E12S37"].find(FIND_STRUCTURES, {filter: object => object.structureType == STRUCTURE_WALL}))


    else if(claimers.length < 0 && Game.time % 910 == 0) {
        let newName = 'Claimer' + Game.time;
        console.log('Spawning new claimer: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([MOVE,CLAIM], newName, 
            {memory: {role: 'claimer'}});        
    }

    else if(containerbuilders.length < 2) {
        let newName = 'ContainerBuilder' + Game.time;
        console.log('Spawning new containerbuilder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([MOVE,WORK,CARRY], newName, 
            {memory: {role: 'buildcontainer'}});        
    }


    

    if(Game.spawns['Spawn1'].spawning) { 
        let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
    


    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if(creep.memory.role == 'worker') {
            roleWorker.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if(creep.memory.role == 'remoteworker') {
            roleRemoteWorker.run(creep);
        }
        else if(creep.memory.role == 'attacker') {
            roleAttacker.run(creep);
        }
        else if(creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
        else if(creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
        // else if(creep.memory.role == 'filler') {
        //     roleDefender.run(creep);
        // }
        else if(creep.memory.role == 'buildcontainer') {
            roleBuildContainer.run(creep);
        }
        else if(creep.memory.role == 'carry') {
            roleCarry.run(creep);
        }
    }
}

// make only carry travel to container and make worker go there and just work and will be more efficient!