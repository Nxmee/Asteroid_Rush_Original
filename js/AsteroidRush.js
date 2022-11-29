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
    game.load.audio("background","../assets/audio/music/background.mp3")
    game.load.audio("fire","../assets/audio/sfx/fire.wav")
    game.load.audio("explode","../assets/audio/sfx/explode.wav")
    //game.load.image("pipe","../assets/sprites/pipes/spacepipe_half.png");
    game.load.image("pipe","../assets/sprites/pipes/spacepipe-body_sheet.png");
    game.load.image("pipeEnd","../assets/sprites/pipes/spacepipe-end.png");
    game.load.image("scorer","../assets/sprites/pipes/scorer.png");
    game.load.image("Planet_01","../assets/sprites/planets/planet_01.png");
    game.load.image("Planet_02","../assets/sprites/planets/planet_02.png");
    game.load.image("Planet_03","../assets/sprites/planets/planet_03.png");
    game.load.image("Planet_04","../assets/sprites/planets/planet_04.png");
    game.load.image("Planet_05","../assets/sprites/planets/planet_05.png");
    game.load.image("Planet_06","../assets/sprites/planets/planet_06.png");
    game.load.image("Planet_07","../assets/sprites/planets/planet_07.png");
    game.load.image("Planet_08","../assets/sprites/planets/planet_08.png");
    game.load.image("Planet_09","../assets/sprites/planets/planet_09.png");
    game.load.image("Planet_10","../assets/sprites/planets/planet_10.png");
    game.load.image("Planet_11","../assets/sprites/planets/planet_11.png");
    game.load.image("Planet_12","../assets/sprites/planets/planet_12.png");
    game.load.image("Planet_13","../assets/sprites/planets/planet_13.png");
    game.load.image("Planet_14","../assets/sprites/planets/planet_14.png");
    game.load.image("Planet_15","../assets/sprites/planets/planet_15.png");
    game.load.image("asteroid","../assets/sprites/meteor.png");
    game.load.image("backdrop","../assets/sprites/Starfield.png");
    game.load.image("laser","../assets/sprites/laser.png");
    game.load.spritesheet("mute","../assets/sprites/menu/mute.png",64,64);
    game.load.spritesheet("pause","../assets/sprites/menu/pause.png",32,32);
    game.load.spritesheet("customise","../assets/sprites/menu/customise.png",64,64);
    game.load.spritesheet("difficulty","../assets/sprites/menu/difficulty.png",64,64);
    game.load.image("menu","../assets/sprites/menu/menu.png");
    game.load.image("menu2","../assets/sprites/menu/menu2.png");
    game.load.spritesheet("info","../assets/sprites/menu/info.png",64,64);
    game.load.spritesheet("easy","../assets/sprites/menu/difficulty/easy.png",128,64);
    game.load.spritesheet("medium","../assets/sprites/menu/difficulty/medium.png",128,64);
    game.load.spritesheet("hard","../assets/sprites/menu/difficulty/hard.png",128,64);
    game.load.spritesheet("ultra","../assets/sprites/menu/difficulty/ultra.png",128,64);
    game.load.image("uparrow","../assets/sprites/menu/customise/uparrow.png");
    game.load.image("downarrow","../assets/sprites/menu/customise/downarrow.png");
    game.load.image("pipe1","../assets/sprites/pipes/spacepipe-body.png");
    game.load.image("pipe2","../assets/sprites/pipes/spacepipe-body2.png");
    game.load.image("pipe3","../assets/sprites/pipes/spacepipe-body3.png");
    game.load.spritesheet("playerImg", "../assets/sprites/ship/shipsheet.png",58,40,10);
    game.load.spritesheet("playerImg_dummy", "../assets/sprites/ship/shipsheet_large.png",116,80,10);
    jQuery("#greeting-form").on("submit", function(event_details) {
        var greeting = "Hello ";
        var name = jQuery("#fullName").val();
        var greeting_message = greeting + name;
    });
}

