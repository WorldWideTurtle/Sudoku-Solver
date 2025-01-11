// UNUSED
// Since JavaScript allows bit manipulations on signed 32 bit integers
// and an nArray for a single row would require 36 bits, this 
// does not fully work in js.

import { nSet } from "./nSet";

export const nArray = {
    /**
     * Creates a new nArray
     */
    new: function(args : number[]) {
        if (args?.length <= 0) return 0;
        // +1 Since the number 0 can't be stored otherwise
        return args.map(e=>e+1).reduce((num = 0,current,i)=>num|(current<<(i<<2)))
    },

    /**
     * Sets the number at an index
     */
    set: function(a : number,b = 0,c = 0) {
        return (a & ~(0xF<<(c<<2)))|((b+1)<<(c<<2));
    },

    /**
     * Gets the number at an index
     */
    get: function(a : number,b : number) {
        return ((a>>>(b<<2))&0xF)-1;
    },

    /**
     * Formats the nArray as an JS Array
     */
    toArray: function(a : number) {
        let arr = [];
        while (a>0) {
            arr.push((a&0xF)-1);
            a = a>>>4;
        }
        return arr;
    },

    /**
     * Formats the nArray as an nSet
     * @param {Number} a nArray
     * @return {Number} nSet
     */
    toSet: function(a : number) {
        let numSet = 0;
        while (a>0) {
            numSet = nSet.add(numSet,(a&0xF)-1);
            a = a>>>4;
        }
        return numSet;
    }
}