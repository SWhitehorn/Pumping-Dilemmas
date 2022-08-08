import data from "./data.js"

export default {
    
    openingNode: {
        x:600, y: 800,
        children: ['loopTutorial'],
        tutorial: true,
        name: 'openingNode',
        type: 'opening',
        data: data.loop0Data,
    },

    loopTutorial: {
        x: 800, y: 800,
        tutorial: true,
        name: 'loopTutorial',
        type: 'loopTutorial',
        data: data.loop0Data,
        children: ['loopNode1']
    },

    loopNode0: {
        x: 800, y: 600, 
        children: ['loopNode1'], 
        data: data.loop0Data, 
        type: 'loop', 
        name: "node0",
        },

    loopNode1: {
        x: 1000, y: 800, 
        children: ['loopNode2'], 
        data: data.loop1Data, 
        type: 'loop', 
        name: "loopNode1",
    },

    loopNode2: {
        x: 1100, y: 800,
        children: ['createNode1'],
        data: data.loop2Data,
        type: 'loop',
        name: "loopNode2"
    },

    loopNode3: {
        x: 1000, y: 1000,
        children: [],
        data: data.loop3Data,
        type: 'loop',
        name: "loopNode3",
    },

    loopNode4: {
        x: 800, y: 1000,
        children: [],
        data: data.loop4Data,
        type: 'loop',
        name: 'loopNode4'
    },

    loopNode5: {
        x: 600, y: 1000,
        children: [],
        data: data.loop5Data,
        type: 'loop',
        name: 'loopNode5'
    },

    createNode0: {
        x: 1200, y: 1000,
        children: [],
        data: data.create0Data,
        type: 'createTutorial',
        name: 'createNode0',
        tutorial: true
    },

    createNode1: {
        x: 1200, y: 800,
        children: ['writeNode0'],
        data: data.create1Data,
        type: 'create',
        name: 'createNode1',
    },
    
    writeNode0: {
        x: 1400, y: 800,
        children: ['writeNode1'],
        data: data.add0Data,
        name: 'writeNode0',
        type: 'writeWord'
    },
    writeNode1: {
        x: 1400, y: 650,
        children: [],
        data: data.add0Data,
        name: 'writeNode1',
        type: 'nonRegular'
    }
}