//declaring global variables
var pipetimer;
var score;
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
var playerSpeed;
var asteroidChance;
var menuUp;
var colourmenu;
var diffmenu;
var menu;
var colourbutton;
var diffbutton;
var infobutton;
var colourupbutton;
var colourdownbutton;
var easybutton;
var medbutton;
var hardbutton;
var ultrabutton;
var playerskin;
var paused;
var menuText;
var SkinDraw;
var difficulty;
var infoOpen;
var gamePlaying;
gamePlaying = 0;

if(typeof(Storage) !== "undefined") {
    if(parseInt(localStorage.getItem("Skin")) != NaN){
        playerskin = parseInt(localStorage.getItem("Skin"));
    }
    else {
        playerskin = 0;
        console.log("it didn't save")
    }
} else {
    playerskin = 0;
    console.log("Storage undefined")
}
difficulty = "Medium"
if(typeof(Storage) !== "undefined") {
    if(localStorage.getItem("Difficulty") == "Easy"){
        difficulty = "Easy"
    }else if(localStorage.getItem("Difficulty") == "Medium"){
        difficulty = "Medium"
    }else if(localStorage.getItem("Difficulty") == "Hard"){
        difficulty = "Hard"
    }else if(localStorage.getItem("Difficulty") == "Ultra"){
    difficulty = "Ultra"

};
}else{
    console.log("Error");
}
var playerDummy;
var afterFirst;
afterFirst = 0;

function playerJump() {
    player.body.velocity.y = -playerSpeed;
}
//Makes the player Drop
function playerDrop() {
    player.body.velocity.y = playerSpeed;
}
//Slows the player Down
function playerStop() {
    player.body.velocity.y = 0;
}
function spaceHandler() {
    createLaser();game.sound.play("fire");
}//Makes the space bar fire a laser with an appropriate sound
function upHandler() {
    playerJump()
}//Makes the player go up
function downHandler() {
    playerDrop()
}//Makes the player go down

