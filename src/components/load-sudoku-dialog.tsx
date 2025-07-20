import { type ChangeEvent, type FormEvent, useState } from "react"
import { sudokuUtil } from "../lib/util/sudokuUtil";
import { useDialog } from "./zustand/useDialog";
import { useToast } from "./zustand/useToast";
import { useSolverZustand } from "./zustand/useSolver";
import classNames from "classnames";

export function LoadSudokuDialog() {
    const closeDialog = useDialog(state => state.closeDialog);
    const loadGrid = useSolverZustand(state => state.loadGrid);
    const addToast = useToast(state=>state.addToast);
    const [input, setInput] = useState("");
    const [errors, setErrors] = useState<string[]>([]);

    function nomalizeString(input: string) {
        const normalized = input.replaceAll(".","0").substring(0,81);
        const padded = normalized + ((input.length < 81) ? "0".repeat(81 - input.length) : "");
        return padded;
    }

    function onSubmit(e : FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let errors = [];
        
        if (input.length > 81) {
            errors.push(`Your text is too long. Currently ${input.length - 81} Characters too many.`)
        }

        const clues = input.match(/[1-9]/g)
        if (!clues) {
            errors.push(`Your text contains no clues.`)
        }

        // eslint-disable-next-line no-useless-escape
        const invalidCharacters = input.match(/[^\d^\.]/g)
        if (invalidCharacters) {
            errors.push("Your text contains invalid characters: " + Array.from((new Set(invalidCharacters))).join(","))
        }

        const normalized = nomalizeString(input)
        if (invalidCharacters || !sudokuUtil.isValid(normalized)) {
            errors.push("This board configuration is invalid.")
        }

        if (errors.length > 0) {
            setErrors(errors);
            addToast({type:"error", message: "Invalid input, try again."})
        } else {
            loadGrid(normalized);
            addToast({type:"success", message: "Loaded board."})

            // No clues would lead to an error, they are not undefined if reached here.
            if (clues!.length < 17) {
                addToast({type:"info", message: "Less than 17 clues, board has multiple solutions."})
            }
            closeDialog();
        }
    }

    function onInput(e:ChangeEvent<HTMLInputElement>) {
        setInput(e.target.value);
    }

    return (
        <form onSubmit={onSubmit} className="p-2">
            <div className="flex flex-col gap-1">
                <label htmlFor="SUDOKU_INPUT">Write the code</label>
                <p className="opacity-70 text-sm max-w-[450px]">You may only use numbers, represent empty cells as either 0 or as a ".", and go from left to right, row by row.</p>
                <input name="input" onChange={onInput} defaultValue={input} id="SUDOKU_INPUT" autoComplete="off" className="rounded-md p-2 shadow-sm shadow-foreground dark:shadow-none dark:border border-solid border-foreground/10 bg-popover placeholder:text-foreground/40" type="text" placeholder="0214000..." required/>
            </div>
            {errors.length ? 
                <ul>
                    {errors.map((e,i)=>(
                        <li key={i} className="text-error">{e}</li>
                    ))}
                </ul>
            : ""}
            <hr className="border-popover my-2"/>
            <div className="flex flex-row-reverse">
                <button disabled={input.length === 0} className={classNames("bg-foreground text-background rounded-sm dark:border border-foreground/10 border-solid p-2 hover:bg-foreground/80 transition-[background] duration-75", (input.length === 0) && "opacity-65 pointer-events-none")}>Submit</button>
            </div>
        </form>     
    )
}