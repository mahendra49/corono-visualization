export function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function distance(object1, object2) {
  const xd = object1.x - object2.x;
  const yd = object1.y - object2.y;
  const dis = Math.sqrt(xd * xd + yd * yd);
  return dis;
}

export default { getRandomArbitrary, getRandomInt, distance };
