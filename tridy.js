class GameObjects{
    constructor(x, y, width, height, layer, haveCollision, sprites,tag, canMove) {
        this.x = x;
        this.y = y,
        this.width = width,
        this.height = height;
        this.layer = layer;
        this.haveCollision = haveCollision;
        this.sprites = sprites;
        this.tag = tag;
        this.canMove = canMove;
        this.currentSprite = 0;
    }

}

class PhysicGameObjects extends GameObjects {
    constructor(x, y, width, height, layer, haveCollision, sprites,tag, canMove) {
        super(x, y, width, height, layer, haveCollision, sprites,tag, canMove)

    } 

    Collider() {

    }

    CollideWith() {

    }

    UpdateX(AllGameObjects) {
        for (let i = 0; i < AllGameObjects.length; i++) {
            this.kolize(AllGameObjects[i]) 

        }
    }

    kolize(blok) {

        if (blok.haveCollision == true) {

            if (
                this.y + this.height / 2 > blok.y - blok.height / 2 &&
                this.y - this.height / 2 < blok.y + blok.height / 2 &&
                this.x - this.width / 2 < blok.x + blok.width / 2 &&
                this.x + this.width / 2 > blok.x - blok.width / 2
        ) {
            this.isColliding = true;

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
                this.velocity = 0;
            } else if (
                down < Math.abs(top) &&
                down < Math.abs(right) &&
                down < left
            ) {
                this.y += down+1;
                this.velocity = 0;
                this.jumpCount = 0;
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
        } else {
            this.isColliding = false;
        }
        }

        let player;
        
        for(let i = 0; i < AllGameObjects.length; i++) {
            if(AllGameObjects[i].tag == "player") {
                player = AllGameObjects[i]
                break;
            }
        }      

        if(blok.canMove == true && this.isColliding == true) {
            blok.x += this.speed * player.dir.right;
            blok.x -= this.speed * player.dir.left;
            blok.y -= this.speed * player.dir.down;
            blok.y += this.speed * player.dir.up;
          
        }

        if(blok.tag == "wall" && this.isColliding == true) {
     
        }
        
    }
  
}

class Player extends PhysicGameObjects{
            
    constructor(x, y, width, height, layer, haveCollision, sprites,tag, canMove,speed, hp) {
        super(x, y, width, height, layer, haveCollision, sprites,tag, canMove)
        this.isColliding = false;
        this.dir = {left:false, right: false, up:false, down:false}
        this.speed = 5;
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

    move() {
        this.x += this.speed * this.dir.right;
        this.x -= this.speed * this.dir.left;
        this.y -= this.speed * this.dir.down;
        this.y += this.speed * this.dir.up;
        camera.x = this.x;
        camera.y = this.y;
    }

    Health() {

    }

    Update(AllGameObjects) {
        this.Health();
        this.move()
      
    }
}

class Sword extends GameObjects {
    constructor(x, y, width, height, layer, haveCollision, texture, canMove) {
        super(x, y, width, height, layer, haveCollision, texture, canMove)
        this.isAttacking = false;    
    }

    
}

class Enemy extends PhysicGameObjects{
    constructor(x, y, width, height, layer, haveCollision, sprites, tag, canMove) {
        super(x, y, width, height, layer, haveCollision, sprites,tag, canMove)
        this.isColliding = false;
        this.speed = 6;
        this.isAttacking = false;
    }

    Move(AllGameObjects) {
    let player;
        for(let i = 0; i < AllGameObjects.length; i++) {
            if(AllGameObjects[i].tag == "player") {
                player = AllGameObjects[i]
                break;
            }
        }
      
        let dir = this.Direction(player)

        this.x += dir.x * this.speed;
        this.y += dir.y * this.speed;
    }

    //--------------Toban------------

    Magnitude(pos){
        return Math.sqrt((pos.x * pos.x) + (pos.y * pos.y));
    }

    Normalized(pos){
        let m = this.Magnitude(pos);
        return {x:(pos.x / m), y:(pos.y / m)}
    }
    Distance(player){
        return Math.sqrt((player.x - this.x)* (player.x - this.x) + (player.y - this.y) *(player.y - this.y))
    }
    
    Direction(player){
        let dir = {x:player.x-this.x, y: player.y - this.y}
        return (this.Normalized(dir))
    }

    //-----------------------------

    Kolize() {

    }

    Update(AllGameObjects) {
        this.UpdateX(AllGameObjects)
        this.Move(AllGameObjects);
       
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