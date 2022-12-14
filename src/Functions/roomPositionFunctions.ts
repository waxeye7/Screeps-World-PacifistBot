interface RoomPosition {
    getNearbyPositions:() => Array<RoomPosition>;
    getOpenPositions:() => Array<RoomPosition>;
    getOpenPositionsIgnoreCreeps:() => Array<RoomPosition>;
    getOpenPositionsIgnoreCreepsCheckStructs:() => Array<RoomPosition>;
}

RoomPosition.prototype.getNearbyPositions = function getNearbyPositions() {
    let positions = [];

    let startX = this.x - 1 || 1;
    let startY = this.y - 1 || 1;

    for(let x = startX; x <= this.x + 1 && x < 49; x++) {

        for(let y = startY; y <= this.y + 1 && y < 49; y++) {

            if (x !== this.x || y !== this.y) {
                positions.push(new RoomPosition(x, y, this.roomName));
            }
        }
    }
    return positions;
}


RoomPosition.prototype.getOpenPositions = function getOpenPositions() {
    let nearbyPositions = this.getNearbyPositions();

    let terrain = Game.map.getRoomTerrain(this.roomName);
    let walkablePositions = _.filter(nearbyPositions, function(pos:any) {
        return terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL;});

    let freePositions = _.filter(walkablePositions, function(pos) {
        return !pos.lookFor(LOOK_CREEPS).length;});

    return freePositions;
}

RoomPosition.prototype.getOpenPositionsIgnoreCreeps = function getOpenPositionsIgnoreCreeps() {
    let nearbyPositions = this.getNearbyPositions();

    let terrain = Game.map.getRoomTerrain(this.roomName);
    let walkablePositions = _.filter(nearbyPositions, function(pos:any) {
        return terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL;});

    return walkablePositions;
}

RoomPosition.prototype.getOpenPositionsIgnoreCreepsCheckStructs = function getOpenPositionsIgnoreCreepsCheckStructs() {
    let nearbyPositions = this.getNearbyPositions();

    let terrain = Game.map.getRoomTerrain(this.roomName);
    let walkablePositions = _.filter(nearbyPositions, function(pos:any) {
        return terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL && pos.x >= 1 && pos.x <= 48 && pos.y >= 1 && pos.y <= 48;});

    let freePositions = _.filter(walkablePositions, function(pos) {
        let lookStructures = pos.lookFor(LOOK_STRUCTURES)
        return lookStructures.length == 0 || lookStructures.length == 1 && (lookStructures[0].structureType == STRUCTURE_ROAD || lookStructures[0].structureType == STRUCTURE_CONTAINER);});

    return freePositions;
}
