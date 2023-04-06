let canvas = document.getElementById("kanvas");
let ctx = canvas.getContext("2d");

let allObjects = [3, 15, 7, 1, 6, 2, 9]
let sorted = [];

let player1 = new Player(0, 0, 75, 75, 1, 6, 1, false, "playerTexture.png");
let sword = new Sword(150, 0, 28, 75, 1,  0,  "swordTextureFalse.png",false);
let attackingTexture = new GameObjects()

let block1 = new GameObjects(200, -150, 75, 75, 0, true, "blockTexture.png", false);
let block2 = new GameObjects(400, 150, 75, 75, 0, true, "blockTexture.png", false);
let block3 = new GameObjects(-400, 150, 75, 75, 0, true, "blockTexture.png", false);
let block4 = new GameObjects(200, 250, 75, 75, 0, true, "blockTexture.png", false);
let block5 = new GameObjects(-180, -100, 75, 75, 0, true, "blockTexture.png", false);
let block6 = new GameObjects(-40, -400, 75, 75, 0, true, "blockTexture.png", false);
let block7 = new GameObjects(300, 0, 75, 75, 0, false, "ncBlockTexture.png", false);
let block8 = new GameObjects(400, 0, 75, 75, 2, false, "ncBlockTexture.png", false);
let block9 = new GameObjects(-400, 0, 75, 75, 1, true, "movingBlockTexture.png", true);

let camera = new Camera(0, 0, 0);
let game = new Game(ctx, canvas, camera);

game.AllGameObjects.push(player1, sword, block1, block2, block3, block4, block5, block6, block7, block8, block9)

setInterval(Update, 16);

function Update() {
    game.Update()
}


