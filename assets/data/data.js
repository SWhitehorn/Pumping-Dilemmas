
export default {

loopTutorialData: {
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
    word: "abbba",
    repeats: [2, 3, 0],
    alphabet: ['a', 'b'],
    language: "L = { ab\u{207F}a | n \u{2265} 0}",
    lines: [
        "If a word has more letters than the automaton has states, then the path through the automaton must visit the same state more than once.",
        "This means there must be a part of the word that starts and ends in the same state when read.",
        "The length of this loop plus the section before it must be less than the number of states in the automaton.",
        "This part of the word can be repeated or removed, and the resulting word will still be in the language.",
    ]
    // lines: [
    //     "Welcome to Pumping Dilemmas!",
    //     "Above is an example of a finite automaton. A finite automaton consists of states (circles) and transitions (arrows).",
    //     "The automaton takes a word (a sequence of letters) as an input, and moves between states based on the letters of the word.",
    //     "Click again to see the automaton reading the word 'abbba'.",
    //     "Once all letters have been read, the word is accepted if the final state has an inner circle. The set of words accepted by an automaton is its language.",
    //     "Click to try inputting some other words. Type, then click the play button to watch the automata go. Click the back arrow when ready to move on."
    // ]
},


 loop0Data : {
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
    language: "L = {w \u{2208} {a,b}* | w has an odd number of 'a' symbols}"
},

loop1Data: {
    automata: {
        states: {
            q1: {x:100, y:150, 
                accepting: false, 
                transitions: {a: ['q2'], b: ['q4']},
                name: 'q1'
            },
            q2: {x:400, y:150, 
                accepting: false, 
                transitions: {a: ['q3'], b: ['q4']},
                controlPoints: {q4: {x:360 , y:250} },
                name: 'q2'
            },
            q3: {x:700, y:150, 
                accepting: true, 
                transitions: {a: ['q3'], b: ['q3']},
                name: 'q3'
            },
            q4: {x:400, y:350, 
                accepting: false, 
                transitions: {a: ['q2'], b: ['q3']},
                controlPoints: {q2: {x:440 , y:250} },
                name: 'q4'
            }
        },
        start: {name: 'q1'}
    },
    word: "ababba",
    repeats: [3, 0, 2],
    alphabet: ['a', 'b'],
    language: "L = { w \u{2208} {a,b}* | w contains a consecutively repeated letter }",
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
    language: "L = {w \u{2208} {a,b}* | w is formed of non-overlapping substrings 'ab' and 'ba'}",
    repeats: [2, 0, 3], 
    word: "baabba"
},

loop2Data_a : {
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
    language: "L = {w \u{2208} {a,b}* | w is formed of non-overlapping substrings 'ab' and 'ba'}",
    repeats: [3, 0], 
    word: "ababba"
},

loop3Data: {
    automata: {
        states: {
            q1: {
            x: 150, y: 150,
            accepting: false,
            transitions: { a: [ 'q4' ], b: [ 'q1' ] },
            controlPoints: { q4: { x: 384, y: 284 }, q1: { x: 197, y: 93 } }
            },
            q2: {
            x: 150, y: 350,
            accepting: true,
            transitions: { a: [ 'q5' ], b: [ 'q2' ] },
            controlPoints: { q2: { x: 201, y: 277 }, q5: { x: 401, y: 203 } }
            },
            q3: {
            x: 650, y: 250,
            accepting: false,
            transitions: { a: [ 'q3' ], b: [ 'q3' ] },
            controlPoints: { q3: { x: 637, y: 195 } } },
            q4: {
            x: 500, y: 350,
            accepting: false,
            transitions: { b: [ 'q2' ], a: [ 'q3' ] },
            controlPoints: { q2: { x: 325, y: 350 }, q3: { x: 575 , y: 300 } }
            },
            q5: {
            x: 500, y: 150,
            accepting: false,
            transitions: { b: [ 'q1' ], a: [ 'q3' ] },
            controlPoints: { q1: { x: 325, y: 150 }, q3: { x: 575, y: 200 } }
            }
        },
        start: {name: 'q1'},
    },
    word: 'ababab',
    repeats: [2, 0],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | w has an odd number of 'a's and each a is followed by at least one b" 
},

loop4Data: {
    automata: {
        states: {
            q1: {
                x: 230, y: 138,
                accepting: false,
                transitions: { b: [ 'q2' ], a: [ 'q3' ] },
                controlPoints: { q2: { x: 392.31160441914426, y: 106.38571811092334 }, q3: { x: 266, y: 241 } }
            },
            q2: {
                x: 555, y: 136,
                accepting: false,
                transitions: { b: [ 'q1' ], a: [ 'q4' ] },
                controlPoints: { q1: { x: 393, y: 190 }, q4: { x: 512, y: 242 } }
            },
            q3: {
                x: 229, y: 337,
                accepting: true,
                transitions: { b: [ 'q4' ], a: [ 'q1' ] },
                controlPoints: { q4: { x: 382, y: 301 }, q1: { x: 185, y: 245 } }
            },
            q4: {
                x: 556,
                y: 343,
                accepting: false,
                transitions: { a: [ 'q2' ], b: [ 'q3' ] },
                controlPoints: { q2: { x: 606, y: 247 }, q3: { x: 391, y: 384 } }
            }
        },
        start: {name: 'q1'}
    },
    word: 'bbabb',
    repeats: [0, 3],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | w has an odd number of 'a's and an even number of 'b's" 
},

loop5Data: {
    automata: {
        states: {
            q1: {
                x: 92, y: 250,
                accepting: false,
                transitions: { a: [ 'q1' ], b: [ 'q2' ] },
                controlPoints: { q1: { x: 92, y: 187 }, q2: { x: 166.5, y: 247 } }
            },
            q2: {
                x: 241, y: 250,
                accepting: false,
                transitions: { a: [ 'q4' ], b: [ 'q2' ] },
                controlPoints: { q4: { x: 321.9683797428539, y: 250.52449633153162 }, q2: { x: 241, y: 187 } }
            },
            q3: {
                x: 731,y: 250,
                accepting: true,
                transitions: { a: [ 'q3' ], b: [ 'q3' ] },
                controlPoints: { q3: { x: 731, y: 193 } }
            },
            q4: {
                x: 403, y: 250,
                accepting: false,
                transitions: { b: [ 'q5' ], a: [ 'q1' ] },
                controlPoints: { q5: { x: 490.51403079428184, y: 251.31846299977565 }, q1: { x: 246.16273050033118, y: 332.6781690823796 } }
            },
            q5: {
                x: 579, y: 250,
                accepting: false,
                transitions: { a: [ 'q3' ], b: [ 'q2' ] },
                controlPoints: { q3: { x: 655.0041092153108, y: 250.84384981819034 }, q2: {x: 400, y: 150 } }
            }
        },
        start: {name: 'q1'}
    },
    word: 'abbaba',
    repeats: [2, 3, 0],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | w contains the subword 'baba'" 
},

 create3Data : {
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

create2Data: {
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
    words: [{word: 'aa', result: true}, {word: 'ababa', result: false}, {word: 'baba', result: true}, {word: 'bbba', result: false}],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | w contains exactly two 'a's}"
},

createTutorialData: {
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
    words: [{word: 'abb', result: true}, {word: 'bab', result: false}, {word: "a", result: true}, {word: 'b', result: false}, {word: 'aaaa', result: true}],
    alphabet: ['a', 'b'],
    language: "L = {w \u{2208} {a,b}* | w starts with a}"
},

create0Data: {
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
    words: [{word: 'ba', result: true}, {word: 'abab', result: false}, {word: "b", result: false}, {word: 'baba', result: true}, {word: 'bbba', result: false}],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | w starts with ba}"
},

