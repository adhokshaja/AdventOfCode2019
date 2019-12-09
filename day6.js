/*
 * --- Day 6: Universal Orbit Map ---
 * https://adventofcode.com/2019/day/6
 * Except for the universal Center of Mass (COM), every object in space is in orbit around exactly one other object.
 * The Universal Orbit Map facility uses orbit count checksums - the total number of direct orbits and indirect orbits.
 * Find the orbit check sum for the input.
 */
 
const fs = require('fs');
const { TreeNode } = require('./TreeNode')

const input = fs.readFileSync("./inputs/day6.txt", (_,a) => a).toString().split("\n");
//console.log(input);


const objects = {};

/**
 * Creates and adds a new TreeNode object to the Objects array
 * if the object of that name doesn't exist
 */
const addIfNotExists = (name) => {
    if(typeof(objects[name])=== 'undefined'){
        objects[''+name] = new TreeNode(name);
    }
}

for(let i of input){
    const [o1,o2] = i.split(')');
    addIfNotExists(o1);
    addIfNotExists(o2);
    objects[o1].addChildNode(objects[o2]);
}

const rootNode = objects['COM'];
console.log("Part 1",rootNode.findTotalNestedDepths());

const youNode = objects['YOU'];
console.log(youNode);

const youPath = TreeNode.bredthFirstSearch(rootNode,'YOU');
const sanPath = TreeNode.bredthFirstSearch(rootNode, 'SAN');

function firstCommonAncestor([...arr1],[...arr2]){
    const a = arr1.reverse(),
        b = arr2.reverse();
    for(let i in a){
        for(let j in b){
            if(a[i] === b[j]){
                return {i,j}
            }
        }
    }
}

const {i,j} = firstCommonAncestor(youPath,sanPath);
console.log("Part 2", (i-1)+(j-1));