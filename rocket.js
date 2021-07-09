function Rocket(position, dna) {
  this.mass = 1;
  this.r = this.mass * 4; //size

  this.pos = position.copy();
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);

  this.fitness = 0.0;
  this.dna = dna;
  this.geneCounter = 0;
  this.hitObstacle = false;
  this.hitTarget = false;

  this.finishTime = 0; //How long it takes to reach the target
  this.recordDist = width * height; //some high number that will be beaten instantly.

  this.isBest = false;

  //Fitness function
  //distance = distance from target
  //finish = what order did I finish in (first, second, third, etc...)
  //fitness(distance, finish) = (1.0/finish^1.5) * (1.0/distance^6);
  //a lower distance/finish is rewarded expoentially.
  //the rockets with the smallest distance to the target and the rockets with the best finishing place will be rewarded exponentially.
  this.calcFitness = function() {
    //best possible score is 1. A "0" would mess with our math
    if (this.recordDist < 1) {
      this.recordDist = 1;
    }

    //reward finishing faster and getting close
    this.fitness = (1 / (this.finishTime * this.recordDist));



    //make the function exponential
    this.fitness = pow(this.fitness, 8);

    //lose 90% of fitness if you hit an obstical
    if (this.hitObstacle) {
      this.fitness *= 0.001;
    }

    //double your fitness if you hit the target
    if (this.hitTarget) {
      this.fitness *= 10000;
    }

  }

  //Run in relate to all obsticals and target
  //If I hit an obstacle, don't bother updating
  this.run = function(obstacles) {
    if (!this.hitObstacle && !this.hitTarget) {
      this.applyForce(this.dna.genes[this.geneCounter]);
      this.geneCounter = (this.geneCounter + 1) % this.dna.genes.length;
      this.update();
      this.checkObstacles(obstacles);
    }

    //draw me!
    if (!this.hitObstacle) {
      this.display();
    }
  }

  //did I make it to the target?
  this.checkTarget = function() {
    var d = dist(this.pos.x, this.pos.y, target.pos.x, target.pos.y);

    if (d < this.recordDist) {
      this.recordDist = d;
    }

    if (target.contains(this.pos) && !this.hitTarget) {
      this.hitTarget = true;
    } else if (!this.hitTarget) {
      this.finishTime++;
    }
  }

  //Did I hit an obstacle?
  this.checkObstacles = function(obstacles) {
    for (var i = 0; i < obstacles.length; i++) {
      if (obstacles[i].contains(this.pos)) {
        this.hitObstacle = true;
      }
    }
  }

  //How to accelerate
  this.applyForce = function(force) {
    var newAcc = force.div(this.mass);
    this.acc.add(newAcc);
  }

  //Update velocity and position, reset acceleration
  this.update = function() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }


  this.display = function() {
    //rotate towards rocket's velocity
    var theta = this.vel.heading() + PI / 2;
    fill(200, 100);
    stroke(0);
    strokeWeight(1);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(theta);

    // Thrusters
    rectMode(CENTER);
    fill(0);
    rect(-this.r / 2, this.r * 2, this.r / 2, this.r);
    rect(this.r / 2, this.r * 2, this.r / 2, this.r);

    // Rocket body
    if (this.isBest) {
      fill(0, 255, 0);
    } else {
      fill(175);
    }

    beginShape(TRIANGLES);
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape();
    pop();

    if (this.isBest) {
      line(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
    }
  }
}