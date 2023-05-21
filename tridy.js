/*------------------TODO lIST-------------
-predelat vykreslovani
-udelat animace (Player Death, Enemy Death - muze byt proste lebka sprite protoze to mam, Player Hit, Enemy Hit)
-tlacitka a packy

-----------------------------------------*/

class GameObjects{                                                                     // Pouze inicializace nezbytnych promenych
    constructor(x, y, width, height, layer, sprites,tag,id) {
        this.id = id
        this.x = x;                 //x pozice
        this.y = y,                 //y pozice
        this.width = width,         //sirka
        this.height = height;       //vyska
        this.layer = layer;         //vrstva (pri vykreslovani) - mensi vrstva se vykresluje prvni
        this.sprites = sprites;     //[Animation][Snimek]
        this.tag = tag;             //tag
        this.currentAnimation = 0   //Animace z ktere ma vykreslovat
        this.currentSprite = 0;     //Sprite z animace ktery ma vykreslit
        this.AllGameObjects;        //Vsechny objekty ve hre - pro ruzne scripty v updatu
    }

    GetObjectstByTag(tag) //vrati pole objektu s tagem
    {

    }    

    GetObjecttById(id) //vrati Objekt podle id
    {
        
    }  
}

class PhysicGameObjects extends GameObjects //objekty s kolizemi
{

    constructor(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic)
    {
        super(x, y, width, height, layer, sprites,tag,id)
        this.haveCollision = haveCollision;   //Ma kolize 
        this.isStatic = isStatic;  //Je staticky (nebude ovlivnovan colisemi jinych objektu)  
    }

    PhysicCollider() //provede kolize
    {
        for (let i = 0; i < this.AllGameObjects.length; i++) {
            this.Kolize(this.AllGameObjects[i]) 
        }
    }
    

    CollideWith() //vrati array id se kteryma ma kolizi
    {
                   
    }

    Update() //kazdy snimek
    {
        if(!this.isStatic)
        {
            this.PhysicCollider(); 
        }
    }
        
    Kolize(blok) 
    {
        
        if (blok.haveCollision == true) 
        {  
           
            if (
                this.y + this.height / 2 > blok.y - blok.height / 2 &&
                this.y - this.height / 2 < blok.y + blok.height / 2 &&
                this.x - this.width / 2 < blok.x + blok.width / 2 &&
                this.x + this.width / 2 > blok.x - blok.width / 2
                ) 
            {
                let top = blok.y - blok.height / 2 - (this.y + this.height / 2);
                let down = blok.y + blok.height / 2 - (this.y - this.height / 2);
                let right = blok.x - blok.width / 2 - (this.x + this.width / 2);
                let left = blok.x + blok.width / 2 - (this.x - this.width / 2);

                if (
                    Math.abs(top) < down &&
                    Math.abs(top) < Math.abs(right) &&
                    Math.abs(top) < left
                ) {
                    this.y += top;
                } else if (
                    down < Math.abs(top) &&
                    down < Math.abs(right) &&
                    down < left
                ) {
                    this.y += down;
                } else if (
                    left < Math.abs(top) &&
                    left < Math.abs(right) &&
                    left < down
                ) {
                    this.x += left;
                    
                } else if (
                    Math.abs(right) < Math.abs(top) &&
                    Math.abs(right) < left &&
                    Math.abs(right) < down
                ) {
                    this.x += right;
                }
            } 
            
        } 
    }
}

class Player extends PhysicGameObjects{
            
