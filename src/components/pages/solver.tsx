import { SudokuGrid } from "../sudoku-grid";
import {ReactComponent as BarChartIcon} from '../icons/bar-chart.svg'
import {ReactComponent as PlayIcon} from '../icons/play.svg'
import {ReactComponent as FastForwardIcon} from '../icons/fast-forward.svg'
import {ReactComponent as ClearAllIcon} from '../icons/clear-all.svg'
import {ReactComponent as DownloadIcon} from '../icons/download.svg'
import {ReactComponent as UploadIcon} from '../icons/upload.svg'
import {ReactComponent as ListIcon} from '../icons/list.svg'
import {ReactComponent as RestartIcon} from '../icons/restart.svg'
import { ReactNode } from "react";
import classNames from "classnames";
import { baseBoard, manager } from "../../lib/sudoku/manager";


function generateTestData() {
    return new Array(9).fill(0).map(e=>new Array(9).fill(0).map(i=>~~(Math.random() * 9 + 0.999)))
}

export function Solver() {
    return (
        <div className="size-full grid place-items-center flex-1">
            <div className="bg-muted w-fit p-4 shadow-md shadow-foreground/30 rounded-lg dark:shadow-none">
                <GridDisplay />
                <hr className="m-2"/>
                <ButtonBar />
                <ResultsDisplay />
            </div>
        </div>
    );
}

function GridDisplay() {
    manager.loadGrid(baseBoard);
    manager.solve(true);

    return (
        <div className="flex gap-2 justify-center">
            <div className="flex flex-col items-center gap-1">
                <h2 className="text-2xl font-bold">Sudoku</h2>
                <SudokuGrid data={manager.sudokuGrid.getRowArray()} />
            </div>
            <div className="flex-col items-center gap-1 hidden md:flex">
                <h2 className="text-2xl font-bold">Entropy</h2>
                <SudokuGrid data={manager.sudokuGrid.getRowArray()} />
            </div>
        </div>
    )
}

function ButtonBar() {
    return (
        <div className="flex gap-4 w-full justify-center">
            <div className="flex gap-2 p-1 rounded-md bg-popover shadow-sm shadow-foreground dark:shadow-none">
                <Button><PlayIcon className="rotate-180"></PlayIcon></Button>
                <Button><PlayIcon></PlayIcon></Button>
                <Button><FastForwardIcon></FastForwardIcon></Button>
            </div>
            <div className="flex gap-2 p-1 rounded-md bg-popover shadow-sm shadow-foreground dark:shadow-none">
                <Button><RestartIcon></RestartIcon></Button>
            </div>
            <div className="flex gap-2 p-1 rounded-md bg-popover shadow-sm shadow-foreground dark:shadow-none">
                <Button><DownloadIcon></DownloadIcon></Button>
                <Button><UploadIcon></UploadIcon></Button>
                <Button><ListIcon></ListIcon></Button>
                <Button><ClearAllIcon></ClearAllIcon></Button>
                <Button><BarChartIcon></BarChartIcon></Button>
            </div>
        </div>
    )
}

function Button({children}:{children? : ReactNode}) {
    return (
        <button className="hover:*:fill-accent *:transition-[fill] *:duration-100 *:fill-foreground">{children}</button>
    )
}

function ResultsDisplay() {
    return (
        <div className="grid grid-cols-4 grid-rows-1 md:grid-rows-2 gap-2 w-full mt-2">
            <ResultEntry dataKey="Time taken (ms)" dataValue="" className="col-span-2"/>
            <ResultEntry dataKey="Itterations" dataValue="" className="col-span-2"/>
            <ResultEntry dataKey="Singles" dataValue="" className="hidden md:flex"/>
            <ResultEntry dataKey="Hiddens" dataValue="" className="hidden md:flex"/>
            <ResultEntry dataKey="Guesses" dataValue="" className="hidden md:flex"/>
            <ResultEntry dataKey="Backtracks" dataValue="" className="hidden md:flex"/>
        </div>
    )
}

function ResultEntry({dataKey,dataValue,className} : {dataKey: string, dataValue: string, className?: string}) {
    return (
        <div className={classNames("bg-popover p-2 rounded-md flex gap-1 justify-between text-base shadow-sm shadow-foreground dark:shadow-none *:min-w-[6ch] *:inline-block",className)}><span>{dataKey}</span><span>{dataValue}</span></div>
    )
}