let canvas = document.getElementById("kanvas");
let ctx = canvas.getContext("2d");

addEventListener("load", (event) => {Start();});

let camera = new Camera(0, 0, 0);
let game = new Game(ctx, canvas, camera);
let player;
let map;
let newGameObject;


setInterval(Update, 16);

async function Start() {
    await fetch('mapa_2.json')
    .then((response) => response.json())
    .then((json) => map = json);

    for (let i = 0; i < map.length; i++) {

        switch(map[i].tag)
        {
            
            case "player":
                newGameObject = new Player(map[i].x,map[i].y,map[i].width,map[i].height,map[i].layer,map[i].haveCollision,map[i].sprites,map[i].tag,map[i].canMove,map[i].speed)
                player = i;
            break;
            case "wall":
                newGameObject = new GameObjects(map[i].x,map[i].y,map[i].width,map[i].height,map[i].layer, map[i].haveCollision,map[i].sprites,map[i].tag)
            break;
        }
        game.AllGameObjects.push(newGameObject)

    }
}

function Update() {
    game.Update()
}


