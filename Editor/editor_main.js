let canvas = document.getElementById("kanvas"); //inicializace canvasu
let ctx = canvas.getContext("2d");  //inicializace contextu z canvasu pro vykreslování
ctx.imageSmoothingEnabled = false;  //vypnutí vyhlazování kvůli neostrím hranám v pixelArtu

let grid = {lineColor:"#bfbfbf",lineWidth:0.5,size:75}  //velikost mrizky a bloku

let editorCamera = {zoom:1, zoomSpeed: 0.1,zoomMin: 0.2,zoomMax: 4,position:{x:0,y:0},dragPosition:{x:0,y:0}}   //proměné pro kameru

let isDraging = false;      //bool který se zapne pokud uživatel hýbe s kamerou
let AllGameObjects = [];    //všechny objekty ve scéně
let sprites = [];           //pole kam se načtou všechny textury
let currentBlock = null;    //právě zvolený blok
let currentLayer = 0;       //momentální vrstva
let AllLayers = false;      //bool pro zobrazení všech vrstev

let history = [];           //historie pro pouziti undo - ctrl z
let undoHistory = [];       //historie pro pouziti redu - ctrl x

let idCount = 0             //počítadlo id pro objekty

let selectedObjects = [];   //pole objektů které jsou právě označeny
let isSelecting = false;    //bool který je zaplý pokud uživatel právě označuje
let selectPos = {strart:{x:0,y:0},end:{x:0,y:0}}    //pozice označení

let copiedObjects = [];     //pole zkopírovaných objektů

let Textures;   //proměná do které se načtou možné textury

let mousePos = {x:0,y:0};   //pozice myši

let buttons = {paint: document.getElementById("btn1"),move:document.getElementById("btn2")};  //proměná kde jsou uložené elementy tlačítek 
let currentTool = 0;            //momentálně vybraný nástroj 0-nic 1-paint 2-move;

let isMoving = false;           //bool který se zapne pokud uživatel hýbe s objektem
let movingPos = {x:0,y:0}       //puvodní pozice myši při pohybu s objekty
let movingObjectsStartPos = []; //původní pozice pohybujících se objektu

let layerBtn = document.getElementById("btn3"); //tlacitko pro vrstvy
let layerValue = document.getElementById("layerValues");  

addEventListener("load", (event) => {Start();}); //event který při načtení spustí funkci start()

async function Start()  //načte možné textury a přidá je do front-endu, zapne se interval pro funkci Update 
{
    await fetch('TextureFile.json')
    .then((response) => response.json())
    .then((json) => Textures = json);
    await loadSprites();    

    addTexturesToDiv();

    setInterval(Update,16)
}

function Update()   //spusti funkci pro vykreslování 
{
    Draw()
}

function Draw() //vymaže a vykresli objekty, grid, popřípadě označení nebo zkopírované objekty
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

function DrawObjects()  //vykrezli objekty
{
    SortLayers(AllGameObjects)

    for(let i = 0; i < AllGameObjects.length;i++)
    {
        if(AllLayers || (currentLayer == AllGameObjects[i].layer))
        {
            let pos = WorldToCnavas(AllGameObjects[i].x,AllGameObjects[i].y)
            let img = sprites[AllGameObjects[i].sprites][0][0]
            ctx.drawImage(img, pos.x - AllGameObjects[i].width/2 * editorCamera.zoom, pos.y - AllGameObjects[i].height/2* editorCamera.zoom, grid.size * editorCamera.zoom, grid.size* editorCamera.zoom);        
        }
    }
}

function SortLayers(arr) //seřadí objekty podle proměné layer od nejmenšího po nejvštší
{
    arr.sort(function(a, b){return a.layer - b.layer});
}

function DrawGrid() //vykresli mřížku
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

function DrawSelect() //vykreslí značení
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

