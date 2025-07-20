import { type NSet, nSet } from "./nSet";

const baseLowest = ((0x1FF<<9)|(10<<4)|10);

// (i%9)*9 + ~~(i/9)
const columnLookup = [
    0,  9, 18, 27, 36, 45, 54, 63, 72, 
    1, 10, 19, 28, 37, 46, 55, 64, 73, 
    2, 11, 20, 29, 38, 47, 56, 65, 74, 
    3, 12, 21, 30, 39, 48, 57, 66, 75, 
    4, 13, 22, 31, 40, 49, 58, 67, 76, 
    5, 14, 23, 32, 41, 50, 59, 68, 77, 
    6, 15, 24, 33, 42, 51, 60, 69, 78, 
    7, 16, 25, 34, 43, 52, 61, 70, 79, 
    8, 17, 26, 35, 44, 53, 62, 71, 80
];

// ~~(i/27)*27 + ~~(i/9)%3*3 + i%3 + ~~((i%9)/3)*9
const squareLookup = [
     0,  1,  2,  9, 10, 11, 18, 19, 20, 
     3,  4,  5, 12, 13, 14, 21, 22, 23, 
     6,  7,  8, 15, 16, 17, 24, 25, 26, 
    27, 28, 29, 36, 37, 38, 45, 46, 47, 
    30, 31, 32, 39, 40, 41, 48, 49, 50, 
    33, 34, 35, 42, 43, 44, 51, 52, 53, 
    54, 55, 56, 63, 64, 65, 72, 73, 74, 
    57, 58, 59, 66, 67, 68, 75, 76, 77, 
    60, 61, 62, 69, 70, 71, 78, 79, 80
];

export class nGrid {
    initialState? : number[][] = [];

    rowState = new Uint8Array(81);

    activeRowSet = new Uint16Array(9);
    activeColumnSet = new Uint16Array(9);
    activeSquareSet = new Uint16Array(9);

    steps : number[][] = [[]];
    activeStep = 1;

    reverseCount = 0;
    itterationCount = 0;
    singleCount = 0;
    hiddenCount = 0;
    guesses = 0;
    solveTime = 0;

    constructor(initial? : number[][]) {
        this.initialState = initial;
        if (initial) {this.init()};
    }

    load(grid : number[][]) {
        this.initialState = grid;
    }
    
    reset() {
        this.reverseCount = 0;
        this.itterationCount = 0;
        this.steps = [[]];
        this.activeStep = 1;
        this.singleCount = 0;
        this.hiddenCount = 0;
        this.guesses = 0;
    }

    splitArray(arr: Uint8Array,size: number) : Uint8Array[] {
        let res = new Array(arr.length/size);
        for (let i = 0; i < arr.length; i+=size) {
            let newArr = new Uint8Array(size);
            for (let j = 0; j < size; j++) {
                newArr[j] = arr[i+j];
            }
            res[i/size] = newArr;
        }
        return res;
    }

    init() {
        if (this.initialState === undefined) return;
        this.reset()

        let tmpRowState = new Uint8Array(this.initialState.flat())
        this.rowState = tmpRowState;

        for (let i = 0; i < 9; i++) {
            let i9 = i * 9;
            let sets = 0;
            for (let j = 0; j < 9; j++) {
                sets |= (1 << (tmpRowState[i9 + j] - 1)) | ((1 << (tmpRowState[columnLookup[i9 + j]] - 1)) << 9) | ((1 << (tmpRowState[squareLookup[i9 + j]] - 1)) << 18)
            }
            this.activeRowSet[i] = sets & 0x1FF;
            this.activeColumnSet[i] = (sets >>> 9) & 0x1FF;
            this.activeSquareSet[i] = (sets >>> 18) & 0x1FF;
        }
    }

    getRowArray = () => this.splitArray(this.rowState,9);

    getRowSet = () => Array.from(this.activeRowSet).map(e=>nSet.toArray(e));

    getColumnSet = () => Array.from(this.activeColumnSet).map(e=>nSet.toArray(e));

    getSquareSet = () => Array.from(this.activeSquareSet).map(e=>nSet.toArray(e));

