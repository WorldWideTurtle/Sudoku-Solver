export const standardDisplayer = (list: Record<string,string[]>) => {
    const displayList : [string,string[]][] = [];
    for (const group of Object.keys(list)) {
        displayList.push([group,list[group]])
    }
    return displayList;
}

export const standartFlattener = (list: Record<string,string[]>) => {
    const flattenedList: string[] = [];
    for (const group of Object.keys(list)) {
        flattenedList.push.apply(flattenedList,list[group])
    }
    return flattenedList;
}