var Bullet = function(x, y, RIGHT)
{
	this.image = document.createElement("img"),
	this.sprite = new Sprite("bullet.png");
	this.sprite.setLoop(0, false);

	this.position = new Vector2();
	this.position.set(x, y);
	
	this.velocity = new Vector2();
	
	this.RIGHT = RIGHT;
	if(this.RIGHT == true)
	{
		this.velocity.set(MAXDX *2, 0);
	}
	else
	{
		this.velocity.set(-MAXDX *2, 0);
	}
	
	
	
	
	
	
	/*this.x = player.x,
	this.y = player.y,
	
	this.width = 5,
	this.height = 5,
	
	this.velocityX = 0,
	this.velocityY = 0,
	
	this.isDead = true 
	
	this.image.src = "bullet.png";
	
	this.BULLET_SPEED = 0.2;*/
};
Bullet.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
}

Bullet.prototype.draw = function()
{
	var screenX = this.position.x - worldOffsetX;
	this.sprite.draw(context, screenX, this.position.y);
}



