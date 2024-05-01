class Ball {
  constructor(x, y, d, fillColor, speedX, speedY, contextWidth, contextHeight) {
    this.x = x
    this.y = y
    this.d = d
    this.radius = d / 2
    this.fillColor = fillColor
    this.speedX = speedX
    this.speedY = speedY
    this.contextWidth = contextWidth
    this.contextHeight = contextHeight
  }
  
  drawBall() {
    fill(this.fillColor)
    circle(this.x, this.y, this.d)
  }
  
  move() {
    if (this.x + this.radius > this.contextWidth || this.x - this.radius < 0) {
      this.speedX *= -1
    }
    
    if (this.y + this.radius > this.contextHeight || this.y - this.radius < 0) {
      this.speedY *= -1
    }
    
    this.x += this.speedX
    this.y += this.speedY
  }
}

class Racket {
  constructor(x, y, w, h, fillColor, contextWidth, contextHeight) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.fillColor = fillColor
    this.contextWidth = contextWidth
    this.contextHeight = contextHeight
  }
  
  drawRacket() {
    fill(this.fillColor)
    rect(this.x, this.y, this.w, this.h)
  }
  
  move(keyUp, keyDown, step) {
    if (keyIsDown(keyUp)) {
      if (this.y <= 0) {
        step = 0
      }
      this.y -= step
    }
    
    if (keyIsDown(keyDown)) {
      if (this.y + this.h >= this.contextHeight) {        
        step = 0
      }
      this.y += step
    }
  }
  
  hit(ballX, ballY, ballRadius) {
    return collideRectCircle(this.x, this.y, this.w, this.h, ballX, ballY, ballRadius)
  }
}

let ball
let player1
let player2

let player1Score = 0
let player2Score = 0

// sounds
let hitSound
let scoreSound
let soundtrack

function preload() {
  hitSound = loadSound('assets/hit.mp3')
  scoreSound = loadSound('assets/score.mp3')
  soundtrack = loadSound('assets/soundtrack.mp3')
}

function setup() {
  createCanvas(1280, 720)
  soundtrack.loop()
  
  const ballX = width / 2
  const ballY = height / 2
  
  ball = new Ball(ballX, ballY, 12, 'white', 10, 10, width, height)
  
  const racketWidth = 6
  const racketHeight = 80
  
  const player1X = 5
  const player1Y = height / 2 - racketHeight / 2
  
  const player2X = width - racketWidth - 5
  const player2Y = player1Y
  
  player1 = new Racket(player1X, player1Y, racketWidth, racketHeight, 'white', width, height)
  player2 = new Racket(player2X, player2Y, racketWidth, racketHeight, 'white', width, height)
}

function draw() {
  background('black')

  scoreboard(player1Score, width / 3, 20)
  scoreboard(player2Score, width - width / 3, 20)
  
  ball.drawBall()
  ball.move()
  
  player1.drawRacket()
  player1.move(87, 83, 12)
  
  player2.drawRacket()
  player2.move(UP_ARROW, DOWN_ARROW, 12)
  
  let player1Hit = player1.hit(ball.x, ball.y, ball.radius)
  let player2Hit = player2.hit(ball.x, ball.y, ball.radius)
  
  if (player1Hit || player2Hit) {
    ball.speedX *= -1
    hitSound.play()
  }
  
  if (ball.x - ball.radius <= 0) {
    player2Score += 1
    scoreSound.play()
    ball.x = player2.x - ball.radius
    ball.y = player2.y + player2.h / 2
  }
  
  if (ball.x + ball.radius >= width) {
    player1Score += 1
    scoreSound.play()
    ball.x = player1.x + player1.w + ball.radius
    ball.y = player1.y + player1.h / 2
  }
}

function scoreboard(score, x, y) {
  textSize(20)
  textAlign(CENTER, TOP)
  textStyle(BOLD)
  
  stroke('white')
  fill('red')
  rect(x - 25, y, 50, 25)
  
  noStroke()
  fill('white')
  text(score, x, y + 4)
}