function DrawSelectedObjects() //vykreslí pruhledné bloky kterými právě uživatel kreslí
{
    if(currentTool != 1 )
        return

    if(copiedObjects.length != 0)
    {
        let pos = CanvasToWorld(mousePos.x,mousePos.y)
        pos.x = grid.size * Math.round(pos.x/grid.size) - grid.size/2
        pos.y = grid.size * Math.round(pos.y/grid.size) + grid.size/2
        
        ctx.globalAlpha = 0.2;

        for(let i = 0; i < copiedObjects.length; i++)
        {
            let pos2 = WorldToCnavas(copiedObjects[i].x + pos.x,copiedObjects[i].y + pos.y)
            let img = sprites[copiedObjects[i].sprites][0][0]
            ctx.drawImage(img,  pos2.x ,  pos2.y , grid.size * editorCamera.zoom, grid.size* editorCamera.zoom);   
        }
        ctx.globalAlpha = 1;
    }
    else if(currentBlock != null)
    {
        let pos = CanvasToWorld(mousePos.x,mousePos.y)
        pos.x = grid.size * Math.round(pos.x/grid.size) - grid.size/2
        pos.y = grid.size * Math.round(pos.y/grid.size)+ grid.size/2
        let pos2 = WorldToCnavas(pos.x,pos.y)
        ctx.globalAlpha = 0.2;
        let img = sprites[currentBlock.sprites][0][0]
        ctx.drawImage(img, pos2.x , pos2.y , grid.size * editorCamera.zoom, grid.size* editorCamera.zoom);   
        ctx.globalAlpha = 1;
    }
}

function DrawObjectSelection() //vykreslí označené objekty
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

function CanvasToWorld(x,y) //převede pozici x,y z obrazovky do světa
{
    
    return{
        x:( x - canvas.width/2 - editorCamera.position.x)/ editorCamera.zoom,
        y: (-y + canvas.height/2 + editorCamera.position.y)/ editorCamera.zoom 
    }
}

function WorldToCnavas(x,y) //převede pozici x,y ze světa na obrazovku
{
    return{
        x: (x* editorCamera.zoom + canvas.width/2 ) + editorCamera.position.x  ,
        y: (-y* editorCamera.zoom + canvas.height/2 ) + editorCamera.position.y  
    }
}

