import { create } from "zustand";
import { nGrid } from "../../lib/sudoku/nGrid";
import { sudokuUtil } from "../../lib/util/sudokuUtil";

type SolvedState = {
    current: "solved" | "unsolved",
    type?: "full" | "partial"
}

export type SolveData = {
    time: number,
    itterations: number,
    singles: number,
    hiddens: number,
    guesses: number,
    backtracks: number
}

type SolverStore = {
    grid: nGrid
    state: SolvedState
    update: number
    solve: (full: boolean) => void
    loadGrid: (newGrid : string) => void
    undo: () => void
    reset: () => void
    getSolveData: () => SolveData
}

export const baseBoard = "060900000000015000500640030054000902100000003906000410090051006000390000000008070";

export const useSolverZustand = create<SolverStore>((set, get)=>({
    grid: new nGrid(sudokuUtil.decode(baseBoard)),
    update: 0,
    state: {current: "unsolved"},
    solve: (full: boolean) => {
        const grid = get().grid;
        if (full) {
            grid.init();
        } else {
            if (grid.isSolved()) return;
        }
        grid.solve(full);
        set((state)=>({
            update:state.update+1,
            state: {
                current: grid.isSolved() ? "solved" : "unsolved",
                type: full ? "full" : "partial"
            }
        }))
    },
    loadGrid: (newGrid: string) => {
        const grid = get().grid;
        grid.load(sudokuUtil.decode(newGrid))
        grid.init()
        set((state)=>({
            update:state.update+1,
            state: {
                current: "unsolved",
                type: undefined
            }
        }))
    },
    undo: () => {
        const grid = get().grid;
        grid.undo()
        set((state)=>({update:state.update+1}))
    },
    reset: () => {
        const grid = get().grid;
        grid.init();
        set((state)=>({
            update:state.update+1,
            state: {
                current: "unsolved",
                type: undefined
            }
        }))
    },
    getSolveData: () => {
        const grid = get().grid;
        return {
            time: grid.solveTime,
            itterations: grid.itterationCount,
            singles: grid.singleCount,
            hiddens: grid.hiddenCount,
            guesses: grid.guesses,
            backtracks: grid.reverseCount,
        }
    }
}))