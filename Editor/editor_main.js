let canvas = document.getElementById("kanvas");
let ctx = canvas.getContext("2d");

//----------------------------------Tady se muze cokoliv nastavit--------------------------
let grid = {lineColor:"#bfbfbf",lineWidth:0.5,size:75}


//-----------------------------------------Nesahat-----------------------------------------
let editorCamera = {zoom:1, zoomSpeed: 0.1,zoomMin: 0.2,zoomMax: 4,position:{x:0,y:0},dragPosition:{x:0,y:0}}
let isDraging = false;
let AllGameObjects = [];
let currentBlock = null;
let history = [];
let udnoHistory = [];

let Textures;

addEventListener("load", (event) => {Start();});

async function Start()
{
    await fetch('TextureFile.json')
    .then((response) => response.json())
    .then((json) => Textures = json);

    addTexturesToDiv();

    setInterval(Update,16)
}

function Update()
{
    Draw()
}

function Draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    DrawObjects();
    DrawGrid();
}

function DrawObjects()
{
    SortLayers(AllGameObjects)

    for(let i = 0; i < AllGameObjects.length;i++)
    {
        let pos = WorldToCnavas(AllGameObjects[i].x,AllGameObjects[i].y)
        let img = new Image(grid.size,grid.size)
        img.src = AllGameObjects[i].sprites[0]
        ctx.drawImage(img, pos.x - AllGameObjects[i].width/2 * editorCamera.zoom, pos.y - AllGameObjects[i].height/2* editorCamera.zoom, grid.size * editorCamera.zoom, grid.size* editorCamera.zoom);        
    }
}

function SortLayers(arr) {
    arr.sort(function(a, b){return a.layer - b.layer});
}

function DrawGrid()
{
    ctx.strokeStyle = grid.lineColor;
    ctx.lineWidth = grid.lineWidth;

    let yCount =  Math.round(canvas.height/(grid.size * editorCamera.zoom));
    if((yCount % 2) == 1)
    {
        yCount++
    }
    
    for(let i = 0; i < yCount; i++)
    {
        let y = ((grid.size * i) - ((Math.round(yCount )/2) * grid.size)) + (Math.round(editorCamera.position.y / grid.size / editorCamera.zoom) * grid.size) + grid.size/2
        let pos = WorldToCnavas(0,y)
        ctx.beginPath();
        ctx.moveTo(0, pos.y);
        ctx.lineTo(canvas.width, pos.y);
        ctx.stroke();
    }

    let xCount =  Math.round(canvas.width/(grid.size * editorCamera.zoom));

    if((xCount % 2) == 1)
    {
        xCount++
    }

    for(let i = 0; i < xCount ; i++)
    {
        let x = ((grid.size * i) - ((Math.round(xCount )/2) * grid.size)) - (Math.round(editorCamera.position.x / grid.size / editorCamera.zoom) * grid.size) + grid.size/2
        let pos = WorldToCnavas(x,0)
        ctx.beginPath();
        ctx.moveTo(pos.x ,0 );
        ctx.lineTo(pos.x, canvas.height);
        ctx.stroke();
    }
}

function CanvasToWorld(x,y)
{
    
    return{
        x:( x - canvas.width/2 - editorCamera.position.x)/ editorCamera.zoom,
        y: (-y + canvas.height/2 + editorCamera.position.y)/ editorCamera.zoom 
    }
}

function WorldToCnavas(x,y)
{
    return{
        x: (x* editorCamera.zoom + canvas.width/2 ) + editorCamera.position.x  ,
        y: (-y* editorCamera.zoom + canvas.height/2 ) + editorCamera.position.y  
    }
}

//----------------------------------Zooooooooooooooom-----------------------
canvas.addEventListener("wheel", (e)=> 
{  
    startPos = {x:e.offsetX - canvas.width/2 ,y:e.offsetY - canvas.height/2}
    endPos = {x:0 ,y:0 }
    if (e.deltaY < 0) 
    {
        editorCamera.zoom += editorCamera.zoomSpeed * editorCamera.zoom;

        if(editorCamera.zoom > editorCamera.zoomMax)
        {
            editorCamera.zoom = editorCamera.zoomMax
        }
        else
        {
            endPos.x = startPos.x * (editorCamera.zoomSpeed + 1);
            endPos.y = startPos.y * (editorCamera.zoomSpeed + 1);
            editorCamera.position.x +=  startPos.x - endPos.x + editorCamera.position.x * editorCamera.zoomSpeed;
            editorCamera.position.y +=  startPos.y - endPos.y + editorCamera.position.y * editorCamera.zoomSpeed;
        }
    }
    else
    {
        editorCamera.zoom -= editorCamera.zoomSpeed * editorCamera.zoom;

        if(editorCamera.zoom < editorCamera.zoomMin)
        {
            editorCamera.zoom = editorCamera.zoomMin
        }
        else
        {
        endPos.x = startPos.x * (editorCamera.zoomSpeed + 1);
        endPos.y = startPos.y * (editorCamera.zoomSpeed + 1);
   
        editorCamera.position.x -=  startPos.x - endPos.x + editorCamera.position.x * editorCamera.zoomSpeed;
        editorCamera.position.y -=  startPos.y - endPos.y + editorCamera.position.y * editorCamera.zoomSpeed;
        }
    }
   
});

