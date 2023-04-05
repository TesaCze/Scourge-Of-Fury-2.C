let canvas = document.getElementById("kanvas");
let ctx = canvas.getContext("2d");

let allObjects = [3, 15, 7, 1, 6, 2, 9]
let sorted = [];

let player1 = new Player(0, 0, 75, 75, 6, -0.3, false, "playerTexture.png");

let block1 = new GameObjects(200, -150, 75, 75, 0, true, "blockTexture.png");
let block2 = new GameObjects(400, 150, 75, 75, 0, true, "blockTexture.png");
let block3 = new GameObjects(-400, 150, 75, 75, 0, true, "blockTexture.png");
let block4 = new GameObjects(200, 250, 75, 75, 0, true, "blockTexture.png");
let block5 = new GameObjects(-180, -100, 75, 75, 0, true, "blockTexture.png");
let block6 = new GameObjects(-40, -400, 75, 75, 0, true, "blockTexture.png");
let block7 = new GameObjects(300, -200, 75, 75, 0, false, "ncBlockTexture.png");

let camera = new Camera(0, 0, 0);
let game = new Game(ctx, canvas, camera);

game.AllGameObjects.push(player1, block1, block2, block3, block4, block5, block6, block7)

setInterval(Update, 16);

function Update() {
    game.Update()
}


