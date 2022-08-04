import data from "./data.js"

export default {
    
    startnode: {
        x:400, y: 300,
        children: ['node1'],
        tutorial: true,
        name: 'startNode',
        type: 'start'
    },

    
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
        children: ['node3'],
        data: data.level2Data,
        type: 'create',
        name: 'node2',
    },
    node3: {
        x:1200, y:300,
        children: ['node4'],
        data: data.level3Data,
        name: 'node3',
        type: 'writeWord'
    },
    node4: {
        x: 1200, y: 150,
        children: [],
        data: data.level4Data,
        name: 'node4',
        type: 'nonRegular'
    }
}