let canvas = document.getElementById("kanvas");
let ctx = canvas.getContext("2d");

//----------------------------------Tady se muze cokoliv nastavit--------------------------
let grid = {lineColor:"#bfbfbf",lineWidth:0.5,size:75}



//-----------------------------------------Nesahat-----------------------------------------
let editorCamera = {zoom:1, zoomSpeed: 0.1,zoomMin: 0.05,position:{x:0,y:0},dragPosition:{x:0,y:0}}
let isDraging = false;
let AllGameObjects = [];
let currentBlock = null;

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

    for(let i = 0; i < canvas.height/grid.size  ; i++)
    {
        let pos = grid.size * Math.round(i * grid.size)
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(canvas.width, pos);
        ctx.stroke();
    }

    for(let i = -0; i < canvas.width/grid.size ; i++)
    {
        let pos = i * grid.size * editorCamera.zoom
        ctx.beginPath();
        ctx.moveTo(pos ,0 );
        ctx.lineTo(pos, canvas.height);
        ctx.stroke();
    }
}

function CanvasToWorld(x,y)
{
    
    return{
        x: (x / editorCamera.zoom- canvas.width/2 - editorCamera.position.x)  ,
        y: -(y / editorCamera.zoom - canvas.height/2 - editorCamera.position.y) 
    }
}

function WorldToCnavas(x,y)
{
    console.log(editorCamera.position)
    return{
        x: (x + canvas.width/2 ) + editorCamera.position.x ,
        y: (-y + canvas.height/2 ) + editorCamera.position.y 
    }
}

//----------------------------------Zooooooooooooooom-----------------------
canvas.addEventListener("wheel", (e)=> 
{  
    startPos = {x:e.offsetX - canvas.width/2 ,y:e.offsetY - canvas.height/2}
    endPos = {x:0 ,y:0 }
    console.log(editorCamera.position)
    if (e.deltaY < 0) 
    {
        editorCamera.zoom += editorCamera.zoomSpeed * editorCamera.zoom;

        endPos.x = startPos.x * (editorCamera.zoomSpeed + 1);
        endPos.y = startPos.y * (editorCamera.zoomSpeed + 1);
        editorCamera.position.x +=  startPos.x - endPos.x + editorCamera.position.x * editorCamera.zoomSpeed;
        editorCamera.position.y +=  startPos.y - endPos.y + editorCamera.position.y * editorCamera.zoomSpeed;
    }
    else
    {
        editorCamera.zoom -= editorCamera.zoomSpeed * editorCamera.zoom;
        if(editorCamera.zoom < editorCamera.zoomMin)
        {
            editorCamera.zoom = editorCamera.zoomMin
        }
        endPos.x = startPos.x * (editorCamera.zoomSpeed + 1);
        endPos.y = startPos.y * (editorCamera.zoomSpeed + 1);
   
        editorCamera.position.x -=  startPos.x - endPos.x + editorCamera.position.x * editorCamera.zoomSpeed;
        editorCamera.position.y -=  startPos.y - endPos.y + editorCamera.position.y * editorCamera.zoomSpeed;

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
        let pos = CanvasToWorld(e.offsetX,e.offsetY)
        pos.x = grid.size * Math.round(pos.x/grid.size)
        pos.y = grid.size * Math.round(pos.y/grid.size)

        let newGameObject;

        
        switch(currentBlock.type)
        {
            case "player":
                newGameObject = new Player(pos.x,pos.y,grid.size,grid.size,0,true,currentBlock.sprites,"player",true,7)
            break;
            case "wall":
                newGameObject = new GameObjects(pos.x,pos.y,grid.size,grid.size,0,true,currentBlock.sprites,"wall")
            break;
        }

        for(let i = 0; i < AllGameObjects.length;i++)
        {
            
           if((newGameObject.x == AllGameObjects[i].x && newGameObject.y == AllGameObjects[i].y))
           {
                return
           }
        }
        console.log(newGameObject)
        AllGameObjects.push(newGameObject);
       
    }
    
});

canvas.addEventListener("mousemove", (e)=> 
{
    if(isDraging)
    {
        editorCamera.position.x = e.offsetX - editorCamera.dragPosition.x 
        editorCamera.position.y = e.offsetY - editorCamera.dragPosition.y 
    }
});

canvas.addEventListener("mouseup", (e)=> 
{
    if(isDraging)
    {
        isDraging = false;
    }
});

function onTextureClick(obj)
{

    currentBlock = obj
}

function addTexturesToDiv()
{
    for(let i = 0; i < Textures.length;i++)
    {
        const newDiv = document.createElement("img");
        newDiv.src = Textures[i].sprites[0]
        console.log()
        newDiv.setAttribute("onclick","onTextureClick("+JSON.stringify(Textures[i])+")");
        document.getElementById("textury").appendChild(newDiv) 
    }
}

function downloadMap() {
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(AllGameObjects)], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = "mapa.json";
    a.click();
  }