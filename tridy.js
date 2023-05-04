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
        /*let playerDetection;
        for(let i = 0; i < this.AllGameObjects.length; i++) {
            if(this.AllGameObjects[i].tag == "player") {
                playplayerDetectioner = this.AllGameObjects[i]
                break;
            }
        }*/
        


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
            
    constructor(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic,speed,hp){
        super(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic)
        this.isColliding = false;
        this.dir = {left:false, right: false, up:false, down:false}
        this.speed = 8;
        this.isAttacking = false;
        this.hp = 100;

        document.addEventListener("keypress", (event) => {
            switch (event.key) {
                case "a":
                    this.dir.left = true;
                    break;
                case "w":
                    this.dir.up = true;
                    break;
                case "d":
                    this.dir.right = true;
                    break;
                case "s":
                    this.dir.down = true;
                    break;
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
    
    AnimationSwitch() {
        let playerAnimations = [];
        
    }

    Move() {
        this.x += this.speed * this.dir.right;
        this.x -= this.speed * this.dir.left;
        this.y -= this.speed * this.dir.down;
        this.y += this.speed * this.dir.up;
        camera.x = this.x;
        camera.y = this.y;
    }

    Health() {

    }


    Update() 
    {
        this.Move() 
        this.PhysicCollider();
        this.Health();
    }
}

class Sword extends GameObjects {
    constructor(x, y, width, height, layer, haveCollision, texture, canMove) {
        super(x, y, width, height, layer, haveCollision, texture, canMove)
        this.isAttacking = false;    
    }

    
}

class Enemy extends PhysicGameObjects{
    constructor(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic) {
        super(x, y, width, height, layer, sprites,tag,id, haveCollision,isStatic)
        this.speed = 5;
        this.isAttacking = false;
        this.isSeeing = false;

        this.traceX = traceX;
        this.traceY = traceY;
    }


    Move() {                //movement script pro enemy
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
        } else {
            this.RerurnToLocation();
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
        for(let i = 0; i < this.AllGameObjects.length; i++) {
            if(this.AllGameObjects[i].tag == "enemy") {
                enemy = this.AllGameObjects[i]
                break;
            }
        }

         
            let dir = {x:player.x-enemy.x, y: player.y - enemy.y}
            this.isSeeing = true;
            for(let i = 0; i < 10; i++)
            {
                let x = enemy.x + (dir.x/10*i)
                let y = enemy.y + (dir.y/10*i)
              
                for(let i = 0; i < this.AllGameObjects.length; i++) {
                    if(this.AllGameObjects[i].haveCollision == true && this.AllGameObjects[i].tag == "wall") {
                        let wallCollide = this.AllGameObjects[i]
                        if(this.Distance(enemy, player) > 600 || (y < wallCollide.y +wallCollide.height /2 &&
                            y > wallCollide.y - wallCollide.height /2 &&
                            x > wallCollide.x - wallCollide.width /2  &&
                            x < wallCollide.x + wallCollide.width /2  )
                            ) 
                            {
                                this.isSeeing = false
                                break;
                            }
                    }
            }

           /* for(let i = 0; i < 10; i++)
            {
                let x = enemy.x + (dir.x/10*i)
                let y = enemy.y + (dir.y/10*i)

                
                ctx.beginPath();
                if(isSeeing)
                {
                    ctx.fillStyle = "rgba(255, 0, 0, 0.2)"
                    //Enemy.
                }
                else
                {
                    ctx.fillStyle = "rgba(200, 200, 200, 0.1)"
                }
                ctx.arc(x - this.camera.x + this.canvas.width/2 , -y + this.camera.y + this.canvas.height/2 , 10, 0, Math.PI * 2);
                ctx.fill();
            }*/


        
        }

        

        console.log(this.isSeeing);

    }
    
    traceX = this.x;
    traceY = this.y;

    RerurnToLocation() {            //vrati enemy na pozici na spawnu
        //console.log(this.traceX + " " + this.traceY)

            this.x += this.traceX* this.speed;
            this.y += this.traceY * this.speed; 
    }
    

    Distance(enemmy, player) {
        return Math.sqrt((player.x - enemmy.x)* (player.x - enemmy.x) + (player.y - enemmy.y) *(player.y - enemmy.y))
    }

    Update() {
        this.Move();
        this.FindPlayer();
        this.PhysicCollider();
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

    /*SpriteSwitch() {
        let currSprite; 
        for (let i = 1; i < this.AllGameObjects.currentSprite.length; i++) {
            currSprite++;
        }
    }*/

    DrawLayers() {
        //this.SpriteSwitch();
        for (let i = 0; i < this.AllGameObjects.length; i++) {
            let texture = new Image(75, 75);
                texture.src = this.AllGameObjects[i].sprites[0];
            ctx.drawImage(texture, this.canvasPos(this.AllGameObjects[i]).x - this.camera.x, this.canvasPos(this.AllGameObjects[i]).y + this.camera.y, 75, 75);        
        }
    }

    PlayerHealth() {
        addEventListener("keyup", (event) => {
            if(event.key == "p") {
                this.Hit();
            }
        });

        ctx.fillStyle='#fff';
        ctx.fillRect(canvas.width - 120, canvas.height - 75, 90, 40);  
        ctx.font = "20px Arial";
        ctx.fillStyle = "black"
        ctx.fillText(this.playerHp + "/30", canvas.width - 100, canvas.height - 50);
        if(this.isColliding == true) {
            return 0;
        }
    }    
    
    Hit() {
        this.playerHp --;
    }



    Render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.DrawLayers();
        //this.FindPlayer();
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
        this.SortLayers();
        this.Render();
    }
 
    SpawnObjects() {
        
    }

    SortLayers() {
        this.AllGameObjects.sort(function(a, b)
        {return a.layer - b.layer});
    }
}