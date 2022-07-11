import Color from "chroma-js";
import P5 from "p5";

interface Point {
  dir: number;
  startdir: number;
  color: Color.Color;
  position: [number, number];
  thickness: number;
  seed: number;
}

const setups = [
  {
    // Spinplosion
    pointMult: -1,
    cosper: 0,
    sinper: 0,
    dirSlowness: 5,
  },
  {
    // Random
    pointMult: 0,
    cosper: 0,
    sinper: 0,
    dirSlowness: 1,
  },
  {
    // uniform out
    pointMult: -1,
    cosper: Math.PI / 2,
    sinper: Math.PI / 2,
    dirSlowness: 10000,
  },
];
const setup = setups[2];

const TAU = Math.PI * 2;
const spread = 100;
const numberOfPoints = 3000;
const dirSlowness = setup.dirSlowness;
const thicknessSlowness = 2;
const thickness = 20;
const gaussianColorDiff = false;
const colorVariance = 30;

const s = (p5: P5) => {
  const points: Point[] = [];

  p5.setup = () => {
    let canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.background("#eeeeee");

    const getPoint = (theta?: number): [number, number] => {
      theta ||= Math.random() * TAU;
      const r = spread * p5.sqrt(Math.random());
      return [
        p5.width / 2 + Math.sin(theta + setup.sinper) * r,
        p5.height / 2 + Math.cos(theta + setup.cosper) * r,
      ];
    };
    const noise = p5.random(0, 360);

    for (let i = 0; i < numberOfPoints; i++) {
      const seed = p5.random(0, 10e5);
      const startdir = Math.random() * TAU;
      const pos = getPoint(-startdir * setup.pointMult);
      const m = p5.noise(seed, 0 / 8000 / dirSlowness);
      const dir = m * m * Math.PI * 2 * 8 + startdir;
      const p: Point = {
        startdir: dir,
        dir: dir,
        thickness: 0,
        position: pos,
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

      const m = p5.noise(p.seed, p5.millis() / 8000 / dirSlowness);
      p.dir = m * m * Math.PI * 2 * 8 - p.startdir;
      p.position[0] += Math.cos(p.dir);
      p.position[1] += Math.sin(p.dir);

      p5.line(prevpx, prevpy, p.position[0], p.position[1]);
    });

    // if (p5.millis() > 5 * 1000) p5.noLoop();
  };
};

new P5(s);
