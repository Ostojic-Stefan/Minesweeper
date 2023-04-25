import Matrix from "./Matrix.js";
import Stack from "./Stack.js";
import { getMousePos, getRandomInt } from "./utils.js";
import { Tile, tileScale } from "./Tile.js";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;

let showBombs = false;
const mat = new Matrix<Tile>(18, 14);
const cols = 18;
const rows = 14;
let gNumBombs = 0;

const gPostitionOffsets = [
    { x: -1, y : -1 },
    { x:  0, y : -1 },
    { x:  1, y : -1 },
    { x: -1, y :  0 },
    { x:  1, y :  0 },
    { x: -1, y :  1 },
    { x:  0, y :  1 },
    { x:  1, y :  1 },
];

initializeMatrix(mat);

drawTiles();

canvas.addEventListener('contextmenu', (evt) => {
    evt.preventDefault();

    const mousePos = getMousePos(canvas, evt);
    const x = Math.floor(mousePos.x / tileScale);
    const y = Math.floor(mousePos.y / tileScale);
    const clickedTile = mat.getValue(x, y);
    clickedTile.setText("F");
    if (clickedTile.isBomb) {
        gNumBombs -= 1;
    }
    if (gNumBombs == 0) {
        alert("WIN!!!");
    }
})

canvas.addEventListener('click', (evt) => {
    const mousePos = getMousePos(canvas, evt);
    const x = Math.floor(mousePos.x / tileScale);
    const y = Math.floor(mousePos.y / tileScale);
    const clickedTile = mat.getValue(x, y);

    if (clickedTile.isBomb) {
        alert("You Lost!");
        showBombs = true;
    }

    const stack = new Stack<Tile>();
    stack.push(clickedTile);

    while (stack.size() > 0) {
        const currTile = stack.pop()!;
        currTile.checked = true;
        const numOfAdjacent = getNumOfAdjacent(currTile);
        if (numOfAdjacent !== 0) {
            currTile.setText(numOfAdjacent.toString());
        }
        if (numOfAdjacent === 0) {
            gPostitionOffsets.forEach(offset => {
                const xPos = currTile.getPosition().x + offset.x;
                const yPos = currTile.getPosition().y + offset.y;
                if (xPos >= 0 && xPos < cols && yPos >= 0 && yPos < rows) {
                    if (mat.getValue(xPos, yPos).checked === false) {
                        stack.push(mat.getValue(xPos, yPos));
                    }
                }
            });
        }
    }
});

function drawTiles() {
    for (let x = 0; x < cols; ++x) {
        for (let y = 0; y < rows; ++y) {
            const tile = mat.getValue(x, y);
            const { x: xPos, y: yPos } = tile.getPosition();

            context.fillStyle = "#333";
            if (showBombs && tile.isBomb) context.fillStyle = "red";
            else if (tile.checked) context.fillStyle = "#666";

            context.fillRect(xPos * tileScale, yPos * tileScale, tileScale - 1, tileScale - 1);
            if (tile.hasText()) {
                context.font = "32px serif";
                context.fillStyle = "lime";
                const centerX = (tile.getPosition().x * tileScale) + tileScale / 2 - 8;
                const centerY = (tile.getPosition().y * tileScale) + tileScale - 8;
                context.fillText(tile.getText(), centerX, centerY);
            }
        }
    }
}

function getNumOfAdjacent(tile: Tile): number {
    const currPos = tile.getPosition();
    return gPostitionOffsets.reduce((acc, offset) => {
        const xPos = currPos.x + offset.x;
        const yPos = currPos.y + offset.y;
        if (xPos >= 0 && xPos < cols && yPos >= 0 && yPos < rows) {
            if (mat.getValue(xPos, yPos).isBomb)
                return acc + 1;
            }
        return acc;
    }, 0)
}

function initializeMatrix(matrix: Matrix<Tile>): void {
    let numBombs = 0;
    for (let x = 0; x < cols; ++x) {
        for (let y = 0; y < rows; ++y) {
            const tile = new Tile(x, y);
            const isBomb = getRandomInt(0, 100) > 80; 
            numBombs += isBomb ? 1 : 0;
            tile.setIsBomb(isBomb);
            matrix.setValue(x, y, tile);
        }
    }
    gNumBombs = numBombs;
}

function update() {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    drawTiles();
    requestAnimationFrame(update);
}

update();