import P5 from "p5";

interface Cockroach {
  position: Position;
  dir: number;
  size: number;
}

type Position = [number, number];

const func = (p5: P5) => {
  const distancesq = (p1: Position, p2: Position) => {
    const xd = p1[0] - p2[0];
    const yd = p1[1] - p2[1];
    return xd * xd + yd + yd;
  };

  const cockroaches: Cockroach[] = [];

  const gendir = () => p5.random(0, Math.PI * 2);

  const genroach = (): Cockroach => ({
    position: [p5.random(0, p5.width), p5.random(0, p5.height)],
    dir: gendir(),
    size: p5.random(10, 20),
  });

  p5.setup = () => {
    let canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.background("#eeeeee");
    canvas.doubleClicked(({ clientX, clientY }) => {
      cockroaches.push({
        position: [clientX, clientY],
        dir: gendir(),
        size: p5.random(10, 20),
      });
    });
    for (let i = 0; i < 300; i++) cockroaches.push(genroach());
  };

  const outsideMap = (p: Position) => {
    return p[0] < 0 || p[0] > p5.width || p[1] < 0 || p[1] > p5.height;
  };
  const minus = (p: Position, p2: Position) =>
    [p[0] - p2[0], p[1] - p2[1]] as Position;

  p5.draw = () => {
    p5.background("#eeeeee");
    cockroaches.map((cock, _i, arr) => {
      p5.circle(cock.position[0], cock.position[1], cock.size);
      const newpos: Position = [
        cock.position[0] + Math.cos(cock.dir),
        cock.position[1] + Math.sin(cock.dir),
      ];
      if (outsideMap(newpos)) {
        cock.dir = gendir();
      } else {
        cock.position = newpos;
      }

      // sense
      const RANGE2 = 200 * 200;
      const inRange = arr
        .filter((c) => c !== cock)
        .map((c) => [distancesq(c.position, cock.position), c] as const)
        .filter((c) => c[0] < RANGE2)
        .map(([_, c]) => c);
      const rads = inRange.map((c) => {
        const delta = minus(c.position, cock.position);
        const theta_rad = p5.atan2(delta[1], delta[0]);
        return theta_rad - cock.dir;
      });
      const numToLeft = rads.filter(
        (theta) => theta > -p5.QUARTER_PI && theta < 0
      ).length;
      const numToRight = rads.filter(
        (theta) => theta < p5.QUARTER_PI && theta > 0
      ).length;
      if (numToLeft !== numToRight) {
        cock.dir += 0.15 * (numToLeft < numToRight ? 1 : -1);
      }
    });
  };
};

new P5(func);
