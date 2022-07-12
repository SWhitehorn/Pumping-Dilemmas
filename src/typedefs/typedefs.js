/** 
 * Type for state objects
 * @typedef {Object} State
 * @property {number} x - Starting x position
 * @property {number} y - Starting y position
 * @property {boolean} accepting - Indicates whether state is accepting
 * @property {Object} transitions - Contains the transitions for the state
 * @property {string[]} keys - Array of keys of transitions for state
 */

/**
 * Type for points
 * @typedef {Object} Point
 * @property {number} x - x position
 * @property {number} y - y position
 */

/**
 * Type for transition data
 * @typedef {Object} TransitionData
 * @property {TransitionPoint} point - Object with data about interactive transition point
 * @property {Object} label - Text object for transition label 
 * @property {Object} line - Geom object for visual line
 */
