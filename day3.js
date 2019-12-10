/*
 * --- Day 3: Crossed Wires ---
 * https://adventofcode.com/2019/day/3
 * Part One
 * Two wires are connected to a central port and extend outward on a grid.
 * The wires twist and turn, but the two wires occasionally cross paths. 
 * To fix the circuit, you need to find the intersection point closest to the central port.
 * Use Manhattan Distance for measurement.
 * While the wires do technically cross right at the central port where they both start, this point does not count, nor does a wire count as crossing with itself.
 */

const fs = require('fs');

const input = fs.readFileSync("./inputs/day3.txt", (_, a) => a).toString().split("\r\n");
const { Point } = require('./Point')
/**
 * Point Class
 */

const origin = new Point();

/**
 * Gets the complete path of the Wire from a direction trace
 * @param {String} dirTrace Direction Trace
 */
const getPathFromDir = (dirTrace) => {
    const path = [origin];
    let lastIndexUpdated = 0;
    for (let value of dirTrace.split(",")) {
        //console.log(value);
        const dir = value.slice(0, 1);
        const units = parseInt(value.slice(1));
        for (let i = 0; i < units; i++) {
           // console.log(lastIndexUpdated, path[lastIndexUpdated]);
            let nextPoint = path[lastIndexUpdated++].cloneAndMove(dir,1);
            path.push(nextPoint);
        }
        
    }
   // console.log(path);
    return path;
}

/**
 * Gets the Intersections points of two paths
 * @param {[Point]} path1
 * @param {[Point]} path2 
 */
function getIntersections(path1, path2) {
//TODO: Look for a faster approach to find the intersection
    const intersections = [];
    for (let w1 of path1) {
        for (let w2 of path2) {
            if (Point.isEqual(w1, w2)) {
                intersections.push(w1);
            }
        }
    }
    return intersections.filter(a => !Point.isEqual(a, origin));
}


/**
 * Gets the Closest Intersection and Distance from origin
 * @param {[Point]} intersections 
 */
const getClosestIntersection =  (intersections) => {
    let k = intersections.sort( (a,b) => Point.ManhattanDistance(a) - Point.ManhattanDistance(b));
    return k[0];
}


function runTests(){
    let intersections;
    intersections = getIntersections(getPathFromDir("R8,U5,L5,D3"),getPathFromDir("U7,R6,D4,L4"));
    console.log(intersections);
    console.log(getClosestIntersection(intersections));

    intersections = getIntersections(getPathFromDir("R75,D30,R83,U83,L12,D49,R71,U7,L72"), getPathFromDir("U62,R66,U55,R34,D71,R55,D58,R83"));
    console.log(intersections);
    console.log(getClosestIntersection(intersections));

    intersections = getIntersections(getPathFromDir("R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51"), getPathFromDir("U98,R91,D20,R16,D67,R40,U7,R15,U6,R7"));
    console.log(intersections);
    console.log(getClosestIntersection(intersections));
}
//runTests();


function part1() {
    const wire1 = input[0];
    const wire2 = input[1];

    const wire1Path = getPathFromDir(wire1);
    const wire2Path = getPathFromDir(wire2);
    const intersections = getIntersections(wire1Path,wire2Path);
    const closestIntersection = getClosestIntersection(intersections);
    console.log(Point.ManhattanDistance(closestIntersection));
    return {
        p1: wire1Path.map(x=>x.toString()),
        p2: wire2Path.map(x => x.toString()),
        i: intersections.map(x => x.toString())
    }
}

const { p1, p2, i} =  part1();

/**
 * Gets the Intersection point reached the fastest. Pass the points array as strings
 * @param {[String]} path1  String path 
 * @param {[String]} path2  String path 
 * @param {{String}} intersections An Array of intersection PointsStrings
 */
const getFastestIntersection = (path1,path2,intersections) => {
    var intersectionSteps= intersections.map((i) =>{
        const d1 = path1.indexOf(i),
              d2 = path2.indexOf(i),
              d = d1+d2;
        return {i,d};
    }).sort((a,b)=> a.d - b.d);

    return intersectionSteps[0].d;
}


const part2 = getFastestIntersection(p1,p2,i);
console.log(part2);