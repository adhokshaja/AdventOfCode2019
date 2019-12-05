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

/**
 * Input value
 */
const input = fs.readFileSync("./inputs/day5.txt", (_, a) => a).toString().split(",").map(i => parseInt(i));

//console.log(input);

class IntCodeParser {

    //state = [];

    /**
     * @param {[Number]} param0 Starting state of the machine
     */
    constructor([...state]) {
        this.state = state;
        this.initialState = [...state];
    }

    revertStateToInitial(){
        this.state = [...this.initialState];
    }

    /**
     * Returns a copy of the current state
     */
    getState() {
        return [...this.state];
    }

    /**
     * 
     * @param {Number} param Param read from the state
     * @param {string} mode Read mode : 0 = Positional, 1 = Immediate
     */
    getParamValueFromState(param, mode = "0") {
        if (mode === '1') {
            return param;
        }
        else {
            return this.state[param];
        }
    }
    /**
     * 
     * @param {Number} index Write Location index
     * @param {Number} value Value to insert
     */
    writeParamValueToState(index, value) {
        // Write is never in immediate mode
        this.state[index] = value;
    }

    /**
     * Performs the Add instruction
     * *opcode 1*
     * @param {*} opcode Operation string with read modes
     * @param {Number} param1
     * @param {Number} param2
     * @param {Number} param3
     * @param {Number} readHead Current position of the readhead
     */
    add(opcode, param1, param2, param3, readHead) {
        opcode = ("" + opcode).padStart(5, '0');
        if (opcode.slice(-2) !== '01') {
            console.error('Wrong operation add');
            return;
        }

        if (opcode[0] != '0') {
            console.log(opcode);
            console.error('Trying to write positionally2')
        }

        const input1 = this.getParamValueFromState(param1, opcode[2]),
            input2 = this.getParamValueFromState(param2, opcode[1]);
        this.writeParamValueToState(param3, input1 + input2);
        return {next:readHead+4};
    }

    /**
     * Performs the Multiply instruction
     * *opcode 2*
     * @param {Number} opcode Operation string with read modes
     * @param {number} param1 
     * @param {number} param2 
     * @param {number} param3 
     * @param {Number} readHead Current position of the readhead
     */
    mul(opcode, param1, param2, param3, readHead) {
        opcode = ("" + opcode).padStart(5, '0');
        if (opcode.slice(-2) !== '02') {
            console.error('Wrong operation Multiply');
            return;
        }

        if (opcode[0] != '0') {
            console.log(opcode);
            console.error('Trying to write positionally')
        }

        const input1 = this.getParamValueFromState(param1, opcode[2]),
            input2 = this.getParamValueFromState(param2, opcode[1]);
        this.writeParamValueToState(param3, input1 * input2);

        return { next: readHead + 4 };
    }


    /**
* If the first parameter is less than the second parameter, 
* it stores 1 in the position given by the third parameter.
* Else it stores 0 in the position given by the third parameter.
* *opcode 7*
* @param {Number} opcode
* @param {Number} param1 
* @param {Number} param2
* @param {Number} param3
* @param {Number} readHead Current position of the readhead
*/
    lessThan(opcode, param1, param2, param3, readHead) {
        opcode = ("" + opcode).padStart(5, '0');
        if (opcode.slice(-2) != "07") {
            console.error('Wrong operation Jump True');
            return;
        }
        if (opcode[0] != '0') {
            console.error('Trying to write positionally')
        }

        const input1 = this.getParamValueFromState(param1, opcode[2]),
            input2 = this.getParamValueFromState(param2, opcode[1]);
        this.writeParamValueToState(param3, input1 < input2 ? 1 : 0);

        return { next: readHead + 4 };
    }


    /**
    * If the first parameter is less than the second parameter, 
    * it stores 1 in the position given by the third parameter.
    * Else it stores 0 in the position given by the third parameter.
    * *opcode 8*
    * @param {Number} opcode
    * @param {Number} param1 
    * @param {Number} param2
    * @param {Number} param3
    * @param {Number} readHead Current position of the readhead
    */
    equalTo(opcode, param1, param2, param3, readHead) {
        opcode = ("" + opcode).padStart(5, '0');
        if (opcode.slice(-2) != "08") {
            console.error('Wrong operation Jump True');
            return;
        }
        if (opcode[0] != '0') {
            console.error('Trying to write positionally')
        }

        const input1 = this.getParamValueFromState(param1, opcode[2]),
            input2 = this.getParamValueFromState(param2, opcode[1]);
        this.writeParamValueToState(param3, input1 === input2 ? 1 : 0);

        return { next: readHead + 4 };
    }



    /**
     * Gets an Input value and writes it to destination
     * *opcode 3*
     * @param {Number} opcode 
     * @param {Number} param
     * @param {Number} value  - Number to be writted
     * @param {Number} readHead Current position of the readhead
     */
    write(opcode, param, value, readHead){
        opcode = (""+opcode).padStart(3,'0');
        if(opcode.slice(-2) != "03"){
            console.error('Wrong operation save input');
            return;
        }
        this.writeParamValueToState(param,value);
        
        return { next: readHead + 2 };
    }

