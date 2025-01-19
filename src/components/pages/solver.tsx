import { CellItemProps, SudokuGrid } from "../sudoku-grid";
import {ReactComponent as BarChartIcon} from '../icons/bar-chart.svg'
import {ReactComponent as PlayIcon} from '../icons/play.svg'
import {ReactComponent as FastForwardIcon} from '../icons/fast-forward.svg'
import {ReactComponent as ClearAllIcon} from '../icons/clear-all.svg'
import {ReactComponent as DownloadIcon} from '../icons/download.svg'
import {ReactComponent as UploadIcon} from '../icons/upload.svg'
import {ReactComponent as ListIcon} from '../icons/list.svg'
import {ReactComponent as RestartIcon} from '../icons/restart.svg'
import { memo, ReactNode, useEffect, useLayoutEffect, useState } from "react";
import classNames from "classnames";
import { SolveData, useSolverZustand } from "../zustand/useSolver";
import { useShallow } from 'zustand/react/shallow'
import { nSet } from "../../lib/sudoku/nSet";
import { useDialog } from "../zustand/useDialog";
import { useToast } from "../zustand/useToast";
import { sudokuUtil } from "../../lib/util/sudokuUtil";
import { PresetDisplayList } from "../preset-display-list";
import { BenchmarkDialog } from "../benchmark-dialog";
import { LoadSudokuDialog } from "../load-sudoku-dialog";

export function Solver() {
    return (
        <div className="size-full grid place-items-center flex-1">
            <div className="bg-muted max-w-[95vw] p-4 shadow-md shadow-foreground/30 rounded-lg dark:shadow-none">
                <GridDisplay />
                <hr className="m-4"/>
                <ButtonBar />
                <ResultsDisplay />
            </div>
        </div>
    );
}


function NumberCell({value} : CellItemProps) {
    return (
        <span className={`flex size-10 items-center justify-center text-lg ${value !== 0 ? "bg-solved dark:text-solved dark:!bg-transparent" : "bg-unsolved dark:text-unsolved dark:!bg-transparent"}`}>
            {value}
        </span>
    )
}

const MemoNumberCell = memo(NumberCell)

const AllValidNumbers = [1,2,3,4,5,6,7,8,9]

function EntropyCell({hovered, value} : CellItemProps) {
    const size = nSet.size(value);
    return (
        <div className={`size-10 ${size === 0 ? "bg-solved dark:*:text-solved dark:!bg-transparent" : "bg-unsolved dark:*:text-unsolved dark:!bg-transparent"}`}>
            {(hovered && size > 0) ? 
            <div className="grid p-[2px] grid-cols-3 grid-rows-3 size-full">
                {AllValidNumbers.map(e=><span className="text-xs font-mono" key={e}>{nSet.has(value,e) ? e : ""}</span>)}
            </div>
            :
            <span className="flex size-full items-center justify-center text-lg">
                {size}
            </span>
            }
        </div>
    )
}

const MemoEntropyCell = memo(EntropyCell)

function Base() {
    return (
        <div className="flex flex-col items-center gap-1">
            <h2 className="text-2xl font-bold">Sudoku</h2>
            <SudokuGrid getValue={(grid, index) => grid.getValueAtIndex(index)} CellComponent={MemoNumberCell} />
        </div>
    )
}

function Entropy() {
    return (
        <div className="flex-col items-center gap-1 hidden md:flex">
            <h2 className="text-2xl font-bold">Entropy</h2>
            <SudokuGrid getValue={(grid, index) => grid.getEntropy(~~(index / 9), index % 9)} hover CellComponent={MemoEntropyCell} />
        </div>
    )
}

function GridDisplay() {
    return (
        <div className="flex gap-8 justify-center">
            <Base />
            <Entropy />
        </div>
    )
}

