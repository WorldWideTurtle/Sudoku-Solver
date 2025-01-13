import "./dialog.css"
import { useShallow } from "zustand/react/shallow";
import { useDialog } from "../zustand/useDialog";
import { MouseEvent, useCallback, useEffect, useRef } from "react";
import { ReactComponent as CloseIcon } from "../icons/close.svg"

export function Dialog() {
    const [isOpen,dialogContent, closeDialog] = useDialog(useShallow((state)=>[state.isDialogOpen, state.dialogContent, state.closeDialog]))

    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(()=>{
        if (dialogRef.current) {
            if (isOpen) {
                dialogRef.current.show();
            } else {
                dialogRef.current.close();
            }
        }
    }, [isOpen])

    const boundsCheck = useCallback((e : MouseEvent) => {
        if (e.target) {
            const element = e.target as HTMLElement;
            if (element.id === "DIALOG_INTERNAL_CLICKAREA") {
                closeDialog();
            }
        }
    }, [closeDialog])

    return (
        <dialog ref={dialogRef} onClose={closeDialog} className="w-full h-full m-0 max-w-full max-h-full bg-black/40 z-50">
            <div className="grid place-items-center w-full h-full" id="DIALOG_INTERNAL_CLICKAREA" onClick={boundsCheck}>
                <div id="DIALOG_INTERNAL_BOUNDRY" className="bg-muted dark:border-foreground/10 dark:border-1 border-solid rounded-md dark:shadow-none shadow-sm shadow-foreground overflow-hidden">
                    <div className="flex justify-between">
                        <h2 className="text-lg p-2">Title</h2>
                        <button onClick={closeDialog} className="hover:bg-unsolved dark:hover:bg-transparent p-2 group"><CloseIcon className="fill-foreground dark:group-hover:fill-unsolved group-hover:fill-background" /></button>
                    </div>
                    <hr className="mb-2 border-foreground/20" />
                    <div className="p-2 pt-0">
                        {dialogContent}
                    </div>
                </div>
            </div>
        </dialog>
    )
}