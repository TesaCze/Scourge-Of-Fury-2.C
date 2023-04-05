class tiles {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    canvasPos() {
        return {
            x: this.x + canvas.width / 2 - this.width / 2,
            y: -this.y + canvas.height / 2 - this.height / 2,
        };
    }

}

class GameObjects {
    constructor(x, y, width, height, layer, haveCollision) {
        this.x = x;
        this.y = y,
        this.width = width,
        this.height = height;
        this.layer = layer;
        this.haveCollision = haveCollision;
        this.sprites = [];
        
    }

    getCurrentSprite(sprites) {

    }
}

class PhysicGameObjects extends GameObjects {
    constructor(x, y, width, height, layer, haveCollision, sprites) {
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
            
    constructor(
        x,
        y,
        width,
        height,
        color,
        speed,
        velocity,
        isColliding
    ) {
        super(x, y, width,height, velocity)
        this.isColliding = false;
        this.dir = {left:false, right: false, up:false, down:false}
        this.x = 50;
        this.y = 50;
        this.speed = 7;
        this.color = color;
    }

    canvasPos() {
        return {
            x: this.x + canvas.width / 2 - this.width / 2,
            y: -this.y + canvas.height / 2 - this.height / 2,
        };
    }

    move() {
        this.x += this.speed * this.dir.right;
        this.x -= this.speed * this.dir.left;
        this.y -= this.speed * this.dir.down;
        this.y += this.speed * this.dir.up;
        
    }

    kolize(blok) {

        //pridat vsemu jestli maji kolize
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
                camera
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

    Update(AllGameObjects) {
        this.move()
        for (let i = 0; i < AllGameObjects.length; i++) {
            this.kolize(AllGameObjects[i]) 
        }

      
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
            ctx.fillStyle = this.AllGameObjects[i].color;
            ctx.fillRect(
                this.AllGameObjects[i].canvasPos().x,
                this.AllGameObjects[i].canvasPos().y,
                this.AllGameObjects[i].width,
                this.AllGameObjects[i].height
            );
            
        }
    
    }

    Render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.DrawLayers()
    }
    
    ToCanvas() {

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
        this.Render();
    }
 
    SpawnObjects() {
        
    }

    SortLayers() {
        this.AllGameObjects.sort(function(a, b){return a - b});
        
    }
}