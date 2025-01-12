export function Chunk<T extends any[]>(arr : T, size: number) : T[][] {
    if (size <= 0) throw new Error("Chunk() : size can not be less than 1")
    if (~~size !== size) throw new Error("Chunk() : size has to be an integer")
    const returnArray: T[][] = [];
    const chunkCount = arr.length / size;
    for (let i = 0; i < chunkCount; i++) {
        if (i * size > arr.length) {
            returnArray.push(arr.slice(i*size))
        } else {
            returnArray.push(arr.slice(i*size, (i + 1)*size))
        }
    }

    return returnArray;
}