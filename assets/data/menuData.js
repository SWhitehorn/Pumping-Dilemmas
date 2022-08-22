import data from "./data.js"

export default {
    
    // openingNode: {
    //     x:600, y: 800,
    //     children: ['createTutorial'],
    //     tutorial: true,
    //     name: 'openingNode',
    //     type: 'opening',
    //     data: data.loop0Data,
    // },

    createTutorial: {
        x: 600, y: 800,
        tutorial: true,
        name: 'createTutorial',
        type: 'createTutorial',
        data: data.createTutorialData,
        children: ['createNode0', 'createNode02']
    },

    // Starts with ba
    createNode0: {
        x: 800, y: 900,
        children: ['createNode3'],
        data: data.create0Data,
        type: 'create',
        name: 'createNode0',
    },

    // Starts with ba
    createNode02: {
        x: 800, y: 700,
        children: ['createNode3'],
        data: data.create02Data,
        type: 'create',
        name: 'createNode02',
    },

    // Ends in ab
    createNode3: {
        x: 1000, y: 800,
        children: ['createNode1', 'createNode2'],
        data: data.create3Data,
        type: 'create',
        name: 'createNode3'
    },

    // Contains abb as a subword
    createNode1: {
        x: 1200, y: 700,
        children: ['createNode5'],
        data: data.create1Data,
        type: 'create',
        name: 'createNode1',
    },

    // Contains exactly two as
    createNode2: {
        x: 1200, y: 900,
        children: ['createNode5'],
        data: data.create2Data,
        type: 'create',
        name: 'createNode2'
    },

    // Every a is followed by a 'b'
    createNode5: {
        x: 1400, y: 800,
        children: ['loopTutorial'],
        data: data.create5Data,
        type: 'create',
        name: 'createNode5'
    },

    // ab^na
    loopTutorial: {
        x: 1600, y: 800,
        tutorial: true,
        name: 'loopTutorial',
        type: 'loop',
        data: data.loopTutorialData,
        children: ['loopNode0']
    },

    // Odd number of as
    loopNode0: {
        x: 1800, y: 800, 
        children: ['loopNode1'], 
        data: data.loop0Data, 
        type: 'loop', 
        name: "loopNode0",
    },

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
        children: ['createNode7'],
        data: data.create4Data,
        type: 'create',
        name: 'createNode4'
    },

    // |w| is a multiple of four
    createNode6: {
        x: 2800, y: 900,
        children: ['createNode8'],
        data: data.create6Data,
        type: 'create',
        name: 'createNode6'
    },

    // Second to last symbol is b
    createNode7: {
        x: 3000, y: 700,
        children: ['nonDeterministicNode0'],
        data: data.create7Data,
        name: 'createNode7',
        type: 'create'
    },

    createNode8: {
        x: 3000, y: 900,
        children: ['nonDeterministicNode0'],
        data: data.create8Data,
        name: 'createNode8',
        type: 'create'
    },

    nonDeterministicNode0: {
        x:3200, y: 800,
        children: ['nonDeterministicNode1', 'createNode9'],
        tutorial: true,
        name: 'nonDeterministicNode0',
        type: 'opening',
        data: data.nonDeterministicData0,
    },

    nonDeterministicNode1: {
        x:3200, y: 1000,
        children: ['createNode10'],
        tutorial: true,
        name: 'nonDeterministicNode1',
        type: 'opening',
        data: data.nonDeterministicData1,
    },

    // Ends in ab
    createNode9: {
        x: 3400, y: 800,
        children: ['writeNode0'],
        data: data.create9Data,
        name: 'createNode9',
        type: 'create',
    },

    createNode10: {
        x: 3200, y: 1200,
        children: [],
        name: 'createNode10',
        data: data.create10Data,
        type:'create',
    },

    // a^n b^n
    writeNode0: {
        x: 3600, y: 800,
        children: ['writeNode1'],
        data: data.add0Data,
        name: 'writeNode0',
        type: 'writeWord', 
        tutorial: true
    },

    // wwᴿ
    writeNode1: {
        x: 3800, y: 800,
        children: ['createNode61'],
        data: data.add1Data,
        name: "writeNode1",
        type: 'writeWord'
    },

    // Ends in aa or bb
    createNode61: {
        x: 4000, y: 800,
        children: ['writeNode2'],
        data: data.loop6Data,
        type: 'create',
        name: 'createNode61'
    },

    writeNode2: {
        x: 4200, y: 800,
        children: ['createNode62', 'writeNode3'],
        data: data.add2Data,
        name: "writeNode2",
        type: "writeWord"
    },

    writeNode3: {
        x: 4200, y: 600,
        children: [],
        data: data.add3Data,
        name: "writeNode3",
        type: "writeWord"
    },
    
    // Every odd position is a b
    createNode62: {
        x: 4400, y: 800,
        children: ['nonRegNode2'],
        data: data.loop7Data,
        type: 'create',
        name: 'createNode62'
    },

    // a^n b^n
    nonRegNode2: {
        x: 4600, y: 800,
        children: ['nonRegNode3'],
        data: data.nonReg2Data,
        name: 'nonRegNode2',
        type: 'nonRegular',
        tutorial: true
    },

    // wwᴿ, 2 states
    nonRegNode3: {
        x: 4800, y: 800,
        children: ['nonRegNode4', 'createNode11'],
        data: data.nonReg3Data,
        name: 'nonRegNode3',
        type: 'nonRegular',
    },

    // wwᴿ, 4  states
    nonRegNode4: {
        x: 4800, y: 1000,
        children: [],
        data: data.nonReg4Data,
        name: 'nonRegNode4',
        type: 'nonRegular',
    },

    // 0 or more concatenations of 'ab' and 'aba' 
    create11Node: {
        x: 5000, y: 800,
        children: ['nonRegNode5'],
        name: 'createNode11',
        data: data.create11Data,
        type:'create',
    },

    nonRegNode5: {
        x: 5200, y: 800,
        children: ['nonRegNode6', 'nonRegNode7', 'nonRegNode5a'],
        data: data.nonReg5Data,
        name: 'nonRegNode5',
        type: 'nonRegular'
    },

    nonRegNode5a: {
        x: 5200, y: 1000,
        children: [],
        data: data.nonReg5aData,
        name: 'nonRegNode5a',
        type: 'nonRegular'
    },
    
    nonRegNode6: {
        x: 5400, y: 700,
        children: ['createNode12'],
        data: data.nonReg6Data,
        name: 'nonRegNode6',
        type: 'nonRegular'
    },

    nonRegNode7: {
        x: 5400, y: 900,
        children: ['createNode12'],
        data: data.nonReg7Data,
        name: 'nonRegNode7',
        type: 'nonRegular'
    },

    createNode12: {
        x: 5600, y: 800,
        children: ['nonRegNode8'],
        data: data.create12Data,
        name: 'createNode12',
        type: 'create'
    },

    nonRegNode8: {
        x: 5800, y: 800,
        children: ['nonRegNode9'],
        data: data.nonReg8Data,
        name: 'nonRegNode8',
        type: 'nonRegular'
    },

    nonRegNode9: {
        x: 6000, y: 800,
        children: ['createNode13', 'createNode14'],
        data: data.nonReg9Data,
        name: 'nonRegNode9',
        type: 'nonRegular'
    },

    createNode13: {
        x: 6200, y: 700,
        children: ['nonRegNode10'],
        data: data.create13Data,
        name: 'createNode13',
        type: 'create'
    },

    createNode14: {
        x: 6200, y: 900,
        children: ['nonRegNode10'],
        data: data.create14Data,
        name: 'createNode14',
        type: 'create'
    },

    nonRegNode10: {
        x: 6400, y: 800,
        children: ['nonRegNode11'],
        data: data.nonReg10Data,
        name: 'nonRegNode10',
        type: 'nonRegular'
    },

    nonRegNode11: {
        x: 6600, y: 800,
        children: [],
        data: data.nonReg11Data,
        name: 'nonRegNode11',
        type: 'nonRegular'
    },

    




    

    





}