function addBlock(x,y)  //přidá blok nebo zkopírovené bloky
{   
    if(currentTool != 1 )
        return

    if(copiedObjects.length != 0 )
    {
        let pos = CanvasToWorld(mousePos.x,mousePos.y)
        pos.x = grid.size * Math.round(pos.x/grid.size) 
        pos.y = grid.size * Math.round(pos.y/grid.size)
        let newGameObject;
        let temp = [];
        
        for(let i = 0; i < copiedObjects.length; i++) //aby se bloky neprekrivaly
        {
            let pos2 = {x:copiedObjects[i].x + pos.x,y: copiedObjects[i].y + pos.y}
            for(let j = 0; j < AllGameObjects.length;j++)
            {
                if((currentLayer == AllGameObjects[i].layer) && (pos2.x == AllGameObjects[j].x && pos2.y == AllGameObjects[j].y))
                {
                    return;
                }
                else if(copiedObjects[i].tag == "player" && AllGameObjects[j].tag == "player")
                {
                    AllGameObjects.splice(j,1)
                }
            }
        }

        for(let i = 0; i < copiedObjects.length; i++)
        {
            let pos2 = {x:copiedObjects[i].x + pos.x,y: copiedObjects[i].y + pos.y}
            switch(copiedObjects[i].tag)
            {
                case "player": //(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic,speed,hp)
                    newGameObject = new Player(pos2.x,pos2.y,grid.size,grid.size,currentLayer,copiedObjects[i].sprites,"player",idCount,true,false,7)
                break;
                case "wall":    //(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic)
                    newGameObject = new PhysicGameObjects(pos2.x,pos2.y,grid.size,grid.size,currentLayer,copiedObjects[i].sprites,"wall",idCount,copiedObjects[i].haveCollision,true)
                break;
                case "enemy":   //(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic)
                    newGameObject = new Enemy(pos2.x, pos2.y, grid.size, grid.size, currentLayer ,copiedObjects[i].sprites,"enemy",idCount,true,false)
                break;
            }
            
            temp.push(idCount)
            AllGameObjects.push(newGameObject);
            idCount++;
        }
        history.push({type:0, objects:temp}) 
        undoHistory = [];
    }
    else
    {
        let pos = CanvasToWorld(x,y)
        pos.x = grid.size * Math.round(pos.x/grid.size)
        pos.y = grid.size * Math.round(pos.y/grid.size)

        let newGameObject;

        
        for(let i = 0; i < AllGameObjects.length;i++)
        {
            if((currentLayer == AllGameObjects[i].layer) && (pos.x == AllGameObjects[i].x && pos.y == AllGameObjects[i].y))
            {
                return;
            }
            else if(currentBlock.type == "player" && AllGameObjects[i].tag == "player")
            {
                AllGameObjects.splice(i,1)
            }
        }


        switch(currentBlock.type)
        {
            case "player": //(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic,speed,hp)
                newGameObject = new Player(pos.x,pos.y,grid.size,grid.size,currentLayer,currentBlock.sprites,"player",idCount,true,false,7)
            break;
            case "wall":    //(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic)
                newGameObject = new PhysicGameObjects(pos.x,pos.y,grid.size,grid.size,currentLayer,currentBlock.sprites,"wall",idCount,currentBlock.haveCollision,true)
            break;
            case "enemy":   //(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic)
                newGameObject = new Enemy(pos.x, pos.y, grid.size, grid.size, currentLayer ,currentBlock.sprites,"enemy",idCount, true,false)
            break;
        }
        
        undoHistory = [];
        AllGameObjects.push(newGameObject);
        history.push({type:0, objects:[idCount]}) //0 add 1 delete 2 move
        idCount++;
    }
}

function removeBlock(x,y) //odebere blok
{

    let pos = CanvasToWorld(x,y)
    pos.x = grid.size * Math.round(pos.x/grid.size)
    pos.y = grid.size * Math.round(pos.y/grid.size)

    
    for(let i = 0; i < AllGameObjects.length;i++)
    {
        
       if((AllLayers || (currentLayer == AllGameObjects[i].layer)) && (pos.x == AllGameObjects[i].x && pos.y == AllGameObjects[i].y))
       {
            history.push({type:1, objects: [AllGameObjects[i]]})
            AllGameObjects.splice(i,1)
       }
    }
}

function findSelectedBlocks() //najde označené objekty
{
    selectedObjects = [];
    for(let i = 0; i < AllGameObjects.length;i++)
    {
        if((AllLayers || (currentLayer == AllGameObjects[i].layer)) && (((AllGameObjects[i].x + AllGameObjects[i].width/2 > selectPos.strart.x && AllGameObjects[i].x - AllGameObjects[i].width/2 < selectPos.end.x ) || 
        (AllGameObjects[i].x - AllGameObjects[i].width/2 < selectPos.strart.x && AllGameObjects[i].x + AllGameObjects[i].width/2 > selectPos.end.x))&&
        ((AllGameObjects[i].y - AllGameObjects[i].height/2 < selectPos.strart.y && AllGameObjects[i].y + AllGameObjects[i].height/2 > selectPos.end.y ) || 
        (AllGameObjects[i].y + AllGameObjects[i].height/2 > selectPos.strart.y && AllGameObjects[i].y - AllGameObjects[i].height/2 < selectPos.end.y))))
        {
            selectedObjects.push(AllGameObjects[i])
        }
    }
}

function onTextureClick(obj) //změní momentálně vybraný objekt
{
    currentBlock = obj
    selectedObjects = [];
    copiedObjects = [];
    if(currentTool != 1)
    {
        paintTool()
    }
}

