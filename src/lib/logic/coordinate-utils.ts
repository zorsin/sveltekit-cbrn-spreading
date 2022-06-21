// peilung = bearing
// lat = breite (40-50), north
// lon = längen (9), east

export const calcBearing = (lat, lon, angle, distance) => {
  // https://www.cachewiki.de/wiki/Wegpunktprojektion

  // north
  const distanceLat = distance * Math.cos(angle);
  //east
  const distanceLon = distance * Math.sin(angle);
  // calc northern distance offset
  const distanceLatOffset = distanceLat / 1850;

  // calc east distance offset
  const northAngle = (Math.PI * lat) / 180;
  const distanceLonOffset = distanceLon / (1850 * Math.cos(northAngle));

  const newLat = lat + distanceLatOffset / 60;
  const newLon = lon + distanceLonOffset / 60;

  return { lat: newLat, lon: newLon };
};

export const toLeafletPoint = ({ lat, lon }) => {
  return [lat, lon];
};

export const toObject = (leafletPoint) => {
  return { lat: leafletPoint[0], lon: leafletPoint[1] };
};

export const calcAngelFromAndjacentOpposite = (andjacent, opposite) => {
  // alpha gleich ankathete durch gegenkathete
  const angleAlpha = Math.atan(opposite / andjacent);
  return angleAlpha;
};

export const calcHypotenuseFromAndjacentAlpha = (andjacent, alpha) => {
  const hypotenuse = andjacent / Math.cos(alpha);
  return hypotenuse;
};
