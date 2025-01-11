import { create } from "zustand";
import { standardDisplayer, standartFlattener } from "../../lib/sudoku/listLoaders/standard-loader";

export const availablePresets : AvailablePreset[] =  [
    {name: "Standard", source: "baseList.json", size: 13, displayProcessor: standardDisplayer, listProcessor: standartFlattener}
];

type PresetName = "Standard";

type AvailablePreset = {
    name: PresetName
    source: string
    size: number
    displayProcessor: (list: any) => [string,string[]][]
    listProcessor: (list: any) => string[]
}

type LoadedPreset = {
    id: number
    data: any
}

type SudokuPresetStore = {
    loaded: Record<string,LoadedPreset>
    fetchPreset: (name: PresetName) => Promise<Object>
    abort: (name: PresetName) => void
}

const abortControllers : Record<string,AbortController> = {

}

export const useSudokuPresets = create<SudokuPresetStore>((set,get)=>({
    loaded: {},
    fetchPreset: async(name: PresetName) => {
        return new Promise(async (resolve,reject) => {
            if (get().loaded[name]) {
                return resolve(get().loaded[name].data)
            }

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
            set((state)=>({loaded:{...state.loaded,name: newEntry}}));
            resolve(json)
        })
    },
    abort: (name: PresetName) => {
        if (abortControllers[name]) {
            abortControllers[name].abort()
        }
    }
}))