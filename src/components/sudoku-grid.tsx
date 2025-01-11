export function SudokuGrid({data} : {data?: number[][]}) {
    if (data === undefined) {
        return null;
    }

    return (
        <div className="grid grid-cols-9 grid-rows-9">
            {data.flat().map((e,i)=>(
                <span key={i} className="flex size-8 items-center justify-center text-lg">{e}</span>
            ))}
        </div>
    );
}