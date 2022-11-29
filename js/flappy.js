// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    game.load.image("playerImg", "../assets/ship_noflame.png");
    game.load.audio("score", "../assets/point.ogg");
    game.load.audio("background","../assets/background.mp3")
    game.load.audio("fire","../assets/fire.wav")
    game.load.audio("explode","../assets/explode.wav")
    game.load.image("pipe","../assets/spacepipe_half.png");
    game.load.image("pipeEnd","../assets/spacepipe-end.png");
    game.load.image("asteroid","../assets/meteor.png");
    game.load.image("backdrop","../assets/Starfield.png");
    game.load.image("Planet_01","../assets/planet_01.png");
    game.load.image("Planet_02","../assets/planet_02.png");
    game.load.image("Planet_03","../assets/planet_03.png");
    game.load.image("laser","../assets/laser.png");
    game.load.image("scorer","../assets/scorer.png");
    game.load.spritesheet("mute","../assets/mute.png",64,64)
    game.load.spritesheet("pause","../assets/pause.png",32,32)
    jQuery("#greeting-form").on("submit", function(event_details) {
        var greeting = "Hello ";
        var name = jQuery("#fullName").val();
        var greeting_message = greeting + name;
        alert(greeting_message);
    });
}
//declaring global variables
var score;
score = 0;
var labelScore;
var player;
var pipes = [];
var meteors = [];
var lasers = [];
var scorers = [];
var planets = [];
var pipeInterval;
var splashDisplay1;
var splashDisplay2;
var background;
var background1;
var background2;
var backgroundVelocity;
var backgroundWidth;
var mute;
var pause;
var failSplash1;
var failSplash2;
var failSplash3;
/*
 * Initialises the game. This function is only called once.
 */

//Key Handlers
//Makes the player Jump
function playerJump() {
    player.body.velocity.y = -375;
}
//Makes the player Drop
function playerDrop() {
    player.body.velocity.y = 375;
}
//Slows the player Down
function playerStop() {
    player.body.velocity.y = 0;
}
    //Space Bar Handler
function spaceHandler() {
    createLaser();
    game.sound.play("fire");
}
    //Up Arrow Handler
function upHandler() {
    playerJump()
}
    //Down Arrow Handler
function downHandler() {
    playerDrop()
}
//Space Bar stopper
function spaceStopper() {
    playerStop()
}
//Up Arrow Handler
function upStopper() {
    playerStop()
}
//Down Arrow Handler
function downStopper() {
    playerStop()
}
//Adds to the score
function increaseScore(){
    score = score + 1;
    reScore();
    labelScore.setText(score.toString());
    if(25 % score == 0 && score != 1){

        randomPlanet()
    }
}
function decreaseScore(){
    score = score - 1;
    reScore();
    labelScore.setText(score.toString());
}
//Adds a pipe block to (x, y)
function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x,y,"pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = pipeSpeed;
}
//Adds a pipe end to (x, y)
function addPipeEnd(x, y) {
    var pipeBlock = game.add.sprite(x,y,"pipeEnd");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = pipeSpeed;
}
function addMeteor(x, y) {
    var meteor = game.add.sprite(x,y,"asteroid");
    meteors.push(meteor);
    game.physics.arcade.enable(meteor);
    meteor.body.velocity.x = pipeSpeed;
}
function createWave(){
    var generate;
    generate = game.rnd.integerInRange(1,10);
    if(generate == 5){
        generateBelt();
    }
    else{
        generatePipe();
    }
}
function randomPlanet(){
    var type = game.rnd.integerInRange(1, 3);
    var rand = game.rnd.integerInRange(0,272)
    var planet
    if(type == 1){
        planet = game.add.sprite(790,rand,"Planet_01");
    }
    else if(type == 2){
        planet = game.add.sprite(790,rand,"Planet_02");
    }
    else if(type == 3){
        planet = game.add.sprite(790,rand,"Planet_03");
    }
    planets.push(planet);
    game.physics.arcade.enable(planet);
    planet.body.velocity.x = -20;
}
function addScorer(x,y){
    var scorer = game.add.sprite(x,y,"scorer");
    scorers.push(scorer);
    game.physics.arcade.enable(scorer);
    scorer.body.velocity.x = pipeSpeed;
}
function createLaser(){
    var laser = game.add.sprite(player.x+80,player.y+20,"laser");
    lasers.push(laser);
    game.physics.arcade.enable(laser);
    laser.body.velocity.x = 350;
}
//Creates a pipe
function generatePipe(){
    var gapStart = game.rnd.integerInRange(3, 13);
    for (var count=0; count<16; count=count+1) {
        if(count != gapStart && count != gapStart + 1 && count != gapStart -1 && count != gapStart -2 && count != gapStart +2) {
            addPipeBlock(790, count * 25);
        }
        else if(count == gapStart + 2){
            addPipeEnd(788, count * 25+13);
        }
        else if(count == gapStart -2){
            addPipeEnd(788, count * 25-5);
        }
        else if(count == gapStart -1 ){
            addScorer(788, count * 25);
        }

    }
    //changeScore();
}
//Creates an asteroid belt
function generateBelt(){
    var generate;
    for (var count=0; count<16; count=count+1) {
            generate = game.rnd.integerInRange(1,3);
        if(generate != 1) {
            addMeteor(750, count * 50);
        }
    }
    //changeScore();
}
function onMute(){
    if(mute.frame == 0){
        mute.frame = 1;
        game.sound.mute = true;
    }
    else if(mute.frame == 1){
        mute.frame = 0;
        game.sound.mute = false;
    }
}
function reScore(){
    labelScore.destroy();
    labelScore = game.add.text(20, 20, score.toString(),
        {font: "30px Arial", fill: "#FFFFFF"});
}
//Adds to the speed counter, which increases speed once it hits 5
function create() {
    game.sound.play("background");

    mute = game.add.sprite(726,336,"mute")
    mute.frame = 0;
    mute.inputEnabled = true;
    mute.events.onInputDown.add(onMute);
    splashDisplay1 = game.add.text(20,100, "Press ENTER to start, UP and Down to move, SPACE fires an asteroid-destroying laser",
        {font: "19px Arial", fill: "#FFFFFF"});
    splashDisplay2 = game.add.text(20,300, "Fly through pipe: 1 point. Destroy an asteroid: 1 point, Shoot a pipe: -1 point",
        {font: "19px Arial", fill: "#FFFFFF"});
    game.stage.setBackgroundColor("000000");
    labelScore = game.add.text(20, 20, "0",
        {font: "30px Arial", fill: "#FFFFFF"});


    game.physics.arcade.enable(labelScore);
    player = game.add.sprite(100,200,"playerImg");
    game.physics.arcade.enable(player);
    game.input
        .keyboard.addKey(Phaser.Keyboard.ENTER)
        .onDown.add(start);
}

