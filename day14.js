/*
 * Day 14: Space Stoichiometry
 * https://adventofcode.com/2019/day/14
 * Arcade machine - IntCode
*/

const debug = false;
const fs = require('fs');
const input = fs.readFileSync("./inputs/day14.txt", (_, a) => a).toString().trim().split('\n');


getReactionElementsAndCount = (reactionTerm) => {
    let count_term = reactionTerm.trim().split(' ');
    return {
        name: count_term[1],
        count: count_term[0]
    }
}

parseReactionString = (reactionStr) => {

    const reactionInOut = reactionStr.split('=>');
    const OutComponent = getReactionElementsAndCount(reactionInOut[1]);

    const inputs = reactionInOut[0].split(',').map(t => getReactionElementsAndCount(t));

    var reactionObject = {};
    reactionObject[`${OutComponent.name}`] = {
        minOut: OutComponent.count,
        inputs
    };

    return reactionObject;
}


function run(reactions, fuelRequired = 1) {

    let ReactionLookup = {};

    reactions.forEach(reactionStr => {

        const reactionObj = parseReactionString(reactionStr);
        ReactionLookup = { ...ReactionLookup, ...reactionObj };
    });



    const required = {};
    const remaining = {};

    const isNonOreRequired = () => {

        var k = [];
        k = Object.keys(required).filter(a => a != "ORE").map(k => !!required[k]);
        return k.filter(i => i).length > 0;
    };


    const gatherRequiredComponentsForElem = (elem, quantity = 1) => {

        if (elem == "ORE") {
            return;
        }

        const reaction = ReactionLookup[elem];
        const ElemMultiplier = Math.ceil(quantity / reaction.minOut);

        reaction.inputs.forEach(comp => {
            const name = comp.name;
            let reqdQuantity = ElemMultiplier * comp.count;

            const remain = remaining[name] || 0;

            reqdQuantity = reqdQuantity - remain;
            remaining[name] = 0;

            required[name] = required[name] || 0;
            required[name] = required[name] + reqdQuantity;

        });

        generatedQuantity = reaction.minOut * ElemMultiplier;
        required[elem] = 0;
        remaining[elem] = generatedQuantity - quantity;
    }

    required["FUEL"] = fuelRequired;
    while (isNonOreRequired()) {
        Object.keys(required).filter(a => a != "ORE" && !!required[a]).forEach(elem => {
            var quantity = required[elem];
            gatherRequiredComponentsForElem(elem, quantity);
        });
    }


    return required['ORE'];
}


//run(input);
function tests_p1() {
    var t1 = run(['10 ORE => 10 A',
        '1 ORE => 1 B',
        '7 A, 1 B => 1 C',
        '7 A, 1 C => 1 D',
        '7 A, 1 D => 1 E',
        '7 A, 1 E => 1 FUEL']); //31
    console.log(t1);
    var t2 = run(['9 ORE => 2 A',
        '8 ORE => 3 B',
        '7 ORE => 5 C',
        '3 A, 4 B => 1 AB',
        '5 B, 7 C => 1 BC',
        '4 C, 1 A => 1 CA',
        '2 AB, 3 BC, 4 CA => 1 FUEL']); //165
    console.log(t2);

    var t3 = run(['157 ORE => 5 NZVS',
        '165 ORE => 6 DCFZ',
        '44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL',
        '12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ',
        '179 ORE => 7 PSHF',
        '177 ORE => 5 HKGWZ',
        '7 DCFZ, 7 PSHF => 2 XJWVT',
        '165 ORE => 2 GPVTF',
        '3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT']); //13312
    console.log(t3);
}

//tests_p1();

//part 1
const p1 = run(input);
console.log('PART 1 : ', p1);



function run_p2(reactions, startingOre = 1000000000000) {

    // Accelerated Binary search algorithm
    // Converges on answer faster if the answer is further away from the search term
    // Stops after maxItterations or if the iteration produces the same fuel twice in a row
    const maxItter = 10000;
    let minFuel = 1,
        maxFuel = startingOre;
    let CurrFuel = Math.floor((maxFuel + minFuel) / 2);
    let lp = 0;
    let lastFuel = 0;
    while (CurrFuel <= maxFuel && CurrFuel >= minFuel && maxFuel > minFuel && lastFuel != CurrFuel && lp < maxItter) {
        lp++;
        lastFuel = CurrFuel;
        const oreReqd = run([...reactions], CurrFuel);

        if (debug) {
            console.log(`l: ${lp} | CF : ${CurrFuel} | OR: ${oreReqd} | mi: ${minFuel} | mx: ${maxFuel} `);
        }

        if (Math.floor(startingOre / oreReqd) > 1) {
            // If a large multiple, then increase currFuel by the multiple
            minFuel = CurrFuel;
            CurrFuel = CurrFuel * Math.floor(startingOre / oreReqd);
            if (CurrFuel > maxFuel) {
                CurrFuel = maxFuel;
            }
        } else if (Math.floor(oreReqd / startingOre) > 1) {
            // if a divisible portion of the required, reduce by the divisor
            maxFuel = CurrFuel;
            CurrFuel = parseInt(CurrFuel / Math.floor(oreReqd / startingOre));
            if (CurrFuel < minFuel) {
                CurrFuel = minFuel;
            }
        }
        else {
            // Standard Binary Search
            if (startingOre > oreReqd) {
                minFuel = CurrFuel;
            } else if (startingOre < oreReqd) {
                maxFuel = CurrFuel;
            } else {
                return CurrFuel;
            }
            CurrFuel = parseInt((maxFuel + minFuel) / 2);
        }
    }
    if (lp == maxItter) {
        console.info("Max Iterations reached. May not be the right answer");
    }
    return CurrFuel;
}


function tests_p2() {

    var t3 = run_p2(['157 ORE => 5 NZVS',
        '165 ORE => 6 DCFZ',
        '44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL',
        '12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ',
        '179 ORE => 7 PSHF',
        '177 ORE => 5 HKGWZ',
        '7 DCFZ, 7 PSHF => 2 XJWVT',
        '165 ORE => 2 GPVTF',
        '3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT']);
    console.log(t3);// 82892753  

    var t2 = run_p2(['171 ORE => 8 CNZTR',
        '7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL',
        '114 ORE => 4 BHXH',
        '14 VRPVC => 6 BMBT',
        '6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL',
        '6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT',
        '15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW',
        '13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW',
        '5 BMBT => 4 WPTQ',
        '189 ORE => 9 KTJDG',
        '1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP',
        '12 VRPVC, 27 CNZTR => 2 XDBXC',
        '15 KTJDG, 12 BHXH => 5 XCVML',
        '3 BHXH, 2 VRPVC => 7 MZWV',
        '121 ORE => 7 VRPVC',
        '7 XCVML => 6 RJRHP',
        '5 BHXH, 4 VRPVC => 5 LTCX']);
    console.log(t2); // 460664 

}
//tests_p2();

const part2 = run_p2(input);

console.log("PART 2: ", part2);