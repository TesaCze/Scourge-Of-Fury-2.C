let canvas = document.getElementById("kanvas");
let ctx = canvas.getContext("2d");

let allObjects = [3, 15, 7, 1, 6, 2, 9]
let sorted = [];

let player1 = new hraci(
    -15, 60, 50, 100, "#fff", 6, -0.3, false
    );

let block1 = new tiles(200, -150, 250, 30, "red");
let block2 = new tiles(400, 150, 250, 30, "red");
let block3 = new tiles(-400, 150, 250, 30, "red");
let block4 = new tiles(200, 250, 250, 30, "red");
let block5 = new tiles(-180, -100, 100, 30, "red");
let block6 = new tiles(-40, -400, 250, 30, "red");

console.log(player1)

function Update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player1.move();
    blocks();
    drawPlayer(player1);

    //console.log(player1.canvasPos().y);
}
setInterval(Update, 16);

function drawPlayer(hrac) {
    ctx.fillStyle = hrac.color;
    ctx.fillRect(
        hrac.canvasPos().x,
        hrac.canvasPos().y,
        hrac.width,
        hrac.height
    );
}


function drawTiles(blok) {
    ctx.fillStyle = blok.color;
    ctx.fillRect(
        blok.canvasPos().x,
        blok.canvasPos().y,
        blok.width,
        blok.height
    );
}

function blocks() {
    drawTiles(block1);
    drawTiles(block2);
    drawTiles(block3);
    
    player1.kolize(block1);
    player1.kolize(block2);
    player1.kolize(block3);
    
}

function Render() {
    SortLayers();

}

function SortLayers() {
    allObjects.sort(function(a, b){return a - b});
    
}


function DrawLayers() {
    for (let i = 0; i < allObjects.length; i++) {
        

    }

}