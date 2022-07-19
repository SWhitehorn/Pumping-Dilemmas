function cykParse(word, rules){
    const n = w.length;
     
    // Initialize the table
    const table = [];
    for (let i = 0; i < this.word.length; i++) {
        this.table[i] = []
        for (let j = 0; j < this.word.length; j++) {
            this.table[i][j] = new Set();
        }
    }
 
    // Filling in the table
    for (let j = 0; j < n, j++){
        rules.forEach((rule) => {
            
        })
    }
        // Iterate over the rules
        for lhs, rule in R.items():
            for rhs in rule:
                 
                # If a terminal is found
                if len(rhs) == 1 and \
                rhs[0] == w[j]:
                    T[j][j].add(lhs)
 
        for i in range(j, -1, -1):  
              
            # Iterate over the range i to j + 1  
            for k in range(i, j + 1):    
 
                # Iterate over the rules
                for lhs, rule in R.items():
                    for rhs in rule:
                         
                        # If a terminal is found
                        if len(rhs) == 2 and \
                        rhs[0] in T[i][k] and \
                        rhs[1] in T[k + 1][j]:
                            T[i][j].add(lhs)
 
    # If word can be formed by rules
    # of given grammar
    if len(T[0][n-1]) != 0:
        print("True")
    else:
        print("False")
}