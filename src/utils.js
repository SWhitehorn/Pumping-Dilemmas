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

