// Assorted useful functions

/**
 * Returns next available letter in language, or first if all are taken
 * @param {string} letter - Current language
 * @param {string[]} language - Array of symbols in the language
 * @returns {string} Next available symbol
 */
export const getNextLetter = (letter, language) => {
    
    const index = language.indexOf(letter)
    if (index + 1 < language.length) {
        return language[index+1]
    } else{
        return language[0];
    }
}

/**
 * Tests whether object is empty
 * @param {Object} obj - Object to test 
 * @returns {boolean} True if empty (no keys), false if not
 */
export const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
}


/**
 * Creates a key for transition based on the names of the two states
 * @param {string} first - Name of first state
 * @param {string} second - Name of second state
 */
export const createKey = (first, second) => {
    return first + "," + second;
}

/**
 * Tests whether two states onnected by a transition are the same
 * @param {string} key - The key for the transition 
 * @returns {boolean} True if the transition runs from state to itself
 */
export const sameState = (key) => {
    const states = splitKey(key);
    return (states[0] === states[1]);
}

/** Returns the key split into the names of the two states */
export const splitKey = (key) => {
    return key.split(",");
}

/** 
 * Generates a random number between bounds
 * @param {number} min - The lower bound of the value (inclusive)
 * @param {number} max - The upper bound of the value (exclusive)
 * @returns {number} The chosen number
*/
export const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max-min) ) + min;
}