create4Data: {
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
            q4: {x: 450, y: 460, 
                accepting: true,
                transitions: {},
                name: 'q4'
            },

            q5: {x: 475, y: 460, 
                accepting: true,
                transitions: {},
                name: 'q5'
            },
        },
        start: {name: 'q1', direction: 'top'}
    },
    words: [{word: 'aba', result: true}, {word: 'baab', result: true}, {word: "b", result: true}, {word: 'ab', result: false}, {word: 'bbba', result: false}, {word: 'babab', result: true}],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | w starts and ends with the same letter}",
    loop: true
},

create5Data: {
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
        start: {name: 'q3'}
    },
    words: [{word: 'ab', result: true}, {word: 'aab', result: false}, {word: "b", result: true}, {word: 'ε', result: true}, {word: 'bba', result: false}, {word: 'bbab', result: true}],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | Every 'a' is followed by a 'b'}",
    loop: true
},

create6Data: {
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
        start: {name: 'q4'}
    },
    words: [{word: 'aaaa', result: true}, {word: "b", result: false}, {word: 'ε', result: true}, {word: 'bba', result: false}, {word: 'abbab', result: false}, {word: 'bbaabbaa', result: true}],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | |w| is a multiple of four}",
    loop: true
},

loop6Data: {
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
            q4: {x: 450, y: 460, 
                accepting: true,
                transitions: {},
                name: 'q4'
            },

            q5: {x: 475, y: 460, 
                accepting: true,
                transitions: {},
                name: 'q5'
            },
        },
        start: {name: 'q1'}
    },
    words: [{word: "babb", result: true}, {word: "abaa", result: true}, {word: "aba", result: false}, {word: "abbaab", result: false}, {word: "bababb", result: true}],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | w ends in aa or bb",
    loop: true,
    deterministic: false
},

