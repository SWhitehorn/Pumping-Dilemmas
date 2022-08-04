import data from "./data.js"

export default {
    
    openingNode: {
        x:600, y: 800,
        children: ['loopTutorial'],
        tutorial: true,
        name: 'openingNode',
        type: 'opening',
        data: data.level0Data,
    },

    loopTutorial: {
        x: 800, y: 800,
        tutorial: true,
        name: 'loopTutorial',
        type: 'loopTutorial',
        data: data.level0Data
    },

    node0: {
        x: 800, y: 600, 
        children: ['node1'], 
        data: data.level0Data, 
        type: 'loop', 
        name: "node0",
        },
    node1: {
        x: 1000, y: 800, 
        children: ['node2'], 
        data: data.level1Data, 
        type: 'loop', 
        name: "node1",
    },
    node2: {
        x: 1200, y: 800,
        children: ['node3'],
        data: data.level2Data,
        type: 'create',
        name: 'node2',
    },
    node3: {
        x: 1400, y: 800,
        children: ['node4'],
        data: data.level3Data,
        name: 'node3',
        type: 'writeWord'
    },
    node4: {
        x: 1400, y: 650,
        children: [],
        data: data.level4Data,
        name: 'node4',
        type: 'nonRegular'
    }
}