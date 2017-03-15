function Cursor(){
	this.pos = createVector(-GRID_SIZE, -GRID_SIZE);
	this.targets = [];	//List of trees inside selection

	this.move = function(x, y){
		if(x>=0 && x<=width && y>=0 && y<=height){
			this.pos.x = x - (x % GRID_SIZE);
			this.pos.y = y - (y % GRID_SIZE);
		}
		//Move it to the closest grid co-ordinate to the given location
		//as long a it's within the canvas.
	}

	this.show = function(){
		noFill();
		strokeWeight(1);
		stroke(255, 55, 217);
		rect(this.pos.x, this.pos.y, GRID_SIZE, GRID_SIZE);
	}

	this.contains = function(target) {
		//Target represents a vector
		//If that vector falls within the selection, return true
		if(target.pos.x >= this.pos.x && target.pos.x <= this.pos.x + GRID_SIZE){
			if(target.pos.y >= this.pos.y && target.pos.y <= this.pos.y + GRID_SIZE){
				return true;
			}
		}
		return false;
	}

	this.closestTarget = function(vect){
		//Loop trough all of the trees selected by the cursor and
		//return the closest one to the given vector
		if(this.targets.length <=0){
			return null;
		}
		var closest = this.targets[0];

		for(var i = 1; i < this.targets.length; i++){
			if (vect.dist(closest.pos) > vect.dist(this.targets[i].pos)){
				closest = this.targets[i];
			}
		}
		return closest;
	}

	this.clearTargets = function(){
		this.targets = [];
	}

	this.addTarget = function(newTarget){
		this.targets.push(newTarget);
	}

}
