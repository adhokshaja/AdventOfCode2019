/*
 * --- Day 2: 1202 Program Alarm --- 
 * https://adventofcode.com/2019/day/2
 * Part One
 * An Intcode program is a list of integers separated by commas (like 1,0,0,3,99). 
 * To run one, start by looking at the first integer (called position 0).
 * Opcode 99 means that the program is finished
 * Opcode 1 adds together numbers read from two positions and stores the result in a third position.
 * Opcode 2 works exactly like opcode 1, except it multiplies the two inputs instead of adding them.
 * Encountering an unknown opcode means something went wrong.
 * 
 * Input - https://adventofcode.com/2019/day/2/input
 */

const programInput = [1, 0, 0, 3, 1, 1, 2, 3, 1, 3, 4, 3, 1, 5, 0, 3, 2, 1, 13, 19, 1,
    9, 19, 23, 1, 6, 23, 27, 2, 27, 9, 31, 2, 6, 31, 35, 1, 5, 35, 39, 1, 10, 39, 43,
    1, 43, 13, 47, 1, 47, 9, 51, 1, 51, 9, 55, 1, 55, 9, 59, 2, 9, 59, 63, 2, 9, 63,
    67, 1, 5, 67, 71, 2, 13, 71, 75, 1, 6, 75, 79, 1, 10, 79, 83, 2, 6, 83, 87, 1,
    87, 5, 91, 1, 91, 9, 95, 1, 95, 10, 99, 2, 9, 99, 103, 1, 5, 103, 107, 1, 5,
    107, 111, 2, 111, 10, 115, 1, 6, 115, 119, 2, 10, 119, 123, 1, 6, 123, 127,
    1, 127, 5, 131, 2, 9, 131, 135, 1, 5, 135, 139, 1, 139, 10, 143, 1, 143, 2,
    147, 1, 147, 5, 0, 99, 2, 0, 14, 0];



/**
 * Performs either add or multiply operation on two inputs
 * @param {Number} in1 First Input 
 * @param {Number} in2 Second Input
 * @param {boolean} isOpAdd True if the operation is Add. False is Operation is multiply
 */
const calc = (in1,in2,isOpAdd=true) => {
    if(isOpAdd){
        return in1+in2;
    }else{
        return in1*in2;
    }
}

/**
 * Perfroms intCode Operations on the starting state and returns ending state
 * @param {[number]} input Starting State
 */
const intCode = (input, debug=true) => {
    // Make a copy of input. Treat input as immutable
    let output = [...input];
    const inputLength = output.length;

    let i = 0; // instruction pointer
    let stop = false; // a stop flag

    while (i < inputLength && !stop) {

        const opCode = output[i];
        //console.log(i, "->",opCode);
        switch (opCode) {
            case 99: 
                stop = true;
                if(debug){
                    console.info("Halt at ",i);
                }
                i = i+1;
                break;
            case 1:
            case 2: 
                let from_1 = output[i+1];
                let from_2 = output[i+2];
                let to = output[i + 3];
                if (typeof (from_1) === "undefined" || typeof (from_2) === "undefined"){
                    if (debug){ 
                        console.error("Array out of bounds");
                    }
                }
                else{
                    output[to] = calc(output[from_1],output[from_2],opCode === 1);
                }
                i = i + 4;
                break;
            default:
                stop = true;
                if (debug){
                    console.error("Unknown OpCode Encountered at ",i);
                }
                break;
        }

        //console.log(output);
    }
    return output;
}

//Tests

const perfromTests = () =>{

    /**
     * Tests if the arrays are equal
     * @param {[Number]} a Array 1
     * @param {[Number]} b Array 2
     */
    function arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.
        // Please note that calling sort on an array will modify that array.
        // you might want to clone your array first.

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    /**
     * Tests individual Calculations
     * @param {[number]} inArr Input
     * @param {[number]} outArr Expected Output
     */
    const testCalc = (inArr, outArr) => {
        let testIn = [...inArr];
        let testOut = [...outArr]; // Expected Output
        var calcOut = intCode(testIn);// Calculated Output
        console.log(calcOut);
        return arraysEqual(testOut, calcOut);
    }

let testIn,testOut;

//Test 1
testIn = [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50];
testOut = [3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50];
console.log("Test 1  Passing: ", testCalc(testIn, testOut));

//Test 2
testIn = [1, 0, 0, 0, 99];
testOut = [2, 0, 0, 0, 99];
console.log("Test 2  Passing: ", testCalc(testIn, testOut));

//Test 3
testIn = [2, 3, 0, 3, 99];
testOut = [2, 3, 0, 6, 99];
console.log("Test 3  Passing: ", testCalc(testIn, testOut));

//Test 4
testIn = [2, 4, 4, 5, 99, 0];
testOut = [2, 4, 4, 5, 99, 9801];
console.log("Test 4  Passing: ", testCalc(testIn, testOut));

//Test 5 
testIn = [1, 1, 1, 4, 99, 5, 6, 0, 99];
testOut = [30, 1, 1, 4, 2, 5, 6, 0, 99];
console.log("Test 5  Passing: ", testCalc(testIn, testOut));
};

//perfromTests();

function part1(startingState,debug=true) {
    /**
 * Before running the program, replace position 1 with the value 12 and replace position 2 with the value 2.
 */
    const modifiedProgramInput = [...startingState];
    modifiedProgramInput[1] = 12; //replace position 1 with the value 12
    modifiedProgramInput[2] = 2; // replace position 2 with the value 2

    var calcOutput = intCode(modifiedProgramInput,debug);
    console.log("Part 1 : ", calcOutput[0]);
}
// Actual Calc
//part1(programInput,false);

// PART 2

/**
 * Opcodes (like 1, 2, or 99) mark the beginning of an instruction
 * The values used immediately after an opcode, if any, are called the instruction's parameters.
 * The address of the current instruction is called the instruction pointer.
 * 
 * The value placed in address 1 is called the noun, 
 * and the value placed in address 2 is called the verb. 
 * Each of the two input values will be between 0 and 99, inclusive.
 * 
 * Once the program has halted, its output is available at address 0
 * 
 * Find the input noun and verb that cause the program to produce the output 19690720
 * What is 100 * noun + verb
 */

function part2(expectedOut, startingState, debug = false) {
    for(let n=0; n<=99; n++){
        for(let v=0; v<=99; v++){
            const modifiedProgramInput = [...startingState];
            modifiedProgramInput[1] = n; //replace position 1 with noun
            modifiedProgramInput[2] = v; // replace position 2 with verb
            const calcOutput = intCode(modifiedProgramInput,debug);
            if (calcOutput[0] == expectedOut){
                console.log("Part 2 : ", ((100 * n) + v))
                return (100 * n) + v; //100 * noun + verb
            }
        }
    }

}

part2(19690720, programInput);