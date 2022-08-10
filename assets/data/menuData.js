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


    createTutorial: {
        x: 800, y: 800,
        tutorial: true,
        name: 'createTutorial',
        type: 'createTutorial',
        data: data.createTutorialData,
        children: ['createNode0']
    },

    // Starts with ba
    createNode0: {
        x: 1000, y: 800,
        children: ['createNode3'],
        data: data.create0Data,
        type: 'create',
        name: 'createNode0',
    },

    // Ends in ab
    createNode3: {
        x: 1200, y: 800,
        children: ['createNode1', 'createNode2'],
        data: data.create3Data,
        type: 'create',
        name: 'createNode3'
    },

    // Contains abb as a subword
    createNode1: {
        x: 1400, y: 700,
        children: ['createNode5'],
        data: data.create1Data,
        type: 'create',
        name: 'createNode1',
    },

    // Contains exactly two as
    createNode2: {
        x: 1400, y: 900,
        children: ['createNode5'],
        data: data.create2Data,
        type: 'create',
        name: 'createNode2'
    },

    // Every a is followed by a 'b'
    createNode5: {
        x: 1600, y: 800,
        children: ['loopTutorial'],
        data: data.create5Data,
        type: 'create',
        name: 'createNode5'
    },

    // ab^na
    loopTutorial: {
        x: 1800, y: 800,
        tutorial: true,
        name: 'loopTutorial',
        type: 'loopTutorial',
        data: data.loop0Data,
        children: ['loopNode1']
    },

    // Odd number of as
    loopNode1: {
        x: 2000, y: 800, 
        children: ['loopNode2'], 
        data: data.loop1Data, 
        type: 'loop', 
        name: "loopNode1",
    },
    // (ab U ba)* 
    loopNode2: {
        x: 2200, y: 800,
        children: ['loopNode4', 'loopNode2a'],
        data: data.loop2Data,
        type: 'loop',
        name: "loopNode2"
    },

    // (ab U ba)* 
    loopNode2a: {
        x: 2200, y: 600,
        children: [],
        data: data.loop2Data_a,
        type: 'loop',
        name: "loopNode2a"
    },

    // w has an odd number of 'a's and each a is followed by at least one b
    loopNode3: {
        x: 2400, y: 600,
        children: [],
        data: data.loop3Data,
        type: 'loop',
        name: "loopNode3",
    },

    // w has an odd number of 'a's and an even number of 'b's
    loopNode4: {
        x: 2400, y: 800,
        children: ['loopNode3', 'loopNode5'],
        data: data.loop4Data,
        type: 'loop',
        name: 'loopNode4'
    },

    // w contains the subword 'baba'
    loopNode5: {
        x: 2600, y: 800,
        children: ['createNode4', 'createNode6'],
        data: data.loop5Data,
        type: 'loop',
        name: 'loopNode5'
    },

    // Starts and ends with same letter
    createNode4: {
        x: 2800, y: 700,
        children: ['createNode6'],
        data: data.create4Data,
        type: 'create',
        name: 'createNode4'
    },

    // |w| is a multiple of four
    createNode6: {
        x: 2800, y: 900,
        children: ['writeNode0'],
        data: data.create6Data,
        type: 'create',
        name: 'createNode6'
    },
    
    // a^n b^n
    writeNode0: {
        x: 3000, y: 800,
        children: ['writeNode1'],
        data: data.add0Data,
        name: 'writeNode0',
        type: 'writeWord', 
        tutorial: true
    },

    // wwᴿ
    writeNode1: {
        x: 3200, y: 800,
        children: ['loopNode6'],
        data: data.add1Data,
        name: "writeNode1",
        type: 'writeWord'
    },

    // Ends in aa or bb
    loopNode6: {
        x: 3400, y: 800,
        children: ['loopNode7'],
        data: data.loop6Data,
        type: 'loop',
        name: 'loopNode6'
    },

    loopNode7: {
        x: 3600, y: 800,
        children: ['writeNode2'],
        data: data.loop7Data,
        type: 'loop',
        name: 'loopNode7'
    },

    // a^n b^n
    writeNode2: {
        x: 3800, y: 800,
        children: [],
        data: data.add2Data,
        name: 'writeNode2',
        type: 'nonRegular',
        tutorial: true
    },

    // wwᴿ
    writeNode3: {
        x: 4000, y: 800,
        children: ['createNode7'],
        data: data.add3Data,
        name: 'writeNode3',
        type: 'nonRegular',
    },

    createNode7: {
        x: 4200, y: 800,
        children: ['createNode8', 'nonDeterministicNode'],
        data: data.create7Data,
        name: 'createNode7',
        type: 'create'
    },

    createNode8: {
        x: 4200, y: 600,
        children: [],
        data: data.create8Data,
        name: 'createNode8',
        type: 'create'
    },

    nonDeterministicNode0: {
        x:4400, y: 800,
        children: ['nonDeterministicNode1'],
        tutorial: true,
        name: 'nonDeterministicNode0',
        type: 'opening',
        data: data.nonDeterministicData0,
    },

    nonDeterministicNode1: {
        x:4400, y: 600,
        children: [],
        tutorial: true,
        name: 'nonDeterministicNode1',
        type: 'opening',
        data: data.nonDeterministicData1,
    },






}