function start(){
    backgroundVelocity = 20;
    backgroundWidth = 790;
    background1 = game.add.sprite(0,0, "backdrop");
    game.physics.arcade.enable(background1);
    background1.body.velocity.x = -backgroundVelocity;

    background2 = game.add.sprite(backgroundWidth,0, "backdrop");


    game.physics.arcade.enable(background2);
    background2.body.velocity.x = -backgroundVelocity;

    game.time.events.loop((backgroundWidth / backgroundVelocity) * Phaser.Timer.SECOND, function(){
        var background = game.add.sprite(backgroundWidth,0, "backdrop");
        game.physics.arcade.enable(background);
        background.body.velocity.x = -backgroundVelocity;

    });
    mute.kill();
    splashDisplay1.destroy(); //Kills the splash screen
    splashDisplay2.destroy(); //Kills the splash screen
    pipeSpeed = -400; //Defines the pipe speed
    game.physics.startSystem(Phaser.Physics.ARCADE); //enables physics
    //adding up arrow handler
    game.input
        .keyboard.addKey(Phaser.Keyboard.UP)
        .onDown.add(upHandler);
    //adding down arrow handler
    game.input
        .keyboard.addKey(Phaser.Keyboard.DOWN)
        .onDown.add(downHandler);
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onUp.add(spaceStopper);
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);
    //adding up arrow handler
    game.input
        .keyboard.addKey(Phaser.Keyboard.UP)
        .onUp.add(upStopper);
    //adding down arrow handler
    game.input
        .keyboard.addKey(Phaser.Keyboard.DOWN)
        .onUp.add(downStopper);
    //player.body.gravity.y = 500;

    pipeInterval = 0.9; //Defines the pipe interval
    //creates a pipe at a delay
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
        createWave);
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start); //stops a glitch

}
function update() {

    for(var o=meteors.length - 1; o >= 0; o--){
        for(var i=lasers.length-1; i>=0; i--){
            game.physics.arcade.overlap(lasers[i],meteors[o], function() {
                meteors[o].destroy();
                lasers[i].destroy();
                increaseScore();
            });
            }
            }
    for(var i=lasers.length-1; i>=0; i--){
        game.physics.arcade.overlap(lasers[i],pipes, function(){
            lasers[i].destroy();
            decreaseScore();
        });
    }
    game.physics.arcade
        .overlap(player,pipes,
    gameOver);
    for(var i=scorers.length-1; i>=0; i--){
        game.physics.arcade.overlap(scorers[i],player, function(){
            scorers[i].destroy();
            increaseScore();
        });
    }
game.physics.arcade
        .overlap(player,meteors,
     gameOver);
    if(player.body.y < 0) {
        gameOver();
    }
    if(player.body.y > 400){
        gameOver();
    }
    player.bringToTop();

    for(var i = lasers.length - 1; i >= 0; i--) {
    if(lasers[i].body.x > 790) {
        lasers[i].destroy();
        lasers.splice(i, 1);
        decreaseScore()
    }
}
}
for(var i = pipes.length - 1; i >= 0; i--) {
    if(pipes[i].body.x < 0) {
        pipes[i].destroy();
        pipes.splice(i, 1);
    }
}
for(var i = meteors.length - 1; i >= 0; i--) {
    if(meteors[i].body.x < 0) {
        meteors[i].destroy();
        meteors.splice(i, 1);
    }
}
function gameOver(){
    game.paused = true;
    $("#score").val(score.toString());
    failSplash1 = game.add.text(300,100, "You Lose!",
        {font: "35px Arial", fill: "#FFFFFF"});
    failSplash2 = game.add.text(300,200, "You scored: " + score + " points",
        {font: "25px Arial", fill: "#FFFFFF"});
    failSplash3 = game.add.text(300,300, "press enter to restart",
        {font: "25px Arial", fill: "#FFFFFF"});
    game.input
        .keyboard.addKey(Phaser.Keyboard.ENTER)
        .onDown.add(function(){
            $("#score").val(score);
            $("#greeting").show();
            location.reload();
        });

}
$.get("/score", function(scores){
    console.log("Data: ",scores);
});
$.get("/score", function(scores){
    scores.sort(function (scoreA, scoreB){            1
        var difference = scoreB.score - scoreA.score; 2
        return difference;                            3
    });
    for (var i = 0; i < scores.length; i++) {
        $("#scoreBoard").append(
            "<li>" +
            scores[i].name + ": " + scores[i].score +
            "</li>");
    }
});