loop7Data: {
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
    words: [{word: "babb", result: true}, {word: "abb", result: false}, {word: "bbbbb", result: true}, {word: "bbab", result: false}, {word: "babab", result: true}],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | Every odd position is a 'b'",
    loop: true,
    deterministic: false
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
        "On the screen is an automaton the computer has made, that it claims matches L = { a\u{207F}b\u{207F} | n > 0 }.", 
        "Prove it does not match the language by entering a word.",
        "Your word should either be in the language but rejected by the automaton, or not in the language but accepted.",
        "Then click play to test your word!"
    ] 
},

add1Data: {
    automata: {
        states: {
            q1: {
                x: 389, y: 149,
                accepting: true,
                transitions: { a: [ 'q4' ], b: [ 'q5' ] },
                controlPoints: { q4: { x: 240, y: 111 }, q5: { x: 525.0485573273558, y: 101.06937033435865 } }
            },
            q2: {
                x: 311, y: 316,
                accepting: false,
                transitions: { b: [ 'q4' ], a: [ 'q2' ] },
                controlPoints: { q4: { x: 181.33667243959684, y: 262.18460751073127 }, q2: { x: 311, y: 256 } }
            },
            q3: {
                x: 466, y: 313,
                accepting: false,
                transitions: { a: [ 'q5' ], b: [ 'q3' ] },
                controlPoints: { q5: { x: 603, y: 259 }, q3: { x: 466, y: 253 } }
            },
            q4: {
                x: 114, y: 139,
                accepting: false,
                transitions: { a: [ 'q1' ], b: [ 'q2' ] },
                controlPoints: { q1: { x: 241, y: 194 }, q2: { x: 135.13951667874554, y: 313.60178087167884 } }
            },
            q5: {
                x: 665, y: 136,
                accepting: false,
                transitions: { a: [ 'q3' ], b: [ 'q1' ] },
                controlPoints: { q3: { x: 659, y: 314 }, q1: { x: 528, y: 185 }
                }
            }
        },
        start: {name: 'q1', direction:'top'}
    },
    language:"L = { wwᴿ | w\u{2208}{a,b}*  }",
    grammar: "S -> ε | 31 | 42 | 33 | 44, Q -> 31 | 42 | 33 | 44, 1 -> Q3, 2 -> Q4, 3 -> a, 4 -> b"
},

