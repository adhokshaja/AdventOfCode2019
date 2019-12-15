/*
 * Day 12: Care Package
 * https://adventofcode.com/2019/day/13
 * Arcade machine - IntCode
 * Every three output instructions specify the 
 *  x position (distance from the left), 
 *  y position (distance from the top), 
 *  and tile id.
    * 0 is an empty tile. No game object appears in this tile.
    * 1 is a wall tile. Walls are indestructible barriers.
    * 2 is a block tile. Blocks can be broken by the ball.
    * 3 is a horizontal paddle tile. The paddle is indestructible.
    * 4 is a ball tile. The ball moves diagonally and bounces off objects.
*/


const debug = false;

const fs = require('fs');
const input = fs.readFileSync("./inputs/day13.txt", (_, a) => a).toString().split(",").map(i => parseInt(i));

const { IntCodeParser } = require('./IntcodeParser');

const drawTile = (tileId) =>{
    switch (tileId){
        case 1: return '■'; break; // wall
        case 2: return '#'; break; // block
        case 3: return '_'; break; // Horiz paddle
        case 4: return '0'; break; // Horiz paddle
        default: return ' ';
    }
}

function part1() {
    const arcadeMachine = new IntCodeParser(input);
    const output = arcadeMachine.run([]);

    const grid = [];


    for (let i = 0; i < output.length; i = i + 3) {
        const x = output[i],
            y = output[i + 1],
            t = output[i + 2];
        grid[y] = grid[y] || [];
        grid[y][x] = t;
    }

    const blocksPerRow = grid.map(r => {
        const row = r.map(t => drawTile(t));
        // Additional fluff, not truely needed
        console.log(row.join(''));
        return row.filter(a => a == '#').length;
    });

    const TotalBlocks = blocksPerRow.reduce((a, i) => a + i, 0);
    console.log("Total Blocks : ",TotalBlocks);

}
part1();



function part2(){
    const modInput = [...input];
    modInput[0] = 2; // Play for free
    const arcadeMachine = new IntCodeParser(modInput);
    let output = arcadeMachine.run([]);

    let ballX = 0,
        paddleX = 0,
        score = 0;

    while(output.length > 0){

        // We only care about the position of the ball, the paddle and score 
        for (let i = 0; i < output.length; i = i + 3) {
            const x = output[i],
                y = output[i + 1],
                t = output[i + 2];
            if(x == -1 && y== 0){
                score = t;
            }else if(t ==4){
                ballX = x;
            }else if(t == 3){
                paddleX = x;
            }
            
        }

        // Set the joystick position appropriately
        if(ballX < paddleX){
            output = arcadeMachine.run([-1]); // tilt left
        }else if(ballX > paddleX){
            output = arcadeMachine.run([1]); //title right
        }else{
            output = arcadeMachine.run([0]); // stay neutral
        }
    }
    console.log("Final Score: ",score);

}

part2();