    getEntropy(row: number,column : number) {
        if (this.getValueAt(row,column) !== 0) return 0;
        return (this.activeRowSet[row]|this.activeColumnSet[column]|this.activeSquareSet[~~(column/3) + ~~(row/3)*3])^(0x1FF);
    }

    getEntropyAbs(row : number,column : number) {
        return (this.activeRowSet[row]|this.activeColumnSet[column]|this.activeSquareSet[~~(column/3) + ~~(row/3)*3])^(0x1FF);
    }

    getValueAt = (row : number,column : number) => this.rowState[row * 9 + column];

    getValueAtIndex = (index : number) => this.rowState[index];

    checkSolvedCondition(set: Uint16Array) {
        return (Array.from(set).reduce((acc,cur)=>acc & cur, 0x1FF) === 0x1FF)
    }

    isSolved() {
        return (
            this.checkSolvedCondition(this.activeRowSet) 
            && this.checkSolvedCondition(this.activeColumnSet) 
            && this.checkSolvedCondition(this.activeSquareSet)
        );
    }

    totalEntropy() {
        let arr: Uint8Array[]  = []
        for (let row = 0; row < 9; row++) {
            let rowArray = new Uint8Array(9);
            for (let column = 0; column < 9; column++) {
                rowArray[column] = nSet.size(this.getEntropy(row,column));
            }
            arr.push(rowArray);
        }
        return arr;
    }

    solve(full : boolean) {
        // Main loop
        // Itterate over methods from most to least effective.
        let itter = 0;
        this.solveTime = performance.now();
        this.solveHidden()
        do {
            itter++;
            if(this.solveObviousSingles() || this.solveHidden() || this.guess()) {continue};
            break;
        } while (full)
        this.solveTime = performance.now() - this.solveTime;
        this.itterationCount += itter;
    }

    solveObviousSingles() {
        let found = false;
        for (let row = 0; row < 9; row++) {
            if (this.activeRowSet[row] === 0x1FF) continue;
            for (let column = 0; column < 9; column++) {
                // GetValueAtIndex;
                if (this.rowState[Math.imul(row,9) + column] !== 0) continue;

                // GetEntropyAps
                const entp = (this.activeRowSet[row]|this.activeColumnSet[column]|this.activeSquareSet[~~(column/3) + ~~Math.imul(row/3,3)])^(0x1FF);
                // IsSingle
                if (entp === 0) {
                    return this.backTrack();
                } else if ((entp & (entp - 1)) === 0) {
                    this.set(row,column,nSet.log2(entp)+1);
                    this.singleCount++;
                    found = true;
                }
            }
        }
        return found;
    }

    solveHidden() {
        // Solve hidden singles in Rows and Columns
        // A hidden single is a cell in which one of the possible numbers is unique to this cell, along a capture group.
        // Check each cell and add the options to a set. If the number is already in the set, move it to another set. 
        // Any numbers remaining in the initial set have only been encountered once.
        for (let row = 0; row < 9; row++) {
            if (this.activeRowSet[row] === 0x1FF) continue;
            let previousRow = 0;
            let potentialRow = 0;
            
            for (let col = 8; col !== -1; col--) {
                if (previousRow === 0x1FF) break;
                // GetValueAt
                if (this.rowState[row * 9 + col] !== 0) continue; 

                let entropy = this.getEntropyAbs(row,col);
                previousRow |= (potentialRow & entropy);
                potentialRow = (potentialRow | entropy) & (~previousRow)
                
            }

            if (potentialRow && !(potentialRow & (potentialRow - 1))) {
                for (let col = 8; col !== -1; col--) {
                    // GetValueAt
                    if (this.rowState[row * 9 + col] !== 0) continue; 
                    if ((this.getEntropyAbs(row,col) & potentialRow) === 0) continue;

                    this.set(row,col,nSet.log2(potentialRow)+1);
                    this.hiddenCount++;
                    return true;
                }
            }
        }

        for (let row = 8; row !== -1; row--) {
            if (this.activeColumnSet[row] === 0x1FF) continue;
            let previousCol = 0;
            let potentialCol = 0;
            for (let col = 0; col < 9; col++) {
                if (previousCol === 0x1FF) break;
                // GetValueAt
                if (this.rowState[col * 9 + row] !== 0) continue; 

                let entropy = this.getEntropyAbs(col,row);
                previousCol |= (potentialCol & entropy);
                potentialCol = (potentialCol | entropy) & (~previousCol)
            }
            
            if (potentialCol && !(potentialCol & (potentialCol - 1))) {
                for (let col = 0; col < 9; col++) {
                    // GetValueAt
                    if (this.rowState[col * 9 + row] !== 0) continue;
                    if ((this.getEntropyAbs(col,row) & potentialCol) === 0) continue;

                    this.set(col,row,nSet.log2(potentialCol)+1);
                    this.hiddenCount++;
                    return true;
                }
            }
        }
        return false;
    }

