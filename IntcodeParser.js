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
    constructor([...state], name= "IntCode Parser") {
        this.state = state;
        this.name = name;
        this.initialState = [...state];
        this.readHead = 0;
        this.relativeBase = 0;
    }

    revertStateToInitial() {
        this.state = [...this.initialState];
        this.readHead = 0;
        this.relativeBase = 0;
    }

    /**
     * Returns a copy of the current state
     */
    getState() {
        return [...this.state];
    }

    /**
     * Gets the value from a param based on Instruction mode. If the value is un initialize it returns zero
     * @param {Number} param Param read from the state
     * @param {string} mode Read mode : 0 = Positional, 1 = Immediate, 2= Relative Mode
     * 
     */
    getParamValueFromState(param, mode = "0") {
        let value = 0;
        if (mode === '1') {
            // Immediate
            return param;
        } else if (mode === '2') {
            //Positional
            value = this.state[param + ralativeBase];
        }
        else {
            // Relative
            value = this.state[param];
        }

        if (typeof (value) === "undefined") {
            // return a value of zero if undefined
            value = 0;
        }
        return value;
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
     * @param {String} op Operation to be performed - add, mul, sub, div, mod
     *  eq : equal to, lt :less than, gt:greater than, lte, gte
     */
    arithLogicOps(opcode, op) {

        const param1 = this.state[this.readHead + 1];
        const param2 = this.state[this.readHead + 2];
        const param3 = this.state[this.readHead + 3];

        opcode = ("" + opcode).padStart(5, '0');
        if (opcode[0] != '0') {
            console.log(opcode);
            console.error('Trying to write positionally');
        }

        const input1 = this.getParamValueFromState(param1, opcode[2]),
            input2 = this.getParamValueFromState(param2, opcode[1]);
        let resultValue = 0;

        switch (op) {
            case 'add': resultValue = input1 + input2; break;
            case 'sub': resultValue = input1 - input2; break;
            case 'mul': resultValue = input1 * input2; break;
            case 'div': resultValue = input1 / input2; break;
            case 'mod': resultValue = input1 % input2; break;
            case 'lt': resultValue = input1 < input2 ? 1 : 0; break;
            case 'gt': resultValue = input1 > input2 ? 1 : 0; break;
            case 'lte': resultValue = input1 <= input2 ? 1 : 0; break;
            case 'gte': resultValue = input1 >= input2 ? 1 : 0; break;
            case 'eq': resultValue = input1 === input2 ? 1 : 0; break;
            default: break;
        }

        this.writeParamValueToState(param3, resultValue);
        this.readHead = this.readHead + 4;
        return;
    }



    /**
     * Gets an Input value and writes it to destination
     * *opcode 3*
     * @param {Number} opcode 
     * @param {Number} value  - Number to be writted
     */
    write(opcode, value) {
        const param = this.state[this.readHead+1];
        opcode = ("" + opcode).padStart(3, '0');
        if (opcode.slice(-2) != "03") {
            console.error('Wrong operation save input');
            return;
        }
        this.writeParamValueToState(param, value);
        this.readHead = this.readHead+2;
        return;
    }

    /**
     * Reads an value from state and returns it
     * *opcode 4*
     * @param {Number} opcode
     */
    read(opcode) {
        const param = this.state[this.readHead + 1];
        opcode = ("" + opcode).padStart(3, '0');
        if (opcode.slice(-2) != "04") {
            console.error('Wrong operation Read');
            return;
        }
        const readValue = this.getParamValueFromState(param, opcode[0]);
        this.readHead = this.readHead + 2;
        return { value: readValue };
    }


    /**
     * If the first parameter is (cond = true:non-zero / cond = false:zero) ,
        *it sets the read head to the value from the second parameter.
     * Else it set read head pointer to next location
     * *opcode 5 6*
     * @param {Number} opcode
     * @param {Boolean} condition Contition to check fro 
     */
    jumpOnCondition(opcode, condition) {
        opcode = ("" + opcode).padStart(4, '0');
        const param1 = this.state[this.readHead + 1];
        const param2 = this.state[this.readHead + 2];
        const input1 = this.getParamValueFromState(param1, opcode[1]),
            input2 = this.getParamValueFromState(param2, opcode[0]);
        let conditionValidity = false;
        if(condition){
            conditionValidity = input1 !== 0;
        }else{
            conditionValidity = input1 === 0
        }
        this.readHead = (conditionValidity ? input2 : this.readHead + 3);
        return;
    }

    updateRelativeBase(opcode){
        const param = this.state[this.readHead + 1];
        opcode = ("" + opcode).padStart(3, '0');
        if (opcode.slice(-2) != "09") {
            console.error('Wrong operation Update Rel Base');
            return;
        }
        const input = this.getParamValueFromState(param, opcode[0]);
        this.relativeBase = this.relativeBase + input;
        this.readHead = this.readHead + 2;
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
            //console.log(this.readHead,opcode)
            switch (("" + opcode).padStart(2, '0').slice(-2)) {
                case '01':
                    // Add
                    this.arithLogicOps(opcode, 'add');
                    break;
                case '02':
                    // Multiply
                    this.arithLogicOps(opcode, 'mul');
                    break;
                case '03':
                    if (inputHead >= input.length) {
                        if (debug) {
                            console.error(`Waiting for input, pasused at readHead: ${this.readHead}`);
                        }
                        return outputs; 
                    }
                    var currInput = input[inputHead++]-0; // cast to Number
                    this.write(opcode, currInput);
                    break;
                case '04':
                    let res = this.read(opcode);
                    outputs.push(res.value);
                    break;
                case '05': // Jump True
                    this.jumpOnCondition(opcode, true);
                    break;
                case '06': // Jump False
                    this.jumpOnCondition(opcode, false);
                    break;
                case '07':
                    //Less than
                    this.arithLogicOps(opcode, 'lt');
                    break;
                case '08':
                    //Equal
                    this.arithLogicOps(opcode, 'eq');
                    break;
                case '09':
                    this.updateRelativeBase(opcode);
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