    constructor(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic,speed, hp){
        super(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic)
        this.isColliding = false;
        this.dir = {left:false, right: false, up:false, down:false}
        this.speed = 8;
        this.isAttacking = false;
        this.hp = 10;
        this.isFlipped = false;
        this.isAlive = true;

        document.addEventListener("keypress", (event) => {
            if(this.isAlive == true) {
                switch (event.key) {
                case "a":
                    this.dir.left = true;
                    this.isFlipped = true;
                    break;
                case "w":
                    this.dir.up = true;
                    break;
                case "d":
                    this.dir.right = true;
                    this.isFlipped = false;
                    break;
                case "s":
                    this.dir.down = true;
                    break;
            }
        }
        });
        document.addEventListener("keyup", (event) => {
            switch (event.key) {
                case "a":
                    this.dir.left = false;
                    break;
                case "d":
                    this.dir.right = false;
                    break;
                case "w":
                    this.dir.up = false;
                    break;
                case "s":
                    this.dir.down = false;
            }
        });

        document.addEventListener("click", (event) => {
            return 0;
        })
     
    }

    Move() {
        this.x += this.speed * this.dir.right;
        this.x -= this.speed * this.dir.left;
        this.y -= this.speed * this.dir.down;
        this.y += this.speed * this.dir.up;
        
        if(this.dir.up == true || this.dir.right == true || this.dir.down == true || this.dir.left == true) {
            this.currentAnimation = 1;
        } else {
            this.currentAnimation = 0;
        }
    }

    Health() {
     /*   let player;
        let hp;
        let enemy;
        for(let i = 0; i < this.AllGameObjects.length; i++) {
            if(this.AllGameObjects[i].tag == "player") {
                player = this.AllGameObjects[i]
                break;
            }
        }
        for(let i = 0; i < this.AllGameObjects.length; i++) {
            if(this.AllGameObjects[i].tag == "enemy") {
                enemy = this.AllGameObjects[i]
                break;
            }
        }
        hp = player.hp;
        this.Kolize(enemy);*/

        let enemy;
        for(let i = 0; i < this.AllGameObjects.length; i++) {
            if(this.AllGameObjects[i].tag == "enemy") {
                enemy = this.AllGameObjects[i]
                break;
            }
        }

        if (
            (this.y + this.height / 2) + 10 >= (enemy.y - enemy.height / 2) - 10 &&
            (this.y - this.height / 2) - 10 <= (enemy.y + enemy.height / 2) + 10&&
            (this.x - this.width / 2) - 10 <= (enemy.x + enemy.width / 2) + 10 &&
            (this.x + this.width / 2) + 10 >= (enemy.x - enemy.width / 2) - 10
            ) 
        {
            console.log("penis");
            this.currentAnimation = 3;
        }    

        if(this.isAlive == false) {
            this.currentAnimation = 3;
        } 
    }

    Update() {
        this.Health();
        if(this.isAlive == true) {
            this.Move() 
        }
        this.PhysicCollider();
        camera.x = this.x;
        camera.y = this.y;
    }
}

class Sword extends PhysicGameObjects {
    constructor(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic) {
        super(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic)
        this.isAttacking = false; 
        this.isFlipped = false;
        this.canAttack = true;
        this.haveCollision = false;

        document.addEventListener("click", (event) => {
            if(this.canAttack == true) {
            this.Attack();
            this.canAttack = false;
            setTimeout(() => {
                this.canAttack = true;
            }, 370);
        }      
            
        })
        document.addEventListener("keypress", (event) => {
            switch (event.key) {
                case "a":
                    this.isFlipped = true;
                    break;
                case "d":
                    this.isFlipped = false;
                    break;
            }
        });
    }

    Move() { 
        let player;
        for(let i = 0; i < this.AllGameObjects.length; i++) {
                if(this.AllGameObjects[i].tag == "player") {
                    player = this.AllGameObjects[i]
                    break;
                }
            }


        this.y = player.y + 10;

        if(this.isFlipped == false) {
            this.x = player.x + 50;
            
        } else {
            this.x = player.x-50;
        }

    }

