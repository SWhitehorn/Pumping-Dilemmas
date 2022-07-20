import data from "../data.js"

export default {
    node0: {x: 600, y: 300, children: ['node1'], data: data[0], type: 'loop', name: "node0"},
    node1: {x: 800, y: 300, children: [], data: data[0], type: 'loop', name: "node1"}
}