let canvas = document.getElementById("kanvas");
let ctx = canvas.getContext("2d");

//----------------------------------Tady se muze cokoliv nastavit--------------------------
let grid = {lineColor:"#bfbfbf",lineWidth:0.5,size:75}


//-----------------------------------------Nesahat-----------------------------------------
let editorCamera = {zoom:1, zoomSpeed: 0.1,zoomMin: 0.2,zoomMax: 4,position:{x:0,y:0},dragPosition:{x:0,y:0}}
let isDraging = false;
let AllGameObjects = [];
let currentBlock = null;

let history = []; //ctrl z
let udnoHistory = []; //ctrl x

let idCount = 0

let selectedObjects = [];
let isSelecting = false;
let selectPos = {strart:{x:0,y:0},end:{x:0,y:0}}

let copiedObjects = [];

let Textures;

let mousePos = {x:0,y:0};

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

    if(selectedObjects.length != 0)
    {
        DrawObjectSelection();
    }

    if(isSelecting)
    {
        DrawSelect();
    }
    else
    {
        DrawSelectedObjects()
    }
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

function SortLayers(arr) 
{
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

function DrawSelect()
{
    let posS = WorldToCnavas(selectPos.strart.x,selectPos.strart.y);
    let posE = WorldToCnavas(selectPos.end.x,selectPos.end.y);
    ctx.fillStyle = "rgba(0,145,255,0.2)"
    ctx.fillRect(posS.x,posS.y,posE.x - posS.x,posE.y - posS.y)
    ctx.strokeStyle = "rgba(0,145,255,1)"
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(posS.x,posS.y,posE.x - posS.x,posE.y - posS.y)
    ctx.stroke()
}

function DrawSelectedObjects()
{
    if(copiedObjects.length != 0)
    {

    }
    else if(currentBlock != null)
    {
        let pos = CanvasToWorld(mousePos.x,mousePos.y)
        pos.x = grid.size * Math.round(pos.x/grid.size) - grid.size/2
        pos.y = grid.size * Math.round(pos.y/grid.size)+ grid.size/2
        let pos2 = WorldToCnavas(pos.x,pos.y)
        ctx.globalAlpha = 0.2;
        let img = new Image(grid.size,grid.size)
        img.src = currentBlock.sprites
        ctx.drawImage(img, pos2.x , pos2.y , grid.size * editorCamera.zoom, grid.size* editorCamera.zoom);   
        ctx.globalAlpha = 1;
    }
}

function DrawObjectSelection()
{
    for(let i = 0; i < selectedObjects.length; i++)
    {   
        let pos = WorldToCnavas(selectedObjects[i].x - selectedObjects[i].width/2 , selectedObjects[i].y  + selectedObjects[i].height/2);
        ctx.fillStyle = "rgba(0,145,255,0.2)"
        ctx.fillRect(pos.x  ,pos.y ,selectedObjects[i].width * editorCamera.zoom,selectedObjects[i].height* editorCamera.zoom)
        ctx.strokeStyle = "rgba(0,145,255,1)"
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(pos.x  ,pos.y ,selectedObjects[i].width * editorCamera.zoom,selectedObjects[i].height* editorCamera.zoom)
        ctx.stroke()
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
        return
           // AllGameObjects.splice(i,1)
       }
       else if(currentBlock.type == "player" && AllGameObjects[i].tag == "player")
       {
            AllGameObjects.splice(i,1)
       }
    }


    switch(currentBlock.type)
    {
        case "player": //(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic,speed,hp)
            newGameObject = new Player(pos.x,pos.y,grid.size,grid.size,0,currentBlock.sprites,"player",idCount,true,false,7)
        break;
        case "wall":    //(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic)
            newGameObject = new PhysicGameObjects(pos.x,pos.y,grid.size,grid.size,0,currentBlock.sprites,"wall",idCount,currentBlock.haveCollision,true)
        break;
    }
    
    udnoHistory = [];
    AllGameObjects.push(newGameObject);
    history.push([0,idCount]) //0 add 1 delete
    idCount++;
}

function removeBlock(x,y)
{

    let pos = CanvasToWorld(x,y)
    pos.x = grid.size * Math.round(pos.x/grid.size)
    pos.y = grid.size * Math.round(pos.y/grid.size)

    
    for(let i = 0; i < AllGameObjects.length;i++)
    {
        
       if((pos.x == AllGameObjects[i].x && pos.y == AllGameObjects[i].y))
       {
            history.push([1,AllGameObjects[i]])
            AllGameObjects.splice(i,1)
       }
    }
}