    guessCell(row : number,column : number,ent : NSet) {
        this.guesses++;
        let first = nSet.first(ent)
        this.set(row,column,first);
        this.activeStep = this.steps.push([(first<<18)|((ent & (ent - 1))<<9)|(row<<4)|column])
    }

    guess() {
        let lowest = baseLowest;
        let ent = 0;
        for (let row = 8;row >= 0; row--) {
            if (this.activeRowSet[row] === 0x1FF) continue;
            for (let column = 8; column >= 0; column--) {
                // GetValueAt
                if (this.rowState[row * 9 + column] !== 0) continue;

                ent = this.getEntropyAbs(row,column);
                if (nSet.size(ent) >= nSet.size(lowest>>>9)) continue;

                lowest = (ent<<9)|(row<<4)|column;
                if (nSet.size(ent) === 2) {
                    this.guessCell(row,column,ent);
                    return true;
                }
                
            }
        }
        
        if (lowest === baseLowest) return false;

        this.guessCell((lowest>>>4)&0xF,lowest&0xF,lowest>>>9)
        return true;
    }

    backTrack() {
        while (this.activeStep > 1) {
            const lastStep = this.steps[this.activeStep-1];
            let guessStep = lastStep[0];
            if (nSet.size((guessStep>>>9)&0x1FF) !== 0) {
                this.reverseCount+=lastStep.length;
                for (const step of lastStep) {
                    this.reverse(step);
                }
                let val = nSet.first((guessStep>>>9)&0x1FF)
                this.set((guessStep>>>4)&0xF,guessStep&0xF, val);
                this.steps[this.activeStep-1] = [(val<<18)|(nSet.shift((guessStep>>>9)&0x1FF)<<9)|(guessStep&0xF0)|(guessStep&0xF)];
                break;
            } else {
                if (this.activeStep <= 2) return false;

                this.reverseCount+=lastStep.length;
                for (const step of this.steps.pop()!) { // Can't be undefined if activeStep > 0
                    this.reverse(step);
                }

                this.activeStep--;
            }
        }

        return false
    }
    
    undo() {
        if (this.activeStep === 0) return;
        const lastStep = this.steps[this.activeStep-1];
        this.reverse(lastStep.pop()!) // Can't be undefined if activeStep > 0
    }

    set(row : number,column : number,value : number) {
        this.steps[this.activeStep-1].push((value<<18)|(row<<4)|(column));
        // nSet.add
        this.activeRowSet[row] = this.activeRowSet[row] | (1 << (value - 1));
        this.activeColumnSet[column] = this.activeColumnSet[column] | (1 << (value - 1));
        this.activeSquareSet[~~(column/3) + ~~(row/3)*3] = this.activeSquareSet[~~(column/3) + ~~(row/3)*3] | (1 << (value - 1));

        this.rowState[row * 9 + column] = value;
    }

    reverse(step : number) {
        const row = (step>>>4)&0xF;
        const column = step&0xF;
        const value = step>>>18;

        // nSet.remove
        this.activeRowSet[row] = this.activeRowSet[row] &  ~(1 << (value - 1));
        this.activeColumnSet[column] = this.activeColumnSet[column] & ~(1 << (value - 1));
        this.activeSquareSet[~~(column/3) + ~~(row/3)*3] = this.activeSquareSet[~~(column/3) + ~~(row/3)*3] & ~(1 << (value - 1));

        this.rowState[row * 9 + column] = 0;
    }
}