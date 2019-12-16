/*
 * Day 15: Oxygen System
 * https://adventofcode.com/2019/day/15
 * Repair Droid - IntCode
 * Accept a movement command via an input instruction.
 * Send the movement command to the repair droid.
 * Wait for the repair droid to finish the movement operation.
 *Report on the status of the repair droid via an output instruction.
    * 0 The repair droid hit a wall. Its position has not changed.
    * 1 The repair droid has moved one step in the requested direction.
    * 2 The repair droid has moved one step in the requested direction; its new position is the location of the oxygen system.
*/


const debug = false;

const fs = require('fs');
const input = fs.readFileSync("./inputs/day15.txt", (_, a) => a).toString().split(",").map(i => parseInt(i));

const { IntCodeParser } = require('./IntcodeParser');

const movePoint = ({ x: col, y: row }, dir) => {
    switch (dir) {
        case 1: return { x: col, y: row - 1 };
        case 2: return { x: col, y: row + 1 };
        case 3: return { x: col - 1, y: row };
        case 4: return { x: col + 1, y: row };
        default: return { x: col, y: row };
    }
}

const convertOutputToSymbol = (droidOut) => {

    switch (parseInt(droidOut)) {
        case 0: return '#'; //wall
        case 2: return '*'; // Oxygen System
        default: return ' '; //empty
    }
}
const locToStr = ({ x, y } = { x: 0, y: 0 }) => `${x},${y}`;


const buildMap = (program, startLocation = { x: 0, y: 0 }) => {

    const mappedOxygenTank = (map) => [...Object.values(map)].includes('*');

    const droid = new IntCodeParser(program);
    const map = {};
    const path = [];
    map[locToStr(startLocation)] = ' '; // Empty location
    path.push({ loc: startLocation, move: [] });
    let ittr = 0, maxIttr = 50000;
    let oxygenPath = [];
    while (!(path.length <= 0)) {
        const { loc, move } = path.splice(0, 1)[0]; // get first location from path
        ittr++;
        //console.log(move);
        for (let dir of [1, 2, 3, 4]) {
            const currMove = [...move, parseInt(dir)];

            droid.revertStateToInitial();
            const currLoc = movePoint(loc, parseInt(dir));
            if (locToStr(currLoc) in map) {
                continue;
            }
            //console.log(currMove);
            var op = droid.run(currMove).pop();
            //console.log(op, convertOutputToSymbol(op));

            map[locToStr(currLoc)] = convertOutputToSymbol(op);
            if (op != 0) {
                path.push({ loc: currLoc, move: currMove });
            }
            if (op == 2) {
                console.log('found');
                oxygenPath = currMove;
            }
        }
    }
    return [map, oxygenPath];
}

const p1 = buildMap(input);
const numSteps = p1[1].length;
const map = p1[0];

console.log('Part 1: ', numSteps);

const part2 = (map) => {
    const isMapFilledWithOxygen = (map) => !([...Object.values(map)].includes(' '));

    let currIttr = 0;
    let VisitedLocs = [];
    while (!isMapFilledWithOxygen(map) && currIttr < 5000) {
        //get all the oxygen locations
        const oxygenLocs = Object.keys(map).filter(k => map[k] == '*');

        for (let oxygenLoc of oxygenLocs) {
            // for each oxygenLocation

            //if oxygen location was already visited, continue
            if (VisitedLocs.indexOf(oxygenLoc) >= 0) {
                continue;
            }

            const currLoc = {};
            currLoc.x = parseInt(oxygenLoc.split(',')[0]);
            currLoc.y = parseInt(oxygenLoc.split(',')[1]);


            //get the 4 neighbors
            for (dir of [1, 2, 3, 4]) {
                const neighbor = movePoint(currLoc, dir);
                const neighborLocStr = locToStr(neighbor);
                if (map[neighborLocStr] == ' ') {
                    //if it is empty, add oxygen there
                    map[neighborLocStr] = '*';
                }
            }
            VisitedLocs.push(oxygenLoc);
        }
        currIttr++;
    }
    return currIttr;
}

const p2 = part2(map);
console.log("Part 2:", p2);