add2Data: {
    automata: {
        states: {
            q1: {
                x: 381.5, y: 152,
                accepting: true,
                transitions: { a: [ 'q7' ], b: [ 'q6' ] },
                controlPoints: { q7: { x: 512.5, y: 112 }, q6: { x: 250.5, y: 107 } }
            },
            q2: {
                x: 105.5, y: 354,
                accepting: false,
                transitions: { a: [ 'q6' ], b: [ 'q4' ] },
                controlPoints: { q6: { x: 145.5, y: 252 }, q4: { x: 197.5, y: 389 } }
            },
            q3: {
                x: 448.5, y: 350,
                accepting: false,
                transitions: { b: [ 'q5' ], a: [ 'q3' ] },
                controlPoints: { q5: { x: 555.5, y: 314 }, q3: { x: 448.5, y: 290 } }
            },
            q4: {
                x: 290.5, y: 357,
                accepting: false,
                transitions: { a: [ 'q2' ], b: [ 'q4' ] },
                controlPoints: { q2: { x: 201.5, y: 332 }, q4: { x: 290.5, y: 297 } }
            },
            q5: {
                x: 664.5, y: 356,
                accepting: false,
                transitions: { a: [ 'q3' ], b: [ 'q7' ] },
                controlPoints: { q3: { x: 557.5, y: 391 }, q7: { x: 609.5, y: 256 } }
            },
            q6: {
                x: 135.5, y: 159,
                accepting: false,
                transitions: { b: [ 'q2' ], a: [ 'q1' ] },
                controlPoints: { q2: { x: 69.5, y: 253 }, q1: { x: 257.5, y: 193 } }
            },
            q7: {
                x: 655.5, y: 146,
                accepting: false,
                transitions: { a: [ 'q5' ], b: [ 'q1' ] },
                controlPoints: { q5: { x: 684.5, y: 251 }, q1: { x: 523.5, y: 186 } }
            }
        },
        start: {name: 'q1', direction: 'top'}
    },
    language: "L = { w\u{2208}{a,b}* | w has equal numbers of 'a's and 'b's }",
    grammar: `S -> ε | 71 | 82 | 73 | 74 | 85 | 86 | 78 | 87,
    Q -> 71 | 82 | 73 | 74 | 85 | 86 | 78 | 87,
    1 -> Q3,
    2 -> Q5,
    3 -> 8Q,
    4 -> Q8,
    5 -> 7Q,
    6 -> Q7,
    7 -> a,
    8 -> b`
},

add3Data: {
    automata: {
        states: {
            q1: {
                x: 82, y: 254,
                accepting: false,
                transitions: { a: [ 'q4' ], b: [ 'q1' ] },
                controlPoints: {
                q4: { x: 190, y: 194 }, q1: { x: 82, y: 194 } }
            },
            q2: {
                x: 503,
                y: 253,
                accepting: false,
                transitions: { a: [ 'q3' ], b: [ 'q2' ] },
                controlPoints: { q3: { x: 597, y: 207 }, q2: { x: 503, y: 193 } }
            },
            q3: {
                x: 706, y: 255,
                accepting: true,
                transitions: { a: [ 'q2' ], b: [ 'q3' ] },
                controlPoints: { q2: { x: 604, y: 315 }, q3: { x: 706, y: 195 } }
            },
            q4: {
                x: 298, y: 253,
                accepting: false,
                transitions: { c: [ 'q2' ], a: [ 'q1' ], b: [ 'q4' ] },
                controlPoints: { q2: { x: 400.5, y: 253 }, q1: { x: 192, y: 308 }, q4: { x: 298, y: 193 }
                }
            }
        },
        start: {name: 'q1'}
    },
    language: "L = { 𝘸c𝘸 | 𝘸\u{2208}{a,b}*, 𝘸 has an odd number of 'a's}",
},

nonReg2Data: {
    language: "L = { a\u{207F}b\u{207F} | n > 0 }",
    grammar: "A -> ε | 2 1 | 2 3, S -> 2 1 | 2 3, 1 -> S3, 2 -> a, 3 -> b",
    tutorial: true
},

nonReg3Data: {
    language:"L = { wwᴿ | w\u{2208}{a,b}*  }",
    grammar: "S -> ε | 31 | 42 | 33 | 44, Q -> 31 | 42 | 33 | 44, 1 -> Q3, 2 -> Q4, 3 -> a, 4 -> b",
    numStates: 2,
    posKey: 'middle2'
},

nonReg4Data: {
    language:"L = { wwᴿ | w\u{2208}{a,b}*  }",
    grammar: "S -> ε | 31 | 42 | 33 | 44, Q -> 31 | 42 | 33 | 44, 1 -> Q3, 2 -> Q4, 3 -> a, 4 -> b",
    numStates: 4,
    posKey: 'middle2'
},

