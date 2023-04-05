let canvas = document.getElementById("kanvas");
let ctx = canvas.getContext("2d");

let allObjects = [3, 15, 7, 1, 6, 2, 9]
let sorted = [];

let player1 = new Player(0, 0, 50, 100, "#fff", 6, -0.3, false);

let block1 = new tiles(200, -150, 250, 30, "red");
let block2 = new tiles(400, 150, 250, 30, "red");
let block3 = new tiles(-400, 150, 250, 30, "red");
let block4 = new tiles(200, 250, 250, 30, "red");
let block5 = new tiles(-180, -100, 100, 30, "red");
let block6 = new tiles(-40, -400, 250, 30, "red");

let camera = new Camera(0, 0, 0);
let game = new Game(ctx, canvas, camera);

game.AllGameObjects.push(player1, block1, block2, block3, block4, block5, block6)

setInterval(Update, 16);

function Update() {
    game.Update()
}


