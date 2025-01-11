export type NSet = number;

export const nSet = {
    /**
     * Creates a new nSet from an array
     */
    new: function(args : number[]) : NSet {
        let newSet = 0;
        for (let i = 0; i < args.length; i++) {
            //Intermediate shift to the left to avoid if 0 check.
            newSet = ((newSet<<1) | (1 << args[i]))>>>1;
        }
        return newSet;
    },

    /**
     * Returns the elements in either nSet
     */
    union: (a : NSet,b : NSet) : NSet => a|b,

    /**
     * Returns the log base 2 of a 32 bit power of 2.
     */
    log2: (x : number) : number => (31 - Math.clz32(x)) | 0,

    /**
     * Returns the elements common in both nSets
     */
    intersect: (a : NSet,b : NSet) : NSet => a|b,

    /**
     * Returns the elements not common in both nSets
     */
    difference: (a : NSet,b : NSet) : NSet => a^b,

    /**
     * Subtracts one nSet from another
     */
    subtract: (a : NSet,b : NSet) : NSet => a&~b,

    /**
     * Checks if the set contains a certain element
     */
    has: function(a : NSet,b : number) : NSet {
        return a & (1<<(b-1));
    },

    /**
     * Checks if the set contains only a single element
     */
    isSingle: function(a : NSet) : boolean {
        return (a && !(a & (a - 1))) as boolean;
    },

    /**
     * Returnes the first element of the Set
     */
    first: function(a : NSet) : number  {
        return this.log2(a & (-a)) + 1;
    },

    /**
     * Returnes the first element of the Set
     */
    firstBit: function(a : NSet) : NSet {
        return a & (-a);
    },

    /**
     * Deletes the first element of the Set
     */
    shift: function(a : NSet) : NSet {
        return a & (a-1);
    },

    /**
     * Deletes the target value from the set
     */
    delete: function(a : NSet,b = 0) : NSet {
        //Intermediate shift to the left to avoid if 0 check.
        return ((a<<1) & ~(1<<b))>>>1;
    },

    /**
     * Deletes the target bit from the set
     */
    removeBit(a : NSet,b : NSet) : NSet {
        return a & (~b)
    },

    /**
     * Adds the target value to the set
     */
    add: function(a : NSet,b : number) : NSet {
        //Intermediate shift to the left to avoid if 0 check.
        return ((a<<1)|(1<<(b)))>>>1;
    },

    /**
     * Converts the nSet to binaray representation
     */
    toString: function(a : NSet) {
        return a.toString(2);
    },

    /**
     * Counts the elements in the nSet
     */
    size: function(a : NSet) {
        a = a-((a >>> 1) & 0x55555555)
        a = (a & 0x33333333) + ((a >>> 2) & 0x33333333)
        return ((a + (a >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
    },

    /**
     * Converts the nSet to array representation
     */
    toArray: function(a : NSet) {
        let arr = new Uint8Array(9);
        let i = 0;
        while (a>0) {
            arr[i++] = (a & 1) * i;
            a >>>= 1;
        }
        return arr;
    },
}