    /**
     * Reads an value from state and returns it
     * *opcode 4*
     * @param {Number} opcode
     * @param {Number} param
     * @param {Number} readHead Current position of the readhead
     */
    read(opcode,param, readHead){
        opcode = ("" + opcode).padStart(3, '0');
        if (opcode.slice(-2) != "04") {
            console.error('Wrong operation Read');
            return;
        }
        const readValue = this.getParamValueFromState(param,opcode[0]);
        return { next: readHead + 2, value: readValue}; 
    }

    /**
     * If the first parameter is non-zero, 
        *it sets the read head to the value from the second parameter.
     * Else it set read head pointer to next location
     * *opcode 5*
     * @param {Number} opcode
     * @param {Number} param1 
     * @param {Number} param2
     * @param {Number} readHead Current position of the readhead
     */
    jumpIfTrue(opcode, param1, param2, readHead) {
        opcode = ("" + opcode).padStart(4, '0');
        if (opcode.slice(-2) != "05") {
            console.error('Wrong operation Jump True');
            return;
        }
        const input1 = this.getParamValueFromState(param1, opcode[1]),
            input2 = this.getParamValueFromState(param2, opcode[0]);
        return { next: (input1 !== 0 ? input2 : readHead+3)};
    }

    /**
    * If the first parameter is zero, 
    * it sets the read head to the value from the second parameter.
    * Else set read head pointer to next location
    * *opcode 6*
    * @param {Number} opcode
    * @param {Number} param1 
    * @param {Number} param2
    * @param {Number} readHead Current position of the readhead
    */
    jumpIfFalse(opcode, param1, param2, readHead) {
        opcode = ("" + opcode).padStart(4, '0');
        if (opcode.slice(-2) != "06") {
            console.error('Wrong operation Jump True');
            return;
        }

        const input1 = this.getParamValueFromState(param1, opcode[1]),
            input2 = this.getParamValueFromState(param2, opcode[0]);
        return { next: (input1 === 0 ? input2 : readHead + 3) };
    }




    /**
     * 
     * @param {Number} input to the program
     */
    run(input){
        let readHead = 0;
        var outputs = [];
        console.log(`Running for input ${input}`);

        while(readHead <=this.state.length){
            let opcode = this.state[readHead]
            let res = {};
            //console.log(readHead,opcode)
            switch(opcode%10){
                case 1:
                   res = this.add(opcode,this.state[readHead+1],this.state[readHead+2],this.state[readHead+3], readHead);
                    readHead = res.next;
                    break;
                case 2: 
                
                    res = this.mul(opcode, this.state[readHead + 1], this.state[readHead + 2], this.state[readHead + 3], readHead);
                    readHead = res.next;
                    break;
                case 3:
                    res = this.write(opcode, this.state[readHead + 1], input, readHead);
                    readHead = res.next;
                    break;
                case 4:
                    res = this.read(opcode, this.state[readHead + 1], readHead);
                    outputs.push(res.value);
                    readHead = res.next;
                    break;
                case 5:
                    res = this.jumpIfTrue(opcode, this.state[readHead + 1], this.state[readHead + 2], readHead);
                    readHead = res.next;
                    break;
                case 6:
                    res = this.jumpIfFalse(opcode, this.state[readHead + 1], this.state[readHead + 2], readHead);
                    readHead = res.next;
                    break;
                case 7:
                    res = this.lessThan(opcode, this.state[readHead + 1], this.state[readHead + 2], this.state[readHead + 3], readHead);
                    readHead = res.next;
                    break;
                case 8:
                    res = this.equalTo(opcode, this.state[readHead + 1], this.state[readHead + 2], this.state[readHead + 3], readHead);
                    readHead = res.next;
                    break;
                case 9:  //99
                    return outputs;
                default:
                    console.error(`Unknown code ${opcode} at ${readHead}`);
                    return outputs;
            }
        }
        console.error("Halt not encountered")
        return outputs;
    }

}

const runTests_P1 = () => {


    var helloWorld = new IntCodeParser([3, 0, 4, 0, 99]);
    console.log(helloWorld.run(5));


    var multiplyBy2 = new IntCodeParser([3, 0, 1002, 0, 2, 0, 4, 0, 99]);
    console.log(multiplyBy2.run(2));


    var add12 = new IntCodeParser([3, 0, 1001, 0, 12, 0, 4, 0, 99]);
    console.log(add12.run(1));


    var add4Mult10 = new IntCodeParser([3, 20, 1001, 20, 4, 21, 1002, 20, 20, 22, 4, 21, 4, 22, 99]);
    console.log(add4Mult10.run(5));

}

//runTests_P1()

var part1 = new IntCodeParser([...input]);
//console.log(disgnosticsProgram.run(1));


const runTests_P2 = () =>{

    var isNotZero = new IntCodeParser([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9]);
    console.log(isNotZero.run(1));
    isNotZero.revertStateToInitial();
    console.log(isNotZero.run(0));

    var largeTest = new IntCodeParser([3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
        1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
        999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99]);

    console.log(largeTest.run(2));
    largeTest.revertStateToInitial();
    console.log(largeTest.run(8));
    largeTest.revertStateToInitial();
    console.log(largeTest.run(500));

}
//runTests_P2();

var part2 = new IntCodeParser([...input]);
console.log(part2.run(5));


