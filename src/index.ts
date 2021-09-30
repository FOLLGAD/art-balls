import Color from "chroma-js";
import P5 from "p5";

interface Point {
  dir: number;
  color: Color.Color;
  position: [number, number];
  thickness: number;
  seed: number;
}

const TAU = Math.PI * 2;
const spread = 100;
const numberOfPoints = 3000;
const dirSlowness = 1;
const thicknessSlowness = 2;
const thickness = 20;
const gaussianColorDiff = false;
const colorVariance = 20;

const s = (p5: P5) => {
  const points: Point[] = [];

  p5.setup = () => {
    let canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.background("#eeeeee");

    const getPoint = (): [number, number] => {
      const theta = Math.random() * TAU;
      const r = spread * p5.sqrt(Math.random());
      return [
        p5.width / 2 + Math.cos(theta) * r,
        p5.height / 2 + Math.sin(theta) * r,
      ];
    };
    const noise = p5.random(0, 360);

    for (let i = 0; i < numberOfPoints; i++) {
      const seed = p5.random(0, 10e5);
      const p: Point = {
        dir: 0,
        thickness: 0,
        position: getPoint(),
        color: Color.hsl(
          (noise +
            (gaussianColorDiff
              ? p5.randomGaussian(0, colorVariance)
              : p5.random(-1, 1) * colorVariance) +
            360) %
            360,
          1,
          0.5
        ),
        seed,
      };

      points.push(p);
    }
  };

  p5.draw = () => {
    p5.background("rgba(240, 240, 240, 0.01)");

    points.map((p) => {
      p.thickness =
        p5.noise(p.seed * 2, p5.millis() / 1000 / thicknessSlowness) *
        thickness;
      p5.stroke(p.color.hex());
      p5.strokeWeight(p.thickness);

      let prevpx = p.position[0],
        prevpy = p.position[1];

      p.dir =
        p5.noise(p.seed, p5.millis() / 8000 / dirSlowness) *
        p5.noise(p.seed) *
        Math.PI *
        2 *
        8;
      p.position[0] += Math.cos(p.dir);
      p.position[1] += Math.sin(p.dir);

      p5.line(prevpx, prevpy, p.position[0], p.position[1]);
    });

    // if (p5.millis() > 5 * 1000) p5.noLoop();
  };
};

new P5(s);
