import { sudokuUtil } from "../util/sudokuUtil";
import { nGrid } from "./nGrid";

export const baseBoard = "060900000000015000500640030054000902100000003906000410090051006000390000000008070";

export type SolveData = {
    itterationCount: number,
    singleCount: number,
    hiddenCount: number,
    guesses: number,
    reverseCount: number,
    time: number
}

export type PresetType = "base" | "performance"

type Manager = {
    sudokuGrid: nGrid
    presets: {[Key in PresetType]?: string[]}
    getPresets: (type : PresetType) => Promise<boolean | string[]>
    softLoad: (grid: string) => void
    loadGrid: (grid: string) => void
    restart: () => void
    solve: (full: boolean) => void
    getSolveData: () => SolveData
    getSolveTime: () => number
}

export const manager : Manager = {
    sudokuGrid: new nGrid(sudokuUtil.decode(baseBoard)),
    presets: {},

    async getPresets(type : PresetType) {
        return new Promise(async (resolve)=>{
            if (!this.presets[type]) {
                let json;
                try {
                    let response = await fetch(`static/out/${type}List.json`)
                    json = await response.json()
                } catch (error) {
                    return resolve(false);
                }
                
                if (json) {
                    this.presets[type] = json;
                }
            }

            if (this.presets[type] !== undefined)
                resolve(this.presets[type]!)
        })
    },

    softLoad(grid) {
        this.sudokuGrid.load(sudokuUtil.decode(grid));
        this.sudokuGrid.init();
    },

    loadGrid(grid) {
        this.sudokuGrid.load(sudokuUtil.decode(grid));
        this.restart();
    },

    restart() {
        this.sudokuGrid.init();
    },

    solve(full) {
        this.sudokuGrid.solve(full);
    },

    getSolveData() {
        return {
            itterationCount: this.sudokuGrid.itterationCount,
            singleCount: this.sudokuGrid.singleCount,
            hiddenCount: this.sudokuGrid.hiddenCount,
            guesses: this.sudokuGrid.guesses,
            reverseCount: this.sudokuGrid.reverseCount,
            time: this.sudokuGrid.solveTime
        }
    },

    getSolveTime() {
        return this.sudokuGrid.solveTime;
    }
}