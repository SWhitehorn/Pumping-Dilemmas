
const level1Data = {
    automata: {
        states: {
            q1: {x:100, y:150, 
                accepting: false, 
                transitions: {a: ['q2'], b: ['q4']}
            },
            q2: {x:400, y:150, 
                accepting: false, 
                transitions: {a: ['q3'], b: ['q2']}
            },
            q3: {x:700, y:150, 
                accepting: true, 
                transitions: {a: ['q4'], b: ['q4']}
            },
            q4: {x:400, y:350, 
                accepting: false, 
                transitions: {a: ['q4'], b: ['q4']}
            }
        },
        start: 'q1'
    },
    word: ["abba"],
    repeats: 2,
    alphabet: ['a', 'b'],
    language: "L = {ab\u{207F}a|n\u{2265}0}" 
}


const level2Data = {
    automata: {
        states: {
            q1: {x:245, y:233, 
                accepting: false, 
                transitions: {a: ['q3'], b: ['q1']}, 
                controlPoints: {q3: {x: 399, y: 136}}
            },
            q3: {x:520, y:233,
                accepting: true,
                transitions: {a: ["q1"], b: ["q3"]},
                controlPoints: {q1: {x: 395,y: 334}}
            }
        },
        start: "q1"
    },
    word: ["abababaa"],
    repeats: 0,
    alphabet: ['a', 'b'],
    language: "do this later"
}


const level4Data = {
    automata: {
        states: {
            q1: {x: 150, 
                y: 225, 
                accepting: false,
                transitions: {b: ['q2'], a: ['q4']}
            },
            q2: {x: 400, 
                y: 125, 
                accepting: false,
                transitions: {a: ['q3'], b: ['q2']}
            },
            q3: {x: 700, 
                y: 225, 
                accepting: true,
                transitions: {a: ['q3'], b: ['q4']}
            },
            q4: {x: 400, 
                y: 325, 
                accepting: false,
                transitions: {a: ['q4'], b: ['q4']}
            },
            },
        start: 'q1'
        },
    word: ["bbbaaa"],
    alphabet: ['a','b'],
    language: "L = {b\u{207F}a\u{1D50}|n>0,m>0}" 
}

const testData1 = {
    automata: {
        states: {
            q1: {x: 150, 
                y: 400, 
                accepting: false,
                transitions: {}
            },
            q2: {x: 300, 
                y: 400, 
                accepting: false,
                transitions: {}
            },
            q3: {x: 450, 
                y: 400, 
                accepting: true,
                transitions: {}
            },
            q4: {x: 600, 
                y: 400, 
                accepting: false,
                transitions: {}
            },
            },
        start: 'q1'
        },
    word: ["aaabbb"],
    alphabet: ['a', 'b'],
    language: "L = {a\u{207F}b\u{1D50}|n>0,m>0}" 
}

const testData2 = {
    language: "L = {a\u{207F}b\u{207F}|n>0}"
}

export default [level1Data, level2Data, testData1, testData2]