function selectBlocks()
{
    selectedObjects = [];
    for(let i = 0; i < AllGameObjects.length;i++)
    {
        if(((AllGameObjects[i].x + AllGameObjects[i].width/2 > selectPos.strart.x && AllGameObjects[i].x - AllGameObjects[i].width/2 < selectPos.end.x ) || 
        (AllGameObjects[i].x - AllGameObjects[i].width/2 < selectPos.strart.x && AllGameObjects[i].x + AllGameObjects[i].width/2 > selectPos.end.x))&&
        ((AllGameObjects[i].y - AllGameObjects[i].height/2 < selectPos.strart.y && AllGameObjects[i].y + AllGameObjects[i].height/2 > selectPos.end.y ) || 
        (AllGameObjects[i].y + AllGameObjects[i].height/2 > selectPos.strart.y && AllGameObjects[i].y - AllGameObjects[i].height/2 < selectPos.end.y)))
        {
            selectedObjects.push(AllGameObjects[i])
        }
    }
    
}

function onTextureClick(obj)
{
    currentBlock = obj
    selectedObjects = [];
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

function downloadMap() 
{
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(AllGameObjects)], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = "mapa.json";
    a.click();
}

canvas.addEventListener("mousedown", (e)=> 
{ 
    if(e.button == 0 && e.shiftKey)
    {   
        isSelecting = true;
        let temp = CanvasToWorld(e.offsetX,e.offsetY)
        selectPos.strart.x = temp.x
        selectPos.strart.y = temp.y
        selectPos.end.x = temp.x
        selectPos.end.y = temp.y
    }
    else if(e.button == 1)
    {
        isDraging = true;
        editorCamera.dragPosition.x = e.offsetX - editorCamera.position.x
        editorCamera.dragPosition.y = e.offsetY - editorCamera.position.y;
    }
    else if(e.button == 0 && currentBlock != null)
    {
        addBlock(e.offsetX,e.offsetY)
    }
    else if(e.button == 2)
    {
        removeBlock(e.offsetX,e.offsetY)
    }
    
});

canvas.addEventListener("mousemove", (e) => 
{
    mousePos.x = e.offsetX;
    mousePos.y = e.offsetY;
    if(isDraging)
    {
        editorCamera.position.x = e.offsetX - editorCamera.dragPosition.x 
        editorCamera.position.y = e.offsetY - editorCamera.dragPosition.y 
    }
    else if(isSelecting && !e.shiftKey)
    {
        isSelecting = false;
    }
    else if(isSelecting)
    {
        let temp = CanvasToWorld(e.offsetX,e.offsetY)
        selectPos.end.x = temp.x
        selectPos.end.y = temp.y
    }


    if(e.buttons == 1 && currentBlock != null && !e.shiftKey)
    {
        addBlock(e.offsetX,e.offsetY)
    }
    else if(e.buttons == 2 && !e.shiftKey)
    {
        removeBlock(e.offsetX,e.offsetY)
    }
});

canvas.addEventListener("mouseup", (e) => 
{
    if(isDraging)
    {
        isDraging = false;
    }
    else if(isSelecting)
    {
        isSelecting = false;
        let temp = CanvasToWorld(e.offsetX,e.offsetY)
        selectPos.end.x = temp.x
        selectPos.end.y = temp.y
        selectBlocks();
    }
});

document.addEventListener("keydown", (e) => 
{
    //console.log(e)
    switch(e.code)
    {
        case "Space":
            editorCamera.position.x = 0;
            editorCamera.position.y = 0;
            editorCamera.zoom = 1;
        break;
    }

    if(e.code == "KeyZ" && e.ctrlKey) //Undo
    {
        
        if(history.length != 0)
        {
            if(history[history.length-1][0] == 0)
            {
                for(let i = 0; i < AllGameObjects.length; i++)
                {
                    if(AllGameObjects[i].id == history[history.length-1][1])
                    {
                        udnoHistory.push([0,AllGameObjects[i]]);
                        AllGameObjects.splice(i,1)
                        history.pop()
                    }
                }
            }
            else
            {
                AllGameObjects.push(history[history.length-1][1])
                udnoHistory.push([1,history[history.length-1][1].id]);
                history.pop();
            }
            
        }
    }
    else if(e.code == "KeyX" && e.ctrlKey) //Redo
    {
        if(udnoHistory.length != 0)
        {
            if(udnoHistory[udnoHistory.length-1][0] == 0)
            {
                AllGameObjects.push(udnoHistory[udnoHistory.length-1][1])
                history.push([0,udnoHistory[udnoHistory.length-1][1].id])
                udnoHistory.pop();
            }
            else
            {
                for(let i = 0; i < AllGameObjects.length; i++)
                {
                    if(AllGameObjects[i].id == udnoHistory[udnoHistory.length-1][1])
                    {
                        history.push([1,AllGameObjects[i]]);
                        AllGameObjects.splice(i,1)
                        udnoHistory.pop()
                    }
                }
            }
        }
    }
    else if(e.code == "KeyC" && e.ctrlKey) //copie
    {
        copiedObjects = selectedObjects
    }
})

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