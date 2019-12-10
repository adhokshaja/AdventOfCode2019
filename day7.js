/*
 * --- Day 7: Amplification Circuit ---
 * https://adventofcode.com/2019/day/7
 * Amplifers A, B, C, D and E are chained. Such that input to an Amp is the output of the preceding stage
 * A --> B --> C --> C --> D --> E
 * Input to Amp A is always 0, Output of Amp E is the output of the system
 * Each Amp has the same "Software Program"(IntCode)
 * Each Amp has a phase setting in the range 0..4, with each amp having a unique setting.
 * The first input to an Amp program is the phase setting, the second input is the output of the preceding stage
 * Find the phase settings, that return the largest output 
 */

const fs = require('fs');
const input = fs.readFileSync("./inputs/day7.txt", (_, a) => a).toString().split(",").map(i => parseInt(i));

const { IntCodeParser } = require('./IntcodeParser');
const { PermutationGen } = require('./PermutationsGenerator');
const debug = false;
/**
 * 
 * @param {IntCodeParser} amp Amplifier Program
 * @param {Number} phaseSetting Phase Setting for the Amplifier
 * @param {Number} input Input to the Amplifier
 * @param {Number} input Input to the Amplifier
 */
const getAmpOutput = (amp, input) => {
    let o = [];
    //If not reset, we don't need to pass in the phase setting again,
    // We are continuing the same program from a paused state
    o = amp.run([input], debug);
    if(debug){
        console.log(o);
    }
    return o[0];
}


/**
 * Reset the amplifiers and Set Phase each
 * @param {{Amp_A:IntCodeParser, Amp_B:IntCodeParser, Amp_C:IntCodeParser, Amp_D:IntCodeParser, Amp_E:IntCodeParser}}} param0
 * @param {[Number,Number,Number,Number,Number]} param1
 */
function ResetAmplifierCircuit({ Amp_A, Amp_B, Amp_C, Amp_D, Amp_E }, [pa,pb,pc,pd,pe]) {

    Amp_A.revertStateToInitial();
    Amp_A.run([pa], false);

    Amp_B.revertStateToInitial();
    Amp_B.run([pb], false);

    Amp_C.revertStateToInitial();
    Amp_C.run([pc], false);

    Amp_D.revertStateToInitial();
    Amp_D.run([pd], false);

    Amp_E.revertStateToInitial();
    Amp_E.run([pe], false);

    if(debug){
        console.log(`Amplifiers Reset to Phase ${arguments[1].join(',')}`);
    }

}



/**
 * Runs the Amplifier Circuit once and returns the results
 * @param {{Amp_A:IntCodeParser, Amp_B:IntCodeParser, Amp_C:IntCodeParser, Amp_D:IntCodeParser, Amp_E:IntCodeParser}}} param0
 * @param {Number} in_a 
 * @param {Boolean} reset 
 */
function RunAmplifierCircuitOnce({ Amp_A, Amp_B, Amp_C, Amp_D, Amp_E }, in_a = 0) {
    if(debug){
        console.log(`Running Amplifier Circuit for input ${in_a}`)
    }
    const out_a = getAmpOutput(Amp_A, in_a);
    const out_b = getAmpOutput(Amp_B, out_a);
    const out_c = getAmpOutput(Amp_C, out_b);
    const out_d = getAmpOutput(Amp_D, out_c);
    const out_e = getAmpOutput(Amp_E, out_d);
    return out_e;
}

/**
 * Creates and Runs the Amplifier Circuit w or w/o feedback
 * @param {[Number]} program IntCode Software Program
 * @param {[Number, Number, Number, Number]} phaseRange Phase Setting numbers
 * @param {Boolean} feedback Is feedback included in the loop
 */
function run(program, phaseRange = [0, 1, 2, 3, 4], feedback = false) {

    const outputs = [];

    //Initialize Amplifiers
    const Amplifiers = {
        Amp_A : new IntCodeParser([...program], "Amp A"),
        Amp_B : new IntCodeParser([...program], "Amp B"),
        Amp_C : new IntCodeParser([...program], "Amp C"),
        Amp_D : new IntCodeParser([...program], "Amp D"),
        Amp_E : new IntCodeParser([...program], "Amp E")
    }
    

    let phasePermutations = PermutationGen(phaseRange);

    for (let phaseSetting of phasePermutations) {
        //console.log(phaseSetting.join(','));
        let i = 1;
        if (debug) {
            console.log(`Run ${i} for ${phaseSetting.join(',')}`);
        }
        // Reset the Amplifier Circuit with the new Phase Settings
        ResetAmplifierCircuit(Amplifiers, phaseSetting);

        // Run the Circuit Once to get the output
        let ampOutput = RunAmplifierCircuitOnce(Amplifiers, 0);

        if (!feedback) {
            // if there is no feedback, we are done
            outputs.push({
                phaseSetting: phaseSetting.join(','),
                systemOutput: ampOutput
            });
        } 
        
        else {
            let last_out = ampOutput;
            if (debug) { console.log(ampOutput); }
            while (ampOutput) {
                i++;
                if (debug) { console.log(`Run ${i} for ${phaseSetting.join(',')}`); }
                last_out = ampOutput;
                ampOutput = RunAmplifierCircuitOnce(Amplifiers, last_out);
            }

            outputs.push({
                phaseSetting: phaseSetting.join(','),
                systemOutput: last_out
            });
        }
    }

    var maxOutput = outputs.reduce((acc, curr) => {
        if (acc.systemOutput < curr.systemOutput) {
            return curr;
        }
        return acc;
    }, { phaseSetting: "", systemOutput: 0 });

    console.log(maxOutput);
    return maxOutput;
}

const tests_part1 = () => {
     run([3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0]); // 43210 => 4,3,2,1,0

     run([3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23,
         101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0]); //54321 => 0,1,2,3,4

    run([3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33,
        1002, 33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0]); // 65210 => 1,0,4,3,2
};
//tests_part1();

const part1_out = run(input);

const tests_part2 = () => {
    run([3, 26, 1001, 26, -4, 26, 3, 27, 1002, 27, 2, 27, 1, 27, 26,
        27, 4, 27, 1001, 28, -1, 28, 1005, 28, 6, 99, 0, 0, 5], [5, 6, 7, 8, 9], true); //139629729 => 9,8,7,6,5

    run([3, 52, 1001, 52, -5, 52, 3, 53, 1, 52, 56, 54, 1007, 54, 5, 55, 1005, 55, 26, 1001, 54,
        -5, 54, 1105, 1, 12, 1, 53, 54, 53, 1008, 54, 0, 55, 1001, 55, 1, 55, 2, 53, 55, 53, 4,
        53, 1001, 56, -1, 56, 1005, 56, 6, 99, 0, 0, 0, 0, 10], [5, 6, 7, 8, 9], true); // 18216 => 9,7,8,5,6
}

//tests_part2();

const part2_out = run(input, [5, 6, 7, 8, 9], true);