    Attack() {
        let player;
        for(let i = 0; i < this.AllGameObjects.length; i++) {
                if(this.AllGameObjects[i].tag == "player") {
                    player = this.AllGameObjects[i]
                    break;
                }
            }
            if (player.isAlive == true) {
                let enemy;
                for(let i = 0; i < this.AllGameObjects.length; i++) {
                        if(this.AllGameObjects[i].tag == "enemy") {
                            enemy = this.AllGameObjects[i]
                            break;
                        }
                    }  
                this.currentSprite = 0;
                this.currentAnimation = 1;

                setTimeout(() => {
                    this.currentAnimation = 0;
                }, 360);
            }
    }
  

    Update() {
        this.Move();
    }
    
}

class Enemy extends PhysicGameObjects{
    constructor(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic) {
        super(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic)
        this.speed = 5;
        this.isAttacking = false;
        this.isSeeing = false;
        this.traceX = this.x + 1;     //vubec nevim proc tam musi byt +1 ale bez toho to nefaka
        this.traceY = this.y;   
        this.walls = [];
        this.lastX = x;
        this.lastY = y;
        this.isFlipped = false;
    }


    Move() {                             //movement script pro enemy
        if(this.isSeeing == true) {
            let player;
            for(let i = 0; i < this.AllGameObjects.length; i++) {
                if(this.AllGameObjects[i].tag == "player") {
                    player = this.AllGameObjects[i]
                    break;
                }
            }
            
            let dir = this.Direction(player)

            this.x += dir.x * this.speed;
            this.y += dir.y * this.speed; 


            if(dir.x < 0) {
                this.isFlipped = true;
            } else {
                this.isFlipped = false;
            }

        } else {
            let dir = this.RetDirection()

            this.x += dir.x * (this.speed / 1.5);
            this.y += dir.y * (this.speed / 1.5); 

            if(dir.x < 0) {
                this.isFlipped = true;
            } else {
                this.isFlipped = false;
            }
        }

        if(this.currentAnimation != 2) {
            if(Math.floor(this.lastX) == Math.floor(this.x) && Math.floor(this.lastY) == Math.floor(this.y)) {
                this.currentAnimation = 0;
            } else {
                this.currentAnimation = 1;
            }
        }
        

        }
    //--------------Toban------------

    Magnitude(pos){
        return Math.sqrt((pos.x * pos.x) + (pos.y * pos.y));
    }

    Normalized(pos){
        let m = this.Magnitude(pos);
        return {x:(pos.x / m), y:(pos.y / m)}
    }
    
    Direction(player){
        let dir = {x:player.x-this.x, y: player.y - this.y}
        return (this.Normalized(dir))
    }

    //-----------------------------

    FindPlayer() {                      // kontroluje zda enemy vidi hrace
        let player;
        let enemy;
        for(let i = 0; i < this.AllGameObjects.length; i++) {
            if(this.AllGameObjects[i].tag == "player") {
                player = this.AllGameObjects[i]
                break;
            }
        }
             
            let dir = {x:player.x-this.x, y: player.y - this.y}
            this.isSeeing = true;
            for(let i = 0; i < 10; i++)
            {
                let x = this.x + (dir.x/10*i)
                let y = this.y + (dir.y/10*i)
              
                for(let i = 0; i < this.AllGameObjects.length; i++) {
                    if(this.AllGameObjects[i].haveCollision == true && this.AllGameObjects[i].tag == "wall") {
                        let wallCollide = this.AllGameObjects[i]
                        if(this.Distance(player) > 600 || (
                            y < wallCollide.y +wallCollide.height /2 &&
                            y > wallCollide.y - wallCollide.height /2 &&
                            x > wallCollide.x - wallCollide.width /2  &&
                            x < wallCollide.x + wallCollide.width /2)
                            ) 
                            {
                                this.isSeeing = false
                                break;
                            }
                    }
            }
        }

    }
    
    RetMagnitude(pos){
        return Math.sqrt((pos.x * pos.x) + (pos.y * pos.y));
    }

    RetNormalized(pos){
        let m = this.RetMagnitude(pos);
        return {x:(pos.x / m), y:(pos.y / m)}
    }
    
