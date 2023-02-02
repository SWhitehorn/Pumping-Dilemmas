// Assorted useful functions
import colours from "./colours.js";

/**
 * Returns next available letter in language, or first if all are taken
 * @param {string} letter - Current language
 * @param {string[]} language - Array of symbols in the language
 * @returns {string} Next available symbol
 */
export const getNextLetter = (letter, language) => {
  const index = language.indexOf(letter);
  if (index + 1 < language.length) {
    return language[index + 1];
  } else {
    return language[0];
  }
};

/**
 * Tests whether object is empty
 * @param {Object} obj - Object to test
 * @returns {boolean} True if empty (no keys), false if not
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Creates a key for transition based on the names of the two states
 * @param {string} first - Name of first state
 * @param {string} second - Name of second state
 */
export const createKey = (first, second) => {
  return first + "," + second;
};

/**
 * Tests whether two states onnected by a transition are the same
 * @param {string} key - The key for the transition
 * @returns {boolean} True if the transition runs from state to itself
 */
export const sameState = (key) => {
  const states = splitKey(key);
  return states[0] === states[1];
};

/** Returns the key split into the names of the two states */
export const splitKey = (key) => {
  return key.split(",");
};

/**
 * Generates a random number between bounds
 * @param {number} min - The lower bound of the value (inclusive)
 * @param {number} max - The upper bound of the value (exclusive)
 * @returns {number} The chosen number
 */
export const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const drawTriangle = (scene, tri) => {
  scene.graphics.fillStyle(colours.BLACK);
  scene.graphics.fillTriangleShape(tri);
  scene.graphics.strokeTriangleShape(tri);
};

/**
 * Calculates how far left a word should start drawing so it is centered on screen
 * @param {String} word
 * @param {Boolean} [small] - Flag small letter sizing
 */
export const calculateStartingX = (word, small = false) => {
  const width = 800;
  let letterWidth = 35;

  // Option for smaller letter
  if (small) {
    letterWidth = 20;
  }

  const wordWidth = letterWidth * word.length;
  return width / 2 - wordWidth / 2;
};

/**
 * Tests whether point is within bounds of shape.
 * @param {Object} shape - Game object shape to test.
 * @param {Point} point
 */
export const withinBounds = (shape, point) => {
  const bounds = shape.getBounds();

  return (
    point.x > bounds.x &&
    point.x < bounds.x + bounds.width &&
    point.y > bounds.y &&
    point.y < bounds.y + bounds.height
  );
};

/** Changes the background colour */
export const changeBackground = (scene) => {
  scene.cameras.main.setBackgroundColor(0xb3bfc7);
  scene.bgIcons = [];

  for (let i = 0; i < 9; i++) {
    let x = 50 + i * 85 + randomNumber(-20, 20);
    let y = i % 2 === 0 ? randomNumber(50, 350) : randomNumber(200, 450);

    let icon = scene.add.image(x, y, "computerIcon");
    icon.alpha = 0.3;
    icon.setDepth(-1);
    scene.bgIcons.push(icon);
  }
};

/** Resets the background colour */
export const resetBackground = (scene) => {
  scene.cameras.main.setBackgroundColor(colours.BLUE);

  if (scene.hasOwnProperty("bgIcons")) {
    scene.bgIcons.forEach((icon) => {
      icon.destroy();
    });
  }
};