function addTexturesToDiv() //přidá textury na front-end
{
    for(let i = 0; i < Textures.length;i++)
    {
        const blocky = document.createElement("div");
        document.getElementById("textury").appendChild(blocky)
        blocky.setAttribute("id", "block[" + i + "]");
        blocky.classList.add("hover-text");
        const newDiv = document.createElement("img");
        newDiv.src = sprites[Textures[i].sprites][0][0].src
        newDiv.setAttribute("onclick","onTextureClick("+JSON.stringify(Textures[i])+")");
        newDiv.setAttribute("id", "block[" + i + "]");
        document.getElementById("block[" + i + "]").appendChild(newDiv) 
        const popisDivu = document.createElement("span");
        document.getElementById("block[" + i + "]").appendChild(popisDivu)
        popisDivu.innerHTML=Textures[i].text;
        popisDivu.classList.add("visible");

    }
}

function downloadMap()  //stáhne mapu
{
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(AllGameObjects)], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = "mapa.json";
    a.click();
}

function importMap()  //importuje mapu
{
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = ".json"

    input.onchange = _ => {
        let file = input.files[0];
        let reader = new FileReader();
        reader.readAsText(file);

        reader.addEventListener('load', (event) => {
          let jsonData = event.target.result;
          AllGameObjects = JSON.parse(jsonData);
        });
       
    };

    input.click();
    selectedObjects = [];
    undoHistory = [];
    history = [];
}

async function loadSprites()  //načte všechny textury do pole
{
    let temp;
    await fetch("../textureLoader.json")
    .then((response) => response.json())
    .then((json) => temp = json);


    for(let i = 0; i < temp.length; i++)
    {
        let animTemp = []
        for(let j = 0; j < temp[i].length; j++)
        {
            let currTemp = []
            for(let k = 0; k < temp[i][j].length; k++)
            {
                let imgTemp = new Image()
                imgTemp.src = temp[i][j][k]
                currTemp.push(imgTemp)
            }
            animTemp.push(currTemp)
        }
        sprites.push(animTemp);
    }
}

function paintTool()    //přepínání nástroje pro malování
{
    if(currentTool == 1)
    {
        buttons.paint.style.color = "rgba(24, 24, 24, 0.79)"
        currentTool = 0;
    }
    else
    {
        buttons.move.style.color = "rgba(24, 24, 24, 0.79)"
        buttons.paint.style.color = "rgba(255,255,255,1)"
        currentTool = 1;
    }
}

function moveTool() //přepínání nástroje pro pohyb s objekty
{
    if(currentTool == 2)
    {
        buttons.move.style.color = "rgba(24, 24, 24, 0.79)"
        currentTool = 0;
    }
    else
    {
        buttons.move.style.color = "rgba(255,255,255,1)"
        buttons.paint.style.color = "rgba(24, 24, 24, 0.79)"
        currentTool = 2;
    }
}

function layerChange(value) //pokud se zmení input vrstvy
{
    currentLayer = value;
    selectedObjects = [];
}

function updateLayerInput() //aktualizace inputu vrstvy
{
    let input = document.getElementById("LayerInput");
    input.value = currentLayer;
}

function AllLayersChange(value) //pokud se zmení checkbox pro vsechny vrstvy
{
    AllLayers = value;
    selectedObjects = [];
}

function updateAllLayerInput() //aktualizace checkboxu pro vsechny vrstvy
{
    let input = document.getElementById("AllLayerInput");
    input.checked = AllLayers;
}

//----- MODAL ---------
var modal = document.getElementById("myModal");

var btn = document.getElementById("myBtn");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function() 
{
  modal.style.display = "block";
}

span.onclick = function() 
{
  modal.style.display = "none";
}

window.onclick = function(event) 
{
  if (event.target == modal) 
  {
    modal.style.display = "none";
  }
}
//--------------------------------------------------

