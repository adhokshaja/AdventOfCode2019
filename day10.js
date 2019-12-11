/*
 * Day 10: Monitoring Station
 * https://adventofcode.com/2019/day/10
 * The map indicates whether each position is empty (.) or contains an asteroid (#)
 * The asteroids can be described with X,Y coordinates 
 *  where X is the distance from the left edge and Y is the distance from the top edge.
 * Top left edge is (0,0), x increases along columns, y increases along rows
 * A monitoring station can detect any asteroid to which it has direct line of sight 
 *          - that is, there cannot be another asteroid exactly between them. 
 * This line of sight can be at any angle, not just lines aligned to the grid or diagonally.
 */

const fs = require('fs');
const input = fs.readFileSync("./inputs/day10.txt", (_, a) => a).toString().trim();
const { Point } = require('./Point');

/**
 * 
 * @param {string} inp Astring Input String 
 */
const getAstroidArrayFromString = (inp) => {
    return inp.split('\n').map(l => l.split(''));
}

/**
 * Performs correct Rotation on the Angle
 * Sets **Up** as 0deg, uses 0-360 deg **clockwise**
 * @param {Number} angle Input Angle [-180,180] Clockwise
 */
function orientAngle(angle) {
    angle = angle+90;
    if(angle < 0){
        angle +=360;
    }
    return angle
}

/**
 * 
 * @param {Point} refPoint Reference Point
 * @param {[Point]} array Array of Points
 */
const RayTrace = (refPoint, array) => {
    const LOS = {};
    for (thisPoint of array) {
        if (!Point.isEqual(thisPoint, refPoint)) {
            let angle = orientAngle(Point.AngularDistance(refPoint, thisPoint));
            const dist = Point.EuclideanDistance(refPoint, thisPoint);
            LOS[`${angle}`] = LOS[`${angle}`] || [];
            LOS[`${angle}`].push({
                point: thisPoint,
                distance: dist
            });
        }
    }
    let numPoints = Object.keys(LOS).length;
    for (i in LOS) {
        if (LOS.hasOwnProperty(i)) {
            LOS[i] = LOS[i].sort((a, b) => a.distance - b.distance);
        }
    }

    return {
        point: refPoint,
        LOS,
        numPoints
    }
}

const run = (inp) => {
    //console.log(inp);
    const astroidArray = getAstroidArrayFromString(inp);

    const rows = astroidArray.length;
    const cols = astroidArray[0].length;

    const AstroidLocations = [];

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (astroidArray[y][x] === '#') {
                let thisLocation = new Point(x, y);
                AstroidLocations.push(thisLocation);
            }
        }
    }
    //console.log(AstroidLocations);
    const RayTracedLocations = AstroidLocations.map((a, _, arr) => RayTrace(a, arr));
    RayTracedLocations.sort((a,b) => b.numPoints - a.numPoints);
    
    const bestPoint = RayTracedLocations[0].point.toString();
    const bestPointObjects = RayTracedLocations[0].numPoints;
    console.log(`Best is ${bestPoint} with ${bestPointObjects} other asteroids detected`);
    return RayTracedLocations[0];
}

function tests_p1() {
    const str1 = '.#..#\n.....\n#####\n....#\n...##';
    run(str1); // 3,4 ==> 8

    const str2 = '......#.#.\n#..#.#....\n..#######.\n.#.#.###..\n.#..#.....\n..#....#.#\n#..#....#.\n.##.#..###\n##...#..#.\n.#....####';
    run(str2); // 5,8 ==> 33

    const str3 = '#.#...#.#.\n.###....#.\n.#....#...\n##.#.#.#.#\n....#.#.#.\n.##..###.#\n..#...##..\n..##....##\n......#...\n.####.###.';
    run(str3); // 1,2 ==> 35

    const str4 = '.#..##.###...#######\n##.############..##.\n.#.######.########.#\n.###.#######.####.#.\n#####.##.#.##.###.##\n..#####..#.#########\n####################\n#.####....###.#.#.##\n##.#################\n#####.##.###..####..\n..######..##.#######\n####.##.####...##..#\n.#####..#.######.###\n##...#.##########...\n#.##########.#######\n.####.#.###.###.#.##\n....##.##.###..#####\n.#.#.###########.###\n#.#.#.#####.####.###\n###.##.####.##.#..##';
    run(str4); // 11,13 ==> 210
}

//tests_p1();

const p1_location = run(input);

//Part 2
const run_p2 = (MonitoringLocation) => {
const Astroids = MonitoringLocation.LOS;
const angles = Object.keys(Astroids).sort((a, b) => parseFloat(a) - parseFloat(b));
const numAstroids = MonitoringLocation.numPoints;
const vaporizedAstroids = [];

while (vaporizedAstroids.length <= numAstroids){
    angles.forEach((angle) => {
        if (Astroids[angle].length > 0){
            const astroidVaporized = Astroids[angle].splice(0,1)[0];
            vaporizedAstroids.push({
                ...astroidVaporized,
                angle
            });
        }
    });
}
return vaporizedAstroids;
}


function test_p2 (){
    
    
    const str4 = '.#..##.###...#######\n##.############..##.\n.#.######.########.#\n.###.#######.####.#.\n#####.##.#.##.###.##\n..#####..#.#########\n####################\n#.####....###.#.#.##\n##.#################\n#####.##.###..####..\n..######..##.#######\n####.##.####...##..#\n.#####..#.######.###\n##...#.##########...\n#.##########.#######\n.####.#.###.###.#.##\n....##.##.###..#####\n.#.#.###########.###\n#.#.#.#####.####.###\n###.##.####.##.#..##';
    const loc = run(str4); // 11,13 ==> 210

    let vap = run_p2(loc);

    console.log(vap);


    // const a = ".#....#####...#..\n##...##.#####..##\n##...#...#.#####.\n..#.....X...###..\n..#.#.....#....##";
    // const loc = run(a);  // 4, 9 
    // let vap = run_p2(loc);
    // console.log(vap);

}

const vaporizedAstroids = run_p2(p1_location);

console.log(`200th Astroid Vaporized = ${vaporizedAstroids[199].point.toString()}. Answer is ${vaporizedAstroids[199].point.x * 100 + vaporizedAstroids[199].point.y}`);