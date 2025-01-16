import { useShallow } from "zustand/react/shallow"
import { availablePresets, PresetName, toDataList, useSudokuPresets } from "./zustand/useSudokuPresets"
import { ChangeEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ReactComponent as DownloadIcon } from "./icons/download.svg";
import { ReactComponent as SpinnerIcon } from "./icons/spinner.svg";
import classNames from "classnames";
import { solver } from "../lib/sudoku/solver";

type BenchmarkFormState = {
    selectedPreset: number
    threadCount: number
    chunkSize: number
};

type modifyStateFunction = <T>(key:keyof BenchmarkFormState, value: T) => void;

type FormStepProps = {state: BenchmarkFormState, modifyState: modifyStateFunction}

const MAX_PAGES = 2;
const PAGE_NEXT_TEXT = [
    "Next",
    "Start"
]

export function BenchmarkDialog() {
    const [state,setState] = useState<BenchmarkFormState>({
        selectedPreset: -1,
        threadCount: navigator.hardwareConcurrency,
        chunkSize: 800
    });
    const [page, setPage] = useState(0);

    function modifyStateInternal<T>(key:keyof BenchmarkFormState, value: T) {
        setState(currentState => ({...currentState, [key]: value}))
    }

    const modifyState = useCallback(modifyStateInternal, [])


    function nextPage() {
        setPage(p => Math.min(p + 1,MAX_PAGES))
    }

    function prevPage() {
        setPage(p => Math.max(p - 1,0))
    }

    return (
        <form>
            <div className="p-2">
                {page === 0 && <ChoosePresetStep state={state} modifyState={modifyState} />}
                {page === 1 && <ChooseSettingsStep state={state} modifyState={modifyState} />} 
                {page === 2 && <SolveStep state={state} modifyState={modifyState} />} 
            </div>
            <hr className="my-2 border-popover"/>
            <div className="grid grid-cols-2  gap-2">
                {page > 0 && 
                    <button 
                        type="button" 
                        className="dark:border-1 col-start-1 float-left border-foreground/10 border-solid px-3 py-2 rounded-sm hover:bg-popover transition-[background-color] duration-100" 
                        onClick={prevPage}>
                            Previous
                    </button>
                }
                {page < MAX_PAGES && 
                    <button 
                        type="button" 
                        className={classNames("dark:border-1 col-start-2 float-right border-foreground/10 text-background bg-foreground border-solid px-3 py-2 rounded-sm transition-[background-color] duration-100",state.selectedPreset === -1 ? "bg-transparent text-foreground hover:bg-popover" : "hover:bg-foreground/90")} 
                        disabled={state.selectedPreset === -1} 
                        onClick={nextPage}>
                            {PAGE_NEXT_TEXT[page]}
                    </button>
                }
            </div>
        </form>
    )
}

