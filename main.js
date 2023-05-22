let canvas = document.getElementById("kanvas");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

addEventListener("load", (event) => {Start();});

let camera = new Camera(0, 0, 0);
let game = new Game(ctx, canvas, camera);
let sword = new Sword(-10, -75, 75, 75, 0, [["../animations/Sword/Idle/hit.png"],["../animations/Sword/Attack/hit.png","../animations/Sword/Attack/hit1.png","../animations/Sword/Attack/hit2.png"]],"sword");
let map;         
let newGameObject;
let currentLvl;

async function Start() 
{
    await LoadFromJson("enemaci_test.json")
    game.EnemyStartCount();
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
            case "enemy":                   //(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic)
                newGameObject = new Enemy(map[i].x,map[i].y,map[i].width,map[i].height,2,map[i].sprites,map[i].tag,i,map[i].haveCollision,true)
            break;
        }
        newGameObject.AllGameObjects = game.AllGameObjects;
        game.AllGameObjects.push(newGameObject)

    }
    sword.AllGameObjects = game.AllGameObjects;
    game.AllGameObjects.push(sword)
}

function Update() {
    game.Update()
}
function AnimationUpdate() {
    game.AnimationUpdate()
}


//----- MODAL ---------
var modal = document.getElementById("myModal");

var btn = document.getElementById("myBtn");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
//---------------------