    RetDirection(){
        let dir = {x:this.traceX-this.x, y: this.traceY - this.y}
        return (this.RetNormalized(dir))
    }

    Distance(player) {
        return Math.sqrt((player.x - this.x)* (player.x - this.x) + (player.y - this.y) *(player.y - this.y))
    }

    WallCollision(dir) { //kontroluje zda hrac narazi do sten kdyz se vraci

        this.lastX = this.x;
        this.lastY = this.y;

        this.walls = [];
        for(let i = 0; i < this.AllGameObjects.length; i++) {
            if(this.AllGameObjects[i].tag == "wall" && this.AllGameObjects[i].haveCollision == true) {
                this.walls.push(this.AllGameObjects[i]) 
            }
            for (let y = 0; y < this.walls.length; y++) {
                if ((this.y + this.height / 2 + 2) > this.walls[y].y - this.walls[y].height / 2 &&
                    (this.y - this.height / 2 - 2) < this.walls[y].y + this.walls[y].height / 2 &&
                    (this.x - this.width / 2 - 2) < this.walls[y].x + this.walls[y].width / 2 &&
                    (this.x + this.width / 2 + 2) > this.walls[y].x - this.walls[y].width / 2) {

                let top = this.walls[y].y - this.walls[y].height / 2 - (this.y + this.height / 2);
                let down = this.walls[y].y + this.walls[y].height / 2 - (this.y - this.height / 2);
                let right = this.walls[y].x - this.walls[y].width / 2 - (this.x + this.width / 2);
                let left = this.walls[y].x + this.walls[y].width / 2 - (this.x - this.width / 2);

                let currX;
                let currY;
    
                if (
                    Math.abs(top) < down &&
                    Math.abs(top) < Math.abs(right) &&
                    Math.abs(top) < left
                ) {
                    currY = this.y
                    if(this.lastY == currY) {
                        this.DodgeTop(dir)
                    }
                    
                } else if (
                    down < Math.abs(top) &&
                    down < Math.abs(right) &&
                    down < left
                ) {
                    currY = this.y
                    if(this.lastY == currY) {
                        this.DodgeDown(dir)
                    }
                } else if (
                    left < Math.abs(top) &&
                    left < Math.abs(right) &&
                    left < down
                ) {
                    currX = this.x
                    if(this.lastX == currX) {
                        this.DodgeLeft(dir)
                    }
                    
                } else if (
                    Math.abs(right) < Math.abs(top) &&
                    Math.abs(right) < left &&
                    Math.abs(right) < down
                ) {
                    currX = this.x
                    if(this.lastX == currX) {
                        this.DodgeRight(dir)
                    }
                }
            }
            }
            
        }
    }

    DodgeLeft() {
        this.x += 1;
        this.y -= 1;
    }

    DodgeRight() {
        this.x -= 1;
        this.y -= 1;
    }

    DodgeTop() {
        this.x -= 1;
        this.y -= 1;
    }

    DodgeDown() {
        this.x += 1;
        this.y += 1;
    }

    Hit() {
        let sword;
        for(let i = 0; i < this.AllGameObjects.length; i++) {
            if(this.AllGameObjects[i].tag == "sword") {
                sword = this.AllGameObjects[i]
                break;
            }
        }

        if(sword.currentAnimation == 1) {
            if (
                this.y + this.height / 2 > sword.y - sword.height / 2 &&
                this.y - this.height / 2 < sword.y + sword.height / 2 &&
                this.x - this.width / 2 < sword.x + sword.width / 2 &&
                this.x + this.width / 2 > sword.x - sword.width / 2
                ) 
            {
                this.currentSprite = 0;
                this.currentAnimation = 2;
                this.haveCollision = false;
            }    
        }
    }

