function Tree(){
	this.pos = createVector(random(0, height), random(0, width));

	this.branches = [];
	this.chopped = false;
	this.hp = TREE_HEALTH;
	this.trunkColour = color(113, 94, 74);

	for (var i = 0; i < BRANCH_NUMBER; i++) {
		this.branches.push(createVector(this.pos.x, this.pos.y));
		this.branches[i].add(random(-BRANCH_VARIATION, BRANCH_VARIATION), random(-BRANCH_VARIATION, BRANCH_VARIATION));;
	}

	this.show = function(){
		if(this.chopped){
			strokeWeight(1);
			stroke(87, 57, 25, 0.59);
			fill(this.trunkColour);
			ellipse(this.pos.x, this.pos.y, TRUNK_SIZE);
		}else{
			strokeWeight(1);
			stroke(73, 124, 15, 240);
			//fill(93, 144, 35);
			fill(73, 124, 15, 230);
			//for (var i = 0; i < this.branches.length; i++) {
				//ellipse(this.branches[i].x, this.branches[i].y, BRANCH_SIZE);
			//}
			ellipse(this.pos.x, this.pos.y, BRANCH_SIZE);
		}
	}

	this.burn = function(){
		var r = red(this.trunkColour);
		var g = green(this.trunkColour);
		var b = blue(this.trunkColour);
		r--;
		g--;
		b--;
		this.trunkColour= color(r, g, b);
	}

	this.chop = function(){
		if(this.chopped == false){
			this.hp--;
			if(frameCount%4 ==0){
				chopSound.play();
			}
			if(this.hp < 0){
				fallSound.play();
				this.chopped = true;
      	wood++;
			}
		}
	}
}