create8Data: {
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
            q3: {x: 425, y: 460, 
                accepting: true,
                transitions: {},
                name: 'q3'
            },
            q4: {x: 450, y: 460, 
                accepting: true,
                transitions: {},
                name: 'q4'
            },
            q5: {x: 475, y: 460, 
                accepting: true,
                transitions: {},
                name: 'q5'
            },
        },
        start: {name: 'q3'}
    },
    words: [{word: 'aba', result: true}, {word: 'abab', result: true}, {word: "b", result: false}, {word: 'abba', result: false}, {word: 'bba', result: false}, {word: 'ababa', result: true}],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | w consists of 0 or more concatenations of 'ab' and 'aba' }",
    loop: true
},

create7Data: {
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
            q3: {x: 425, y: 460, 
                accepting: true,
                transitions: {},
                name: 'q3'
            },
            q4: {x: 450, y: 460, 
                accepting: true,
                transitions: {},
                name: 'q4'
            },
        },
        start: {name: 'q1'}
    },
    words: [{word: 'aba', result: true}, {word: 'abbb', result: true}, {word: "baab", result: false}, {word: 'aaa', result: false}, {word: 'b', result: false}, {word: 'abab', result: false}, {word: 'ababa', result:true}],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | The second to last symbol in w is 'b' }",
    loop: true
},

nonDeterministicData0: {
    automata: {
        states: {
            q1: {x:200, y:200, 
                accepting: true, 
                transitions: {b: ['q2', 'q1'], a: ['q1'] },
                name: 'q1'
            },
            q2: {x:400, y:200, 
                transitions: {b: ['q3'], a: ['q3']},
                accepting: false, 
                name: 'q2'
            },
            q3: {x:600, y:200, 
                accepting: true, 
                transitions: {},
                name: 'q3'
            },
        },
        start: {name: 'q1'}
    },
    word: "abba",
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | The second to last symbol in w is 'b'",
    lines: [
        "The automata so far have been deterministic. At each state, there is only one transition they can take.",
        "The above automaton is non-deterministic. Some nodes have more than one transition defined for a letter, others have none.",
        "If there are no transitions, the computation fails. If there are multiple, the computation splits into two and takes both.",
        "The word is accepted if a single computation ends in an accepting state.",
        "Try inputting some words to see the computation path."
    ]
},

nonDeterministicData1: {
    automata: {
        states: {
            q1: {x:400, y:150, 
                accepting: true, 
                transitions: {b: ['q2'], ε: ['q3'] },
                controlPoints: {q3: {x: 440, y: 240} },
                name: 'q1'
            },
            q2: {x:250, y:300, 
                accepting: false, 
                transitions: {a: ['q2', 'q3'], b: ['q3']},
                name: 'q2'
            },
            q3: {x:550, y:300, 
                accepting: false, 
                transitions: {a: ['q1']},
                controlPoints: {q1: {x: 500, y: 210} },
                name: 'q3'
            },
        },
        start: {name: 'q1', direction: 'top'}
    },
    word: "abba",
    alphabet: ['a', 'b'],
    language: "L = ((ba*(aUb)a) U a)*",
    lines: [
        "Non-deterministic finite automata can also have ε-transitions.",
        "If there is an ε-transition, the computation takes it without reading any input from the word."
    ]
},

create11Data: {
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
        start: {name: 'q3'}
    },
    words: [{word: 'aba', result: true}, {word: 'ababa', result: true}, {word: "b", result: false}, {word: 'abba', result: false}, {word: 'bba', result: false}, {word: 'abab', result: true}],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | w consists of 0 or more concatenations of 'ab' and 'aba' }",
    deterministic: false
},

