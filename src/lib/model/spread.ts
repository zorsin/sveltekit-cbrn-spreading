import * as coordUtils from '../logic/coordinate-utils';
export default class Spread {
  points;
  width;
  length;
  startCoordinate = { lat: 0, lon: 0 };
  coordinates = [];
  angle;
  strength;
  spreadStrength;

  constructor(startCoordinate, width, length, angle = 0, strength = 50000) {
    this.width = width / 2;
    this.length = length / 2;
    this.startCoordinate = coordUtils.toObject(startCoordinate);
    this.angle = angle;
    this.strength = strength;
    this.calculateEllipse();
  }

  calculateEllipse() {
    let x = this.length * -1;
    let yPrositiv = 0;
    let yNegativ = 0;
    const pointsPrositiv = [];
    const pointsNegativ = [];
    // right side
    do {
      yPrositiv = (this.width / this.length) * Math.sqrt(this.length * this.length - x * x);
      pointsPrositiv.push([x, yPrositiv]);
      x++;
    } while (x < this.length);
    x = this.length;
    // left side
    do {
      yNegativ = -1 * (this.width / this.length) * Math.sqrt(this.length * this.length - x * x);
      pointsNegativ.push([x, yNegativ]);
      x--;
    } while (x > this.length * -1);
    // add fist point again to close the form
    this.points = [...pointsNegativ, ...pointsPrositiv, pointsNegativ[0]];
    return this.points;
  }

  toCoordnates() {
    const coordinates = [];
    // const startCoordinate = coordUtils.calcBearing(lat, lon, 0, this.length);
    // this.startCoordinate = startCoordinate;
    const direction = (this.angle / 180) * Math.PI; //parseFloat(this.angle);
    const centerCoordinate = coordUtils.calcBearing(
      this.startCoordinate.lat,
      this.startCoordinate.lon,
      direction,
      this.length,
    );
    if (this.points) {
      this.points.forEach((point) => {
        const angle = coordUtils.calcAngelFromAndjacentOpposite(point[0], point[1]);
        const c = coordUtils.calcBearing(
          centerCoordinate.lat,
          centerCoordinate.lon,
          direction + angle,
          coordUtils.calcHypotenuseFromAndjacentAlpha(point[0], angle),
        );
        if (c.lat != centerCoordinate.lat || c.lon != centerCoordinate.lon) {
          coordinates.push(coordUtils.toLeafletPoint(c));
        }
      });
    }
    this.coordinates = coordinates;
    return coordinates;
  }

  getSpreadStrength() {
    if (this.spreadStrength) return this.spreadStrength;
    // replace to diffrent ellips with custom values
    const spreadDivider = 500;
    const outerStrength = this.strength / spreadDivider;
    const spreadStrength = {};
    for (let i = 1; i < spreadDivider + 1; i++) {
      // console.log('innerWidth', ((this.width * 2) / spreadDivider) * i);
      const innerWidth = ((this.width * 2) / spreadDivider) * i;
      const innerLength = ((this.length * 2) / spreadDivider) * i;
      const innerSpread = new Spread(
        [this.startCoordinate.lat, this.startCoordinate.lon],
        innerWidth,
        innerLength,
        this.angle,
      );
      const innerSpreadStrength = this.strength - outerStrength * (i - 1);
      spreadStrength[i] = {
        points: innerSpread.toCoordnates(),
        value: innerSpreadStrength,
        width: innerWidth,
        length: innerLength,
      };
    }
    // console.log('spread strenght', spreadStrength);
    this.spreadStrength = spreadStrength;
    return spreadStrength;
    // //structure
    // const s = {
    //   0: {
    //     points: this.toCoordnates(),
    //     value: 700,
    //     // color: '#330099' // blue
    //   },
    // };
    // return s;
  }
}
