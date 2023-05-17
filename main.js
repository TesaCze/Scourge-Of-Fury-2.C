let canvas = document.getElementById("kanvas");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

addEventListener("load", (event) => {Start();});

let camera = new Camera(0, 0, 0);
let game = new Game(ctx, canvas, camera);
let enemy = new Enemy(0, 500, 75, 75, 0, [["../animations/Enemy/Idle/Idle-1.png","../animations/Enemy/Idle/Idle-2.png","../animations/Enemy/Idle/Idle-3.png","../animations/Enemy/Idle/Idle-4.png"], ["../animations/Enemy/Walk/walk-1.png","../animations/Enemy/Walk/walk-2.png","../animations/Enemy/Walk/walk-3.png","../animations/Enemy/Walk/walk-4.png"], ["../animations/Enemy/Death/Death.png"]],"enemy",69,true,false)
let sword = new Sword(-10, -75, 75, 75, 0, [["../animations/Sword/Idle/hit.png"],["../animations/Sword/Attack/hit.png","../animations/Sword/Attack/hit1.png","../animations/Sword/Attack/hit2.png"]],"sword");
let map;         
let newGameObject;




async function Start() 
{
    await LoadFromJson('mapa_2.json')
    setInterval(Update, 16);
    setInterval(AnimationUpdate, 120);
}

async function LoadFromJson(path)
{
    await fetch(path)
    .then((response) => response.json())
    .then((json) => map = json);

    for (let i = 0; i < map.length; i++) {

        switch(map[i].tag)
        {
            
            case "player":              //(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic,speed,hp)
                newGameObject = new Player(map[i].x,map[i].y,map[i].width,map[i].height,map[i].layer,map[i].sprites,map[i].tag,i,map[i].haveCollision,false,map[i].speed,100) 
            break;
            case "wall":                     //(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic)
                newGameObject = new PhysicGameObjects(map[i].x,map[i].y,map[i].width,map[i].height,2,map[i].sprites,map[i].tag,i,map[i].haveCollision,true)
            break;
        }
        newGameObject.AllGameObjects = game.AllGameObjects;
        game.AllGameObjects.push(newGameObject)

    }
    sword.AllGameObjects = game.AllGameObjects;
    game.AllGameObjects.push(sword)
    enemy.AllGameObjects = game.AllGameObjects; //natvrdo pridany
    game.AllGameObjects.push(enemy)
}

function Update() {
    game.Update()
}
function AnimationUpdate() {
    game.AnimationUpdate()
}
