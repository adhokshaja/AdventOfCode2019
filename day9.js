/*
 * Day 9: Sensor Boost
 * https://adventofcode.com/2019/day/9
 */

const fs = require('fs');
const { IntCodeParser } = require('./IntcodeParser')
/**
 * Input value
 */
const input = fs.readFileSync("./inputs/day9.txt", (_, a) => a).toString().split(",").map(i => parseInt(i));

//console.log(input);

function run(intcode, [...input] = [], name = "Parser", debug = false){
    const parser = new IntCodeParser(intcode,name);

    parser.revertStateToInitial();

    var output = parser.run(input,debug);

    console.log(output);
    return output;
}

function test(){
    run([109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99],[],"Test1", true);
    run([1102, 34915192, 34915192, 7, 4, 7, 99, 0], [], "Test2", true);
    run([104, 1125899906842624, 99], [], "Test2", true);
}
//test();

const p1 = run([...input], [1],"BOOST", true);

const p2 = run([...input], [2], "BOOST", true);