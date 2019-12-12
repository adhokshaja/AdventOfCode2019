/*
 * Day 11: Space Police
 * https://adventofcode.com/2019/day/11
 * Emergency hull painting robot - Input is IntCode Program
 * The Intcode program will serve as the brain of the robot. The program uses input instructions to access the robot's camera: 
 *      provide 0 if the robot is over a black panel 
 *      or 1 if the robot is over a white panel. 
 *  Initially all panels are black
 * Then, the program will output two values:
 *  First, it will output a value indicating the color to paint the panel the robot is over: 
 *      0 means to paint the panel black, 
 *      and 1 means to paint the panel white.
 *  Second, it will output a value indicating the direction the robot should turn: 
 *      0 means it should turn left 90 degrees, 
 *      and 1 means it should turn right 90 degrees.
 */

const debug = false;


const fs = require('fs');
const input = fs.readFileSync("./inputs/day11.txt", (_, a) => a).toString().split(",").map(i => parseInt(i));
//const { Point } = require('./Point');
const { IntCodeParser } = require('./IntcodeParser')

//console.log(input);

const HullPainter = new IntCodeParser(input, "Hull Painter");

// Part 1: Count number of panels it paints at least once, regardless of color.




// The robot starts at (0,0) but can go in either direction
let curX = 0, // Current X
    curY = 0, // Current Y
    minX = 0,
    minY = 0,
    curOrientation = "U"; // U, D, L ,R

/**
 * Moves the robot to next Location.
 * Pixel values increase to the right and down
 * @param {Boolean} turnRight Is turn Right
 */
const moveToNewLocation = (turnRight = false) => {
    switch (curOrientation) {
        case 'U':
            curX = turnRight ? curX + 1 : curX - 1;
            curOrientation = turnRight ? 'R' : 'L';
            break;
        case 'D':
            curX = turnRight ? curX - 1 : curX + 1;
            curOrientation = turnRight ? 'L' : 'R';
            break;
        case 'L':
            curY = turnRight ? curY - 1 : curY + 1;
            curOrientation = turnRight ? 'U' : 'D';
            break;
        case 'R':
            curY = turnRight ? curY + 1 : curY - 1;
            curOrientation = turnRight ? 'D' : 'U';
            break;
    }
}

// TESTS!!!!

function UnitTestMove() {
    /**
     * Test: Performs a left/ right handed loop ( 4 lefts/rights)
     * @param {Boolean} left Is Left hand Turn
     */
    function DoALoop(right = false) {
        console.log(`${curX}, ${curY}, ${curOrientation}`);
        moveToNewLocation(right);
        console.log(`${curX}, ${curY}, ${curOrientation}`);

        moveToNewLocation(right);
        console.log(`${curX}, ${curY}, ${curOrientation}`);


        moveToNewLocation(right);
        console.log(`${curX}, ${curY}, ${curOrientation}`);

        moveToNewLocation(right);
        console.log(`${curX}, ${curY}, ${curOrientation}`);
    }


    console.log("Right loop")
    DoALoop(true);
    console.log("Left loop")
    DoALoop(false);
}
if (debug) { UnitTestMove(); }


function run(startingPixelVal = 0) {

    //Reset All Starting Locations
    curX = 0, // Current X
    curY = 0, // Current Y
    minX = 0,
    minY = 0,
    curOrientation = "U"; // U, D, L ,R

    const PaintedPixels = {};

    HullPainter.revertStateToInitial();
    let RobotOutput = HullPainter.run([startingPixelVal]);

    while (RobotOutput.length > 0) {
        let loc = `${curX},${curY}`;
        if (debug) {
            console.log(RobotOutput);
            console.log(loc);
        }
        PaintedPixels[loc] = RobotOutput[0];
        moveToNewLocation(RobotOutput[1] === 1);
        minX = minX <= curX ? minX : curX;
        minY = minY <= curY ? minY : curY;
        loc = `${curX},${curY}`;
        const colorAtNewLoc = PaintedPixels[loc] || 0;
        RobotOutput = HullPainter.run([colorAtNewLoc]);

    }

    if (debug) {
        console.log(PaintedPixels);
    }

    return { PaintedPixels, min: { x: minX, y: minY } };
}


const part1 = () => {
    let { PaintedPixels, min } = run(0);
    const numCounted = Object.keys(PaintedPixels).length;
    console.log("Part 1",numCounted);
}
part1();



const part2 = () => {
    let { PaintedPixels, min } = run(1);
    const imageArr = [];
    const max = { x: 0, y: 0 };
    Object.keys(PaintedPixels).forEach(key => {
        let [x, y] = key.split(',');
        x = parseInt(x) - min.x;
        y = parseInt(y) - min.y;
        if (!isNaN(x) && !isNaN(y)) {
            max.x = max.x >= x ? max.x : x;
            max.y = max.y >= y ? max.y : y;
            imageArr[y] = imageArr[y] || [];
            imageArr[y][x] = PaintedPixels[key];
        }
    });
    const image = [];
    for (let r = 0; r <= max.y; r++) {
        image[r] = [];
        for (let c = 0; c <= max.x; c++) {
            const pixel = imageArr[r][c] == 1 ? "■" : " "; // 1 = white pixel 0 = black pixel
            image[r][c] = pixel;
        }
    }
    image.forEach(i => console.log(i.join('')));
}

part2();