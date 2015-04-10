var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here-----------------------------------------------------------------------------------------------

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

// load an image to draw
//var chuckNorris = document.createElement("img");
//chuckNorris.src = "hero.png";


//_____________________________________________________________________________________________
var STATE_SPLASH = 0;	
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;

var gameState = STATE_GAME

var LEFT = 0;
var RIGHT = 1;
var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_SHOOT_LEFT = 7;
var ANIM_CLIMB = 9;
var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;
var ANIM_SHOOT_RIGHT =8 ;
var ANIM_MAX = 6;

var ENEMY_MAXDX = METER * 5;
var ENEMY_ACCEL = ENEMY_MAXDX * 2;


var LAYER_COUNT = 4;

var LAYER_BACKGOUND = 0;
var LAYER_PLATFORMS = 3;
var LAYER_LADDERS = 2;
var LAYER_EXTRA = 1;

var LAYER_OBJECT_ENEMIES = 4;
var LAYER_OBJECT_TRIGGERS = 5;

var MAP = { tw: 50, th: 23 };//50,23
var TILE = 35;
var TILESET_TILE = TILE * 2;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;
var tileset = document.createElement("img");
tileset.src = "tileset.png";



var METER = TILE;
var GRAVITY = METER * 9.8 * 6;
var MAXDX = METER * 10;
var MAXDY = METER * 15;
var ACCEL = MAXDX * 2;
var FRICTION = MAXDX * 6;
var JUMP = METER * 1500;

var BULLET_SPEED = 1.5;

var timer = 0;

var player = new Player();
var enemy = new Enemy();
var keyboard = new Keyboard();
var bullet = new Bullet();
var sprite;

var musicBackground;
var sfxFire;


/*function playerShoot()
{
	// we can only have 1 bullet at a time
	if( bullet.isDead == false )
		return;
	// start off with a velocity that shoots the bullet straight up
	var velX = 0;
	var velY = 1;
	// now rotate this vector acording to the ship's current rotation
	var s = Math.sin(player.direction);
	var c = Math.cos(player.direction);
	// for an explanation of this formula,
	// see http://en.wikipedia.org/wiki/Rotation_matrix
	var xVel = (velX * c) - (velY * s);
	var yVel = (velX * s) + (velY * c);
	// dont bother storing a direction and calculating the
	// velocity every frame, because it won't change.
	// Just store the pre-calculated velocity
	bullet.velocityX = xVel * BULLET_SPEED;
	bullet.velocityY = yVel * BULLET_SPEED;
	// don't forget to set the bullet's position
	bullet.x = player.x;
	bullet.y = player.y;
	// make the bullet alive
	bullet.isDead = false;
}*/





function cellAtPixelCoord(layer, x,y)
{
	var tx = pixelToTile(x);
	var ty = pixelToTile(y);
	
	return cellAtTileCoord(layer, tx, ty)
};

function cellAtTileCoord(layer, tx, ty)
{
	if(tx < 0 || tx >= MAP.tw || ty < 0)
		return 1;
		
	if(ty >= MAP.th)
		return 0;
		
	return cells[layer][ty][tx];
};

function tileToPixel(tile_coord)
{
	return tile_coord * TILE;
};

function pixelToTile(pixel)
{
	return Math.floor(pixel/TILE);
};

function bound(value, min, max)
{
	if(value < min)
		return min;
		
	if(value > max)
		return max;
		
	return value;
}


if (player.health <= 0)
{
	player.position.set(50, 100);
	player.health = 100;
}


function drawMap(offsetX, offsetY)
{
	 for(var layerIdx = 0; layerIdx<LAYER_COUNT; layerIdx++)
	 {
		 var idx = 0;
		 for( var y = 0; y < level1.layers[layerIdx].height; y++ )
		 {
			 for( var x = 0; x < level1.layers[layerIdx].width; x++ )
			 {
				 var tileIndex = level1.layers[layerIdx].data[idx] - 1;
				 
				 if( tileIndex/*level1.layers[layerIdx].data[idx]*/ != 0 )
				 {
					 // the tiles in the Tiled map are base 1 (meaning a value of 0 means no tile), so subtract one from the tileset id to get the
					 // correct tile
					var tileIndex = level1.layers[layerIdx].data[idx] - 1;
					 
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * (TILESET_TILE + TILESET_SPACING);
					 
					var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) * (TILESET_TILE + TILESET_SPACING);
					 
					var dx = x * TILE - offsetX;
					
					var dy = (y-1) * TILE - offsetY;
					 
					 context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, dx, dy, TILESET_TILE, TILESET_TILE);
				 }
				 idx++;
			 }
		 }
	 }
}




