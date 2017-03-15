var GRID_SIZE = 20;
var BRANCH_VARIATION = 0;
var BRANCH_SIZE = 18;
var TRUNK_SIZE = 4;
var BRANCH_NUMBER = 1;
var FOREST_SIZE = 800;
var POPULATION = 4;
var TREE_HEALTH = 50;
var CHOP_RANGE = 4;
var DOOM_TIME = 550;
var DOOM_PHRASES = ["DEATH \nFALLS UPON \nTHE LAND",
										"THE FOREST \nCLAIMS IT'S \nTOLL",
										"THE FAE WIND \nBLOWS",
										"THE UNWORTHY\n HAVE \nPERISHED",
										"THROUGH\n THE FOREST \nPROWLS DEATH",
										"THE ACRID AIR\n  BURNS THE\n FLESH"];
var UI_FONT_SIZE = 12;
var DOOM_FONT_SIZE = 24;
var BURN_FONT_SIZE = 18;
var INDEPENDANCE_MINIMUM = 12;
var MAX_POPULATION = 30;
var doomPhrase = 0;	//This is used when doom() is called to select a new phrase to display.
var crsr, selected;	//Crsr is a Cursor that follows the mouse. selected is a Cursor that remains wherever the player clicks.
var manButt;	//This is the button that spawns a man into the world
var forest;	//A Forest just holds and updates an array of Trees
var wood = 0;	//Score counter for the amount of wood that's been chopped.
var men = [];	//An array of Men, represents the worlds population

var doomClock = 0;	//This gets incresed until 1500, when doom() is triggered
var fadeCounter = 0;	//Used to track how dark the screen is.

var burnTheRoots = false;

//ending stuff variables
var hill1Pos, hill2Pos; //Position of the two hill images.
var endingPlay;	//Tells us if the end animation is playing.

function preload(){
	//Preload all the data we need.
	//While the preload funciton runs, a default image defined in index.html is displayed.
	chopSound = loadSound('data/chop.wav');
	fallSound = loadSound('data/treeFall.wav');
	stepSound = loadSound('data/step.wav');
	musicSong = loadSound('data/music.wav');
	doomSound = loadSound('data/doomSound.wav');
	defaultFont = loadFont('data/Font.ttf');
	fireSound = loadSound('data/fireSound.wav');
	endBg = loadImage("data/bg.png");
  endFg = loadImage("data/fg.png");
  endHill1 = loadImage("data/CloseHill.png");
  endHill2 = loadImage("data/FarHill.png");
}

function setup() {
	createCanvas(GRID_SIZE*20, GRID_SIZE*20);
	frameRate(10);
	//pixelDensity(1);
	musicSong.setVolume(15);
	musicSong.loop();
	chopSound.setVolume(0.1);
	fallSound.setVolume(0.5);
	stepSound.setVolume(0.1);
	stepSound.playMode('restart');
	doomSound.setVolume(0.8);
	doomSound.playMode('restart');
	fireSound.rate(0.25);
	crsr = new Cursor();
	selected = new Cursor();
	forest = new Forest();

	for(var i = 0; i < POPULATION; i++){ //populate the world with Men
		men.push(new Man());
	}

	doomClock = 200; //Set the clock to 500 earlier on so players experience doom
											//before they get too invested

	burnTheRoots = false; //This just tracks the phase of the game just before the end

	//initialize variables for end screen paralax
  hill1Pos = 0;
  hill2Pos = 0;
	endingPlay = false;

	textFont(defaultFont);//Set the font for the rest of the game
}

function draw(){
	if(wood => 5 && manButt == null){
		//Check if the player has enough wood to spawn a dude, if they do, create the button.
		//Also check to see if the button exists already.
		manButt = createImg("data/birthBtn.png", "Birth A Soul Into The Forest");
		//The button is really an image with an event handler.
		manButt.position(0, height);
		manButt.mousePressed(birthMan); //Call birthMan() when clicked
	}
	if(endingPlay && burnButt != null){
		//If there are still buttons on the screen at the end of the game, remove them
		removeElements();
	}

	//All the draw functions in here handle updating game logic by themselves.
	//Game is effectively paused when it's draw function isn't called.
	if(burnTheRoots && !fireSound.isPlaying() && forest.burned){
		//This will only run at the end of the game
		endingPlay = true; //set this in case we need to know if the end animation is playing
		endingDraw();
	}else if(!doomSound.isPlaying() && !endingPlay){
		//If we're not doing anything special, draw the main game.
		mainGameDraw();
		if(burnTheRoots || fireSound.isPlaying()){
			//If the firesound is playing, overlay the burn animation
			burnDraw();
		}
	}else{
		//If nothing else is happening, it must be time to kill some dudes.
		doomDraw();
	}

	//Draw a big transparent rectangle over everything.
	//When burnDraw() and endingDraw() are called, they increment and decrement the fade counter resepectively.
	//This causes an increase or decrese in the transparency of the black rectangle,
	//making the screen fade to or from black.
	fadeCounter = constrain(fadeCounter, 0, 255);
	fill(0, 0, 0, fadeCounter);
	rect(0, 0, width, height);
	fill(255);
}

