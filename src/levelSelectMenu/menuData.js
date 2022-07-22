import data from "../data.js"

export default {
    node0: {
        x: 600, y: 300, 
        children: ['node1'], 
        data: data.level0Data, 
        type: 'loop', 
        name: "node0",
        },
    node1: {
        x: 800, y: 300, 
        children: ['node2'], 
        data: data.level1Data, 
        type: 'loop', 
        name: "node1",
    },
    node2: {
        x:1000, y:300,
        children: [],
        data: data.level2Data,
        type: 'create',
        name: 'node2',
    }
}