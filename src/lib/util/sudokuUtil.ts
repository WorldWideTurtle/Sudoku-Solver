export const sudokuUtil = {
    decode(str : string) : number[][] {
        let newArr = new Array(9);
        for (let i = 0; i < 81; i+=9) {
            let row = new Array(9);
            for (let j = 0; j < 9; j++) {
                row[j] = (+str[i + j]);
            }
            newArr[i/9] = row;
        }
        return newArr;
    },

    encode(arr : number[][]) {
        return arr.reduce((row,nextRow)=>row.concat(nextRow.reduce<string>((p,c)=>p+=c.toString(),""),""),"");
    }
}