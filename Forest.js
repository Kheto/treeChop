function Forest(){
  this.treeList = [];
  this.deadTrees = 0;
  this.burned = false;
  for(var i = 0; i < FOREST_SIZE; i++){
    this.treeList.push(new Tree());
  }

  this.update = function(){

  	selected.clearTargets(); //Clear the targets from the selected area
    this.deadTrees = 0;

    for(var currTree = 0; currTree < this.treeList.length; currTree++){
      this.treeList[currTree].show();
      if(this.treeList[currTree].chopped == true){
        this.deadTrees++; //count the number of dead trees
      }
      if(selected.contains(this.treeList[currTree]) && !this.treeList[currTree].chopped){
        selected.addTarget(this.treeList[currTree]); //Update the selected trees
      }
    }
  }

  this.getRandom = function(){
    var r = round(random(0, this.treeList.length));
    var t = this.treeList[r];
    return t;
  }

  this.getClosest = function(vect){
		//Loop trough all of the trees selected by the cursor and
		//return the closest one to the given vector
		if(this.isCleared()){
			return null;
		}
		var closest = this.treeList[0];

		for(var i = 1; i < this.treeList.length; i++){
      if(!this.treeList[i].chopped){
  			if (vect.dist(closest.pos) > vect.dist(this.treeList[i].pos)){
  				closest = this.treeList[i];
  			}
      }
		}
		return closest;
	}

  this.burn = function(){
    this.burned = true;
    for(var currTree = 0; currTree < this.treeList.length; currTree++){
      this.treeList[currTree].burn();
    }
  }

  this.isCleared = function(){
    if(this.deadTrees >= this.treeList.length){
      return true;
    }else{
      return false;
    }
  }

  this.clearTrees = function(){
    //This is just a cheat
    for(var currTree = 0; currTree < this.treeList.length; currTree++){
      this.treeList[currTree].hp = 0;
      this.treeList[currTree].chop();
    }
  }
}
