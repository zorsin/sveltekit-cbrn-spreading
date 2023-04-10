import * as coordUtils from '../logic/coordinate-utils';
import type { CoordinateObject, PointLatLon } from '../logic/coordinate-utils';

export default class Spread {
  points: [number, number][];
  width: number;
  length: number;
  startCoordinate: CoordinateObject = { lat: 0, lon: 0 };
  coordinates: PointLatLon[] = [];
  angle: number;
  strength: number;
  spreadStrength: SpreadRing[];
  mode: SpreadMode;
  openingAngle: number;

  constructor({ startCoordinate, width = 0, length = 0, angle = 0, strength = 50000, mode = 'ellipse', openingAngle = 0 }: SpreadConfig) {
    this.width = width;
    this.length = length;
    this.startCoordinate = coordUtils.toObject(startCoordinate);
    this.angle = angle;
    this.strength = strength;
    this.mode = mode;
    this.openingAngle = openingAngle;

    if (mode === 'ellipse') {
      this.calculateEllipse();
    } else if (mode == 'triangle') {
      this.calculateTriangele();
    }
  }

  calculateEllipse(): [number, number][] {
    const ellipseLength = this.length / 2;
    const ellipseWidth = this.width / 2;
    let x = ellipseLength * -1;
    let yPrositiv = 0;
    let yNegativ = 0;
    const pointsPrositiv = [];
    const pointsNegativ = [];
    // right side
    do {
      yPrositiv = (ellipseWidth / ellipseLength) * Math.sqrt(ellipseLength * ellipseLength - x * x);
      pointsPrositiv.push([x, yPrositiv]);
      x++;
    } while (x < ellipseLength);
    x = ellipseLength;
    // left side
    do {
      yNegativ = -1 * (ellipseWidth / ellipseLength) * Math.sqrt(ellipseLength * ellipseLength - x * x);
      pointsNegativ.push([x, yNegativ]);
      x--;
    } while (x > ellipseLength * -1);
    // add fist point again to close the form
    this.points = [...pointsNegativ, ...pointsPrositiv, pointsNegativ[0]];
    return this.points;
  }

  calculateTriangele(): PointLatLon[] {
    this.points = [];
    return this.points;
  }

  toCoordnates(): PointLatLon[] {
    switch (this.mode) {
      case 'ellipse':
        return this.toCoordnatesEllipse();
      case 'triangle':
        return this.toCoordnatesTriangle();
      default:
        return [];
    }
  }

  toCoordnatesTriangle(): PointLatLon[] {
    const openingAngle = this.openingAngle; //degree
    const angle = coordUtils.degreeToRadian(openingAngle / 2);
    const directionAngle = coordUtils.degreeToRadian(this.angle);
    const hypotenuse = coordUtils.calcHypotenuseFromAndjacentAlpha(this.length, angle);
    const pointA = coordUtils.calcBearing(this.startCoordinate.lat, this.startCoordinate.lon, angle + directionAngle, hypotenuse);
    const pointB = coordUtils.calcBearing(this.startCoordinate.lat, this.startCoordinate.lon, angle * -1 + directionAngle, hypotenuse);
    this.coordinates = [
      coordUtils.toLeafletPoint(this.startCoordinate),
      coordUtils.toLeafletPoint(pointA),
      coordUtils.toLeafletPoint(pointB),
      coordUtils.toLeafletPoint(this.startCoordinate),
    ];
    return this.coordinates;
  }

  toCoordnatesEllipse(): PointLatLon[] {
    const coordinates: PointLatLon[] = [];
    const direction = coordUtils.degreeToRadian(this.angle);
    const centerCoordinate = coordUtils.calcBearing(this.startCoordinate.lat, this.startCoordinate.lon, direction, this.length / 2);
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

  getSpreadStrength(): SpreadRing[] {
    if (this.spreadStrength) return this.spreadStrength;
    // replace to diffrent ellips with custom values
    const spreadDivider = 500;
    const outerStrength = this.strength / spreadDivider;
    const spreadStrength: SpreadRing[] = [];
    for (let i = 1; i < spreadDivider + 1; i++) {
      const innerSpreadStrength = this.strength - outerStrength * (i - 1);
      const nextColor = this.calcSpreadColor(innerSpreadStrength);
      spreadStrength.push(this.calcInnerSpread(spreadDivider, i, nextColor, innerSpreadStrength));
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

  getSpreadStrengthLight(): SpreadRing[] {
    if (this.spreadStrength) return this.spreadStrength;
    // replace to diffrent ellips with custom values
    const spreadDivider = 500;
    const outerStrength = this.strength / spreadDivider;
    const spreadStrength: SpreadRing[] = [];

    let lastColor = '-';
    for (let i = spreadDivider + 1; i > 0; i--) {
      const innerSpreadStrength = this.strength - outerStrength * (i - 1);
      const nextColor = this.calcSpreadColor(innerSpreadStrength);
      if (lastColor == nextColor) {
        continue;
      }
      lastColor = nextColor;
      spreadStrength.push(this.calcInnerSpread(spreadDivider, i, nextColor, innerSpreadStrength));
    }
    this.spreadStrength = spreadStrength;
    return spreadStrength;
  }

  calcInterValues(spreadDivider, i) {
    switch (this.mode) {
      case 'ellipse':
        return {
          innerWidth: (this.width / spreadDivider) * i,
          innerLength: (this.length / spreadDivider) * i,
          innerOpeningAngle: 0,
        };
      case 'triangle':
        return {
          innerWidth: 0,
          innerLength: (this.length / spreadDivider) * i,
          innerOpeningAngle: (this.openingAngle / spreadDivider) * i,
        };
      default:
        return {
          innerWidth: this.width,
          innerLength: this.length,
          innerOpeningAngle: this.openingAngle,
        };
    }
  }

  calcInnerSpread(spreadDivider, i, color, innerSpreadStrength): SpreadRing {
    const { innerWidth, innerLength, innerOpeningAngle } = this.calcInterValues(spreadDivider, i);
    const innerSpread = new Spread({
      startCoordinate: [this.startCoordinate.lat, this.startCoordinate.lon],
      width: innerWidth,
      length: innerLength,
      angle: this.angle,
      mode: this.mode,
      openingAngle: innerOpeningAngle,
    });
    return {
      id: i,
      latLngs: innerSpread.toCoordnates(),
      value: innerSpreadStrength,
      width: innerWidth,
      length: innerLength,
      openingAngle: innerOpeningAngle,
      color,
    };
  }

  calcSpreadColor(strength): SpreadColor {
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

export type SpreadColor = string;
export type SpreadRing = {
  id: number;
  latLngs: PointLatLon[];
  value: number;
  length: number;
  width?: number;
  openingAngle?: number;
  color: SpreadColor;
};
export type SpreadMode = 'ellipse' | 'triangle';
export type SpreadConfig = {
  startCoordinate: PointLatLon;
  length: number;
  angle: number;
  mode: SpreadMode;
  strength?: number;
  width?: number;
  openingAngle?: number;
};
