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
	
	this.BULLET_SPEED = 1.5;
};

function playerShoot()
{
// we can only have 1 bullet at a time
if( bullet.isDead == false )
	return;
// start off with a velocity that shoots the bullet straight up
var velX = 0;
var velY = 1;
// now rotate this vector acording to the ship's current rotation
var s = Math.sin(player.rotation);
var c = Math.cos(player.rotation);
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
}