function ChoosePresetStep({state, modifyState} : FormStepProps) {
    const [loadedPresets, fetchPreset, fetching] = useSudokuPresets(useShallow((state)=>[state.loaded,state.fetchPreset, state.fetching]));

    useLayoutEffect(()=>{
        let total = 0;
        for (const key of Object.keys(loadedPresets)) {
            if (loadedPresets[key as PresetName] !== undefined) {
                return modifyState("selectedPreset",total);;
            }
            total++;
        }
    }, [loadedPresets, modifyState])

    function fetchData(preset: PresetName) {
        if (fetching.find(e=>e === preset) === undefined) {
            fetchPreset(preset);
        }
    }

    function trySelect(index: number) {
        const name = availablePresets[index].name;
        if (loadedPresets[name] !== undefined) {
            modifyState("selectedPreset",index);
        }
    }

    return (
        <fieldset className="flex flex-col gap-1">
            <legend>Select list to benchmark</legend>
            {availablePresets.map((e,i)=>{
                const isSelected = state.selectedPreset === i;
                const isLoaded = loadedPresets[e.name] !== undefined;
                return (
                    <div key={i} className="relative">
                        <button type="button" aria-checked={isSelected} role="radio" className={classNames("bg-popover/40 hover:bg-popover transition-[background-color] duration-100 shadow-sm shadow-foreground dark:shadow-none rounded-sm cursor-pointer p-2 grid grid-cols-[1fr_auto] gap-8 max-w-[450px] text-left dark:border-1 border-solid border-foreground/10",!isLoaded && "opacity-55 pointer-events-none")} onClick={()=>trySelect(i)}>
                            <div>
                                <h3 className="font-bold">{e.name}</h3>
                                <p className="opacity-70 text-sm">{e.description}</p>
                            </div>
                            <div className="place-items-center h-full grid size-4 mr-3">
                                <div className={classNames("rounded-full border-foreground border-1 border-solid size-4",isSelected && "bg-accent", !isLoaded && "hidden")}></div>
                            </div>
                        </button>
                        {
                            !isLoaded && ((fetching.find(k=>k === e.name) === undefined) ?
                            <button 
                                onClick={()=>fetchData(e.name)} 
                                type="button"
                                className="absolute right-4 size-8 top-[50%] p-1 -translate-y-[50%] bg-transparent rounded-md hover:bg-popover transition-[background-color] duration-100">
                                    <DownloadIcon className="fill-foreground" />
                            </button> : <div className="absolute right-4 size-8 top-[50%] p-1 -translate-y-[50%] bg-transparent rounded-md"><SpinnerIcon className="fill-foreground"/></div>)
                        }
                    </div>
                )
            })}
        </fieldset>
    )
}

function ChooseSettingsStep({state, modifyState} : FormStepProps) {
    const onInput = (key: keyof BenchmarkFormState) => (e: ChangeEvent<HTMLInputElement>) => modifyState(key,e.target.value)

    return (
        <div className="grid grid-cols-[auto_1fr_6ch] grid-flow-row items-center gap-2">
            <div className="grid grid-cols-subgrid col-span-3 gap-6">
                <label htmlFor="CHUNKS">Chunk size</label>
                <input name="ChunkSize" onChange={onInput("chunkSize")} id="CHUNKS" type="range" min={100} max={2000} step={100} defaultValue={state.chunkSize}/>
                <span>{state.chunkSize}</span>
            </div>
            <div className="grid grid-cols-subgrid col-span-3 gap-6">
                <label htmlFor="THREADS">Threads</label>
                <input name="ThreadCount" onChange={onInput("threadCount")} id="THREADS" type="range" min={1} max={navigator.hardwareConcurrency} step={1} defaultValue={state.threadCount}/>
                <span>{state.threadCount}</span>
            </div>
        </div>
    )
}


function SolveStep({state} : FormStepProps) {
    const [loadedPresets] = useSudokuPresets(useShallow((state)=>[state.loaded]));
    const [solveProgress, setProgress] = useState(0)

    const progressBarRef = useRef<HTMLDivElement>(null);
    const resultRef = useRef({time: 0, threadTime: 0});

    useEffect(()=>{
        const name = availablePresets[state.selectedPreset].name;
        const startTime = performance.now();
        solver.solveMulti(toDataList(name, loadedPresets[name]!.data), +state.threadCount, +state.chunkSize, (e,p,b)=>{
            setProgress(p)
            resultRef.current.threadTime += e.data;
            resultRef.current.time = performance.now() - startTime;
        })

        return () => solver.cancel();

        // None of the dependencies of this useEffect CAN change after this componend mounted.
        // If they do change, then only after the component unmounted and needs to remount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className="relative max-w-[450px] w-[70vw] h-4 rounded-md overflow-hidden bg-popover shadow-sm shadow-foreground dark:shadow-none">
                <div className="left-0 top-0 absolute h-full transition-[width] duration-75 bg-accent" style={{
                    width: `${solveProgress * 100}%`
                }} ref={progressBarRef}></div>
            </div>
            {solveProgress === 1 && 
                <div className="pt-2">
                    <div>Time taken: {resultRef.current.time.toFixed(2)}ms</div>
                    <div>Thread time: {resultRef.current.threadTime.toFixed(2)}ms</div>
                    <div>Solved: {solver.solved}</div>
                    <div>Result: {(solver.solved / resultRef.current.time * 1000).toFixed()} Solves/s</div>
                </div>
            }
        </>
    )
}