function ButtonBar() {
    const [undo, solve, reset, grid] = useSolverZustand(useShallow((state)=>[state.undo,state.solve,state.reset,state.grid]))

    const [showDialog] = useDialog(useShallow((state)=>[state.showDialog,state.closeDialog]))

    const showToast = useToast((state)=>state.addToast);

    const copyToClipboard = () => {
        if (grid.initialState === undefined) return;
        const sudokuString = sudokuUtil.encode(grid.initialState);
        if (navigator.clipboard) {
            navigator.clipboard.writeText(sudokuString);
        }
        showToast({type: "success", message:"Copied to Clipboard"})
    }

    const showInputDialog = () => {
        showDialog({content:<LoadSudokuDialog />, title:"Import"})
    }

    const showListDialog = () => {
        showDialog({content:<PresetDisplayList/>, title:"Presets"})
    }

    const showSolveListDialog = () => {
        showDialog({content:<PresetDisplayList solve={true}/>, title:"Solve Presets"})
    }

    const showBenchmarkDialog = () => {
        showDialog({content:<BenchmarkDialog/>, title:"Benchmark"})
    }

    return (
        <div className="flex md:gap-4 gap-2 w-fit mx-auto">
            <div className="grid grid-flow-col p-1 rounded-md bg-popover shadow-sm shadow-foreground dark:shadow-none">
                <Button onClick={undo}><PlayIcon className="rotate-180"></PlayIcon></Button>
                <Button onClick={()=>{solve(false)}}><PlayIcon></PlayIcon></Button>
                <Button onClick={()=>{solve(true)}}><FastForwardIcon></FastForwardIcon></Button>
            </div>
            <div className="grid grid-flow-col gap-2 p-1 rounded-md bg-popover shadow-sm shadow-foreground dark:shadow-none">
                <Button onClick={reset}><RestartIcon></RestartIcon></Button>
            </div>
            <div className="grid grid-flow-col gap-2 p-1 rounded-md bg-popover shadow-sm shadow-foreground dark:shadow-none">
                <Button onClick={copyToClipboard}><DownloadIcon></DownloadIcon></Button>
                <Button onClick={showInputDialog}><UploadIcon></UploadIcon></Button>
                <Button onClick={showListDialog}><ListIcon></ListIcon></Button>
                <Button onClick={showSolveListDialog}><ClearAllIcon></ClearAllIcon></Button>
                <Button onClick={showBenchmarkDialog}><BarChartIcon></BarChartIcon></Button>
            </div>
        </div>
    )
}

function Button({children, onClick}:{children? : ReactNode, onClick?:()=>void}) {
    return (
        <button onClick={onClick} className="size-6 md:size-10 *:size-full hover:*:fill-accent *:transition-[fill] *:duration-100 *:fill-foreground">{children}</button>
    )
}

function ResultsDisplay() {
    const [state,getSolveData, update] = useSolverZustand(useShallow((state)=>[state.state,state.getSolveData, state.update]))
    const [solveData, setSolveData] = useState<SolveData>()

    useLayoutEffect(()=>{
        if (state.type === undefined) {
            setSolveData(undefined)
        } else {
            setSolveData(getSolveData())
        }
        // No other depency can change without update changing, so 
        // no other depency needs to be listed.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update])

    const formatTimeValue = () => {
        if (state.current === "solved" && state.type === "full") {
            let time = solveData?.time ?? 0
            if (time === 0) return "<1.00";
            if (time === 1) return "~1.00";

            return time.toFixed(2)
        }

        return "..."
    }

    return (
        <div className="grid grid-cols-4 grid-rows-1 md:grid-rows-2 gap-2 w-full mt-4 relative">
            {
                state.type === undefined 
                ?   <div className="absolute -inset-1 z-20 backdrop-blur-[2px] bg-background/5 grid place-items-center">
                        <h3 className="md:text-xl text-base font-bold flex items-center gap-1">Start solving to see results</h3>
                    </div> 
                :   null
            }
            <ResultEntry dataKey="Time taken (ms)" dataValue={formatTimeValue()} className="col-span-2"/>
            <ResultEntry dataKey="Itterations" dataValue={solveData?.itterations.toString()} className="col-span-2"/>
            <ResultEntry dataKey="Singles" dataValue={solveData?.singles.toString()} className="hidden md:flex"/>
            <ResultEntry dataKey="Hiddens" dataValue={solveData?.hiddens.toString()} className="hidden md:flex"/>
            <ResultEntry dataKey="Guesses" dataValue={solveData?.guesses.toString()} className="hidden md:flex"/>
            <ResultEntry dataKey="Backtracks" dataValue={solveData?.backtracks.toString()} className="hidden md:flex"/>
        </div>
    )
}

function ResultEntry({dataKey,dataValue,className} : {dataKey: string, dataValue?: string, className?: string}) {
    return (
        <div className={classNames("bg-popover p-2 rounded-md flex flex-col sm:flex-row gap-1 justify-between shadow-sm shadow-foreground dark:shadow-none *:min-w-[6ch] *:inline-block *:text-sm md:text-base",className)}><span>{dataKey}</span><span className="text-accent sm:text-right">{dataValue}</span></div>
    )
}