function Population(mutationRate, popSize, popLifetime) {
  this.population = new Array(popSize); //Array to hold the current population
  this.matingPool = []; //Array to hold parents for the next generation
  this.generations = 0; //Number of generations
  this.mutationRate = mutationRate;
  this.popLifetime = popLifetime;

  //Initialize a population of new rockets
  for (var i = 0; i < this.population.length; i++) {
    var startingPosition = createVector(width / 2, height + 20);
    var newDNA = new DNA(this.popLifetime);
    var newRocket = new Rocket(startingPosition, newDNA)
    this.population[i] = newRocket;
  }

  // run every rocket in the population
  this.run = function(obstacles) {
    this.calcFitness();
    this.assignLeader();
    for (var i = 0; i < this.population.length; i++) {
      //if it finishes, mark it as done;
      this.population[i].checkTarget();
      this.population[i].run(obstacles);
    }
  }

  //did anything finish?
  this.targetReached = function() {
    for (var i = 0; i < this.population.length; i++) {
      if (this.population[i].hitTarget) {
        return true;
      }
    }
    return false;
  }

  // fill our fitness array with a value for every memebr of the poulation
  this.calcFitness = function() {
    for (var i = 0; i < this.population.length; i++) {
      this.population[i].calcFitness();
    }
  }

  //generate a mating pool
  this.naturalSelection = function() {
    //clear the array
    this.matingPool = [];

    //find max fitness in population
    var maxFitness = 0;

    for (var i = 0; i < this.population.length; i++) {
      if (this.population[i].fitness > maxFitness) {
        maxFitness = this.population[i].fitness;
      }
    }

    //print(this);

    //based on fitness, each member will get added to the mating pool
    //higher fitness = more entries in mating pool
    //lower fitness = fewer entries in mating pool
    for (i = 0; i < this.population.length; i++) {
      //normalize fitness by scaling fitness to probablity, based on indivudal fitness relative to maxFitness in this generation
      var fitness = map(this.population[i].fitness, 0, maxFitness, 0, 1);
      var numberOfMatingPoolEntries = floor((fitness * 1000)); // arbitrary multiplier
      for (var j = 0; j < numberOfMatingPoolEntries; j++) { //
        this.matingPool.push(this.population[i]);
      }
    }
  }

  //create a new generation
  this.generate = function() {
    //Refill the population with children from the mating pool
    for (var i = 0; i < this.population.length; i++) {
      var indexParentA = floor(random(this.matingPool.length));
      var indexParentB = floor(random(this.matingPool.length));
      var parentA = this.matingPool[indexParentA];
      var parentB = this.matingPool[indexParentB];
      var childDNA = parentA.dna.crossover(parentB.dna);
      childDNA.mutate(this.mutationRate);
      var startingPosition = createVector(width / 2, height + 20);
      var newRocket = new Rocket(startingPosition, childDNA);
      this.population[i] = newRocket;
    }
    this.generations++;
  }

  this.getAverageFitness = function() {
    var total = 0;
    for (var i = 0; i < this.population.length; i++) {
      total += this.population[i].fitness;
    }
    var average = total / this.population.length;
    return average;
  }

  this.getBestFitness = function() {
    var best = 0;
    for (var i = 0; i < this.population.length; i++) {
      if (this.population[i].fitness > best) {
        best = this.population[i].fitness;
      }
    }
    return best;
  }

  this.assignLeader = function() {
    var best = 0;
    var bestIndex;
    for (var i = 0; i < this.population.length; i++) {
      if (this.population[i].fitness > best) {
        best = this.population[i].fitness;
        bestIndex = i;
      }
      this.population[i].isBest = false;
    }

    this.population[bestIndex].isBest = true;
  }
}