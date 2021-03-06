class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
        var highscore = 0;
    }
    
    

    preload() {
        // load images/tile sprites
      //  this.load.image('rocket', './assets/rocket.png');
      //  this.load.image('spaceship', './assets/spaceship.png');
      //  this.load.image('starfield', './assets/starfield.png');

        // ***************MOD ASSETS**********************
        this.load.image('horseman', './assets/horseman.png');
        this.load.image('wildwest', './assets/wildwest.png');
        this.load.image('bullet', './assets/bullet.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'wildwest').setOrigin(0, 0);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // player 2 controls
        keyA = this.input.keyboard.addKey("A");
        keyD = this.input.keyboard.addKey("D");
        keyW = this.input.keyboard.addKey("W");
        
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width,
            borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, 
            borderUISize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0,0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height,
            0xFFFFFF).setOrigin(0,0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2+40, game.config.height - borderUISize - borderPadding,
            'bullet', 0, keyLEFT, keyRIGHT, keyF).setOrigin(0.5, 0);
        // MODDED add rocket (p2)
        this.p2Rocket = new Rocket(this, game.config.width/2-40, game.config.height - borderUISize - borderPadding,
            'bullet', 0, keyA, keyD, keyW).setOrigin(0.5, 0);
        
        // add spaceships (x3)
        this.ship01 = new Spaceship (this, game.config.width + borderUISize*6, borderUISize*4, 'horseman', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship (this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'horseman', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship (this, game.config.width, + borderUISize*6 + borderPadding*4, 'horseman', 0, 10).setOrigin(0, 0);


        

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}), frameRate: 30
        });

        // initialize score
        this.p1Score = 0;
          // display score
        let playConfig = {
        fontFamily: 'Courier',
        fontSize: '28px',
        backgroundColor: '#F3B141',
        color: '#843605',
        align: 'right',
        padding: {
            top: 5,
            bottom: 5,
        },
            fixedWidth: 100
        }

        this.p1Score = 0;
          // display score
        let tinyConfig = {
        fontFamily: 'Courier',
        fontSize: '12px',
        backgroundColor: '#F3B141',
        color: '#843605',
        align: 'right',
        padding: {
            top: 5,
            bottom: 5,
        },
            fixedWidth: 20
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, playConfig);
        
        // GAME OVER flag
        this.gameOver = false;


        // 60-second play clock
        playConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => { // game.settings.gameTimer
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', playConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', playConfig).setOrigin(0.5);
                this.gameOver = true;
        }, null, this);

        // FIRE UI
        this.add.text(game.config.width/2, game.config.height/4 - borderUISize -
             borderPadding, 'FIRE', playConfig).setOrigin(0.5);

        // Initialize highScore
    }

    update() {
        // check input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        
        if (!this.gameOver) {
            this.starfield.tilePositionX -= 4;
            this.p1Rocket.update();             // update player movement
            this.p2Rocket.update();
            this.ship01.update();               // update 3 different ships
            this.ship02.update();
            this.ship03.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

        // MODDED check collisions for p2
        if(this.checkCollision(this.p2Rocket, this.ship03)){
            this.p2Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p2Rocket, this.ship02)){
            this.p2Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p2Rocket, this.ship01)){
            this.p2Rocket.reset();
            this.shipExplode(this.ship01);
        }

               // 30 second speed increase
       var timer = this.time.delayedCall(30000, () => {
            if (this.ship01.moveSpeed == game.settings.spaceshipSpeed){
                this.ship01.moveSpeed += 3; this.ship02.moveSpeed += 3; this.ship03.moveSpeed += 3;
            }
        }, null, this);
    }

    checkCollision(rocket, ship) {
        // AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');                 // play explode animation
        boom.on('animationcomplete', () => {        // callback after anim completes
            ship.reset();                           // reset ship position
            ship.alpha = 1;                         // make ship visible again
            boom.destroy();                         // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        this.sound.play('sfx_grunt');
    }

}