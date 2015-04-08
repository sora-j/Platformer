var Bullet = function()
{
	this.image = document.createElement("img"),
	this.x = player.x,
	this.y = player.y,
	
	this.width = 5,
	this.height = 5,
	
	this.velocityX = 0,
	this.velocityY = 0,
	
	this.isDead = true 
	
	this.image.src = "bullet.png";
	
	this.BULLET_SPEED = 0.2;
};




