import { type ComponentType, type MouseEvent, useEffect, useRef, useState } from "react";
import { nGrid } from "../lib/sudoku/nGrid";
import { useSolverZustand } from "./zustand/useSolver";
import { useShallow } from "zustand/react/shallow";

export type CellItemProps = {
    hovered: boolean
    value: number
  }

type SudokuGridProps = {
    CellComponent: ComponentType<CellItemProps>
    hover?: boolean
    getValue: (grid: nGrid, index: number) => number
}

type GridSizeProperties = {
    left: number
    top: number
    cellSize: number
}

export function SudokuGrid({CellComponent, hover, getValue} : SudokuGridProps) {
    const [grid] = useSolverZustand(useShallow((state)=>[state.grid,state.update]))
    const [hovered, setHovered] = useState(-1);
    const baseElementRef = useRef<HTMLDivElement>(null);
    const gridSizeProperties = useRef<GridSizeProperties>(null);

    useEffect(()=>{
        if (!hover) return;

        function onResize() {
            if (!baseElementRef.current) return;
            let rect = baseElementRef.current.getBoundingClientRect();
            const newProperties: GridSizeProperties = {
                left: rect.left,
                top: rect.top,
                cellSize: rect.width / 9
            }
            gridSizeProperties.current = newProperties;
        }

        onResize()

        window.addEventListener("resize",onResize);

        return () => window.removeEventListener("resize",onResize);
    }, [hover])

    const objects = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let index = i*9 + j;
            objects.push(<CellComponent value={getValue(grid,index)} hovered={hovered === index} key={index}></CellComponent>)
        }
    }

    function onMouseMove(e : MouseEvent) {
        if (!gridSizeProperties.current) return;
        const properties = gridSizeProperties.current;
        const column = ~~((e.clientX - properties.left) / (properties.cellSize));
        const row = ~~((e.clientY - properties.top) / (properties.cellSize));
        const hoverId = row * 9 + column;

        setHovered(hoverId);
    }

    return (
        <div ref={baseElementRef} className="grid grid-cols-9 grid-rows-9 contain-layout contain-style contain-paint" onMouseMove={hover ? onMouseMove : undefined} onMouseLeave={_=>setHovered(-1)}>
            {objects}
        </div>
    );
}