nonReg6Data: {
    language: "L = { w\u{2208}{a,b}* | w has twice as many 'a's as 'b's}",
    grammar: `S -> ε | QQ | 15 1 | 16 2 | 16 3 | 15 4 | 15 5 | 15 6 | 16 7 | 16 8 | 16 9 | 16 10 | 16 11 | 16 12
    Q -> QQ | 15 1 | 16 2 | 16 3 | 15 4 | 15 5 | 15 6 | 16 7 | 16 8 | 16 9 | 16 10 | 16 11 | 16 12
     1 -> Q 4
     2 -> Q 7
     3 -> Q 10
     4 ->  16 13
     5 -> Q 6
     6 ->  16 16
     7 ->  15 13
     8 -> Q 9
     9 ->  15 16
     10 ->  16 14
     11 -> Q 12
     12 ->  16 15
     13 -> Q 16
     14 -> Q 15
     15 -> b
     16 -> a`,
     posKey: 'aba|aab|baa'
},

nonReg5Data: {
    language:"L = { w\u{2208}{a,b}* | w has more 'a's than 'b's }",
    grammar: `S -> R Q | a | QR | QA | Q 1 | 4A
    Q -> R Q | a | QR | QA | Q 1 | 4A
   A -> a | A 4
   R -> RR | 4 2 | 5 3 | 4 5 | 5 4
   1 -> RA
   2 -> R 5
   3 -> R 4
   4 -> a
   5 -> b`,
   posKey: 'ab|ba',
   numStates: 3
},

nonReg5aData: {
    language:"L = { w\u{2208}{a,b}* | w has more 'a's than 'b's }",
    grammar: `S -> R Q | a | QR | QA | Q 1 | 4A
    Q -> R Q | a | QR | QA | Q 1 | 4A
   A -> a | A 4
   R -> RR | 4 2 | 5 3 | 4 5 | 5 4
   1 -> RA
   2 -> R 5
   3 -> R 4
   4 -> a
   5 -> b`,
   posKey: 'ab|ba',
   numStates: 5
},


nonReg7Data: {
    language: "L = { w\u{2208}{a,b}* | w is a palindrome",
    grammar: `<S0> -> ε | a | b | 31 | 42 | 33 | 44,
    S -> a | b | 31 | 42 | 33 | 44,
    1 -> S3,
    2 -> S4,
    3 -> a,
    4 -> b`,
    posKey: 'middle1',
    numStates: 4
},

create9Data: {
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
    words: [{word: 'abab', result: true}, {word: 'abbb', result: false}, {word: "ab", result: true}, {word: 'aaa', result: false}, {word: 'b', result: false}, {word: 'ε', result: false}, ],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | w ends in 'ab' }",
    deterministic: false,
},

