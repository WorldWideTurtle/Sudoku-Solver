import { useShallow } from "zustand/react/shallow"
import { PresetName, toDataList, toDisplayList, useSudokuPresets } from "./zustand/useSudokuPresets"
import { createRef, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { useSolverZustand } from "./zustand/useSolver"
import { useDialog } from "./zustand/useDialog"
import { solver } from "../lib/sudoku/solver"
import classNames from "classnames"

const listClasses = "flex flex-col gap-4 max-h-[600px] pl-2 h-[40vh] overflow-y-auto w-[95vw] max-w-[400px]"
const groupClasses = "border-l-2 border-l-foreground border-solid w-full pr-2"

const preset : PresetName = "Standard";
export function PresetDisplayList({solve} : {solve? : boolean}) {
    const [loadedPresets, fetchPreset] = useSudokuPresets(useShallow((state)=>[state.loaded,state.fetchPreset]))
    const load = useSolverZustand((state)=>state.loadGrid);
    const closeDialog = useDialog((state)=>state.closeDialog);

    const [data, setData] = useState<any>([])
    const [loaded, setLoaded] = useState(false);

    const getDisplayData = useCallback(()=>{
        return toDisplayList(preset,data);
    }, [data])

    const getListData = useCallback(()=>{
        return toDataList(preset,data);
    }, [data])

    const objectRefs = useMemo(()=>{
        return new Array(getListData().length).fill(0).map(e=>createRef<HTMLLIElement>())
    }, [data])

    useLayoutEffect(()=>{
        if (loadedPresets[preset] !== undefined) {
            setData(loadedPresets[preset]!.data)
            setLoaded(true);
        } else {
            fetchPreset(preset)
        }
    }, [loadedPresets])

    useEffect(()=>{
        if (solve && objectRefs.length > 0) {
            solver.solve(getListData(),(event,_,id) => {
                const ref = objectRefs[id]?.current;
                if (ref) {
                    const timeElement = document.createElement("span");
                    timeElement.className = "text-accent"
                    const time = event.data as number;
                    timeElement.textContent = time.toFixed(1) + " ms";
                    ref.replaceChild(timeElement, ref.lastChild!);
                }
            })
        }
    }, [objectRefs])

    if (!loaded || data.length === 0)
        return <PresetDisplaySkelleton />

    const onClickCallback = (sudokuString: string) => {
        load(sudokuString);
        closeDialog();
    }

    let total = 0;
    return (
        <div className={listClasses}>
            {getDisplayData().map(group=>(
                <ul className={groupClasses} key={group[0]}>
                    {group[1].map((inner,i)=>(
                        <li 
                            ref={objectRefs[total++]} 
                            className={classNames("pl-2 hover:bg-foreground/10 w-full cursor-pointer",solve ? "flex justify-between" : "")} 
                            key={i} 
                            onClick={()=>onClickCallback(inner[1])}>
                                {inner[0]}
                                {solve && <span>Solving</span>}
                        </li>
                    ))}
                </ul>
            ))}
        </div>
    )
}

function PresetDisplaySkelleton() {
    return (
        <div className={listClasses}>
            {new Array(8).fill(0).map((e,i)=>(
                <div key={i} className="w-full text-transparent select-none bg-foreground/10 animate-pulse">Loading</div>
            ))}
        </div>
    )
}