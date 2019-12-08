/*
 * --- Day 5: Sunny with a Chance of Asteroids ---
 * https://adventofcode.com/2019/day/3
 * Part One
 * The TEST diagnostic program will run on your existing Intcode computer after a few modifications:
 *  * Two new Instructions
 *      * Opcode 3 takes a single integer as input and saves it to the position given by its only parameter.
 *      * Opcode 4 outputs the value of its only parameter.
 *  * Immediate Mode and Position Mode
 *      * parameter mode 0, position mode - Read from position/ write to position
 *      * parameter mode 1, immediate mode, Read the exact value 
 *      * Each read operation could be either a immediate mode or in position mode.
 * 
 */

const fs = require('fs');
const {IntCodeParser} = require('./IntcodeParser')
/**
 * Input value
 */
const input = fs.readFileSync("./inputs/day5.txt", (_, a) => a).toString().split(",").map(i => parseInt(i));


const runTests_P1 = () => {


    var helloWorld = new IntCodeParser([3, 0, 4, 0, 99],'Hello world');
    console.log(helloWorld.run(5));


    var multiplyBy2 = new IntCodeParser([3, 0, 1002, 0, 2, 0, 4, 0, 99],'Multiply By 2');
    console.log(multiplyBy2.run(2));


    var add12 = new IntCodeParser([3, 0, 1001, 0, 12, 0, 4, 0, 99],'Add 12');
    console.log(add12.run(1));


    var add4Mult10 = new IntCodeParser([3, 20, 1001, 20, 4, 21, 1002, 20, 20, 22, 4, 21, 4, 22, 99],'Add 4 Mul 10');
    console.log(add4Mult10.run(5));

}

// runTests_P1()

var part1 = new IntCodeParser([...input], 'Day 5 part 1');
//console.log(part1.run(1));


const runTests_P2 = () =>{

    var isNotZero = new IntCodeParser([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9],'Is not zero');
    console.log(isNotZero.run(1));
    isNotZero.revertStateToInitial();
    console.log(isNotZero.run(0));

    var largeTest = new IntCodeParser([3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
        1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
        999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99],'large test');

    console.log(largeTest.run(2));
    largeTest.revertStateToInitial();
    console.log(largeTest.run(8));
    largeTest.revertStateToInitial();
    console.log(largeTest.run(500));

}
//runTests_P2();

var part2 = new IntCodeParser([...input], 'D5 p2');
console.log(part2.run(5));


