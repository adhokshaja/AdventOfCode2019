/*
 * --- Day 1: The Tyranny of the Rocket Equation ---
 * Part One
 * The Fuel Counter-Upper needs to know the total fuel requirement. 
 * To find it, individually calculate the fuel needed for the mass of each module (your puzzle input), then add together all the fuel values.
 * 
 * Fuel required to launch a given module is based on its mass. 
 * Specifically, to find the fuel required for a module, take its mass, divide by three, round down, and subtract 2.
 * 
 * Input - https://adventofcode.com/2019/day/1/input
 */

/**Input modules Masses */
var modules = [89407, 103327, 75227, 80462, 147732, 127392, 147052, 67987, 69650, 63139, 117260, 75686, 146517, 147057, 91654, 96757,
    123428, 118351, 84167, 73536, 59261, 139879, 85969, 93931, 125232, 62629, 107163, 105032, 124295, 112716, 72402, 137719, 126924,
    59903, 102568, 63963, 145435, 54578, 141348, 77099, 64050, 60012, 131514, 81400, 118451, 124420, 124821, 51746, 72382, 125018,
    130662, 116926, 73573, 117827, 101462, 85172, 123277, 62842, 91856, 61046, 57290, 86265, 59080, 55713, 88492, 138409, 134009,
    114376, 86621, 107651, 146528, 135273, 87760, 134164, 141430, 133574, 109457, 110225, 147989, 74089, 55747, 61602, 139444,
    111397, 95751, 133049, 129641, 101287, 88916, 83340, 140286, 88824, 66013, 65935, 141174, 105662, 97399, 91345, 120164, 80904];


/**
 * Calculates the fuel requirement for a module
 * @param {Number} moduleMass Mass of the Module
 */
var fuelForModule = (moduleMass) => {
    //to find the fuel required for a module, take its mass, divide by three, round down, and subtract 2
    var fuelRequired = Math.floor(moduleMass / 3) - 2;
    if (fuelRequired < 0) {
        fuelRequired = 0;
    }
    return fuelRequired;
}

var moduleFuelRequirements = modules.map(mass => fuelForModule(mass));

var totalFuelRequirement = moduleFuelRequirements.reduce((acc, moduleFuel) => acc + moduleFuel, 0);

//Answer Part 1
console.log("Part 1 answer: ")
console.log(totalFuelRequirement);



/**
 * Part 2 - Add fuel for fuel required
 * Fuel itself requires fuel just like a module - take its mass, divide by three, round down, and subtract 2.
 * However, that fuel also requires fuel, and that fuel requires fuel, and so on.
 * Any mass that would require negative fuel should instead be treated as if it requires zero fuel;
 * the remaining mass, if any, is instead handled by wishing really hard, which has no mass and is outside the scope of this calculation.
 */

/**
 * Calculates the correct Fuel Requirement for a module taking into account the mass of the fuel added
 * @param {Number} moduleMass Mass of the module
 */
var correctedFuelForModule = function (moduleMass){
    let totalFuel = fuelForModule(moduleMass)
    let lastAddition = totalFuel;

    while (lastAddition > 0) {
        let newAddition = fuelForModule(lastAddition);
        totalFuel += newAddition;
        lastAddition = newAddition;
    }
    return totalFuel;
}


var correctedModuleFuelRequirements = modules.map(mass => correctedFuelForModule(mass));

var correctedTotalFuelRequirement = correctedModuleFuelRequirements.reduce((acc, moduleFuel) => acc + moduleFuel, 0);

//Answer Part 2
console.log("Part 2 answer: ")
console.log(correctedTotalFuelRequirement);
