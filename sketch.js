var target;
var population;
var lifetime = 500; //how many frames each rocket will live for
var lifecycle = 0; //timer for cycle of generation
var popSize = 100;
var mutationRate = 0.05;
var recordTime = lifetime;
var obstacles = [];
var previousGenAverage = 0;
var previousGenBest = 0;
var newObStart;
var newObEnd;

var pStats;


function setup() {
  createCanvas(640, 480);
  createElement('h2', 'Click and drag to create additional obstacles.');
  //frameRate(20);
  pStats = createP('Stats:');

  target = new Obstacle((width / 2) - 12, 24, 24, 24, true, "CENTER");

  //create a population
  population = new Population(mutationRate, popSize, lifetime);

  //create obstacle course
  obstacles.push(new Obstacle((width / 2), height / 2, 200, 10, false, "CENTER"));

}

function draw() {
  background(255);

  target.display();

  //if the generation hasn't ended yet...
  if (lifecycle < lifetime) {
    population.run(obstacles);
    //if there is a new record best time
    if ((population.targetReached()) && (lifecycle < recordTime)) {
      recordTime = lifecycle;
    }
    lifecycle++;
    //otherwise a new generation
  } else {
    lifecycle = 0;
    population.calcFitness();
    previousGenAverage = population.getAverageFitness();
    previousGenBest = population.getBestFitness();
    population.naturalSelection();
    //print(population);
    population.generate();
  }

  //display the obstacles
  for (var i = 0; i < obstacles.length; i++) {
    obstacles[i].display();
  }

  //display some info
  displayInfo();
}

function displayInfo() {
  var statsText = "Generation:  " + population.generations + "<br/>";
  statsText += "Cycles Left:  " + nf(lifetime - lifecycle) + "<br/>";
  statsText += "Record Time:  " + nf(recordTime) + "<br/>";
  statsText += "Previous Generation Best Fitness:  " + nf(previousGenBest) + "<br/>";
  statsText += "Previous Generation Average Fitness:  " + nf(previousGenAverage) + "<br/>";
  statsText += "Population Size:  " + population.population.length + "<br/>";
  statsText += "Mutation Rate:  " + floor(population.mutationRate * 100) + "%";

  pStats.html(statsText);
}

function mousePressed() {
  newObStart = createVector(mouseX, mouseY);
}

function mouseReleased() {
  newObEnd = createVector(mouseX, mouseY);
  var w = newObEnd.x - newObStart.x;
  var h = newObEnd.y - newObStart.y;

  if (w > 0 && h > 0) {
    var newOb = new Obstacle(newObStart.x, newObStart.y, w, h, false, "CORNER");
  } else if (w < 0 && h > 0) {
    var newOb = new Obstacle(newObStart.x - abs(w), newObStart.y, abs(w), abs(h), false, "CORNER");
  } else if (w > 0 && h < 0) {
    var newOb = new Obstacle(newObStart.x, newObStart.y - abs(h), abs(w), abs(h), false, "CORNER");
  } else if (w < 0 && h < 0) {
    var newOb = new Obstacle(newObStart.x - abs(w), newObStart.y - abs(h), abs(w), abs(h), false, "CORNER");
  } else {
    var newOb = new Obstacle(newObStart.x, newObStart.y, 1, 1, false, "CORNER");
  }


  obstacles.push(newOb);
}