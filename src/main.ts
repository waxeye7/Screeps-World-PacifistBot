// rollup -cw --environment DEST:main

// import { Commands } from "./utils/Commands";
import { ErrorMapper } from "./utils/ErrorMapper";

import global from "./utils/Global";

import rooms from "./Rooms/rooms";

import "./Functions/creepFunctions";
import "./Functions/roomFunctions";
import "./Functions/roomPositionFunctions";

import roleMineralMiner from "./Roles/mineralMiner";
import roleEnergyMiner from "./Roles/energyMiner";
import roleCarry from "./Roles/carry";
import roleEnergyManager from "./Roles/energyManager";
import roleDismantler from "./Roles/Dismantler";
import roleRemoteRepair from "./Roles/remoteRepair";
import roleBuilder from "./Roles/builder";
import roleUpgrader from "./Roles/upgrader";
import roleRepair from "./Roles/repair";
import roleFiller from "./Roles/filler";
import roleDefender from "./Roles/defender";
import roleAttacker from "./Roles/attacker";
import roleRangedAttacker from "./Roles/RangedAttacker";
import roleDrainTower from "./Roles/DrainTower";
import roleHealer from "./Roles/healer";
import roleBuildContainer from "./Roles/buildcontainer";
import roleClaimer from "./Roles/claimer";
import roleRemoteDismantler from "./Roles/remoteDismantler";
import roleScout from "./Roles/scout";
import roleSweeper from "Roles/sweeper";
import roleAnnoy from "Roles/annoy";
import roleReserve from "Roles/reserve";
import roleRampartDefender from "Roles/RampartDefender";
import roleRam from "Roles/ram";
import roleSignifer from "Roles/signifer";
import roleBilltong from "./Roles/billtong"
import roleGoblin from "Roles/goblin";

import roleWallClearer from "Roles/WallClearer";

import roleSquadCreepA from "Roles/Squad/SquadCreepA";
import roleSquadCreepB from "Roles/Squad/SquadCreepB";
import roleSquadCreepY from "Roles/Squad/SquadCreepY";
import roleSquadCreepZ from "Roles/Squad/SquadCreepZ";

global.ROLES = {
  MineralMiner: roleMineralMiner,

  EnergyMiner : roleEnergyMiner,
  carry: roleCarry,
  reserve: roleReserve,

  EnergyManager: roleEnergyManager,

  Dismantler: roleDismantler,
  RemoteRepair: roleRemoteRepair,


  builder: roleBuilder,
  upgrader: roleUpgrader,
  repair: roleRepair,

  filler: roleFiller,
  defender: roleDefender,

  attacker: roleAttacker,
  RangedAttacker: roleRangedAttacker,

  DrainTower: roleDrainTower,
  healer: roleHealer,

  buildcontainer: roleBuildContainer,
  claimer: roleClaimer,


  RemoteDismantler: roleRemoteDismantler,
  scout: roleScout,

  sweeper: roleSweeper,

  annoy: roleAnnoy,

  RampartDefender: roleRampartDefender,

  signifer: roleSignifer,
  ram: roleRam,

  billtong: roleBilltong,
  goblin: roleGoblin,


  WallClearer: roleWallClearer,

  SquadCreepA: roleSquadCreepA,
  SquadCreepB: roleSquadCreepB,
  SquadCreepY: roleSquadCreepY,
  SquadCreepZ: roleSquadCreepZ,
}

global.SQ = function(roomName, targetRoomName, boosted=false) {
    Game.rooms[roomName].memory.spawning_squad.status = true;
    Game.rooms[roomName].memory.spawning_squad.targetRoom = targetRoomName;
    Game.rooms[roomName].memory.spawning_squad.boosted = boosted;

    return "Success!"
}
global.SRD = function(roomName, targetRoomName) {
    let newName = 'RemoteDismantler-BIGBOY' + roomName + Math.floor(Math.random() * 100);
    Game.rooms[roomName].memory.spawn_list.push([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK], newName, {memory: {role: 'RemoteDismantler', targetRoom: targetRoomName, homeRoom: roomName}});
    console.log('Adding RemoteDismantler to Spawn List: ' + newName);
    return "Success!"
}
global.SC = function(targetRoomName, x, y) {
    Memory.target_colonise.room = targetRoomName;
    Memory.target_colonise.spawn_pos = new RoomPosition(x,y,targetRoomName);
    return "Success!"
}

export const loop = ErrorMapper.wrapLoop(() => {
//   console.log(Game.time % 100 + "/100");

  rooms();


  const start = Game.cpu.getUsed()
  for(let name in Memory.creeps) {
      let creep = Game.creeps[name];
      if(!creep) {
          delete Memory.creeps[name];
      }
      else {
          if(creep.memory.role == undefined) {
              console.log("i am undefined", name)
              creep.suicide();
              break;
          }
          global.ROLES[creep.memory.role].run(creep);
      }
  }
  console.log('Creeps Ran in', Game.cpu.getUsed() - start, 'ms');


  if(Game.time % 100 == 0) {
    let difference = Game.cpu.bucket - Memory.CPU
    console.log(" ");
    console.log("-------------------", difference + "ms of CPU difference in the last 100 ticks");
    console.log(" ");
    console.log("-------------------", "Averaging", (2000-difference)/100, "CPU per tick")
    Memory.CPU = Game.cpu.bucket;
  }

  if(Game.time % 100 == 0 && Game.shard.name == "shard0" ||
     Game.time % 100 == 0 && Game.shard.name == "shard1" ||
     Game.time % 100 == 0 && Game.shard.name == "shard2" ||
     Game.time % 100 == 0 && Game.shard.name == "shard3") {
      console.log(" ");
      console.log("-------------------",Game.cpu.bucket, 'unused cpu in my bucket');
      console.log(" ");
      if(Game.cpu.bucket == 10000) {
          if(Game.cpu.generatePixel() == 0) {
              console.log('- generating pixel -');
              console.log('- generating pixel -');
              console.log('- generating pixel -');
              console.log('- generating pixel -');
              console.log('- generating pixel -');
          }
      }
  }
});
