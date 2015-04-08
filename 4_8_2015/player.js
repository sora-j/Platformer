var Player = function() 
{
	this.image = document.createElement("img");
	
	this.position = new Vector2();
	this.position.set(canvas.width / 2, canvas.height / 2);
	/*this.x = ;
	this.y = ;*/
	
	this.width = 100;
	this.height = 136;
	
	this.offset = new Vector2();
	this.offset.set(-55, -87);
	this.velocity = new Vector2();
	
	this.falling = true;
	this.jumping = false;	

	/*this.velocityY = 0;
	this.angularVelocity = 0;
	this.rotation = 0;*/
	
	this.image.src = "zero.png";
	
	//this.PLAYER_SPEED = 1;
};

//var player = new Player();

Player.prototype.update = function(deltaTime)  
{
	// calculate the new position and velocity:
	var acceleration = new Vector2();
	var playerAccel = 4000;
	var playerDrag = 7;
	var playerGravity = TILE * 9.8 * 6  ;
	acceleration.y = playerGravity
	 
	if (keyboard.isKeyDown(keyboard.KEY_LEFT))
	{
		acceleration.x -= playerAccel;
	}
	if (keyboard.isKeyDown(keyboard.KEY_RIGHT))
	{
		acceleration.x += playerAccel;
	}
	if (keyboard.isKeyDown(keyboard.KEY_UP))
	{
		acceleration.y -= playerAccel;	
	}
	if (keyboard.isKeyDown(keyboard.KEY_DOWN))
	{
		acceleration.y += playerAccel;	
	}
	
	acceleration = acceleration.subtract(this.velocity.multiplyScalar(playerDrag))
		
	this.velocity = this.velocity.add(acceleration.multiplyScalar(deltaTime));
	this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
	
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	
	
	// collision detection
	// Our collision detection logic is greatly simplified by the fact that the player is a rectangle
	// and is exactly the same size as a single tile. So we know that the player can only ever
	// occupy 1, 2 or 4 cells.
	// This means we can short-circuit and avoid building a general purpose collision detection
	// engine by simply looking at the 1 to 4 cells that the player occupies:
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = (this.position.x)%TILE; // true if player overlaps right
	var ny = (this.position.y)%TILE; // true if player overlaps below
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cell_right = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);

	if (this.velocity.y > 0)
	{
		if (cell_down && !cell || (cell_diag && !cell_right && nx)) 
		{
			this.position.y = tileToPixel(ty);
			this.velocity.y = 0; 
			this.falling = false;
			this.jumping = false; 
			ny = 0; 
		}
	}
	else if (this.velocity.y < 0) 
	{
		if ((cell && !cell_down) || (cell_right && !cell_diag && nx)) 
		{
			 this.position.y = tileToPixel(ty + 1);
			 this.velocity.y = 0; 
			 cell = cell_down;
			 cell_right = cell_diag;
			 
			 cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 2);
			 cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 2);
			 ny = 0;
			 
		}
	}
	if (this.velocity.x > 0) 
	{
		if ((cell_right && !cell) || (cell_diag && !cell_down && ny)) 
		{
			this.position.x = tileToPixel(tx);
			this.velocity.x = 0;
		}
	}
	else if (this.velocity.x < 0) 
	{
		if ((cell && !cell_right) || (cell_down && !cell_diag && ny)) 
		{
			this.position.x = tileToPixel(tx + 1);
			this.velocity.x = 0; 
		}
	}
	
	





		

	//if( typeof(this.rotation) == "undefined" )
		//this.rotation = 0; 				// hang on, where did this variable come from!
	/*if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
	{
		this.rotation += deltaTime;
	}
	else
	{
		this.rotation -= deltaTime;
	}

	//this.rotation += deltaTime;*/	
}

Player.prototype.draw = function()
{
	context.save();
		context.translate(this.position.x, this.position.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width / 2, -this.height / 2);
	context.restore();
}

