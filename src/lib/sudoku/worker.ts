import { sudokuUtil } from "../util/sudokuUtil";
import { nGrid } from "./nGrid";

const grid = new nGrid();

export type GridEventData = {
    data: {
        partial? : boolean,
        grids: string[]
    }
}

// eslint-disable-next-line no-restricted-globals
self.onmessage = (event : GridEventData) =>{    
    if (event.data.partial === true) {
        event.data.grids.forEach(element => {
            grid.load(sudokuUtil.decode(element));
            grid.init();
            grid.solve(true);
            postMessage(grid.solveTime);
        });
    } else {
        let total = 0;
        let grids = event.data.grids;
        let length = grids.length;
        for (let i = 0; i < length; i++) {
            grid.load(sudokuUtil.decode(grids[i]));
            grid.init();
            grid.solve(true);
            total += grid.solveTime;
        }
        postMessage(total)
    }
}
