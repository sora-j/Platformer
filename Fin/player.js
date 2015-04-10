var Player = function() 
{
	
	this.sprite = new Sprite("ChuckNorris.png");
	
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,[0, 1, 2, 3, 4, 5, 6, 7]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,[8, 9, 10, 11, 12]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,[13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,[52, 53, 54, 55, 56, 57, 58, 59]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,[60, 61, 62, 63, 64]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,[65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]);
	

	
	//this.image = document.createElement("img");
	this.startPos = new Vector2();
	this.startPos.set(50, 700);
	this.position = new Vector2();
	this.position.set(this.startPos.x, this.startPos.y);
	
	
	this.health = 100;
	this.deathCount = 0;
	this.width = 159;  //100 //50
	this.height = 163;  //200 //66
	
	/*this.offset = new Vector2();
	this.offset.set(-55, -87);*/
	this.velocity = new Vector2();
	
	this.falling = true;
	this.jumping = false;	

	this.cooldownTimer = 0;

	this.direction = LEFT;
	
	for(var i=0; i < ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -this.width/2, -this.height/2);
	}
	/*this.angularVelocity = 0;
	this.rotation = 0;*/
	
	//this.image.src = "pug_hero_2.png";  //zero.png //pug
	
	//this.PLAYER_SPEED = 1;
};




Player.prototype.changeDirectionalAnimation = function(leftAnim, rightAnim)
{

	if(this.direction == LEFT)
	{
		if(this.sprite.currentAnimation != leftAnim)
		{
			this.sprite.setAnimation(leftAnim);
		}
	}
	else
	{
		if(this.sprite.currentAnimation != rightAnim)
		{
			this.sprite.setAnimation(rightAnim);
		}
	}

}


var PLAYER_SPEED = 300;

Player.prototype.update = function(deltaTime)  
{
	this.sprite.update(deltaTime);

	
	// calculate the new position and velocity:
	var acceleration = new Vector2();
	var playerAccel = 6000;
	
	var jumpForce = 37500;
	
	var playerDrag = 12;
	var playerGravity = TILE * 9.8 * 6;
	
	acceleration.y = playerGravity
	
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	
	var nx = (this.position.x)%TILE; // true if player overlaps right
	var ny = (this.position.y)%TILE; // true if player overlaps below
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cell_right = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
	var cell_ladder = cellAtTileCoord(LAYER_LADDERS, tx, ty);
	
	if (keyboard.isKeyDown(keyboard.KEY_LEFT) == true)
	{
		acceleration.x -= playerAccel;
		this.direction = LEFT;	
	}
	else if (keyboard.isKeyDown(keyboard.KEY_RIGHT) == true)
	{
		acceleration.x += playerAccel;
		this.direction = RIGHT;
	}
	/*
	else 
	{
		if(this.jumping == false && this.falling == false)
		{
			if(this.direction == LEFT)
			{
				 if(this.sprite.currentAnimation != ANIM_IDLE_LEFT)
				 this.sprite.setAnimation(ANIM_IDLE_LEFT);
			}
			else
			{
				 if(this.sprite.currentAnimation != ANIM_IDLE_RIGHT)
				 this.sprite.setAnimation(ANIM_IDLE_RIGHT);
			}
		}
	}
	*/
	if (this.velocity.y > 0)
	{	
		this.falling = true;
		this.jumping = false
	}
	else
	{
		this.falling = false;
	}
	
	
	if (keyboard.isKeyDown(keyboard.KEY_UP) && !this.jumping && !this.falling)
	{
		acceleration.y -= jumpForce;
		this.jumping = true;
	}
	
	if(this.cooldownTimer > 0)
	{
		this.cooldownTimer -= deltaTime;
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true && this.cooldownTimer <= 0) 
	{
		
		

		sfxFire.play();
		this.cooldownTimer = 0.3;
		//playerShoot();
		// Shoot a bullet
	}
	
		if (keyboard.isKeyDown(keyboard.KEY_DOWN) && !this.jumping && !this.falling && cell_ladder)
	{
		acceleration.y -= playerAccel;
	}


	
	
	var dragVector = this.velocity.multiplyScalar(playerDrag);
	dragVector.y = 0;
	acceleration = acceleration.subtract(dragVector);
	
	//acceleration = acceleration.subtract(this.velocity.multiplyScalar(playerDrag))
		
	this.velocity = this.velocity.add(acceleration.multiplyScalar(deltaTime));
	this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
	
	//animation logic
	if (this.jumping || this.falling)
	{
		this.changeDirectionalAnimation(ANIM_JUMP_LEFT, ANIM_JUMP_RIGHT);
	}
	else
	{
		if (Math.abs(this.velocity.x) > 25)
		{
			this.changeDirectionalAnimation(ANIM_WALK_LEFT, ANIM_WALK_RIGHT);
		}
		else
		{
			this.changeDirectionalAnimation(ANIM_IDLE_LEFT, ANIM_IDLE_RIGHT);
		}
	}
	
	
	var collisionOffset = new Vector2();
	collisionOffset.set(-TILE/2, this.height/2 - TILE );
	
	
	var collisionPos = this.position.add(collisionOffset);
	
	
	//var tx = pixelToTile(collisionPos.x);
	//var ty = pixelToTile(collisionPos.y);
	
	
	// collision detection
	// Our collision detection logic is greatly simplified by the fact that the player is a rectangle
	// and is exactly the same size as a single tile. So we know that the player can only ever
	// occupy 1, 2 or 4 cells.
	// This means we can short-circuit and avoid building a general purpose collision detection
	// engine by simply looking at the 1 to 4 cells that the player occupies:

	
		
	
	
	if (this.velocity.y > 0)
	{
		if ((cell_down && !cell) || (cell_diag && !cell_right && nx)) 
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
			 this.position.y = tileToPixel(ty + 1) - collisionOffset.y;
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
			this.position.x = tileToPixel(tx) - collisionOffset.x;
			this.velocity.x = 0;
		}
	}
	
	else if (this.velocity.x < 0) 
	{
		if ((cell && !cell_right) || (cell_down && !cell_diag && ny)) 
		{
			this.position.x = tileToPixel(tx + 1) - collisionOffset.x;
			this.velocity.x = 0; 
		}
	}
	
		if (this.position.y > canvas.height)
	{
		this.position.set(this.startPos.x, this.startPos.x);
		//this.velocity = new Vector2();
		this.deathCount += 1;
		timer = 0;
	}
	
	
}


Player.prototype.draw = function(offsetX, offsetY)
{
	this.sprite.draw(context, this.position.x - offsetX , this.position.y - offsetY);
	
	context.fillStyle = "black";
	context.font = "32px Aegis";
	var textToDisplay = "HP: " + this.health;
	context.fillText(textToDisplay, canvas.width - 200,50);
	
	context.fillStyle = "black";
	context.font = "32px Aegis";
	
	var timerSeconds = Math.floor(timer);
	var timerMilliseconds = Math.floor((timer - timerSeconds) *1000);
	var textToDisplay = "LEVEL TImER: " + (timerSeconds + ":" +timerMilliseconds);
	context.fillText(textToDisplay, 50, 50);
	
	context.fillStyle = "black";
	context.font = "32px Aegis";
	var textToDisplay = "DEATHS: " + this.deathCount;
	context.fillText(textToDisplay, canvas.width - 320,100);

	/*context.save();
		context.translate(this.position.x, this.position.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width / 2, -this.height / 2);
	context.restore();*/
}