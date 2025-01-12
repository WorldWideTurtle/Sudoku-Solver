import { ComponentType } from "react";
import { nGrid } from "../lib/sudoku/nGrid";
import { useSolverZustand } from "./zustand/useSolver";
import { useShallow } from "zustand/react/shallow";

export type CellItemProps = {
    row: number;
    column: number;
    grid: nGrid
  }

type SudokuGridProps = {
    CellComponent: ComponentType<CellItemProps>
}

//"flex size-8 items-center justify-center text-lg"

export function SudokuGrid({CellComponent} : SudokuGridProps) {
    const [grid] = useSolverZustand(useShallow((state)=>[state.grid,state.update]))
    const objects = [];

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            objects.push(<CellComponent row={i} column={j} grid={grid} key={i*9 + j}></CellComponent>)
        }
    }

    return (
        <div className="grid grid-cols-9 grid-rows-9 contain-layout contain-style contain-paint">
            {objects}
        </div>
    );
}