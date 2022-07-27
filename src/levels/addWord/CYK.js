
/**
 * Class for testing membership of CFG
 * @class
 */
export class CYK {
    
    /**
     * Creates new instance with specified ruleset
     * @param {String} grammar - String for grammar. Rules are of form "A -> BC | DE", seperated by commas. 
     *                           First rule must be S ->
     */
    constructor(grammar){
        this.productions = this.parseRules(grammar);
    }

    /**
     * 
     * @param {String} grammar - input grammar
     * @returns {String} parsed ruleset
     */
    parseRules(grammar) {

        // Convert newlines to comma and remove spaces and dots
        grammar = grammar.trim()
        grammar = grammar.replace(/ /g, '')
        grammar = grammar.replace(/\n/g, ',')
        grammar = grammar.replace(/,+/g, ',')
        grammar = grammar.replace(/\./g, '')
    
        const rules = grammar.split(',')
        let productions = []
        for (let rule of rules) {
            // Left of -> is the producer and right are the products
            let [producer, products] = rule.split('->')
            products = new Set(products.split('|'))
            productions.push({producer, products})
        }
        return productions;
    }

    /**
     * 
     * @param {String} word - Word to test
     * @returns {Boolean} True if word is accpeted  
     */
    testMembership(word){
        this.word = word;
        
        // Create n*n 2d array
        this.table = [];
        for (let i = 0; i < this.word.length; i++) {
            this.table[i] = []
            for (let j = 0; j < this.word.length; j++) {
                this.table[i][j] = null
            }
        }

        this.calc(0, this.word.length-1);
        return this.result()
    }

    get_producers(product) {
        return new Set(this.productions
            
            // Keep all productions which contain the searched product
            .filter(production => production.products.has(product))
            
            // Return producer (non-terminal)
            .map(production => production.producer))
    }


    calc(start, end) {
        
        // Cell is already calculated
        if (this.table[start][end]) {
            return this.table[start][end]
        }

        // Entry on the diagonal
        if (start == end) {
            this.table[start][end] = this.get_producers(this.word[start])
            return this.table[start][end]
        }

        // Calculate cell
        for (let i = start; i < end; i++) {
            // Calculate word composition
            const prefix = this.calc(start, i)
            const suffix = this.calc(i+1, end)

            if (!this.table[start][end]) {
                this.table[start][end] = new Set()
            }

            // Try each permutation of prefix and suffix
            for (let prefix_nt of prefix) {
                for (let suffix_nt of suffix) {
                    const producer = this.get_producers(prefix_nt + suffix_nt)

                    // Merge old set with new entries
                    this.table[start][end] = new Set([...this.table[start][end], ...producer])
                }
            }
        }
        return this.table[start][end]
    }

    /**
     * Checks whether start start is in top right of table
     * @returns {Boolean} 
     */
    result() {
        return this.table[0][this.word.length-1].has("S")
    }

    /**
     * Converts table into conventional 2d array so it can be inspected.
     * @returns {String[][]} 
     */
    debugTable(){
        let output = [];

        for (let line of this.table){
            output.push([]);
            for (let item_set of line){
                let item_str = ""
                if (!item_set) {
                    // This field is not looked at
                } else if (item_set.size == 0) {
                    item_str = "-"
                } else {
                    item_str = Array.from(item_set).join()
                }
                output.at(-1).push(item_str);
            }
        }
        return output;
    }
}



