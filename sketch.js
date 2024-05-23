let sparkles = [];
let prevMouseX, prevMouseY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function draw() {
  background(0);
  drawLightBeam();
  if (mouseMoved()) {
    createSparkles();
  }
  drawSparkles();
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function drawLightBeam() {
  // Create the gradient
  let gradient = drawingContext.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, color(255, 255, 100, 150));
  gradient.addColorStop(1, color(255, 255, 255, 0));

  // Draw the gradient
  drawingContext.fillStyle = gradient;

  // Create a curved shape for the shoreline
  beginShape();
  vertex(0, 0);
  vertex(width, 0);
  vertex(width, height * 0.8);
  for (let x = width; x >= -500; x -= 500) {
    let y = height * 0.8 + map(noise(x * 0.01), 0, 1, -100, 100);
    vertex(x, y);
  }
  vertex(0, height * 0.1);
  vertex(0, 0);
  endShape(CLOSE);
}

function createSparkles() {
  let clusterSize = 1; // Number of sparkles in a cluster
  let clusterRadius = 150; // Radius for larger clusters
  for (let i = 0; i < clusterSize; i++) {
    let angle = random(TWO_PI);
    let radius = random(clusterRadius * 0.5, clusterRadius); // Random offset within the cluster radius
    let xOffset = cos(angle) * radius;
    let yOffset = sin(angle) * radius;
    let sparkleX = mouseX + xOffset;
    let sparkleY = mouseY + yOffset;

    // Check if the sparkle is within the gradient area
    if (sparkleY <= height * 0.8 + map(noise(sparkleX * 0.01), 0, 1, -100, 100)) {
      let sparkle = {
        x: sparkleX,
        y: sparkleY,
        size: random(3, 6), // Slightly larger sparkles
        lifespan: 255,
        sparkleSpeed: random(1, 3),
        twinkleOffset: random(0, TWO_PI), // Phase offset for twinkling effect
        twinkleSpeed: random(0.05, 0.2) // Unique twinkle speed for each sparkle
      };
      sparkles.push(sparkle);
    }
  }
}

function drawSparkles() {
  for (let i = sparkles.length - 1; i >= 0; i--) {
    let sparkle = sparkles[i];
    let twinkle = sin((frameCount + sparkle.twinkleOffset) * sparkle.twinkleSpeed) * 127 + 128;
    fill(255, 255, 255, twinkle * (sparkle.lifespan / 255));
    ellipse(sparkle.x, sparkle.y, sparkle.size);

    sparkle.lifespan -= sparkle.sparkleSpeed;
    if (sparkle.lifespan <= 0) {
      sparkles.splice(i, 1);
    }
  }
}

function mouseMoved() {
  return mouseX !== prevMouseX || mouseY !== prevMouseY;
}
