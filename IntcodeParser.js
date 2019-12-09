/**
 * Parses Int code
 * - Opcode descriptions
 *  - 01 :  Add
 *  - 02 :  Multiply
 *  - 03 :  Read
 *  - 04 :  Write
 *  - 05 :  Jump If True
 *  - 06 :  Jump If False
 *  - 07 :  Less Than
 *  - 08 :  Equal To
 * - Parameter Modes
 *  - parameter mode 0, position mode - Read from position/ write to position
 *  - parameter mode 1, immediate mode, Read the exact value
 *  - Each read operation could be either a immediate mode or in position mode.
 */
class IntCodeParser {

    //state = [];

    /**
     * @param {[Number]} param0 Starting state of the machine
     * @param {string}  Name Name for the parser
     */
    constructor([...state], name= "Int code Parser") {
        this.state = state;
        this.name = name;
        this.initialState = [...state];
        this.readHead = 0;
    }

    revertStateToInitial() {
        this.state = [...this.initialState];
        this.readHead = 0;
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
     * Performs Artitmetic and Logical Operations
     * *opcode 1, 2, 7, 8*
     * @param {*} opcode Operation string with read modes
     * @param {Number} param1
     * @param {Number} param2
     * @param {Number} param3
     * @param {Number} readHead Current position of the readhead
     * @param {String} op Operation to be performed - add, mul, sub, div, mod
     *  eq : equal to, lt :less than, gt:greater than, lte, gte
     */
    arithLogicOps(opcode, param1, param2, param3, readHead, op){
        opcode = ("" + opcode).padStart(5, '0');
        if (opcode[0] != '0') {
            console.log(opcode);
            console.error('Trying to write positionally2')
        }

        const input1 = this.getParamValueFromState(param1, opcode[2]),
            input2 = this.getParamValueFromState(param2, opcode[1]);
        let resultValue = 0;
        
        switch(op){
            case 'add': resultValue = input1 + input2; break;
            case 'sub': resultValue = input1 - input2; break;
            case 'mul': resultValue = input1 * input2; break;
            case 'div': resultValue = input1 / input2; break;
            case 'mod': resultValue = input1 % input2; break;
            case 'lt': resultValue = input1 < input2 ? 1: 0; break;
            case 'gt': resultValue = input1 > input2 ? 1 : 0; break;
            case 'lte': resultValue = input1 <= input2 ? 1 : 0; break;
            case 'gte': resultValue = input1 >= input2 ? 1 : 0; break;
            case 'eq': resultValue = input1 === input2 ? 1 : 0; break;
            default : break;
        }

        this.writeParamValueToState(param3, resultValue);
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
    write(opcode, param, value, readHead) {
        opcode = ("" + opcode).padStart(3, '0');
        if (opcode.slice(-2) != "03") {
            console.error('Wrong operation save input');
            return;
        }
        this.writeParamValueToState(param, value);

        return { next: readHead + 2 };
    }

    /**
     * Reads an value from state and returns it
     * *opcode 4*
     * @param {Number} opcode
     * @param {Number} param
     * @param {Number} readHead Current position of the readhead
     */
    read(opcode, param, readHead) {
        opcode = ("" + opcode).padStart(3, '0');
        if (opcode.slice(-2) != "04") {
            console.error('Wrong operation Read');
            return;
        }
        const readValue = this.getParamValueFromState(param, opcode[0]);
        return { next: readHead + 2, value: readValue };
    }


    /**
     * If the first parameter is (cond = true:non-zero / cond = false:zero) ,
        *it sets the read head to the value from the second parameter.
     * Else it set read head pointer to next location
     * *opcode 5 6*
     * @param {Number} opcode
     * @param {Number} param1 
     * @param {Number} param2
     * @param {Number} readHead Current position of the readhead
     * @param {Boolean} condition Contition to check fro 
     */
    jumpOnCondition(opcode, param1, param2, readHead, condition) {
        opcode = ("" + opcode).padStart(4, '0');
        
        const input1 = this.getParamValueFromState(param1, opcode[1]),
            input2 = this.getParamValueFromState(param2, opcode[0]);
        let conditionValidity = false;
        if(condition){
            conditionValidity = input1 !== 0;
        }else{
            conditionValidity = input1 === 0
        }
        return { next: (conditionValidity ? input2 : readHead + 3) };
    }





    /**
     * 
     * @param {Number} input to the program
     */
    run([...input], debug= false) {
        let inputHead = 0;
        var outputs = [];
        if(debug){
            if(this.readHead === 0){
                console.log(`Running ${this.name} for input ${input}`);
            }else{
                console.log(`Continuing ${this.name} from ${this.readHead} for input ${input}`)
            }
        }
        while (this.readHead <= this.state.length) {
            let opcode = this.state[this.readHead]
            let res = {};
            //console.log(this.readHead,opcode)
            switch (("" + opcode).padStart(2, '0').slice(-2)) {
                case '01':
                    // Add
                    res = this.arithLogicOps(opcode, this.state[this.readHead + 1], this.state[this.readHead + 2], this.state[this.readHead + 3], this.readHead,'add');
                    this.readHead = res.next;
                    break;
                case '02':
                    // Multiply
                    res = this.arithLogicOps(opcode, this.state[this.readHead + 1], this.state[this.readHead + 2], this.state[this.readHead + 3], this.readHead,'mul');
                    this.readHead = res.next;
                    break;
                case '03':
                    if (inputHead >= input.length) {
                        if (debug) {
                            console.error(`Waiting for input, pasused at readHead: ${this.readHead}`);
                        }
                        return outputs; 
                    }
                    var currInput = input[inputHead++]-0; // cast to Number
                    res = this.write(opcode, this.state[this.readHead + 1], currInput, this.readHead);
                    this.readHead = res.next;
                    break;
                case '04':
                    res = this.read(opcode, this.state[this.readHead + 1], this.readHead);
                    outputs.push(res.value);
                    this.readHead = res.next;
                    break;
                case '05': // Jump True
                    res = this.jumpOnCondition(opcode, this.state[this.readHead + 1], this.state[this.readHead + 2], this.readHead,true);
                    this.readHead = res.next;
                    break;
                case '06': // Jump False
                    res = this.jumpOnCondition(opcode, this.state[this.readHead + 1], this.state[this.readHead + 2], this.readHead,false);
                    this.readHead = res.next;
                    break;
                case '07':
                    //Less than
                    res = this.arithLogicOps(opcode, this.state[this.readHead + 1], this.state[this.readHead + 2], this.state[this.readHead + 3], this.readHead,'lt');
                    this.readHead = res.next;
                    break;
                case '08':
                    //Equal
                    res = this.arithLogicOps(opcode, this.state[this.readHead + 1], this.state[this.readHead + 2], this.state[this.readHead + 3], this.readHead,'eq');
                    this.readHead = res.next;
                    break;
                case '99':
                    //Halt
                    this.readHead = this.readHead++;
                    return outputs;
                default:
                    console.error(`Unknown code ${opcode} at ${this.readHead}`);
                    return outputs;
            }
        }
        console.error("Halt not encountered")
        return outputs;
    }

}
exports.IntCodeParser = IntCodeParser;
//module.exports(IntCodeParser);