function spaceStopper() {playerStop()}//
function upStopper() {playerStop()}   //Stops the player once the keys are released
function downStopper() {playerStop()} //
//Adds to the score
function increaseScore(){score++;reScore();labelScore.setText(score.toString());//adds to the score and re-initialises the score counter
    if( score % 5 == 0 && score % 2 == 0){
        randomPlanet()}
}
function decreaseScore(){score--;reScore();labelScore.setText(score.toString());//subtracts the score and re-initialises the score counter
}
function reScore(){ //re-initialises the score label
    labelScore.destroy();
    labelScore = game.add.text(20, 20, score.toString(),
        {font: "30px Arial", fill: "#FFFFFF"});
}
function addPipeBlock(x, y,type) {   //Creates a pipe block at (x,y)
    if(type == 1){
        var pipeBlock = game.add.sprite(x,y,"pipe1");
    }else if(type == 2){
        var pipeBlock = game.add.sprite(x,y,"pipe2");
    }else if(type == 3){
        var pipeBlock = game.add.sprite(x,y,"pipe3");
    }
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = pipeSpeed;
}
//Adds a pipe end to (x, y) //Creates a pipe end at (x,y)
function addPipeEnd(x, y) {
    var pipeBlock = game.add.sprite(x,y,"pipeEnd");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = pipeSpeed;
}
function addScorer(x,y){    //Creates a scorer block at (x,y)
    var scorer = game.add.sprite(x,y,"scorer");
    scorers.push(scorer);
    game.physics.arcade.enable(scorer);
    scorer.body.velocity.x = pipeSpeed;
}
//Creates a pipe
function generatePipe(){
    var gapStart = game.rnd.integerInRange(3, 6);
    var shift = game.rnd.integerInRange(-25, 25);
    var type = game.rnd.integerInRange(1, 3);
    for (var count=-1; count<9; count=count+1) {
        if(count != gapStart && count != gapStart -1 && count != gapStart +1) {
            addPipeBlock(790, count * 50 + shift,type);
        }
        else if(count == gapStart + 1){
            addPipeEnd(788, count * 50+39+shift);
        }
        else if(count == gapStart -1){
            addScorer(788, count * 50+25+shift);
            addPipeEnd(788, count * 50-1+shift);
        }

    }
    //changeScore();
}
function addMeteor(x, y) {  //Creates a meteor at (x,y)
    var meteor = game.add.sprite(x,y,"asteroid");
    meteors.push(meteor);
    game.physics.arcade.enable(meteor);
    meteor.body.velocity.x = pipeSpeed;
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
//Creates a wave (Asteroid belt or pipe)
function createWave(){
    var generate;
    generate = game.rnd.integerInRange(1,asteroidChance);
    if(generate == asteroidChance){
        generateBelt();
    }
    else{
        generatePipe();
    }
}
//Generates a random planet from the right of the screen
function randomPlanet(){
    var type = game.rnd.integerInRange(1, 15);
    var rand = game.rnd.integerInRange(0,272)
    var angle = game.rnd.integerInRange(-45, 45)
    var planet;
    if(type == 1){
        planet = game.add.sprite(790,rand,"Planet_01");
    }
    else if(type == 2){
        planet = game.add.sprite(790,rand,"Planet_02");
    }
    else if(type == 3){
        planet = game.add.sprite(790,rand,"Planet_03");
    }
    else if(type == 4){
        planet = game.add.sprite(790,rand,"Planet_04");
    }
    else if(type == 5){
        planet = game.add.sprite(790,rand,"Planet_05");
    }
    else if(type == 6){
        planet = game.add.sprite(790,rand,"Planet_06");
    }
    else if(type == 7){
        planet = game.add.sprite(790,rand,"Planet_07");
    }
    else if(type == 8){
        planet = game.add.sprite(790,rand,"Planet_08");
    }
    else if(type == 9){
        planet = game.add.sprite(790,rand,"Planet_09");
    }
    else if(type == 10){
        planet = game.add.sprite(790,rand,"Planet_10");
    }
    else if(type == 11){
        planet = game.add.sprite(790,rand,"Planet_11");
    }
    else if(type == 12){
        planet = game.add.sprite(790,rand,"Planet_12");
    }
    else if(type == 13){
        planet = game.add.sprite(790,rand,"Planet_13");
    }
    else if(type == 14){
        planet = game.add.sprite(790,rand,"Planet_14");
    }
    else if(type == 15){
        planet = game.add.sprite(790,rand,"Planet_15");
    }
    planet.angle = angle;
    planets.push(planet);
    game.physics.arcade.enable(planet);
    planet.body.velocity.x = pipeSpeed/5;
}
//Generates a laser at the player position
function createLaser(){
    var laser = game.add.sprite(player.x+80,player.y+20,"laser");
    lasers.push(laser);
    game.physics.arcade.enable(laser);
    laser.body.velocity.x = 350;
}
//mutes the game if unmuted, unmutes if muted
function onMute(){
    if(game.sound.mute == false){
        mute.frame = 1;
        game.sound.mute = true;
        localStorage.setItem("Mute","True")
    }
    else if(game.sound.mute == true){
        mute.frame = 0;
        game.sound.mute = false;
        localStorage.setItem("Mute","False")
    }
}
function checkMute(){
    if(localStorage.getItem("Mute") == "True"){
        game.sound.mute = true;
        mute.frame = 1;
    }
    else if(localStorage.getItem("Mute") == "False"){
        game.sound.mute = false;
        mute.frame = 0;
    }
}
function diffMenu(){
    if(diffmenu == 0 && menuUp == 0){
        diffmenu = 1;
        menuUp = 1
        diffbutton.frame = 1
        menu = game.add.sprite(220,20,"menu2");
        easybutton = game.add.sprite(230,80,"easy");
        easybutton.inputEnabled = true;
        easybutton.events.onInputDown.add(function(){difficulty = "Easy";
            resetButtons();easybutton.frame = 1;storeDifficulty();})
        if(difficulty == "Easy") {
            easybutton.frame = 1;
        }else{
            easybutton.frame = 0;
        }
        medbutton = game.add.sprite(230,220,"medium");
        medbutton.inputEnabled = true;
        medbutton.events.onInputDown.add(function(){difficulty = "Medium";
            resetButtons();medbutton.frame = 1;storeDifficulty();});
        if(difficulty == "Medium") {
            medbutton.frame = 1;
        }else{
            medbutton.frame = 0;
        }
        hardbutton = game.add.sprite(380,80,"hard");

        hardbutton.inputEnabled = true;
        hardbutton.events.onInputDown.add(function(){difficulty = "Hard";
            resetButtons();hardbutton.frame = 1;storeDifficulty();});
        if(difficulty == "Hard") {
            hardbutton.frame = 1;
        }else{
            hardbutton.frame = 0;
        }
        ultrabutton = game.add.sprite(380,220,"ultra");
        ultrabutton.inputEnabled = true;
        ultrabutton.events.onInputDown.add(function(){difficulty = "Ultra";
            resetButtons();ultrabutton.frame = 1;storeDifficulty();})
        if(difficulty == "Ultra") {
            ultrabutton.frame = 1;
        }else{
            ultrabutton.frame = 0;
        }
        menuText = game.add.text(295, 30, "Difficulty",
            {font: "40px Arial", fill: "#000000"});
    }
    else if(diffmenu == 1){
        menu.kill();
        easybutton.kill();
        medbutton.kill();
        hardbutton.kill();
        ultrabutton.kill();
        menuText.destroy()
        diffmenu = 0;
        menuUp = 0;
        diffbutton.frame = 0;
    }
}
function storeDifficulty(){
    if(typeof(Storage) !== "undefined") {
        localStorage.setItem("Difficulty", difficulty);
    }else{
        console.log("Error");
    }
}
function resetButtons(){
    easybutton.frame = 0;
    medbutton.frame = 0;
    hardbutton.frame = 0;
    ultrabutton.frame = 0;
}
function setDifficulty(){
    if(difficulty == "Easy"){
        easyMode();

    }else if(difficulty == "Medium"){
        medMode();

    }else if(difficulty == "Hard"){
        hardMode();

    }else if(difficulty == "Ultra"){
        ultraMode()

    }else{
        console.log("Error")
    }
}
function easyMode(){
    difficulty = "Easy";
    playerSpeed = 325;
    pipeSpeed = -300;
    pipeInterval = 1;
    asteroidChance = 12;
    console.log("Easy Mode");
}
function medMode(){
    difficulty = "Medium";
    playerSpeed = 375;
    pipeSpeed = -400;
    pipeInterval = 0.85;
    asteroidChance = 10;
    console.log("Medium Mode");
}
function hardMode(){
    difficulty = "Hard";
    playerSpeed = 420;
    pipeSpeed = -500;
    pipeInterval = 0.65;
    asteroidChance = 8;
    console.log("Hard Mode");
}
function ultraMode(){
    difficulty = "Ultra";
    playerSpeed = -420;
    pipeSpeed = -500;
    pipeInterval = 0.6;
    asteroidChance = 8;
    console.log("Ultra Mode");
}
function customiseMenu(){
    if(colourmenu == 0 && menuUp == 0){
        colourmenu = 1;
        menuUp = 1;
        colourbutton.frame = 1;
        menu = game.add.sprite(150,20,"menu");
        colourupbutton = game.add.sprite(170,70,"uparrow");
        colourupbutton.inputEnabled = true;
        colourupbutton.events.onInputDown.add(colourup);
        colourdownbutton = game.add.sprite(170,170,"downarrow");
        colourdownbutton.inputEnabled = true;
        colourdownbutton.events.onInputDown.add(colourdown);
        playerDummy = game.add.sprite(300,120,"playerImg_dummy")
        playerDummy.frame = playerskin;
        customiseText = game.add.text(330, 30, "Customise",
            {font: "40px Arial", fill: "#000000"});
        SkinDraw = game.add.text(550, 100, playerskin.toString(),
            {font: "100px Arial", fill: "#000000"});
    }
    else if(colourmenu == 1){
        menu.kill();
        colourbutton.frame = 0;
        if(typeof(Storage) !== "undefined") {
            localStorage.setItem("Skin", playerskin.toString());
        }else{
            console.log("Error");
        }
        colourupbutton.kill();
        colourdownbutton.kill();
        playerDummy.kill();
        customiseText.destroy()
        SkinDraw.destroy()
        player.frame = playerskin;
        colourmenu = 0;
        menuUp = 0;
    }
}
function colourup(){
    if(playerskin < 9) {
        playerskin = playerskin + 1;
        console.log(playerskin);
        playerDummy.frame = playerskin;
        SkinDraw.setText(playerskin.toString())

    }else{
        playerskin = 9
        SkinDraw.setText(playerskin.toString())
    }
}
function colourdown() {
    if (playerskin > -1) {
        playerskin = playerskin - 1;
        console.log(playerskin);
        playerDummy.frame = playerskin;
        SkinDraw.setText(playerskin.toString())
    }else{
        playerskin = 0
        SkinDraw.setText(playerskin.toString())
    }
}
function infoMenu(){
    if(infoOpen == 0){
        infobutton.frame = 1;
        infoOpen = 1;
        $("#info").fadeIn();
    }else if(infoOpen == 1){
        infobutton.frame = 0;
        infoOpen = 0;
        $("#info").fadeOut();
    }


}
function create() {
    background1 = game.add.sprite(0,0, "backdrop");
//Adds to the speed counter, which increases speed once it hits 5
//Adds to the speed counter, which increases speed once it hits 5
    game.pause = true;
    menuUp = 0;
    infoOpen = 0;
    colourbutton = game.add.sprite(0, 330, "customise")
    colourbutton.inputEnabled = true;
    colourbutton.events.onInputDown.add(customiseMenu);
    game.sound.play("background");
    score = 0;
    colourmenu = 0;
    diffmenu = 0;
    mute = game.add.sprite(726, 330, "mute")
    mute.frame = 0;
    mute.inputEnabled = true;
    mute.events.onInputDown.add(onMute);
    infobutton = game.add.sprite(140,330,"info")
    infobutton.inputEnabled = true;
    infobutton.events.onInputDown.add(infoMenu);
    diffbutton = game.add.sprite(70,330,"difficulty")
    diffbutton.inputEnabled = true;
    diffbutton.events.onInputDown.add(diffMenu);
    game.stage.setBackgroundColor("#000000");
    labelScore = game.add.text(20, 20, "0",
        {font: "30px Arial", fill: "#FFFFFF"});


    game.physics.arcade.enable(labelScore);
    player = game.add.sprite(100, 175, "playerImg");

    game.physics.arcade.enable(player);
    game.input
        .keyboard.addKey(Phaser.Keyboard.ENTER)
        .onDown.add(enterHandler);
    player.alpha == 0;
    player.frame = playerskin;
    checkMute();
}
function enterHandler(){
    if(menuUp == 0 && gamePlaying == 0){
        start();
        gamePlaying = 1;
    }else if(colourmenu == 1){
        customiseMenu();
    };
    if(diffmenu == 1){
        diffMenu()
    }
}
function start(){
    game.pause = false;
    background1.kill();
    colourbutton.kill();
    //player.alpha == ;
    //define variables
    setDifficulty();
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


    game.physics.startSystem(Phaser.Physics.ARCADE); //enables physics
    //adding up arrow handler
    game.input
        .keyboard.addKey(Phaser.Keyboard.UP)
        .onDown.add(upHandler);
    //adding down arrow handler
    game.input
        .keyboard.addKey(Phaser.Keyboard.DOWN)
        .onDown.add(downHandler);
    /*game.input
        .keyboard.addKey(Phaser.Keyboard.W)
        .onDown.add(upHandler);*/
    //adding down arrow handler
    /*game.input
        .keyboard.addKey(Phaser.Keyboard.S)
        .onDown.add(downHandler);*/
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
    game.input
    /*    .keyboard.addKey(Phaser.Keyboard.W)
        .onUp.add(upStopper);
    //adding down arrow handler
    game.input
        .keyboard.addKey(Phaser.Keyboard.S)
        .onUp.add(downStopper);*/
    //player.body.gravity.y = 500;


    //creates a pipe at a delay

    game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, createWave);


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
    if(menuUp == 0){
        player.bringToTop();
    }

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
    $("#difficulty").val(difficulty);
    failSplash1 = game.add.text(200,0, "You Lose!",
        {font: "35px Arial", fill: "#FFFFFF"});
    failSplash2 = game.add.text(200,100, "You scored: " + score + " points",
        {font: "25px Arial", fill: "#FFFFFF"});
    failSplash3 = game.add.text(200,250, "press enter or submit a high score to restart",
        {font: "25px Arial", fill: "#FFFFFF"});
    $("#greeting").fadeIn();
    game.input
        .keyboard.addKey(Phaser.Keyboard.ENTER)
        .onDown.add(function(){
            location.reload();
        });

}
/*function restart(){
    afterFirst = 1;
    player.kill();
    labelScore.destroy();
    game.world.remove(failSplash1);
    failSplash2.destroy();
    failSplash3.destroy();
    background1.destroy();
    background2.destroy();

    score = 0;
    for(var i = lasers.length - 1; i >= 0; i--) {
        lasers[i].destroy();
        lasers.splice(i, 1);
    }
    for(var i = pipes.length - 1; i >= 0; i--) {
        pipes[i].destroy();
        pipes.splice(i, 1);
    }
    for(var i = meteors.length - 1; i >= 0; i--) {
        meteors[i].destroy();
        meteors.splice(i, 1);
    }
    for(var i = scorers.length - 1; i >= 0; i--) {
        scorers[i].destroy();
        scorers.splice(i, 1);
    }
    //pipetimer.kill();
    game.paused = false;
    restartCreate();
}*/
/*$.get("/score", function(scores){
    console.log("Data: ",scores);
});*/
$.get("/score", function(scores){
    scores.sort(function (scoreA, scoreB){
        var difference = scoreB.score - scoreA.score;
        return difference;
    });
    var e = 0;
    for (var i = 0; i < scores.length; i++) {

        if(scores[i].difficulty == "Easy" && e<5){
            $("#EasyScoreBoardName").append(
                "<ol>" + scores[i].name + "</ol>");
            $("#EasyScoreBoardScore").append(
                "<ol>" + scores[i].score + "</ol>");
            e++
        }

    }
    var e = 0;
    for (var i = 0; i < scores.length; i++) {
        if(scores[i].difficulty == "Medium" && e<5){
            $("#MedScoreBoardName").append(
                "<ol>" + scores[i].name + "</ol>");
            $("#MedScoreBoardScore").append(
                "<ol>" + scores[i].score + "</ol>");
            e++

        }
    }
    var e = 0;
    for (var i = 0; i < scores.length; i++) {
        if(scores[i].difficulty == "Hard" && e<5){
            $("#HardScoreBoardName").append(
                "<ol>" + scores[i].name + "</ol>");
            $("#HardScoreBoardScore").append(
                "<ol>" + scores[i].score + "</ol>");
            e++
        }
    }
    var e = 0;
    for (var i = 0; i < scores.length; i++) {
        if(scores[i].difficulty == "Ultra" && e<5){
            $("#UltraScoreBoardName").append(
                "<ol>" + scores[i].name + "</ol>");
            $("#UltraScoreBoardScore").append(
                "<ol>" + scores[i].score + "</ol>");
            e++
        }
    }
});