    Update() {
        if(this.currentAnimation != 2) {
            this.Move();
            this.Hit();
            this.WallCollision();
            this.FindPlayer();
            this.PhysicCollider();
        }

    }
    
}

class Button extends PhysicGameObjects{

    Pressed() {

    }
}

class MovableBlocks extends PhysicGameObjects{

    Move() {

    }

    Slide() {

    }
   
}

class Camera {
    constructor(x, y, zoom) {
        this.x = x,
        this.y = y,
        this.zoom = zoom
    }
}

class Game{
    constructor(ctx, canvas, camera, playerHp) {
        this.AllGameObjects = [],
        this.ctx = ctx,
        this.canvas = canvas,
        this.camera = camera
        this.playerHp = 30;
    }

    AnimationUpdate() {
        for(let i = 0; i < this.AllGameObjects.length; i++) {
             if(this.AllGameObjects[i].currentSprite == this.AllGameObjects[i].sprites[this.AllGameObjects[i].currentAnimation].length - 1) {
                this.AllGameObjects[i].currentSprite = 0;
            } else {
                this.AllGameObjects[i].currentSprite++;
            }  
        }
    }

    DrawLayers() {
        for (let i = 0; i < this.AllGameObjects.length; i++) {
            let texture = new Image(75, 75);
                texture.src = this.AllGameObjects[i].sprites[this.AllGameObjects[i].currentAnimation][this.AllGameObjects[i].currentSprite];
                if(this.AllGameObjects[i].isFlipped == false) {
                    ctx.drawImage(texture, this.canvasPos(this.AllGameObjects[i]).x - this.camera.x, this.canvasPos(this.AllGameObjects[i]).y + this.camera.y, 75, 75); 
                } else {
                    ctx.scale(-1, 1);
                    ctx.drawImage(texture, -(this.canvasPos(this.AllGameObjects[i]).x - this.camera.x) - texture.width, this.canvasPos(this.AllGameObjects[i]).y + this.camera.y, 75, 75);   
                    ctx.scale(-1,1);
                }
            
        }
    }

    PlayerHealth() {
        let player;
        for(let i = 0; i < this.AllGameObjects.length; i++) {
            if(this.AllGameObjects[i].tag == "player") {
                player = this.AllGameObjects[i]
                break;
            }
        }

        let fullHp = "../animations/Hp/full.png";


        //ctx.drawImage(fullHp, 75, 75, 75, 75);

        //console.log(player.hp);

        addEventListener("keyup", (event) => {
            if(event.key == "p") {
                this.Hit();
            }
        });

    }    
    
    Hit() {
       this.playerHp --;
    }

    Render() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.DrawLayers();
        this.PlayerHealth();
    }
    
    ToCanvas() {

    }

    canvasPos(GameObjects) {
        return {
            x: GameObjects.x + canvas.width / 2 - GameObjects.width / 2,
            y: -GameObjects.y + canvas.height / 2 - GameObjects.height / 2,
        };
    }


    Start() {

    }

    Update() {
        for (let i = 0; i < this.AllGameObjects.length; i++) {
            if(this.AllGameObjects[i].Update != undefined)
            {
                this.AllGameObjects[i].Update(this.AllGameObjects);
            }
        }
        this.PlayerHealth();
        this.SortLayers();
        this.Render();
    }

    SortLayers() {
        this.AllGameObjects.sort(function(a, b)
        {return a.layer - b.layer});
    }
}



/*draw(context, x, y) {
    context.drawImage(this.image, this.frameX, this.frameY, this.spriteWidth, this.spriteHeight, 
        x, y, this.spriteWidth * 2.5, this.spriteHeight * 2.5);
}
setToHalf() {
    this.type = 'half';
    this.tile = this.game.tileObjects[`ui_heart_${this.type}`];
    this.frameX = this.tile.Position.X;
    this.frameY = this.tile.Position.Y;
    this.spriteWidth = this.tile.Width;
    this.spriteHeight = this.tile.Height;
}*/