var cells = []; // the array that holds our simplified collision data
	
	function initialize() 
	{

		
			musicBackground = new Howl
			(
				{
					urls: ["background.ogg"],
					loop: true,
					buffer: true,
					volume: 0.5
				} 
			);
			
			musicBackground.play();
					
			sfxFire = new Howl
			(
				{
					urls: ["fireEffect.ogg"],
					buffer: true,
					volume: 1,
					onend: function() 
					{
						isSfxPlaying = false;
					}
				} 
			);
		
		
		for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++) 
		{ // initialize the collision map
			cells[layerIdx] = [];
			var idx = 0;
			
			for(var y = 0; y < level1.layers[layerIdx].height; y++) 
			{
				cells[layerIdx][y] = [];
				for(var x = 0; x < level1.layers[layerIdx].width; x++) 
				{
					if(level1.layers[layerIdx].data[idx] != 0) 
					{
						// for each tile we find in the layer data, we need to create 4 collisions
						// (because our collision squares are 35x35 but the tile in the
						// level are 70x70)
						cells[layerIdx][y][x] = 1;
						cells[layerIdx][y-1][x] = 1;
						cells[layerIdx][y-1][x+1] = 1;
						cells[layerIdx][y][x+1] = 1;
					}
					else if(cells[layerIdx][y][x] != 1) 
					{
						// if we haven't set this cell's value, then set it to 0 now
						cells[layerIdx][y][x] = 0;
					}
					++idx;
				}
			}
		}
	
	/*idx = 0;
		for(var y = 0; y < level1.layers[LAYER_OBJECT_ENEMIES].height; y++) 
		{
			for(var x = 0; x < level1.layers[LAYER_OBJECT_ENEMIES].width; x++) 
			{
				if(level1.layers[LAYER_OBJECT_ENEMIES].data[idx] != 0) 
				{
					var px = tileToPixel(x);
					var py = tileToPixel(y);
					var e = new Enemy(px, py);
					enemies.push(e);
				}
			idx++;
			}
		}*/
	
	
	}

function run()
{
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, canvas.width, canvas.height);
	       
	var deltaTime = getDeltaTime();
	timer += deltaTime
	
	xScroll = player.position.x - canvas.width;
	yScroll =0
	
	if(xScroll <0)
	{
		xScroll = 0;
	}
	if(xScroll < MAP.tw * TILE - canvas.width)
	{
		xScroll = MAP.tw * TILE - canvas.width;	
	}
	
	/*for(var i=0; i<enemies.length; i++)
	{
		enemies[i].update(deltaTime);
	}*/
	
	drawMap(xScroll, yScroll);
	player.update(deltaTime);
	player.draw(xScroll, yScroll);
	
	enemy.update(deltaTime);
	enemy.draw(xScroll, yScroll);

	/*var hit=false;
	for(var i = 0; i < bullet.length; i++)
	{
		bullet[i].update(deltaTime);
		if( bullet[i].position.x - worldOffsetX < 0 ||
		bullet[i].position.x - worldOffsetX > SCREEN_WIDTH)
		{
			hit = true;
		}
		for(var j=0; j<enemies.length; j++)
		{
			if(intersects( bullet[i].position.x, bullet[i].position.y, TILE, TILE,
			 enemies[j].position.x, enemies[j].position.y, TILE, TILE) == true)
			{
			// kill both the bullet and the enemy
				enemies.splice(j, 1);
				hit = true;
				// increment the player score
				score += 1;
				break;
			}
		}
		if(hit == true)
		{
			bullets.splice(i, 1);
			break;
		}
	}
	
	
	
	*/
		/*
	if(bullet.isDead == false)
	{
		bullet.x += bullet.velocityX;
		bullet.y += bullet.velocityY;
		context.drawImage(bullet.image, bullet.x - bullet.width/2, bullet.y - bullet.height/2);
		if(enemy.isDead == false)
		{
			var hit = intersects(bullet.x, bullet.y, bullet.width, bullet.height, enemy.x, enemy.y, enemy.width, enemy.height);
			if(hit == true)
			{
				bullet.isDead = true;
				enemy.isDead = true;
			}
		}
		if(bullet.x < 0 || bullet.x > SCREEN_WIDTH || bullet.y < 0 || bullet.y > SCREEN_HEIGHT)
		{
			bullet.isDead = true;
		}
	}
	function onKeyUp(event)
	{
		if(event.keyCode == KEY_SPACE)
		{
			playerShoot();
		}
	}
		*/	
		// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
	

	
	
}

initialize();

//-------------------- Don't modify anything below here --------------------------------------------------------------------------------------------


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
