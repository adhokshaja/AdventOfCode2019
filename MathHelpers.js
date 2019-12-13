/**
 * Finds the Greatest Common Divisor of the given array of numbers
 * @param {[Number]} param0 Input array
 */
function GCD ([n1, n2, ...others]){

    let x = Math.abs(n1),
        y = Math.abs(n2);
    while (y) {
        let temp = y;
        y = x % y;
        x = temp;
    }

    if(others.length<=0){
        return x;
    }

    return GCD([x,...others]);  
}



/**
 * Finds the Least Common Multiple of the given array of numbers
 * @param {[Number]} param0 Input array
 */
const LCM = (input) => {

    if (input.filter(x => !x).length > 0) {
        return 0;
    }
    const [n1,n2,...others] = input;
    const lcm = n1 * n2 / GCD([n1, n2]);
    if(others.length <=0){
        return lcm;
    }
    return LCM([lcm, ...others]);
}


exports.GCD = GCD;
exports.LCM = LCM;