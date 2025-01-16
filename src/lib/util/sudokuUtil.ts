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
    },

    isValid(str: string) {
        const arr = this.decode(str);

        for (let r = 0; r < 9; r++) {
            let rowSet = new Set<number>()
            let colSet = new Set<number>()
            let squareSet = new Set<number>()

            let row = arr[r];
            for (let c = 0; c < 9; c++) {
                const rowNumber = row[c]
                const colNumber = arr[c][r]

                const squareRow = (~~(r / 3)) * 3 + (~~(c / 3));
                const squareNumber = arr[squareRow][c % 3];

                if (rowNumber !== 0) {
                    if (rowSet.has(rowNumber)) {
                        return false;
                    } else {
                        rowSet.add(rowNumber)
                    }
                };

                if (colNumber !== 0) {
                    if (colSet.has(colNumber)) {
                        return false;
                    } else {
                        colSet.add(colNumber)
                    }
                }

                if (squareNumber !== 0) {
                    if (squareSet.has(squareNumber)) {
                        return false;
                    } else {
                        squareSet.add(squareNumber)
                    }
                }
            }
        }

        return true;
    }
}