create10Data: {
    automata: {
        states: {
            q1: {x: 290, y: 460, 
                accepting: false,
                transitions: {},
                name: 'q1'
            },
            q2: {x: 425, y: 460, 
                accepting: true,
                transitions: {},
                name: 'q2'
            },
            q3: {x: 450, y: 460, 
                accepting: true,
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
    words: [{word: 'abab', result: true}, {word: 'abc', result: false}, {word: "cbbc", result: true}, {word: 'bcaaa', result: false}, {word: 'b', result: true} ],
    alphabet: ['a', 'b', 'c'],
    language: "L = {w\u{2208}{a,b,c}* | w does not contain every letter of the alphabet }",
    deterministic: false,
},

create11Data: {
    automata: {
        states: {
            q1: {x: 290, y: 460, 
                accepting: false,
                transitions: {},
                name: 'q1'
            },
            q2: {x: 450, y: 460, 
                accepting: true,
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
    words: [{word: 'abab', result: true}, {word: 'baba', result: true}, {word: "abba", result: false}, {word: 'aaba', result: false}, {word: 'b', result: true}, {word: 'ε', result: false}, ],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | w is non-empty and does not contain two consecutive occurrences of the same symbol }",
    deterministic: false,
},

create12Data: {
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
    words: [{word: 'abaaaba', result: true}, {word: 'abaaba', result: false}, {word: "baab", result: false}, {word: 'bbab', result: true}, {word: 'bbbb', result: true}, {word: 'ab', result: false}, ],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | w contains a pair of bs seperated by an odd number of symbols}",
    deterministic: false,
},

create13Data: {
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
            q3: {x: 450, y: 460, 
                accepting: true,
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
    words: [{word: 'bbb', result: true}, {word: 'bbbaa', result: true}, {word: "baabb", result: false}, {word: 'abb', result: false}, {word: 'baaaa', result: true}, ],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | w has an even number of 'a's, an odd number of 'b's, and does not contain the substring 'ab'",
    deterministic: false
},

nonReg8Data: {
    language: "L = {w\u{2208}{a,b}* | w has odd length and the middle symbol is 'a'",
    grammar: `S -> a | 31 | 42 | 32 | 41,
    Q -> a | 31 | 42 | 32 | 41,
    1 -> Q3,
    2 -> Q4,
    3 -> a,
    4 -> b`,
    posKey: 'a(a|b)'
},

nonReg9Data: {
    language: "L = { 𝘸c𝘹 | 𝘸ᴿ is a substring of 𝘹 for 𝘸,𝘹 \u{2208}{a,b}* }",
    grammar: `S -> TX | c | 3X | 41 | 52,
    Q -> TX | c | 3X | 41 | 52,
    T -> c | 3X | 41 | 52,
    X -> a | b | 4X | 5X,
    1 -> T4,
    2 -> T5,
    3 -> c,
    4 -> a,
    5 -> b`,
    posKey: "afterC",
    numStates: 5
},

nonReg10Data: {
    language: "L = {w \u{2208}{a,b}* | in every prefix of w, the number of 'a's is at least the number of 'b's }",
    grammar: `S -> ε | a | A1 | 5Q | A5 | 52 | 53 | 54 | 56,
    Q -> a | A1 | 5Q | A5 | 52 | 53 | 54 | 56,
    A -> 52 | 53 | 54 | 56,
    1 -> 5Q,
    2 -> A3,
    3 -> 6A,
    4 -> A6,
    5 -> a,
    6 -> b`,
    numStates: 5,
    posKey: "ab"
},

nonReg11Data: {
    language:"L = { words not of the form ww for w\u{2208}{a,b}*}",
    numStates: 3,
    grammar: `0 -> ε | AB | BA | a | b | Z1
            S -> AB | BA | a | b | Z1
            E -> AB | BA
            A -> a | Z2
            B -> b | Z3
            U -> a | b | Z1
            Z -> a | b
            1 -> UZ
            2 -> AZ
            3 -> BZ`
},

create14Data: {
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
            q3: {x: 425, y: 460, 
                accepting: true,
                transitions: {},
                name: 'q3'
            },
            q4: {x: 450, y: 460, 
                accepting: true,
                transitions: {},
                name: 'q4'
            },
            q5: {x: 475, y: 460, 
                accepting: true,
                transitions: {},
                name: 'q5'
            },
        },
        start: {name: 'q3'}
    },
    words: [{word: 'aba', result: true}, {word: 'abab', result: false}, {word: "aaa", result: true}, {word: 'bbab', result: true}, {word: 'baabaa', result: false}, {word: 'ab', result: false}, ],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | w contains an equal number of occurrences of the substrings ab and ba}",
    deterministic: false,
},

level4Data : {
    language: "L = { wwᴿ | w\u{2208}{a,b}*  }", 
    grammar: "S -> Q, Q -> B A | D C | ϵ, A -> a, B -> A Q, C -> b, D -> C Q",
},

createLevelData : {
    automata: {
        states: {
            q1: {x: 379, y: 149,
                accepting: false,
                transitions: {},
            },
            q2: {
                x: 146,
                y: 193,
                accepting: false,
                transitions: {},
            },
            q3: {
                x: 616, y: 182,
                accepting: false,
                transitions: { },
            },
            q4: {
                x: 146,
                y: 193,
                accepting: true,
                transitions: {},
            },
            // q5: {
            //     x: 616, y: 182,
            //     accepting: false,
            //     transitions: { },
            // },
            // q6: {
            //     x: 146,
            //     y: 193,
            //     accepting: false,
            //     transitions: {},
            // },
            // q7: {
            //     x: 616, y: 182,
            //     accepting: false,
            //     transitions: { },
            // },

        },
        start: {name: 'q1'}
    },
    words: [{word: "aabba", result: true}, {word: "bbab", result: false}, {word: "abb", result: true}],
    alphabet: ['a', 'b'],
    language: "L = {w\u{2208}{a,b}* | w contains abb as a subword}",
    deterministic: false
},


}


