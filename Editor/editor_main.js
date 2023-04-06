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
    DrawGrid();
}

function DrawGrid()
{
    ctx.strokeStyle = grid.lineColor;
    ctx.lineWidth = grid.lineWidth;

    for(let i = 0; i < canvas.height/grid.size  ; i++)
    {

        ctx.beginPath();
        ctx.moveTo(0, i * grid.size  *editorCamera.zoom  + editorCamera.position.y  + canvas.height/2 +grid.size/2 - grid.size * Math.round(canvas.height/grid.size/2));
        ctx.lineTo(canvas.width, i * grid.size * editorCamera.zoom  + editorCamera.position.y  + canvas.height/2 +grid.size/2- grid.size * Math.round(canvas.height/grid.size/2));
        ctx.stroke();
    }

    for(let i = -0; i < canvas.width/grid.size ; i++)
    {
        ctx.beginPath();
        ctx.moveTo(i * grid.size * editorCamera.zoom  + editorCamera.position.x + canvas.width/2 + grid.size/2- grid.size * Math.round(canvas.width/grid.size/2 ) ,0 );
        ctx.lineTo(i * grid.size * editorCamera.zoom  + editorCamera.position.x +  canvas.width/2 +grid.size/2- grid.size * Math.round(canvas.width/grid.size/2 ), canvas.height);
        ctx.stroke();
    }
}

function CanvasToWorld(x,y)
{
    
    return{
        x: (x - canvas.width/2 - editorCamera.position.x)  ,
        y: -(y - canvas.height/2 - editorCamera.position.y) 
    }
}

function WorldToCnavas(x,y)
{
    return{
        x: x * grid.size + canvas.width/2,
        y: y * grid.size + canvas.height/2
    }
}

//----------------------------------Zooooooooooooooom-----------------------
canvas.addEventListener("wheel", (e)=> 
{  
    startPos = {x:e.offsetX ,y:e.offsetY }
    endPos = {x:0 ,y:0 }

    if (e.deltaY < 0) 
    {
        editorCamera.zoom += editorCamera.zoomSpeed * editorCamera.zoom;

        endPos.x = startPos.x * (editorCamera.zoomSpeed + 1);
        endPos.y = startPos.y * (editorCamera.zoomSpeed + 1);
   
        editorCamera.position.x +=  startPos.x - endPos.x + (editorCamera.position.x + canvas.width/2+ grid.size/2- grid.size * Math.round(canvas.width/grid.size/2)) * editorCamera.zoomSpeed ;
        editorCamera.position.y +=  startPos.y - endPos.y + (editorCamera.position.y + canvas.height/2+ grid.size/2- grid.size * Math.round(canvas.height/grid.size/2)) * editorCamera.zoomSpeed;
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
   
        editorCamera.position.x -=  startPos.x - endPos.x + (editorCamera.position.x + canvas.width/2+ grid.size/2- grid.size * Math.round(canvas.width/grid.size/2)) * editorCamera.zoomSpeed;
        editorCamera.position.y -=  startPos.y - endPos.y + (editorCamera.position.y + canvas.height/2+ grid.size/2- grid.size * Math.round(canvas.height/grid.size/2)) * editorCamera.zoomSpeed;
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

        if(type == "player")
        {
            //Player newGameObject = new Player()
        }

        for(let i = 0; i < AllGameObjects.length;i++)
        {
           //if()
        }
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

function onTextureClick(src,type)
{
    console.log(src,type)
    currentBlock = {src:src,type:type}
}

function addTexturesToDiv()
{
    for(let i = 0; i < Textures.length;i++)
    {
        const newDiv = document.createElement("img");
        newDiv.src = Textures[i].src
        console.log()
        newDiv.setAttribute("onclick","onTextureClick('"+Textures[i].src + "','"+Textures[i].type+"')");
        document.getElementById("textury").appendChild(newDiv) 
    }
}