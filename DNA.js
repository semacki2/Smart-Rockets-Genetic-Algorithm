function DNA(lifetime) {
  this.lifetime = lifetime;

  //the genetic sequence of vectors
  this.genes = new Array(this.lifetime);

  this.maxForce = 0.1;

  //for every gene, create a random vector with a magnitude between 0 and maxForce
  for (var i = 0; i < this.genes.length; i++) {
    this.genes[i] = p5.Vector.random2D();
    this.genes[i].mult(random(0, this.maxForce));
  }
  
  //give the first vecotor a little "push" by setting its magnitude to one
  //which is 10 times the maxForce
  this.genes[0].normalize();
  

  //crossover
  //creates a new DNA "child" from this DNA parent and another DNA parent
  this.crossover = function(other) {
    //a new child
    var child = new DNA(this.genes.length);
    var midpoint = floor(random(this.genes.length)); // random midpoint in DNA

    //half from this parent, half from the other.
    for (var i = 0; i < this.genes.length; i++) {
      if (i > midpoint) {
        child.genes[i] = this.genes[i];
      } else {
        child.genes[i] = other.genes[i];
      }
    }
    return child;
  }

  //mutate child's genes based on mutation rate
  //for every gene there is a {muationRate} % chance to get a new "random" gene.
  //if the gene is index 0, give a little boost by setting the magnitude to 1 by normalizing the vector.
  this.mutate = function(mutationRate) {
    for (var i = 0; i < this.genes.length; i++) {
      if (random(1) < mutationRate) {
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].mult(random(0, this.maxForce));
        if(i == 0){
           this.genes[i].normalize();
           }
      }
    }
  }
}