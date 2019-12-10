/*
 * Day 8: Space Image Format
 * https://adventofcode.com/2019/day/8
 * Images are sent as a series of digits that each represent the color of a single pixel.
 * The digits fill each row of the image left-to-right, then move downward to the next row, filling rows top-to-bottom until every pixel of the image is filled.
 * Each image actually consists of a series of identically-sized layers that are filled in this way. 
 * So, the first digit corresponds to the top-left pixel of the first layer, 
 * the second digit corresponds to the pixel to the right of that on the same layer, 
 * and so on until the last digit, which corresponds to the bottom-right pixel of the last layer.
 */

/* Part 1: 
   Image is 25 pixels wide and 6 pixels tall. 
   Find the layer that contains the fewest 0 digits.
   On that layer, what is the number of 1 digits multiplied by the number of 2 digits.
*/


const fs = require('fs');
const input = fs.readFileSync("./inputs/day8.txt", (_, a) => a).toString().split("").map(i => parseInt(i)).filter(o => !isNaN(o));
//console.log(input);

const imgSize = {
    width: 25,
    height: 6
};

const layerSize = imgSize.width * imgSize.height,
    numLayers = input.length / layerSize;

const layers = [];
for (let i = 0; i < numLayers; i++) {
    let layer = input.splice(0, layerSize);
    layers.push(layer);
}

/**
 * Returns the Number of the specified Digit in the layer
 * @param {[Number]} param0 Layer
 * @param {Number} digit Digit to find
 */
const numberOfDigtsInLayer = ([...layer], digit) => {
    let filteredLayer = layer.filter(a => a === digit);
    return filteredLayer.length;
}

const numZerosInLayers = layers.map(l => numberOfDigtsInLayer(l, 0));


const LayerWithLeastZeros = (
    numZerosInLayers.reduce(({ i, c }, cur, idx) => {
        if (cur < c) {
            return {
                i: idx,
                c: cur
            }
        }
        return {
            i, c
        }
    }, { i: -1, c: layerSize })
).i;


const numOnesInAboveLayer = numberOfDigtsInLayer(layers[LayerWithLeastZeros],1),
    numTowsInAboveLayer = numberOfDigtsInLayer(layers[LayerWithLeastZeros], 2);

const part1_ans = numOnesInAboveLayer * numTowsInAboveLayer;
console.log("part1", part1_ans);

/*
    The image is rendered by stacking the layers and aligning the pixels with the same positions in each layer. 
    The digits indicate the color of the corresponding pixel: 0 is black, 1 is white, and 2 is transparent.
    The layers are rendered with the first layer in front and the last layer in back.
    The first non transparent pixel is the image's pixel value.
*/

const imgArr = [];


for(let pixel = 0; pixel<layerSize; pixel++){
    imgArr[pixel] = layers.filter(layer => layer[pixel]!=2)[0][pixel];
}

const img = imgArr.map(p => {
    if(p===0){
        return "■" // Black Pixel
    }else if(p===1){
        return  "□" // White Pixel
    }else{
        return " " // Transparent Pixel
    }
});

console.log("Part 2\n");
for(let row=0; row<=imgSize.height; row++){
    console.log(img.splice(0,imgSize.width).join(''));
}