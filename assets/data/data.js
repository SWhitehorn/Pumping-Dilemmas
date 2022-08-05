
export default {

loop0Data: {
    automata: {
        states: {
            q1: {x:100, y:150, 
                accepting: false, 
                transitions: {a: ['q2'], b: ['q4']},
                name: 'q1'
            },
            q2: {x:400, y:150, 
                accepting: false, 
                transitions: {a: ['q3'], b: ['q2']},
                name: 'q2'
            },
            q3: {x:700, y:150, 
                accepting: true, 
                transitions: {a: ['q4'], b: ['q4']},
                name: 'q3'
            },
            q4: {x:400, y:300, 
                accepting: false, 
                transitions: {a: ['q4'], b: ['q4']},
                name: 'q4'
            }
        },
        start: {name: 'q1'}
    },
    word: "abba",
    repeats: [2, 1],
    alphabet: ['a', 'b'],
    language: "L = { ab\u{207F}a | n \u{2265} 0}" 
},


 loop1Data : {
    automata: {
        states: {
            q1: {x:250, y:233, 
                accepting: false, 
                transitions: {a: ['q3'], b: ['q1']}, 
                controlPoints: {q3: {x: 400, y: 136}}
            },
            q3: {x:550, y:233,
                accepting: true,
                transitions: {a: ["q1"], b: ["q3"]},
                controlPoints: {q1: {x: 400,y: 334}}
            }
        },
        start: {name: "q1"}
    },
    word: "aaba",
    repeats: [2, 0],
    alphabet: ['a', 'b'],
    language: "L = {w \u{2208} {a,b}* | w has an odd number of a symbols}"
},

 loop2Data : {
    automata: {
        states: {
            q1: {x: 379, y: 149,
                accepting: true,
                transitions: {a: ['q2'], b: ['q3']},
                controlPoints: {q2: {x: 250,y: 128}, q3: {x: 517,y: 139}}
            },
            q2: {
                x: 146,
                y: 193,
                accepting: false,
                transitions: {b: ['q1'], a: ['q4']},
                controlPoints: { q1: { x: 277, y: 210 }, q4: { x: 239, y: 310 } }
            },
            q3: {
                x: 616, y: 182,
                accepting: false,
                transitions: { a: [ 'q1' ], b: [ 'q4' ] },
                controlPoints: { q1: { x: 502, y: 209 }, q4: { x: 562, y: 303 } }
            },
            q4: {
                x: 375, y: 347,
                accepting: false,
                transitions: { a: [ 'q4' ], b: [ 'q4' ] },
                controlPoints: { q4: { x: 375, y: 287 } }
            }
        },
        start: {name: 'q1', direction: 'top'}
    },
    alphabet: ['a', 'b'],
    language: "L = (ab U ba)*",
    repeats: [2, 0, 3], 
    word: "baab"
},

 create0Data : {
    automata: {
        states: {
            q1: {x: 290, y: 460, 
                accepting: false,
                transitions: {},
                name: 'q1'
            },
            q2: {x: 315, y: 460, 
                accepting: false,
                transitions: {},
                name: 'q2'
            },
            q3: {x: 475, y: 460, 
                accepting: true,
                transitions: {},
                name: 'q3'
            },
        },
        start: {name: 'q1'}
    },
    words: [{word: "babab", result: true}, {word: "ab", result: true}, {word: "abb", result: false}],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | w ends in 'ab'}" 
},

create1Data : {
    automata: {
        states: {
            q1: {x: 290, y: 460, 
                accepting: false,
                transitions: {},
                name: 'q1'
            },
            q2: {x: 315, y: 460, 
                accepting: false,
                transitions: {},
                name: 'q2'
            },
            q3: {x: 340, y: 460, 
                accepting: false,
                transitions: {},
                name: 'q3'
            },
            q4: {x: 475, y: 460, 
                accepting: true,
                transitions: {},
                name: 'q4'
            },
        },
        start: {name: 'q1'}
    },
    words: [{word: "aabba", result: true}, {word: "bbab", result: false}, {word: "abb", result: true}],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | w contains abb as a subword}" 
},

add0Data : {
    automata: {
        states: {
            q1: {
                x: 200, y: 200,
                accepting: false,
                transitions: {a: ["q2"]},
            },
            q2: {
                x: 400, y: 200,
                accepting: false,
                transitions: {a: ["q3"], b: ["q4"]},
            },
            q3: {
                x: 600, y: 200,
                accepting: false,
                transitions: {b: ["q5"]},
            },
            q4: {
                x: 200, y: 350,
                accepting: true,
                transitions: {},
            },
            q5: {
                x: 400, y: 350,
                accepting: false,
                transitions: {b: ["q4"]},    
            }
        },
        start: {name: 'q1'}
    },
    language: "L = { a\u{207F}b\u{207F} | n > 0 }",
    grammar: "A -> ε | 2 1 | 2 3, S -> 2 1 | 2 3, 1 -> S3, 2 -> a, 3 -> b",
    message: [
        "On the screen is an automaton claimed to match the given language.", 
        "Prove it does not match the language by entering a word belonging to the language, but that the automaton would reject.",
        "Then click play to test your word!"
    ] 
},

level4Data : {
    language: "L = { a\u{207F}b\u{207F} | n > 0 }",
    grammar: "A -> ε | 2 1 | 2 3, S -> 2 1 | 2 3, 1 -> S3, 2 -> a, 3 -> b"
},

spareData : {
    automata: {
        states: {
            q1: {x: 150, y: 225, 
                accepting: false,
                transitions: {b: ['q2'], a: ['q4']}
            },
            q2: {x: 400, y: 125, 
                accepting: false,
                transitions: {a: ['q3'], b: ['q2']}
            },
            q3: {x: 700, y: 225, 
                accepting: true,
                transitions: {a: ['q3'], b: ['q4']}
            },
            q4: {x: 400, y: 325, 
                accepting: false,
                transitions: {a: ['q4'], b: ['q4']}
            },
            },
        start: {name: 'q1'}
        },
    word: ["bbbaaa"],
    alphabet: ['a','b'],
    language: "L = {b\u{207F}a\u{1D50}|n>0,m>0}" 
},

createLevelData : {
    automata: {
        states: {
            q1: {x: 379, y: 149,
                accepting: true,
                transitions: {a: ['q2'], b: ['q3']},
                controlPoints: {q2: {x: 250,y: 128}, q3: {x: 517,y: 139}}
            },
            q2: {
                x: 146,
                y: 193,
                accepting: false,
                transitions: {b: ['q1'], a: ['q4']},
                controlPoints: { q1: { x: 277, y: 210 }, q4: { x: 239, y: 310 } }
            },
            q3: {
                x: 616, y: 182,
                accepting: false,
                transitions: { a: [ 'q1' ], b: [ 'q4' ] },
                controlPoints: { q1: { x: 502, y: 209 }, q4: { x: 562, y: 303 } }
            },
            q4: {
                x: 375, y: 347,
                accepting: false,
                transitions: { a: [ 'q4' ], b: [ 'q4' ] },
                controlPoints: { q4: { x: 375, y: 287 } }
            }
        },
        start: {name: 'q1', direction: 'top'}
    },
    words: [{word: "aabba", result: true}, {word: "bbab", result: false}, {word: "abb", result: true}],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | w contains abb as a subword}" 
},

testData1 : {
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
        start: {name: 'q1'}
        },
    word: ["aaabbb"],
    alphabet: ['a', 'b'],
    language: "L = {a\u{207F}b\u{1D50}|n>0,m>0}" 
},

 testData2 : {
    language: "L = {a\u{207F}b\u{207F}|n>0}"
}


}
