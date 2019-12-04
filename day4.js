/**
 * --- Day 4: Secure Container ---
 * https://adventofcode.com/2019/day/4
 * Find the number of valid passwords. The password has the following characterstics
    * It is a six-digit number.
    * The value is within the range given in your puzzle input.
    * Two adjacent digits are the same (like 22 in 122345).
    * Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
 */

 /**
  * Inputs
  */
let lowerBound = 165432,
    upperBound = 707912;


/**
 * Returns if a password is valid of not
 * @param {number} passowrd 
 */
function isPassowrdValid(pwd) {

    if (isNaN(pwd)) {
        // console.log("nan")
        return false; // not number
    }
    if (pwd < lowerBound || pwd > upperBound) {
        // console.log('outofBounds')
        return false; // not in range
    }
    pwd = "" + pwd; //convert to string;

    if (pwd.length != 6) {
        // console.log('Incorrect length')
        return false; // not six digits long
    }

    if (!pwd.match(/\d{0,4}(\d)\1\d{0,4}/g)) {
        // Regex: (\d)\1  -- A digit followed by the same digit. Capture group 1, repeat group 1
        // console.log('No repeats')
        return false; // doesn't have repeated numbers
    }

    if (!(pwd[0] <= pwd[1] && pwd[1] <= pwd[2] && pwd[2] <= pwd[3] && pwd[3] <= pwd[4] && pwd[4] <= pwd[5])) {
        //console.log('order mismatch')
        return false; //  has decreasing order left to right
    }

    return true;
}

function runTests1() {
    var t1 = lowerBound,
    t2 = upperBound;

    lowerBound = 0;
    upperBound = 999999;

    console.log(isPassowrdValid(111111)); //true
    console.log(isPassowrdValid(223450)); // false
    console.log(isPassowrdValid(123789)); // false

    lowerBound = t1;
    upperBound = t2;
}

//runTests1();

let validPasswords = [];
for(let i = lowerBound; i<=upperBound; i++){
    if(isPassowrdValid(i))
       validPasswords.push(i);
}
console.log("Part 1",validPasswords.length);


/**
 * The two adjacent matching digits are not part of a larger group of matching digits.
 * @param {Number} pwd Password
 */
function extraPasswordValidation (pwd){
    if(!isPassowrdValid(pwd))
        return false;
    pwd = "" + pwd; 
    //Get all groups with same adjecent numbers, filters ones that have a length 2
    const matches = pwd.match(/(\d)\1{1,}/g).filter(i => i.length <= 2);
    // NOTE: (\d)\1{1,} matches digits repeated multiple times continuously eg:  11, 555 ,6666
    
    if (matches.length <= 0) // There is atleast 1 number that is repeated twice
        return false;
    return true;
}

function runTests2() {
    var t1 = lowerBound,
        t2 = upperBound;

    lowerBound = 0;
    upperBound = 999999;

    console.log(extraPasswordValidation(112233)); //true
    console.log(extraPasswordValidation(123444));//false
    console.log(extraPasswordValidation(111122));//true

    upperBound = t2;
    lowerBound = t1;

}
//runTests2();

let extraValidPasswords = [];
for (let p of validPasswords) {
    if (extraPasswordValidation(p))
        extraValidPasswords.push(p);
}
console.log("Part 2", extraValidPasswords.length);

