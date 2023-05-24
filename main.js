let canvas = document.getElementById("kanvas");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

addEventListener("load", (event) => {selectLevel(0);});

let camera = new Camera(0, 0, 0);
let game;
let sword = new Sword(-10, -75, 75, 75, 0,3,"sword");
let map;         
let newGameObject;
let currentLvl;
let levels = ["../Maps/testMap.json"]
let updateInterval
let animationInterval


async function LoadLevel() 
{
    modal.style.display = "none";

    if(clearInterval(updateInterval) != undefined)
        clearInterval(updateInterval);

    if(clearInterval(animationInterval) != undefined)
        clearInterval(animationInterval);
     
        LoadFromJson()
        game.EnemyStartCount();
        updateInterval = setInterval(Update, 16);
        animationInterval = setInterval(AnimationUpdate, 120);
    
}

async function selectLevel(level)
{
    if(level <= levels.length-1)
    {
        await LoadJson(levels[level])
        LoadLevel();
    }
}

async function LoadJson(path)
{
    await fetch(path)
    .then((response) => response.json())
    .then((json) => map = json);
}

async function LoadFromJson()
{
    game = new Game(ctx, canvas, camera);

    for (let i = 0; i < map.length; i++) {

        switch(map[i].tag)
        {
            case "player":              //(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic,speed,hp)
                newGameObject = new Player(map[i].x,map[i].y,map[i].width,map[i].height,map[i].layer,map[i].sprites,map[i].tag,i,map[i].haveCollision,false,map[i].speed,100) 
                sword.layer = map[i].layer;
            break;
            case "wall":                     //(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic)
                newGameObject = new PhysicGameObjects(map[i].x,map[i].y,map[i].width,map[i].height,map[i].layer,map[i].sprites,map[i].tag,i,map[i].haveCollision,true)
            break;
            case "enemy":                       //(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic)
                newGameObject = new Enemy(map[i].x,map[i].y,map[i].width,map[i].height,map[i].layer,map[i].sprites,map[i].tag,i,map[i].haveCollision,true)
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

function importMap() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = ".json"

    input.onchange = _ => {
        let file = input.files[0];
        let reader = new FileReader();
        reader.readAsText(file);

        reader.addEventListener('load', (event) => {
          let jsonData = event.target.result;
          map = JSON.parse(jsonData);
          LoadLevel();
        });
       
    };

    input.click();
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