canvas.addEventListener("mousedown", (e)=>  
{ 
    if(currentTool != 2) //pokud je vybraný move tool tam vymaže označení je pokud uživatel klikne vedle označených objektů
    {
        selectedObjects = [];
    }
    else
    {
        let temp = CanvasToWorld(e.offsetX,e.offsetY)
        let posX = grid.size * Math.round(temp.x/grid.size) 
        let posY = grid.size * Math.round(temp.y/grid.size)

        let onPos = false;
        
        selectedObjects.forEach(el => 
        {
            if(el.x == posX && el.y == posY)
            {
                onPos = true;
            }
        })

        if(!onPos)
        {
            selectedObjects = []; 
        }
    }

    if(e.button == 0 && e.shiftKey) //pro označování
    {   
        isSelecting = true;
        let temp = CanvasToWorld(e.offsetX,e.offsetY)
        selectPos.strart.x = temp.x
        selectPos.strart.y = temp.y
        selectPos.end.x = temp.x
        selectPos.end.y = temp.y
    }
    else if(e.button == 1) //pro pohyb - koleško myši
    {
        isDraging = true;
        editorCamera.dragPosition.x = e.offsetX - editorCamera.position.x
        editorCamera.dragPosition.y = e.offsetY - editorCamera.position.y;
    }
    else if(e.button == 0 && (currentBlock != null || copiedObjects.length != 0) && currentTool == 1) //podmínka pro přidání objektu
    {
        addBlock(e.offsetX,e.offsetY)
    }
    else if(e.button == 0 && currentTool == 2)  //podmínka pro pohyb s objektem
    {  
        let temp = CanvasToWorld(e.offsetX,e.offsetY)

        if(selectedObjects.length == 0)
        {
            selectPos.strart.x = temp.x
            selectPos.strart.y = temp.y
            selectPos.end.x = temp.x
            selectPos.end.y = temp.y
            findSelectedBlocks();
        }

        movingPos.x = temp.x;
        movingPos.y = temp.y
        isMoving = true;
        movingObjectsStartPos = [];

        selectedObjects.forEach(el =>
        {
            movingObjectsStartPos.push({id:el.id,x:el.x,y:el.y})
        })
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
    else if(isMoving)
    {
        let CurrentPos = CanvasToWorld(e.offsetX,e.offsetY)
        let currX = grid.size * Math.round(CurrentPos.x/grid.size) 
        let currY = grid.size * Math.round(CurrentPos.y/grid.size)
        let startX = grid.size * Math.round(movingPos.x/grid.size) 
        let startY = grid.size * Math.round(movingPos.y/grid.size)

        for(let j = 0; j < selectedObjects.length; j++)
        {
            for(let i = 0; i < movingObjectsStartPos.length; i++) //kontrola pro prekriti (optimalizace neni idealni chtelo by to opravit)
            {
                if(selectedObjects[j].id == movingObjectsStartPos[i].id)
                {
                    for(let k = 0; k < AllGameObjects.length; k++)
                        {
                            let isInArr = false;
                            for(let l = 0; l < selectedObjects.length; l++) 
                            {
                                if(selectedObjects[l].id == AllGameObjects[k].id)
                                {
                                    isInArr = true;
                                    break;
                                }
                            }
                            
                            if(!isInArr && ((AllGameObjects[k].x == (movingObjectsStartPos[i].x + (currX - startX))) && (AllGameObjects[k].y == (movingObjectsStartPos[i].y + (currY - startY)))))
                            {
                                return                              
                            }
                        }
                        
                    }
                }      
            }


        selectedObjects.forEach(el =>
        {
            for(let i = 0; i < movingObjectsStartPos.length; i++) //posunuti objektu
            {
                if(el.id == movingObjectsStartPos[i].id)
                {
                    el.x = movingObjectsStartPos[i].x + (currX - startX)
                    el.y = movingObjectsStartPos[i].y + (currY - startY)
                    break;
                }
            }
        })
    }

    if(e.buttons == 1 && (currentBlock != null || copiedObjects.length != 0) && !e.shiftKey) //opakované přidávání objektů
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
        findSelectedBlocks();
    }
    else if(isMoving)
    {
        if(selectedObjects.length != 0)
        {
            history.push({type:2,objects:movingObjectsStartPos})
        }
        isMoving = false;
    }
});

