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
                this.y + this.height / 2 > blok.y - blok.height / 2 && //kontroluje kolize od středu objektu
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
        this.isColliding = false;                                       //kontroluje zda koliduje
        this.dir = {left:false, right: false, up:false, down:false}     //kontroluje smer hrace pro movement
        this.speed = 8;                                                 //rychlost hrace
        this.isAttacking = false;                                       //kontroluje zda hrac utoci
        this.hp = 10;                                                   //pocet zivotu hrace
        this.isFlipped = false;                                         //prevraceni spritu hrace
        this.isAlive = true;                                            //kontroluje zda hráč žije
        this.lost = false;                                              //prohra
        this.won = false;                                               //výhra
        this.walkingSoundIsPlaying = false;                             //přehrávání zvuku chůze
        this.isHit = false;                                             //hráč dostal damage od nepřítele

        document.addEventListener("keypress", (event) => {          //event na movement a převrácení
            if(this.isAlive == true && this.won == false && this.lost == false) {
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
    }

    Move() {            //movement hráče
        if(this.isHit == false && this.won == false && this.lost == false) {
            this.x += this.speed * this.dir.right;
            this.x -= this.speed * this.dir.left;
            this.y -= this.speed * this.dir.down;
            this.y += this.speed * this.dir.up;
            
            if(this.dir.up == true || this.dir.right == true || this.dir.down == true || this.dir.left == true) {
                if(this.isHit == false) {
                    this.currentAnimation = 1;
                }
            } else {
                if(this.isHit == false) {
                    this.currentAnimation = 0;
                }
            } 
        }
        
    }

    Health() {          //kontroluje kolize mezi nepritelem a hracem a ubere zivoty
        let enemy;
        for(let i = 0; i < this.AllGameObjects.length; i++) {
            if(this.AllGameObjects[i].tag == "enemy") {
                enemy = this.AllGameObjects[i]
                break;
            }
        }

        for(let i = 0; i < this.AllGameObjects.length; i++) {
            if(this.AllGameObjects[i].tag == "enemy" && enemy.canAttack == true && this.AllGameObjects[i].currentAnimation != 2) {
                if (
                    (this.y + this.height / 2) + 10 >= (this.AllGameObjects[i].y - this.AllGameObjects[i].height / 2) - 10 &&
                    (this.y - this.height / 2) - 10 <= (this.AllGameObjects[i].y + this.AllGameObjects[i].height / 2) + 10&&
                    (this.x - this.width / 2) - 10 <= (this.AllGameObjects[i].x + this.AllGameObjects[i].width / 2) + 10 &&
                    (this.x + this.width / 2) + 10 >= (this.AllGameObjects[i].x - this.AllGameObjects[i].width / 2) - 10
                    ) 
                {
                    enemy.canAttack = false;
                    this.isHit = true;
                    this.hp--;
                    setTimeout(() => {
                        enemy.canAttack = true;
                    }, 1000);
                    setTimeout(() => {
                        this.isHit = false;
                    }, 300);

                    if(this.isAlive == true) {
                        let playerDamage = new Audio("../Sounds/playerDamage.wav")
                        playerDamage.volume = 0.1;
                        playerDamage.play();
                    }
                    
            }
            if(this.isHit == true) {        //změna animace na zasáhnutí
                this.currentSprite = 0;
                this.currentAnimation = 3;
            }
            if(this.hp <= 0) {              //smrt hráče
                this.isAlive = false;
                this.hp = 0;
                this.lost = true;
            }

                if(this.isAlive == false) {      //animace smrti
                    this.currentAnimation = 2;                   
                } 
            }
        }       
    }

    Update() {
        let walk = new Audio("../Sounds/walk.wav")
        walk.volume = 0.3;
        if((this.dir.left == true || this.dir.right == true || this.dir.up == true || this.dir.down == true) && this.walkingSoundIsPlaying  == false && this.won == false) {
            this.walkingSoundIsPlaying = true
            walk.play();
            setTimeout(()=>{
                this.walkingSoundIsPlaying = false
            },480)
        }

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
        this.isAttacking = false;               //kontroluje zda hráč útočí
        this.isFlipped = false;                 //převracuje sprite meče
        this.canAttack = true;                  //zabrňuje neustálé útočení
        this.haveCollision = false;             //kontorluje kolize

        canvas.addEventListener("click", (event) => {       
            let player;
        for(let i = 0; i < this.AllGameObjects.length; i++) {
                if(this.AllGameObjects[i].tag == "player") {
                    player = this.AllGameObjects[i]
                    break;
                }
            }
            let swordHit = new Audio("../Sounds/swordHit.wav")      //přehraje zvuk na klik 
            if(this.canAttack == true && player.isHit == false && player.isAlive == true && player.won == false) {
                swordHit.volume = 0.3;
                swordHit.play();
                this.Attack();
                this.canAttack = false;
                setTimeout(() => {
                    this.canAttack = true;
                }, 370);
        }      
            
        })
        document.addEventListener("keypress", (event) => {
            let player;
            for(let i = 0; i < this.AllGameObjects.length; i++) {
                    if(this.AllGameObjects[i].tag == "player") {
                        player = this.AllGameObjects[i]
                        break;
                    }
                }
            if(player.isAlive == true) {          
                switch (event.key) {
                    case "a":
                        this.isFlipped = true;
                        break;
                    case "d":
                        this.isFlipped = false;
                        break;
                }
            }
        });
    }

    Move() {        //nastavuje pozici meče na pozici hráče
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

    Attack() {          //přehrávání animace útoku
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
        this.speed = 5;                 //rychlost nepřítele
        this.isAttacking = false;       //kontroluje zda nepřítel může útočit
        this.isSeeing = false;          //kontroluje zda nepřítel vidí hráče
        this.traceX = this.x + 1;           //vubec nevim proc tam musi byt +1 ale bez toho to nefaka
        this.traceY = this.y;           //puvodni pozice hrace
        this.walls = [];                //array se všemi pozicemi stěn
        this.lastX = x;                 //kontroluje zda se hrac hybe
        this.lastY = y;
        this.isFlipped = false;         //prevraceni spritu hrace
        this.canAttack = true;          //kontroluje zda nepřítel může útočit
        this.isDead = false;            //smrt nepřítele
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

        if(this.currentAnimation != 2) {        //pokud hrac neni zasazen, prehraje animace behu nebo stani
            if(Math.floor(this.lastX) == Math.floor(this.x) && Math.floor(this.lastY) == Math.floor(this.y)) {
                this.currentAnimation = 0;
            } else {
                this.currentAnimation = 1;
            }
        }
        

        }

    Magnitude(pos){             //delka kolik ma nepritel ujit
        return Math.sqrt((pos.x * pos.x) + (pos.y * pos.y));
    }

    Normalized(pos){            //min -1 max 1, zpracuje smer 
        let m = this.Magnitude(pos);
        return {x:(pos.x / m), y:(pos.y / m)}
    }
    
    Direction(player){          //vypocita směr kam ma nepritel jit
        let dir = {x:player.x-this.x, y: player.y - this.y}
        return (this.Normalized(dir))
    }

    FindPlayer() {                      // kontroluje zda enemy vidi hrace
        let player;
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
    
    RetMagnitude(pos){          //delka kolik ma nepritel ujit
        return Math.sqrt((pos.x * pos.x) + (pos.y * pos.y));
    }

    RetNormalized(pos){         //min -1 max 1, zpracuje smer 
        let m = this.RetMagnitude(pos);
        return {x:(pos.x / m), y:(pos.y / m)}
    }
    
    RetDirection(){             //urcuje smer na spawn
        let dir = {x:this.traceX-this.x, y: this.traceY - this.y}
        return (this.RetNormalized(dir))
    }

    Distance(player) {          //vzdálenost mezi nepritelem a hracem
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
                if ((this.y + this.height / 2 + 2) > this.walls[y].y - this.walls[y].height / 2 &&  //kontrola kolizi
                    (this.y - this.height / 2 - 2) < this.walls[y].y + this.walls[y].height / 2 &&
                    (this.x - this.width / 2 - 2) < this.walls[y].x + this.walls[y].width / 2 &&
                    (this.x + this.width / 2 + 2) > this.walls[y].x - this.walls[y].width / 2) {

                let top = this.walls[y].y - this.walls[y].height / 2 - (this.y + this.height / 2);
                let down = this.walls[y].y + this.walls[y].height / 2 - (this.y - this.height / 2);
                let right = this.walls[y].x - this.walls[y].width / 2 - (this.x + this.width / 2);
                let left = this.walls[y].x + this.walls[y].width / 2 - (this.x - this.width / 2);

                let currX;
                let currY;
    
                if (                            //vyhybani se stenam
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

    Hit() {                 //smrt nepritele
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
                this.layer = -1; 
                this.haveCollision = false;
                this.isDead = true;
            }    
        }
    }

    Update() {
        if(this.currentAnimation != 2) {    //kdyz nepritel zemre update se vypne
            this.Move();
            this.Hit();
            this.WallCollision();
            this.FindPlayer();
            this.PhysicCollider();
        }

    }
    
}

class Camera {          //slouzi pro pozicovani hrace na stred obrazovky
    constructor(x, y) {
        this.x = x,     //pozice X
        this.y = y      //pozice Y
    }
}

class Game{
    constructor(ctx, canvas, camera) {
        this.AllGameObjects = [];       //array se vsemi objekty
        this.ctx = ctx;                 //2d context canvasu
        this.canvas = canvas;           //canvas
        this.camera = camera            //kamera
        this.enemyCount = 0;            //pocet nepratel
        this.sprites = []; //0 - hrac, 1 - enemy, 2 - hp, 3 - sword, // 4...12 - tiles
        this.playerHp = 10;             //pocet zivotu
        this.LoadSprites()              //nacteni spritu
    }

    async LoadSprites() //prednacte sprity
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
                    let imgTemp = new Image(75,75)
                    imgTemp.src = temp[i][j][k]
                    currTemp.push(imgTemp)
                }
                animTemp.push(currTemp)
            }
            this.sprites.push(animTemp);
        }
    }

    EnemyStartCount()       //spocita pocet nepratel pri spusteni
    {
        for(let i = 0; i < this.AllGameObjects.length; i++) {
            if(this.AllGameObjects[i].tag == "enemy") {
                this.enemyCount++;
            }
        }
    }

    AnimationUpdate() {       //meni animace
        for(let i = 0; i < this.AllGameObjects.length; i++) {
             if(this.AllGameObjects[i].currentSprite == this.sprites[this.AllGameObjects[i].sprites][this.AllGameObjects[i].currentAnimation].length - 1) {
                this.AllGameObjects[i].currentSprite = 0;
            } else {
                this.AllGameObjects[i].currentSprite++;
            }  
        }
    }

    DrawLayers() {          //vykreslovani objektu a prevraceni
        for (let i = 0; i < this.AllGameObjects.length; i++) {

            let texture = this.sprites[this.AllGameObjects[i].sprites][this.AllGameObjects[i].currentAnimation][this.AllGameObjects[i].currentSprite];
            
            if(this.AllGameObjects[i].isFlipped == false) //kontroluje zda je hrac/nepritel prevraceny
            {
                ctx.drawImage(texture, this.canvasPos(this.AllGameObjects[i]).x - this.camera.x, this.canvasPos(this.AllGameObjects[i]).y + this.camera.y, 75, 75); 
            }
            else 
            {
                ctx.scale(-1, 1);
                ctx.drawImage(texture, -(this.canvasPos(this.AllGameObjects[i]).x - this.camera.x) - texture.width, this.canvasPos(this.AllGameObjects[i]).y + this.camera.y, 75, 75);   
                ctx.scale(-1,1);
            }
        }
    }

    PlayerHealth() {        //vyzobrazovani zivotu na UI
        let player;
        for(let i = 0; i < this.AllGameObjects.length; i++) {
            if(this.AllGameObjects[i].tag == "player") {
                player = this.AllGameObjects[i]
                break;
            }
        }

        let yOffset = 20;       //margin z vrchu
        let xOffset = 20;       //margin z leveho rohu
        let space = 30;         //mezera mezi srdicky
        let HeartSize = 30;     //velikost srdicek

        let fullHp = this.sprites[2][0][0];     //plne srdicko

        let empty = this.sprites[2][2][0];      //prazdne srdicko

        let half = this.sprites[2][1][0];       //poloprazdne srdicko

       for(let i = 0; i < 5; i++)       //zmena plneho srdicka na poloprazdne po zasazeni
        {
            if(player.hp >= i*2 +2)
            {
                this.ctx.drawImage(fullHp,xOffset + i * space,yOffset,HeartSize,HeartSize)
            }
            else if(player.hp >= i*2 +1)
            {
                this.ctx.drawImage(half,xOffset + i * space,yOffset,HeartSize,HeartSize)
            }
            else
            {
                this.ctx.drawImage(empty,xOffset + i * space,yOffset,HeartSize,HeartSize)
            }
        }
    }    
    
    YouDied() {         //obrazovka po umrti hrace
        let player;
        for(let i = 0; i < this.AllGameObjects.length; i++) {
            if(this.AllGameObjects[i].tag == "player") {
                player = this.AllGameObjects[i]
                break;
            }
        }

        if(player.lost == true) {
            ctx.beginPath();
            this.ctx.fillStyle = "rgba(150, 0, 0, 0.2)";
            ctx.fillRect(0, 0, canvas.width, this.canvas.height);
            ctx.stroke();
            this.ctx.font = "50px VT323"
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("You died", canvas.width/2, canvas.height/2);
            this.ctx.font = "25px VT323"
            ctx.fillStyle = "white";
            ctx.fillText("Press Ctrl + R to play again", canvas.width/2 + 100, canvas.height/2 + 30); 
        }
        
    }

    YouWon() {          //obrazovka po vyhre
        let player;
        for(let i = 0; i < this.AllGameObjects.length; i++) {
            if(this.AllGameObjects[i].tag == "player") {
                player = this.AllGameObjects[i]
                break;
            }
        }

        if(player.won == true) {
            ctx.beginPath();
            this.ctx.fillStyle = "rgba(0, 190, 0, 0.1)";
            ctx.fillRect(0, 0, canvas.width, this.canvas.height);
            ctx.stroke();
            this.ctx.font = "50px VT323"
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("You Won!", canvas.width/2, canvas.height/2);
            this.ctx.font = "25px VT323"
            ctx.fillStyle = "white";
            ctx.fillText("Press Ctrl + R to play again", canvas.width/2 + 100, canvas.height/2 + 30);
        }
    }

    EnemyCount() {          //pocita prubezny pocet nepratel
        let player;
        for(let i = 0; i < this.AllGameObjects.length; i++) {
            if(this.AllGameObjects[i].tag == "player") {
                player = this.AllGameObjects[i]
                break;
            }
        }
        let currCount = 0;
        for(let i = 0; i < this.AllGameObjects.length; i++) {
            if(this.AllGameObjects[i].tag == "enemy" && this.AllGameObjects[i].currentAnimation != 2) {
                currCount++;
            }
        }

        this.ctx.font = "25px VT323"
        ctx.fillStyle = "white";
        ctx.fillText("Enemy count: " + currCount + " / " + this.enemyCount, 25, 80); 
        if(currCount == 0) {
            player.won = true;
        }
    }

    Hit() {         //ubira zivoty hracovi
        if(this.playerHp > 0) {
            this.playerHp --;
        }
    }

    Render() {         //vykreslovani canvasu a UI
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.DrawLayers();
        this.PlayerHealth();
    }

    canvasPos(GameObjects) {        //nastavi center point objektu na stred
        return {
            x: GameObjects.x + canvas.width / 2 - GameObjects.width / 2,
            y: -GameObjects.y + canvas.height / 2 - GameObjects.height / 2,
        };
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
        this.EnemyCount();
        this.YouWon();
        this.YouDied();
    }

    SortLayers() {      //seradi layers
        this.AllGameObjects.sort(function(a, b)
        {return a.layer - b.layer});
    }
}
