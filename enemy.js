var Enemy = function() 
{
	this.image = document.createElement("img");
	this.x = canvas.width / 3;
	this.y = canvas.height / 3;
	
	this.width = 55;
	this.height = 80;
	
	this.velocityX = 0;
	this.velocityY = 0;
	this.angularVelocity = 0;
	this.rotation = 0;
	
	this.isDead = false;
	this.ENEMY_SPEED = 0.8
	this.image.src = "enemy.fw.png";
};

//var enemy = new Enemy();
Enemy.prototype.update = function(deltaTime)
{
	//if( typeof(this.rotation) == "undefined" )
		//this.rotation = 0; 				// hang on, where did this variable come from!
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
	{
		this.rotation += deltaTime;
	}
	else
	{
		this.rotation -= deltaTime;
	}

	//this.rotation += deltaTime;	
}

Enemy.prototype.draw = function()
{
	context.save();
		context.translate(this.x, this.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width / 2, -this.height / 2);
	context.restore();
}

