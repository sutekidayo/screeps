'use strict';

/*
 * powerhealer is used to heal powerattackers
 *
 * Moves to the room where the powerbank is and heals surrounding creeps
 */

roles.powerhealer = {};

roles.powerhealer.getPartConfig = function(room, energy, heal) {
  var parts = [MOVE, HEAL];
  return room.getPartConfig(energy, parts);
};

roles.powerhealer.energyRequired = function(room) {
  return Math.min(6500, room.energyCapacityAvailable - 50);
};

roles.powerhealer.energyBuild = function(room, energy) {
  return Math.min(6500, room.energyCapacityAvailable - 50);
};

roles.powerhealer.action = function(creep) {
  if (creep.hits < creep.hitsMax) {
    creep.heal(creep);
  }

  var my_creep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
    filter: function(object) {
      return object.hits < object.hitsMax;
    }
  });

  if (my_creep !== null) {
    var range = creep.pos.getRangeTo(my_creep);
    if (range > 1) {
      creep.rangedHeal(my_creep);
    } else {
      creep.heal(my_creep);
    }
  }

  let heal = function(creep) {
    var range;
    var creep_to_heal = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
      filter: function(object) {
        return object.hits < object.hitsMax / 1.5;
      }
    });

    var power_bank = creep.room.find(FIND_STRUCTURES, {
      filter: function(object) {
        return object.structureType == 'powerBank';
      }
    });

    if (power_bank.length > 0 && power_bank[0].hits > 100000) {
      creep.spawnReplacement();
    }

    creep.setNextSpawn();

    var attacker;

    if (creep_to_heal === null) {
      if (power_bank.length === 0) {
        creep_to_heal = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
          filter: function(object) {
            return object.hits < object.hitsMax;
          }
        });
        if (creep_to_heal !== null) {
          range = creep.pos.getRangeTo(creep_to_heal);
          if (range > 1) {
            creep.rangedHeal(creep_to_heal);
          } else {
            creep.heal(creep_to_heal);
          }
          creep.moveTo(creep_to_heal);
          return true;
        }
        attacker = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
          filter: function(object) {
            return object.memory.role == 'powerattacker';
          }
        });
        creep.moveTo(attacker);
        return false;
      }
      var hostile_creeps = creep.room.find(FIND_HOSTILE_CREEPS, {
        filter: creep.room.findAttackCreeps
      });
      if (hostile_creeps.length > 0) {
        attacker = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
          filter: function(object) {
            return object.memory.role == 'powerattacker';
          }
        });
        creep.moveTo(attacker);
        return false;
      }
      range = creep.pos.getRangeTo(power_bank[0]);
      if (range > 2) {
        creep.moveTo(power_bank[0]);
      }
      return false;
    }
    range = creep.pos.getRangeTo(creep_to_heal);
    if (range <= 1) {
      creep.heal(creep_to_heal);
    } else {
      creep.rangedHeal(creep_to_heal);
      creep.moveTo(creep_to_heal);
    }
    return true;

  };

  heal();
  return true;
};

roles.powerhealer.execute = function(creep) {
  creep.log('Execute!!!');
};
