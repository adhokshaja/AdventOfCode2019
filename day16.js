/*
 * Day 16: Flawed Frequency Transmission
 * https://adventofcode.com/2019/day/16
*/


const debug = false;

const fs = require('fs');
const input = fs.readFileSync("./inputs/day16.txt", (_, a) => a).toString().trim();


const phaseCalc = (inputNums) => {
    const phaseOutput = [];
    //Once per phase
    for (let i = 0; i < inputNums.length; i++) {
        //i is the element index of the output;
        // only start on the index because all numbers before this will be set to zero
        let j = i;
        // For every chunk of i+1 numbers 
        // first chunk is multiplied by 1, next by 0, then by -1 then by 0 again and so on.
        // Then each chunk is added to get the i-th number in phase output
        const chunkSize = (i + 1);
        let sum = 0;

        // We can skip alternating chunks and the remaining chunks can be multiplied by 1 and -1 alternatingly.
        let multiplier = 1;

        while (j < inputNums.length) {
            const chunk = inputNums.slice(j, j + chunkSize);
            if (debug) { console.log(chunk); }
            j += chunkSize; // advance by this chunk's size;

            const chunkSum = chunk.reduce((a, b) => a + b, 0);

            sum += chunkSum * multiplier;
            multiplier = multiplier * -1; // flip the multiplier

            j += chunkSize; // skip next chunkas it will be zeros
        }
        phaseOutput[i] = Math.abs(sum) % 10; // since only the 1s digit is needed
    }

    return phaseOutput;
}


const phaseClacP2 = (inputNums) =>{
     //For part 2, we are using only the last part of the input, ()
     // which means everything will be an addition - Hint from reddit
     // if it was an 8 element array - original array = arr, output array = op
        // op[8] =  (arr[8]+0)%10
        // op[7] =  (arr[8]+ arr[7])%10 = (op[8]+arr[7])%10
        // op[6] = (arr[8]+arr[7]+arr[6])%10 = (op[7]+arr[6])%10
        // op[5] = (arr[5]+op[6])%10;
    const phaseOutput = [];
    phaseOutput[inputNums.length] =0;
    for (let i = inputNums.length -1; i>=0; i--){
        phaseOutput[i] = (inputNums[i] + phaseOutput[i+1])%10;
    }
    phaseOutput.splice(-1,0); //remove last element we added to the array
    return phaseOutput;
}

const runPhases = (signal, numRuns = 1, part1 = true) => {
    let currRun = 1;
    let nextRunInput = [...signal].map(Number);
    while (currRun++ <= numRuns) {
        if (part1) {
            nextRunInput = phaseCalc(nextRunInput);
        }
       else{
            nextRunInput = phaseClacP2(nextRunInput);
       }

    }
    return nextRunInput.join('');
}

const p1_tests = () => {
    const t1_in = "12345678"
    const t1_p1 = runPhases(t1_in);
    console.log(t1_p1); // 48226158
    const t1_p4 = runPhases(t1_in, 4);
    console.log(t1_p4); // 01029498

    const t2_in = "80871224585914546619083218645595";
    const t2_p100 = runPhases(t2_in, 100);
    console.log(t2_p100.slice(0, 8)); //24176176
}

//p1_tests();

const part1 = runPhases(input,100);
console.log('Part 1 :', part1.slice(0,8));

//Part 2

const p2 = (signal) => {
    // num repeats = 10000
    const signalRepeated = signal.repeat(10000);
    const offset = Number(signalRepeated.slice(0, 7));
    // we only need to consider the numbers after the offset for any phases,
    // since the contribution of the prior numbers to the FFT phase calc is zero
    const messageSignal = signalRepeated.slice(offset);
    // console.log(messageSignal.length);
    p2_ans = runPhases(messageSignal,100,false);
   return p2_ans.slice(0, 8);
}
const part2 = p2(input);
console.log("Part 2",part2);