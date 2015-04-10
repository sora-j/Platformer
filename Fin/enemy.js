var Enemy = function() 
{
	this.image = document.createElement("img");
	this.image.src = "enemy.fw.png";
	
	
	this.sprite = new Sprite("enemy.fw.png");
	
	this.x = canvas.width;
	this.y = canvas.height;
	
	this.width = 55;
	this.height = 80;
	
	this.position = new Vector2();
	this.position.set(0,650);

	this.velocity = new Vector2();
	
	this.isDead = false;
	this.direction = RIGHT
	
	
};

//var enemy = new Enemy();
Enemy.prototype.update = function(deltaTime)
{
	var acceleration = new Vector2();
	var enemyAccel = 4000;	
	var enemyDrag = 10;
	
	if (this.direction == RIGHT)
	{
		acceleration.x = enemyAccel;
	}
	else
	{
		acceleration.x = enemyAccel;
	}
	
	var dragX = this.velocity.x * enemyDrag;
	acceleration.x -= dragX;	
	
	
	this.velocity = this.velocity.add(acceleration.multiplyScalar(deltaTime));
	this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
	

		var ddx = 0; // acceleration
		var tx = pixelToTile(this.position.x);
		var ty = pixelToTile(this.position.y);
		
		
		var nx = (this.position.x)% TILE; // true if enemy overlaps right
		var ny = (this.position.y)% TILE; // true if enemy overlaps below
		
		var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
		var cell_right = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
		var cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
		var cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
		
		if(this.direction == RIGHT)
		{
			if(!cell && (cell_right && nx)) 
			{
				this.direction = LEFT // enemy wants to go right
			}
			if(cell_down && (!cell_diag && nx))
			{
				this.direction = LEFT 
			}
		}	
		else 
		{
			if(cell && !(cell_right && nx)) 
			{
				this.direction = RIGHT // enemy wants to go right
			}
			if(!cell_down && (cell_diag && nx))
			{
				this.direction = RIGHT
			}
			
		}
		
		
		
}

Enemy.prototype.draw = function(offsetX, offsetY)
{		
	context.drawImage(this.image, this.position.x - offsetX, this.position.y - offsetY, this.width, this.height);
	/*context.save();
		context.translate(this.x, this.y);
		context.rotate(this.rotation);

	context.restore();*/
}

