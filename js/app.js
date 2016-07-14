// Enemies our player must avoid
var Character = function(img, x, y){
    this.sprite = 'images/'+img;
    this.x = x;
    this.y = y;
    this.limitCollision = 50;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Character.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(dt){
        if (!this.currentSpeed){
            this.currentSpeed = this.possibleSpeeds[Math.floor(Math.random() * this.possibleSpeeds.length)];
        }
        if(this.x > 500){
            this.currentSpeed = this.possibleSpeeds[Math.floor(Math.random() * this.possibleSpeeds.length)] * dt;
            this.x = -100;
            this.y = this.possibleY[Math.floor(Math.random() * this.possibleY.length)];
        }

        this.x = this.x + (this.currentSpeed);
        this.checkCollision(player);
    }
};
// Draw the enemy on the screen, required method for game
Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Enemy = function(img, x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.possibleX = [0, 101, 202, 303, 404];
    this.possibleY = [63, 146, 229];
    this.possibleSpeeds = [200, 300, 400];
    this.currentSpeed = undefined;
    Character.call(this, img, -100, this.possibleY[Math.floor(Math.random() * this.possibleY.length)]);
};
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.generateAleatory = function(qtd) {
    var enemies = [];
    for (var i = 0; i < qtd; i++) {
        enemies.push(new Enemy('enemy-bug.png'));
    }
    return enemies;
};
Enemy.prototype.getAllPositions = function(enemies) {
    var positions = {
        x: [],
        y: []
    };

    for (var i = 0; i < enemies.length; i++) {
        positions.x.push(enemies[i].x);
        positions.y.push(enemies[i].y);
    }

    return positions;
};
Enemy.prototype.checkCollision = function(player){
    if(player.dangerousPlaces.indexOf(player.y) < 0)
        return;
    else{
        var min = this.x - this.limitCollision;
        var max = this.x + this.limitCollision;
        if(player.y == this.y)
            if(player.x >= min && player.x <= max){
                console.log('try again!');
                player.backStart();
            }
    }
};
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(img, x, y){
    this.verticalMovement = 83;
    this.horizontalMovement = 101;
    this.dangerousPlaces = [63, 146, 229];
    Character.call(this, img, x, y);
};
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;
Player.prototype.handleInput = function(code){
    switch(code){
        case 'left':
            if (this.x > 0) this.x = this.x - this.horizontalMovement;
            break;
        case 'up':
            if (this.y > 63)
                this.y = this.y - this.verticalMovement;
            else{
                this.backStart();
            }
            break;
        case 'down':
            if (this.y < 320) this.y = this.y + this.verticalMovement;
            break;
        case 'right':
            if (this.x < 400) this.x = this.x + this.horizontalMovement;
            break;
    }

    this.checkCollision(Enemy.prototype.getAllPositions(allEnemies));
};
Player.prototype.backStart = function(){
    this.y = 395;
};
Player.prototype.checkCollision = function(positions){
    if(this.dangerousPlaces.indexOf(this.y) < 0)
        return;
    else{
        for (var i = 0; i < positions.x.length; i++) {
            var min = this.x - this.limitCollision;
            var max = this.x + this.limitCollision;
            if(positions.y[i] == this.y)
                if(positions.x[i] >= min && positions.x[i] <= max){
                    console.log('try again!');
                    this.backStart();
                    break;
                }
        }
    }
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = Enemy.prototype.generateAleatory(3);
var player = new Player('char-boy.png', 200, 395);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
