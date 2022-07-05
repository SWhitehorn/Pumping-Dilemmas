export const level1Data = [{
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
    "bbbaaa"] 

export const level2Data = [{
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
    "bbbaaa"]