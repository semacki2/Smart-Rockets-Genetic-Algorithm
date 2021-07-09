function Obstacle(x, y, w, h, isTarget, mode) {
  this.pos = createVector(x, y);
  this.width = w;
  this.height = h;
  this.isTarget = isTarget
  this.mode = mode;

  this.display = function() {
    stroke(0);
    if (this.isTarget) {
      fill(255, 0, 0);

    } else {
      fill(175);

    }
    strokeWeight(1);
    if (this.mode == "CENTER") {
      rectMode(CENTER);
    } else {
      rectMode(CORNER);
    }
    rect(this.pos.x, this.pos.y, this.width, this.height);
  }

  this.contains = function(other) {
    if (this.mode == "CENTER") {
      if (other.x > this.pos.x - this.width / 2 && other.x < this.pos.x + this.width / 2 && other.y > this.pos.y - this.height / 2 && other.y < this.pos.y + this.height / 2) {
        return true;
      } else {
        return false;
      }
    } else {
      if (other.x > this.pos.x && other.x < this.pos.x + this.width && other.y > this.pos.y && other.y < this.pos.y + this.height) {
        return true;
      } else {
        return false;
      }
    }
  }
}