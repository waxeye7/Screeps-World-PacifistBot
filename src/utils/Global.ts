declare global {
    /*
      Example types, expand on these or remove them and add your own.
      Note: Values, properties defined here do no fully *exist* by this type definiton alone.
            You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

      Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
      Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
    */
    interface Memory {
        tasks: any;
        uuid: number;
        log: any;
    }
    interface RoomMemory {
        spawn_list: Array<Array<string> | string | object>;
        has_hostile_structures: boolean;
        has_hostile_creeps: boolean;
        has_attacker: boolean;
        danger: boolean;
        name: string;
    }
    interface CreepMemory {
        name: string;
        role: string;
        room: object;
        working: boolean;
    }

    // Syntax for adding proprties to `global` (ex "global.log")
    namespace NodeJS {
        interface Global {
            ROLES: any;
        }
    }
}

export default global;
