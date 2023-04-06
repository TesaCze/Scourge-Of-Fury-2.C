class GameObjects {
    constructor(x, y, width, height, layer, haveCollision, sprites, canMove) {
        this.x = x;
        this.y = y,
        this.width = width,
        this.height = height;
        this.layer = layer;
        this.haveCollision = haveCollision;
        this.sprites = [];
       // this.texture = new Image(75, 75);
        //this.texture.src = texture;
        this.canMove = canMove;
     
        
    }

}

class PhysicGameObjects extends GameObjects {
    constructor(x, y, width, height, layer, haveCollision, sprites, canMove) {
        super(x, y, width, height, layer, haveCollision, sprites)
        console.log(x)
    } 

    Collider() {

    }

    CollideWith() {

    }

    Update() {
        
    }

    

}

class Player extends PhysicGameObjects{
            
    constructor(x, y, width, height, layer, haveCollision, sprites, canMove,speed) {
        super(x, y, width, height, layer, haveCollision, sprites, canMove)
        this.isColliding = false;
        this.dir = {left:false, right: false, up:false, down:false}
        this.speed = 7;
        this.isAttacking = false;
     
    }

    move() {
        this.x += this.speed * this.dir.right;
        this.x -= this.speed * this.dir.left;
        this.y -= this.speed * this.dir.down;
        this.y += this.speed * this.dir.up;
        camera.x = this.x;
        camera.y = this.y;
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

        if(blok.canMove == true && this.isColliding == true) {
            blok.x += this.speed * this.dir.right;
            blok.x -= this.speed * this.dir.left;
            blok.y -= this.speed * this.dir.down;
            blok.y += this.speed * this.dir.up;
          
        }
        
    }

    Update(AllGameObjects) {
        this.move()
        for (let i = 0; i < AllGameObjects.length; i++) {
            this.kolize(AllGameObjects[i]) 
        }
      
    }
}

class Sword extends GameObjects {
    constructor(x, y, width, height, layer, haveCollision, texture, canMove) {
        super(x, y, width, height, layer, haveCollision, texture, canMove)
        this.isAttacking = false;    
    }

    
}

class Enemy extends PhysicGameObjects{
    
    Move() {

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

class Game {
    constructor(ctx, canvas, camera) {
        this.AllGameObjects = [],
        this.ctx = ctx,
        this.canvas = canvas,
        this.camera = camera
    }

    DrawLayers() {
        for (let i = 0; i < this.AllGameObjects.length; i++) {
            ctx.drawImage(this.AllGameObjects[i].texture, this.canvasPos(this.AllGameObjects[i]).x - this.camera.x, this.canvasPos(this.AllGameObjects[i]).y + this.camera.y, 75, 75);        
        }
        sword.x = player1.x + player1.width/2;
        sword.y = player1.y;
        console.log(this.AllGameObjects)
    }

    Render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.DrawLayers()
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