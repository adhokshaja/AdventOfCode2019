/**
 * Yeilds the Permutations of the input array
 * @param {[]]} param0 
 * @param {[]]} param1 
 */
const Permutations = function* ([...a],[...m]=[]){
    if(a.length ===0){
        yield m;
    }else{
        for(let i=0; i<a.length; i++){
            const c = [...a]; // make a coopy of the current array
            const n = c.splice(i,1); // get the next element in the current array
            yield* Permutations(c,m.concat(n));
        }
    }
}

// function unitTest(a){
//     let x = Permutations(a);
//     for(let i of x){
//         console.log(i);
//     }
// }
// unitTest([]);
// unitTest([0,1]);
// unitTest([2,1,'a']);
exports.PermutationGen = Permutations;