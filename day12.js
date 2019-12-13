/*
 * Day 12: N-Body problem
 * https://adventofcode.com/2019/day/12
 * Calculate the position and velocity of 4 moons affected by each other's gravity.
 * Each Moon is in 3d space, and has 3 velocity components along each axis.
 * The calculations are done over a specified number of time steps. 
 * For each time step,
 *  - Change the velocity 
 *          Consider each pair of moons, on each axis, the velocity changes by +1 or -1 unit towards each other.
 *  - Change position based on velocity
 *          On each axis, change poition by the corrosponding velocity along the axis
 * 
 */

const fs = require('fs');
const { Moon } = require('./Moon')

const debug = false;

const input = fs.readFileSync("./inputs/day12.txt", (_, a) => a).toString()
    .trim().split("\n");

const parseInput = (input, [...Names] = ['Io', 'Europa', 'Ganymede', 'Callisto']) => {

    const initPositions = input.map(a => {
        let k = a.replace('<', '{')
            .replace('>', '}')
            .replace(/=/g, ':')
            .replace(/([xyz])/g, `"$1"`);
        return JSON.parse(k);
    });

    /**
     * @type {[Moon]}
     */
    const Moons = initPositions.map((a, i) => new Moon(Names[i], a));
    return Moons;
}

/**
 * For a given Pair of moons, changes their velocities based on thier position
 * @param {Moon} m1 Moon 1
 * @param {Moon} m2 Moon 2
 */
const ApplyGravity = (m1, m2) => {
    if (m1.name == m2.name) { return; }

    //x-axis
    if (m1.x != m2.x) {
        m1.u = m1.x > m2.x ? m1.u - 1 : m1.u + 1;
        m2.u = m2.x > m1.x ? m2.u - 1 : m2.u + 1;
    }

    //y-axis
    if (m1.y != m2.y) {
        m1.v = m1.y > m2.y ? m1.v - 1 : m1.v + 1;
        m2.v = m2.y > m1.y ? m2.v - 1 : m2.v + 1;
    }

    //z-axis
    if (m1.z != m2.z) {
        m1.w = m1.z > m2.z ? m1.w - 1 : m1.w + 1;
        m2.w = m2.z > m1.z ? m2.w - 1 : m2.w + 1;
    }

    return;
}


const run = (startPos = [], numTimeSteps) => {

    if (startPos.length !== 4) {
        console.error("Unknown length input");
        return;
    }

    const moons = parseInput(startPos);
    let currTimeStep = 0;

    if (debug) {
        console.log(moons);
    }

    while (++currTimeStep <= numTimeSteps) {

        for (let i = 0; i <= 3; i++) {
            for (let j = 0; j <= 3; j++) {
                if (j > i) {
                    ApplyGravity(moons[i], moons[j]);
                }
            }
        }

        if (debug) {
            console.log(`\nAfter ${currTimeStep} steps`);
        }
        moons.forEach(moon => {
            moon.move();
            if (debug) {
                console.log(`${moon.toString()}`);
            }
        });
        if (debug) {
            console.log(`\n`);
        }

    };

    const energyOfSystem = moons.map(m => m.getTotalEnergy()).reduceRight((a, t) => a + t, 0);

    moons.forEach(moon => {
        console.log(`${moon.toString()}`);
    });

    console.log(`Total Energy = ${energyOfSystem}`);

    return moons;

};



function tests() {
    var initPos = [
        `<x=-1, y=0, z=2>`,
        `<x=2, y=-10, z=-7>`,
        `<x=4, y=-8, z=8>`,
        `<x=3, y=5, z=-1>`
    ];
    console.log('Test 1')
    run(initPos, 10);

    initPos = [
        `<x=-8, y=-10, z=0>`,
        `<x=5, y=5, z=10>`,
        `<x=2, y=-7, z=3>`,
        `<x=9, y=-8, z=-3>`
    ];
    console.log(`\n Test 2`);
    run(initPos, 100);
}

//tests();


//Part 1 
run(input, 1000);

// Part 2
// Determine the number of steps that must occur before all of the moons' positions and velocities exactly match a previous point in time.

/*
Since the acceleration only occurs on one axis, 
we can compute the time taken for each axis to return back to a previous state.
The LCM of these numbers is the time taken to return back to a previous state for the whole system
*/

/**
 * For a given Pair of moons, changes their velocities in the specified dimension based on thier position
 * @param {Moon} m1 Moon 1
 * @param {Moon} m2 Moon 2
 * @param {number} dim  Which dimension to use 0 = x|u, 1= y|v, 2 = z|w
 */
const ApplyGravity1Dimension = (m1, m2, dim) => {
    if (m1.name == m2.name) { return; }
    const dimensions = [
        { 'p': 'x', 'v': 'u' },
        { 'p': 'y', 'v': 'v' },
        { 'p': 'z', 'v': 'w' }
    ]

    const { p, v } = dimensions[dim];

    if (m1[p] != m2[p]) {
        m1[v] = m1[p] > m2[p] ? m1[v] - 1 : m1[v] + 1;
        m2[v] = m2[p] > m1[p] ? m2[v] - 1 : m2[v] + 1;
    }

    return;
}

const {LCM} = require('./MathHelpers');


const GetStepsToRepeat = (startPos = [], maxIterations = 100000) => {

    // Steps required before repeat
    let RepeatByDimension = [];
    let i = maxIterations;

    const getHashesForMoons = ([...moons]) => {
        return moons.map(m => m.getHash()).join('|');
    }

    RepeatByDimension = [0, 1, 2].map((dim) => {
        const moons = parseInput(startPos);

        let hashSet = new Set(); //A set of planet hashes at each interation
        hashSet.add(getHashesForMoons(moons));

        i = maxIterations;

        while (i--) {
            // For each Iteration, get the next position
            for (let i = 0; i <= 3; i++) {
                for (let j = 0; j <= 3; j++) {
                    if (j > i) {
                        ApplyGravity1Dimension(moons[i], moons[j], dim);
                    }
                }
            }
            moons.forEach(m => m.move());
            const moonHashes = getHashesForMoons(moons);

            if(debug){
                console.log(moonHashes);
            }
            

            if (hashSet.has(moonHashes)) {
                break;
            } else {
                hashSet.add(moonHashes);
            }
        }

        if (i <= 0) {
            console.error("Max Iterations Reached. Try Increasing the max iteration count");
        }
        return hashSet.size;

    });
    if(debug){
        console.log(RepeatByDimension);
        return 0;
    }
    return LCM(RepeatByDimension);
}

function test_p2 (){
    var initPos = [
        `<x=-1, y=0, z=2>`,
        `<x=2, y=-10, z=-7>`,
        `<x=4, y=-8, z=8>`,
        `<x=3, y=5, z=-1>`
    ];

    var s2r = GetStepsToRepeat(initPos, 4000);
    console.log(s2r);


    initPos = [
        `<x=-8, y=-10, z=0>`,
        `<x=5, y=5, z=10>`,
        `<x=2, y=-7, z=3>`,
        `<x=9, y=-8, z=-3>`
    ];

    s2r = GetStepsToRepeat(initPos, 1000);
    console.log(s2r);
}

//test_p2();

const part_2 = GetStepsToRepeat(input,200000);
console.log("Part 2 : ", part_2);