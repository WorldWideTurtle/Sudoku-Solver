export function SudokuGrid({data} : {data?: Uint8Array[][]}) {
    if (data === undefined) {
        return null;
    }

    const objects = [];

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            objects.push(<span key={i*9 + j} className="flex size-8 items-center justify-center text-lg">{data[i][j]}</span>)
        }
    }

    return (
        <div className="grid grid-cols-9 grid-rows-9">
            {objects}
        </div>
    );
}