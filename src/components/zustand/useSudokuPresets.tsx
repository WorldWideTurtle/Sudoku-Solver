import { create } from "zustand";
import { standardDisplayer, standartFlattener } from "../../lib/sudoku/listLoaders/standard-loader";
import { benchmarkFlattener } from "../../lib/sudoku/listLoaders/benchmark-loader";

const basePresest = {
    "Standard": undefined,
    "17-Clue": undefined,
    "kaggle": undefined,
    "forum_hardest_1106": undefined
} as const;

export const availablePresets : AvailablePreset[] =  [
    {
        name: "Standard", 
        source: "/baseList.json", 
        size: 13, 
        description: "A list of a few generated Sudokus of varying difficulty, along with the 95 'impossible' rated sudokus from the MagicTour forum.",
        displayProcessor: standardDisplayer, 
        listProcessor: standartFlattener
    },
    {
        name: "17-Clue", 
        source: "/17-clue.json", 
        size: 4128, 
        description: "A list of all (49158) 17-Clue Sudoku puzzles. Used to benchmark the hidden singles technique.",
        displayProcessor: standardDisplayer, 
        listProcessor: benchmarkFlattener
    },
    {
        name: "kaggle", 
        source: "/kaggle.json", 
        size: 8497, 
        description: "A list of 100000 rather easy puzzles. Used for benchmarking the initialization of boards.",
        displayProcessor: standardDisplayer, 
        listProcessor: benchmarkFlattener
    },
    {
        name: "forum_hardest_1106", 
        source: "/forum_hardest_1106.json", 
        size: 32, 
        description: "A list of 375 hardest puzzles for backtracking solvers. Used for benchmarking the backtracking.",
        displayProcessor: standardDisplayer, 
        listProcessor: benchmarkFlattener
    }
];

export type PresetName = keyof typeof basePresest;

type AvailablePreset = {
    name: PresetName
    source: string
    size: number
    description: string
    displayProcessor: (list: any) => [string,[string,string][]][]
    listProcessor: (list: any) => string[]
}

type LoadedPreset = {
    id: number
    data: any
} | undefined

type SudokuPresetStore = {
    loaded: Record<PresetName,LoadedPreset>,
    fetching: PresetName[],
    fetchPreset: (name: PresetName) => Promise<Object>
    abort: (name: PresetName) => void
}

const abortControllers : Record<string,AbortController> = {

}

export function toDisplayList(name: PresetName, list: any) {
    const preset = availablePresets.find(e=>e.name === name)!;
    return preset.displayProcessor(list);
}

export function toDataList(name: PresetName, list: any) {
    const preset = availablePresets.find(e=>e.name === name)!;
    return preset.listProcessor(list);
}

export const useSudokuPresets = create<SudokuPresetStore>((set,get)=>({
    loaded: basePresest,
    fetching: [],
    fetchPreset: async(name: PresetName) => {
        return new Promise(async (resolve,reject) => {
            const snapshot = get()
            if (snapshot.loaded[name] !== undefined) {
                return resolve(snapshot.loaded[name]!.data)
            }

            set((state)=>({
                fetching: [...state.fetching,name]
            }))

            const controller = new AbortController();
            const signal = controller.signal;
            abortControllers[name] = controller;
            
            const requestedPresetIndex = availablePresets.findIndex(e=>e.name === name);
            if (requestedPresetIndex === -1) throw new Error("The requested preset does not exits");
            
            const requestedPresetSource = availablePresets[requestedPresetIndex].source
            const data = await fetch(requestedPresetSource, {signal});
            if (!data.ok) return reject("Failed to fetch data");
            const json = await data.json();
            const newEntry = {id:requestedPresetIndex,data:json}
            set((state)=>({
                loaded:{...state.loaded, [name]: newEntry},
                fetching: state.fetching.filter(e=>e !== name)
            }));
            resolve(json)
        })
    },
    abort: (name: PresetName) => {
        if (abortControllers[name]) {
            abortControllers[name].abort()
        }
    }
}))