function doom(){
	//This triggers the doom event
	if(!forest.burned){
		doomClock = 0;	//Reset the doom counter
		doomSound.play(); //Play the doom sound, which subsiquently causes doomDraw() to be called every draw cycle
		//var killed = floor(random(men.length-(men.length/3), men.length));
		var killed = round(random(men.length/3, men.length-(men.length/3)));
		print(men.length/4, men.length-(men.length/4));
		//Kill a number of guys between a fourth and three fourths of the total.
		print(killed + " will die.")
		for(var i = 0; i < killed; i++){//Remove that number of guys from the men array.
			print("A death!");
			men = shorten(men);
		}
		doomPhrase = DOOM_PHRASES[round(random(0, DOOM_PHRASES.length-1))];
		//Select a random phrase to display.
	}
}

function mouseMoved(){
	crsr.move(mouseX, mouseY); //Move the cursor to the mouse position
}

function keyPressed(){
	//These are really just for debugging.
	if(key == 'M'){
		birthMan();
	}
	if(key  == 'K'){
		forest.clearTrees();
	}
}

function mousePressed(){
	selected.move(mouseX, mouseY); //Move the selected area to the mouse location.
}

function mainGameDraw(){
	if(doomClock > DOOM_TIME){ //If the clock has reached the right time, trigger doom
		doom();
	}
	background(103, 154, 45); //Draw the grass color as a background
	stroke(93, 144, 35);	//Set grid color
	noFill();	//Make sure the grid isn't filled in.
	strokeWeight(1);
	for(var x = 0; x < width; x += GRID_SIZE){
		for(var y = 0; y < height; y += GRID_SIZE){
			rect(x, y, GRID_SIZE, GRID_SIZE);	//Draw the grid
		}
	}
	for(var i = 0; i < men.length; i++){
		//Loop through the men an update them then display them.
		if(i>=INDEPENDANCE_MINIMUM){
			men[i].setIndependant(true);
		}
		else{
			men[i].setIndependant(false);
		}
	  if(!forest.isCleared()){
			men[i].update();
		}
		men[i].show();
	}

	doomClock += 1;//Increase the doom clock by 1.
	forest.update();
	if(forest.isCleared()){	//If the forest has no trees, move to the penultimate part of the game.
		burnTheRoots = true;
	}
	crsr.show();
	selected.show();


	//Draw the UI
	noStroke();
	fill(255);
	textSize(UI_FONT_SIZE);
	text("Wood: " + wood, 10, 20);
	text("Men: " + men.length, 10, 35);
}

function doomDraw(){
	textSize(DOOM_FONT_SIZE);
	noStroke();

	//This draws a bunch of bars (height 10) accross the screen.
	for(var i = 0; i < height; i+=10){
		c = random(150, 250); //The initial Red colour
		d = c-random(150, c);	//Take the an amount away from the initial colour to get the Green and Blue values
		fill(c, d, d);	//Make the current bar a random shade of red.
		rect(0, i, width, 10);
	}
	stroke(51);
	strokeWeight(5);
	fill(0, 0, 0, 0);
	rect(0, 0, width-2, height-2); //Draw a border around the screen
	noStroke();
	strokeWeight(1);
	//Set the colour of the text to a random shade of Blue (stolen from the colour of the last bar)
	fill(d, c, c);
	//Draw the text roughly in the center, but move it up or down a random amount.
	text(doomPhrase, width/8, height/2+random(0,10));
}

function burnDraw(){
	//This is the penultimate part of the game.
	if(!fireSound.isPlaying()){
		if(musicSong.isPlaying()){	//Stop the main game music
			musicSong.stop();
		}
		fill(20, 0, 0, 80);
		noStroke();
		rect(0, 0, width, height);
		//Darken the screen a bit
		burnButt = createImg('data/burnTheRoots.png', 'Burn The Roots');
		burnButt.position(0, height+20);
		burnButt.mousePressed(initiateBurn);
	}else
	{
			//Set this false because we'll use fireSound.isPlaying() to track whether
				//or not this part of the game is running
			burnTheRoots = false;
			var shade = random(200, 255);
			fill(255, 255-shade, 255-shade, 40);	//Colour the screen a random shade of red
			noStroke();
			rect(0, 0, width, height);
			fadeCounter+=2;//Darken the screen
			forest.burn();
	}
}

function endingDraw(){
  image(endBg, 0, 0);
  image(endHill2, hill2Pos, 0);
  image(endHill1, hill1Pos, 0);
  image(endFg, 0, 0);
  hill1Pos-=0.475;
  hill2Pos-=0.2;
	//Render the background, moving them at different rates relative to each other
	fadeCounter -= 4	//Fade in from black
}

function initiateBurn(){
	//If the forest isn't already burned. Play the music for the burning
	if(!forest.burned){
		fireSound.play();
	}
}

function birthMan(){
	//If we've got enough wood, add a man.
	if(wood >= 5 && men.length < MAX_POPULATION){
		wood -= 5;
		men.push(new Man());
	}

}