canvas.addEventListener("mousedown", (e)=> 
{ 
    if(e.button == 1)
    {
        isDraging = true;
        editorCamera.dragPosition.x = e.offsetX - editorCamera.position.x
        editorCamera.dragPosition.y = e.offsetY - editorCamera.position.y;
    }
    else if(e.button == 0 && currentBlock != null)
    {
        addBlock(e.offsetX,e.offsetY)
    }
    
});

function addBlock(x,y)
{
    let pos = CanvasToWorld(x,y)
    pos.x = grid.size * Math.round(pos.x/grid.size)
    pos.y = grid.size * Math.round(pos.y/grid.size)

    let newGameObject;

    
    for(let i = 0; i < AllGameObjects.length;i++)
    {
        
       if((pos.x == AllGameObjects[i].x && pos.y == AllGameObjects[i].y))
       {
            AllGameObjects.splice(i,1)
       }
       else if(currentBlock.type == "player" && AllGameObjects[i].tag == "player")
       {
            AllGameObjects.splice(i,1)
       }
    }


    switch(currentBlock.type)
    {
        case "player": //(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic,speed,hp)
            newGameObject = new Player(pos.x,pos.y,grid.size,grid.size,0,currentBlock.sprites,"player",true,1,true,false,7)
        break;
        case "wall":    //(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic)
            newGameObject = new PhysicGameObjects(pos.x,pos.y,grid.size,grid.size,0,currentBlock.sprites,"wall",1,currentBlock.haveCollision.ha,true)
        break;
    }
    
    AllGameObjects.push(newGameObject);
}

canvas.addEventListener("mousemove", (e) => 
{
    if(isDraging)
    {
        editorCamera.position.x = e.offsetX - editorCamera.dragPosition.x 
        editorCamera.position.y = e.offsetY - editorCamera.dragPosition.y 
    }

    if(e.buttons == 1 && currentBlock != null)
    {
        addBlock(e.offsetX,e.offsetY)
    }
});

canvas.addEventListener("mouseup", (e) => 
{
    if(isDraging)
    {
        isDraging = false;
    }
});

document.addEventListener("keydown", (e) => 
{
    console.log(e)
    switch(e.code)
    {
        case "Space":
            editorCamera.position.x = 0;
            editorCamera.position.y = 0;
            editorCamera.zoom = 1;
        break;
    }

    if(e.code == "KeyZ" && e.ctrlKey)
    {
        
    }
})

function onTextureClick(obj)
{
    currentBlock = obj
}

function addTexturesToDiv()
{
    for(let i = 0; i < Textures.length;i++)
    {
        const blocky = document.createElement("div");
        document.getElementById("textury").appendChild(blocky)
        blocky.setAttribute("id", "block[" + i + "]");
        blocky.classList.add("hover-text");
        const newDiv = document.createElement("img");
        newDiv.src = Textures[i].sprites[0]
        newDiv.setAttribute("onclick","onTextureClick("+JSON.stringify(Textures[i])+")");
        newDiv.setAttribute("id", "block[" + i + "]");
     //   newDiv.setAttribute("onclick", "selectedBlock()");
        document.getElementById("block[" + i + "]").appendChild(newDiv) 
        const popisDivu = document.createElement("span");
        document.getElementById("block[" + i + "]").appendChild(popisDivu)
        popisDivu.innerHTML=Textures[i].text;
        popisDivu.classList.add("visible");

    }

    var slider = document.getElementById("rozsah");
    var output = document.getElementById("value");
    output.innerHTML = slider.value;

    slider.oninput = function() {
    output.innerHTML = this.value;
}
}

function downloadMap() {
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(AllGameObjects)], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = "mapa.json";
    a.click();
  }