let canvas = document.getElementById("kanvas");
let ctx = canvas.getContext("2d");

//----------------------------------Tady se muze cokoliv nastavit--------------------------
let grid = {lineColor:"#bfbfbf",lineWidth:0.5,size:50}



//-----------------------------------------Nesahat-----------------------------------------
let editorCamera = {zoom:1, zoomSpeed: 0.1,position:{x:0,y:0},dragPosition:{x:0,y:0}}
let isDraging = false;

Start();

function Start()
{
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

    for(let i = 0; i < canvas.height/grid.size ; i++)
    {
        ctx.beginPath();
        ctx.moveTo(0, i * grid.size *editorCamera.zoom  + editorCamera.position.y);
        ctx.lineTo(canvas.width, i * grid.size * editorCamera.zoom  + editorCamera.position.y);
        ctx.stroke();
    }

    for(let i = 0; i < canvas.width/grid.size ; i++)
    {
        ctx.beginPath();
        ctx.moveTo(i * grid.size * editorCamera.zoom  + editorCamera.position.x,0 );
        ctx.lineTo(i * grid.size * editorCamera.zoom  + editorCamera.position.x, canvas.height);
        ctx.stroke();
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
   
        editorCamera.position.x +=  startPos.x - endPos.x + editorCamera.position.x * editorCamera.zoomSpeed;
        editorCamera.position.y +=  startPos.y - endPos.y + editorCamera.position.y * editorCamera.zoomSpeed;
    }
    else
    {
        editorCamera.zoom -= editorCamera.zoomSpeed * editorCamera.zoom;

        endPos.x = startPos.x * (editorCamera.zoomSpeed + 1);
        endPos.y = startPos.y * (editorCamera.zoomSpeed + 1);
   
        editorCamera.position.x -=  startPos.x - endPos.x + editorCamera.position.x * editorCamera.zoomSpeed;
        editorCamera.position.y -=  startPos.y - endPos.y + editorCamera.position.y * editorCamera.zoomSpeed;
    }
});

canvas.addEventListener("mousedown", (e)=> 
{ 
    isDraging = true;
    editorCamera.dragPosition.x = e.offsetX - editorCamera.position.x
    editorCamera.dragPosition.y = e.offsetY - editorCamera.position.y;
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