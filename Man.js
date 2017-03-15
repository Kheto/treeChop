function Man(){
  //Place the man at a random position near the middle of the screen
  this.pos = createVector(random(width/3, width - width/3),
                            random(height/3, height - height/3));
  this.velocity = createVector(0, 0);
  this.speed = createVector(2, 2);
  this.targ = createVector(this.pos.x, this.pos.y); //Set his target to his current position
  //Create a spacer so all the dudes don't stop the at the same distance from the target
  this.spacer = createVector(random(-5, 5), random(-5, 5));
  this.spacer.rotate(random(0, 360));

  this.closest = null;

  this.independant = false;

  this.update = function(){
      if(this.closest == null || this.closest.chopped){
        //Check to see if he currently has a target, and if it's been chopped down
        if(this.independant){ //If he's just wondering about
          this.closest = forest.getClosest(this.pos);
          //Set his target to the closest tree
        }
      }
      if (!this.independant){
        //Find the tree closest to the man within the cursor's slections
        this.closest = selected.closestTarget(this.pos);
      }
    if(this.closest != null){ //If he has a target
      //Create a new vector to represnt that target
      this.targ = createVector(this.closest.pos.x, this.closest.pos.y);
      //Add a spacer to the target
      this.targ.add(this.spacer);
      if(this.pos.dist(this.targ) > 4){//If he's not close enough to chop the tree
        //Move closer
        this.velocity = this.targ.sub(this.pos);  //Get direction
        this.velocity.normalize();  //Reduce it to 1
        this.velocity.mult(2, 2); //Multiply it by velocity
        stepSound.play();
      }else{
        this.closest.chop();  //If he's close enough, chop the tree
        this.velocity = (0, 0); //Stand still
      }
    } else {
      //If there aren't any valid targets stay still
      this.targ = null;
      this.velocity = (0, 0);
    }
    this.pos.add(this.velocity);
  }

  this.setIndependant = function(independance){
    this.independant = independance;
  }

  this.show = function(){
    stroke(255, 172, 167);
    fill(255, 172, 167);
    //The modulus is so the man isn't displayed at his exact Position
    //This makes movement look less smooth.
    rect(this.pos.x - (this.pos.x%5), this.pos.y-(this.pos.y%5), 4, 4)
    //rect(this.pos.x, this.pos.y, 4, 4);
  }
}