document.addEventListener("keydown", (e) => 
{
    switch(e.code)
    {
        case "Space":   //vrati na startující pozici na mapě
            editorCamera.position.x = 0;
            editorCamera.position.y = 0;
            editorCamera.zoom = 1;
        break;

        case "Delete":  //vymaze vsechny oznacene objekty
            if(selectedObjects.length != 0)
            {
                for(let i = 0; i < selectedObjects.length;i++)
                {
                    for(let j = 0; j < AllGameObjects.length; j++)
                    {
                        if(selectedObjects[i].id == AllGameObjects[j].id)
                        {
                            AllGameObjects.splice(j,1);
                        }
                    }
                }
                history.push({type: 1, objects: selectedObjects});
                selectedObjects = [];
            }
        break;

        case "KeyR": //otočení zkopírovaných objektu
            if(copiedObjects.length != 0)
            {
                copiedObjects.forEach(el =>
                {
                    let temp = el.x;
                    el.x = el.y;
                    el.y = -temp;
                })
            }
        break;

        case "KeyB": //nástroj pro malování
            if(currentTool != 1)
            {
                paintTool();
            }
        break;

        case "KeyM": //nástroj pro pohyb s objekty
            if(currentTool != 2)
            {
                moveTool()
            } 
        break;

        case "ArrowUp": //měnění vrstvy
            if(currentLayer != 10)
            {
                currentLayer++
                updateLayerInput()
            }
        break;

        case "ArrowDown": //měnění vrstvy
            if(currentLayer != -10)
            {
                currentLayer--
                updateLayerInput()
            }
        break;

        case "KeyW": //měnění vrstvy
            if(currentLayer != 10)
            {
                currentLayer++
                updateLayerInput()
            }
        break;

        case "KeyS": //měnění vrstvy
            if(currentLayer != -10)
            {
                currentLayer--
                updateLayerInput()
            }
        break;

        case "KeyE": //zobrazení všech vrstev
        {
            AllLayers = !AllLayers;
            updateAllLayerInput()
        }
    }

    if(e.code == "KeyZ" && e.ctrlKey) //Undo
    {
        selectedObjects = [];
        
        if(history.length != 0)
        {
            if(history[history.length-1].type == 0) //typ pridaní objektu
            {
                let temp = []
                for(let i = 0; i < AllGameObjects.length; i++)
                {
                    for(let j = 0; j < history[history.length-1].objects.length;j++)
                    {
                        if(AllGameObjects[i].id == history[history.length-1].objects[j])
                        {
                            temp.push(AllGameObjects[i]);
                            AllGameObjects.splice(i,1)
                        }
                    }
                }
                undoHistory.push({type:0,objects: temp});
                history.pop()
            }
            else if(history[history.length-1].type == 1) //typ odebraní objektu
            {
                let temp = []
                for(let i = 0; i < history[history.length-1].objects.length;i++)
                {
                    AllGameObjects.push(history[history.length-1].objects[i])
                    temp.push(history[history.length-1].objects[i].id)
                }
             
                undoHistory.push({type:1,objects: temp});
                history.pop();
            }
            else if(history[history.length-1].type == 2)//typ pohnuti s objektem
            {
                let temp = [];
                history[history.length-1].objects.forEach(obj =>
                {
                    for(let i = 0; i < AllGameObjects.length;i++)
                    {
                        if(obj.id == AllGameObjects[i].id)
                        {
                            temp.push({id:obj.id,x:AllGameObjects[i].x,y:AllGameObjects[i].y})
                            AllGameObjects[i].x = obj.x;
                            AllGameObjects[i].y = obj.y;
                        }
                    }
                })
                undoHistory.push({type: 2, objects: temp})
                history.pop();
            }
        }
    }
    else if(e.code == "KeyX" && e.ctrlKey) //Redo
    {
        selectedObjects = [];

        if(undoHistory.length != 0)
        {
            if(undoHistory[undoHistory.length-1].type == 0)//typ pridaní objektu
            {
                let temp = []
                for(let i = 0; i < undoHistory[undoHistory.length-1].objects.length; i++)
                {
                    AllGameObjects.push(undoHistory[undoHistory.length-1].objects[i])
                    temp.push(undoHistory[undoHistory.length-1].objects[i].id)
                }
                history.push({type:0,objects: temp});
                undoHistory.pop();
            }
            else if(undoHistory[undoHistory.length-1].type == 1)//typ odebraní objektu
            {
                let temp = [];
                for(let i = 0; i < AllGameObjects.length; i++)
                {
                    for(let j = 0; j < undoHistory[undoHistory.length-1].objects.length;j++)
                    {
                        if(AllGameObjects[i].id == undoHistory[undoHistory.length-1].objects[j])
                        {
                            console.log(i)
                            temp.push(AllGameObjects[i]);
                            AllGameObjects.splice(i,1)  //nefunguje tu break tak jsem ho oddelal vsude
                        }
                    } 
                }
                history.push({type:1,objects: temp});
                undoHistory.pop()
            }
            else if(undoHistory[undoHistory.length-1].type == 2)//typ pohnuti s objektem
            {
                let temp = [];
                undoHistory[undoHistory.length-1].objects.forEach(obj =>
                {
                    for(let i = 0; i < AllGameObjects.length;i++)
                    {
                        if(obj.id == AllGameObjects[i].id)
                        {
                            temp.push({id:obj.id,x:AllGameObjects[i].x,y:AllGameObjects[i].y})
                            AllGameObjects[i].x = obj.x;
                            AllGameObjects[i].y = obj.y;
                        }
                    }
                })
                history.push({type: 2, objects: temp})
                undoHistory.pop();
            }
        }
    }
    else if(e.code == "KeyC" && e.ctrlKey) //Copy, najde stred oznacených objektu
    {
        if(selectedObjects.length == 0)
            return;
        
        currentBlock = null;;
        copiedObjects = [];

        let minX = selectedObjects[0].x
        let maxX = selectedObjects[0].x
        let minY = selectedObjects[0].y
        let maxY = selectedObjects[0].y

        selectedObjects.forEach(element => 
        {
            if(element.x < minX)
            {
                minX = element.x
            }

            if(element.x > maxX)
            {
                maxX = element.x
            }

            if(element.y < minY)
            {
                minY = element.y
            }

            if(element.y > maxY)
            {
                maxY = element.y
            }
        })

        let stredX = (minX +((maxX-minX)/2));
        let stredY = (minY +((maxY-minY)/2));

        if(stredX % grid.size != 0)
        {
            stredX -= grid.size/2
        }

        if(stredY % grid.size != 0)
        {
            stredY -= grid.size/2
        }

        selectedObjects.forEach(el =>
        {
            copiedObjects.push(JSON.parse(JSON.stringify(el))) //kvuli referenci
            copiedObjects[copiedObjects.length-1].x -= stredX
            copiedObjects[copiedObjects.length-1].y -= stredY
        })
    }
    else if(e.code == "KeyA" && e.shiftKey) //vybere vsechny objekty
    {
        AllGameObjects.forEach(el => 
        {
            if(AllLayers || (el.layer == currentLayer))
            {
                selectedObjects.push(el)
            }
        })
        
    }
})

canvas.addEventListener("wheel", (e)=>  //přibližování kamery
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
