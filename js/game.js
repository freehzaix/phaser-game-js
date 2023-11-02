const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var platforms, player, cursors, stars, bombs;
var score = 0;
var scoreText;
var button = document.querySelector("button");

function preload()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('brick', 'assets/brick.png');
    this.load.image('star', 'assets/coin.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('perso',
        'assets/perso.png',
        { frameWidth: 41.33333333333333, frameHeight: 36 }
    );
}


function create()
{
    this.add.image(config.width/2, config.height/2, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(config.width/2, 600, 'brick').setScale(25, 5).refreshBody();

    platforms.create(19, 426, 'brick').setScale(3, 1).refreshBody();
    platforms.create(255, 350, 'brick').setScale(4, 1).refreshBody();
    platforms.create(455, 435, 'brick').setScale(3, 1).refreshBody();
    platforms.create(675, 425, 'brick').setScale(3, 1).refreshBody();

    player = this.physics.add.sprite(100, config.height/2, 'perso');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);


    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('perso', { start: 11, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'perso', frame: 2 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('perso', { start: 3, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    
    stars.children.iterate(function (child) {
    
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    
    });

    bombs = this.physics.add.group();

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

}

function update()
{
    cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }

}

function collectStar (player, star)
{
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;

    if(gameOver){
        button.style.display = "block";
    }else{
        button.style.display = "none";
    }
}

function rejouer()
{
    document.location.href = "index.html";
}