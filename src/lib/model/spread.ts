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
    const spreadStrength = [];
    for (let i = 1; i < spreadDivider + 1; i++) {
      const innerSpreadStrength = this.strength - outerStrength * (i - 1);
      const nextColor = this.calcSpreadColor(innerSpreadStrength);
      spreadStrength.push(spreadDivider, i, nextColor, innerSpreadStrength);
    }

    this.spreadStrength = spreadStrength;
    return spreadStrength;
    // //structure
    //  [ // the order is mandaoty from small to big for point in poly
    //   { // the ellips with this strength
    //     id: 0
    //     latLngs: [[lat,lng],[lat,lng]],
    //     value: 700,
    //     color: '#330099' // blue
    //   },
    // ];
  }

  getSpreadStrengthLight() {
    if (this.spreadStrength) return this.spreadStrength;
    // replace to diffrent ellips with custom values
    const spreadDivider = 500;
    const outerStrength = this.strength / spreadDivider;
    const spreadStrength = [];

    let lastColor = '-';
    for (let i = spreadDivider + 1; i > 0; i--) {
      const innerSpreadStrength = this.strength - outerStrength * (i - 1);
      const nextColor = this.calcSpreadColor(innerSpreadStrength);
      if (lastColor == nextColor) {
        continue;
      }
      lastColor = nextColor;
      spreadStrength.push(spreadDivider, i, nextColor, innerSpreadStrength);
    }
    this.spreadStrength = spreadStrength;
    return spreadStrength;
  }

  calcInnerSpread(spreadDivider, i, color, innerSpreadStrength) {
    const innerWidth = ((this.width * 2) / spreadDivider) * i;
    const innerLength = ((this.length * 2) / spreadDivider) * i;
    const innerSpread = new Spread(
      [this.startCoordinate.lat, this.startCoordinate.lon],
      innerWidth,
      innerLength,
      this.angle,
    );
    return {
      id: i,
      latLngs: innerSpread.toCoordnates(),
      value: innerSpreadStrength,
      width: innerWidth,
      length: innerLength,
      color,
    };
  }

  calcSpreadColor(strength) {
    // values in nSv
    if (strength < 300) {
      return '#FFF'; // white
    } else if (strength < 800) {
      return '#84CC16'; // light green
    } else if (strength < 1000) {
      return '#365314'; // dark green
    } else if (strength < 10000) {
      return '#06B6D4'; // light blue
    } else if (strength < 20000) {
      return '#3B82F6'; // blue
    } else if (strength < 50000) {
      return '#1E3A8A'; // dark blue
    } else if (strength < 100000) {
      return '#EA580C'; // orange
    } else if (strength < 200000) {
      return '#EAB308'; // yellow
    } else {
      // over 200000 = 200µSv (micro)
      return '#DC2626'; // red
    }
  }
}
