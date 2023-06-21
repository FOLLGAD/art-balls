import P5 from 'p5'

let func = (p5: P5) => {
p5.setup = function setup() {
  p5.createCanvas(400, 400);
  //noLoop();
  p5.colorMode(p5.HSB)
}

let t = 0

let a = Math.random() * 100000

p5.draw = function draw() {
  p5.randomSeed(a)
  t+=p5.deltaTime
  
  p5.translate(p5.width/2, p5.height/2);
  
  p5.rotate(p5.PI / 40 * p5.sin(t/250))
  p5.translate(-150, 0)
  
  p5.background("antiquewhite");
  
  let x1 = 0, y1 = 0, x2 = 300, y2 = 0
  
  p5.fill(50, 90, 95)
  p5.stroke(50, 90, 70)
  p5.circle(150, 0, 200)
  
  p5.stroke("black")
  p5.line(x1, y1, x2, y2)
  
  for (let i = 0; i < 100; i++) {
    p5.push()
    let rand = p5.random()
    //line(x1 + (x2-x1)*rand, y1 + (y2-y1)*rand,
      //   300, 100)
    p5.translate(x1 + (x2-x1)*rand, y1 + (y2-y1)*rand)
    p5.rotate(p5.atan2(y2-y1, x2-x1))
    p5.strokeWeight(p5.random(1, 8))
    p5.stroke(p5.random(360), p5.random(50, 100), p5.random(50, 100))
    p5.strokeCap(p5.SQUARE)
    let len = 
        //random(100)
        p5.random(p5.log(1 + (p5.abs(rand-0.5)))*200 + p5.random(5, 10)) +
        (1 + p5.sin(t / 1000 + p5.random(5.923)))
    p5.line(0, 0,
         0, -len)
    p5.pop()
  }
  
  p5.noStroke()
  p5.fill("antiquewhite")
  p5.rect(-20, 0, p5.width+20, 150)
  p5.scale(0)
}
}

new P5(func)
