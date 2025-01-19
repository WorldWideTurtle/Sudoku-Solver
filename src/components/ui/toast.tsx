import { useShallow } from "zustand/react/shallow"
import { Toast, ToastKind, useToast } from "../zustand/useToast"
import { Capitalize } from "../../lib/util/StringUitl";
import classNames from "classnames";
import { memo, useEffect, useState } from "react";
import classes from "./toast.module.css"

function SetUnion<T>(a: Set<T>, b: Set<T>) : Set<T> {
    return new Set<T>([...Array.from(a),...Array.from(b)])
}

export function ToastContainer() {
    const [toasts, deleteToast] = useToast(useShallow((state)=>[state.allToasts,state.removeToast]));

    const [deleted, setDeleted] = useState<Set<number>>(new Set());
    const [visuals, setVisuals] = useState<Toast[]>([]);

    const scheduleDelete = (id: number) => {
        setTimeout(()=>{
            setVisuals((state)=>state.filter(e=>e.id !== id))
        },200)
    }

    useEffect(()=>{
        const currentIds = new Set(visuals.map(e=>e.id!));
        deleted.forEach(e=>currentIds.delete(e));
        const newElements = toasts.filter(e=>!currentIds.has(e.id));

        toasts.forEach(e=>{
            currentIds.delete(e.id)
        })

        currentIds.forEach(e=>{
            scheduleDelete(e);
        })

        setVisuals((state)=>[...state,...newElements])
        setDeleted((state)=>SetUnion(state,currentIds));
    }, [toasts])

    return (
        <div className="fixed right-0 bottom-0 p-6 max-w-[450px] w-full flex flex-col gap-2 z-[100] pointer-events-none">
            {visuals.map(e=>(
                <ToastComponent key={e.id!} onClick={()=>deleteToast(e.id!)} toast={e} deleted={deleted.has(e.id!)} />
            ))}
        </div>
    )
}

type ToastConfiguration = {[Key in ToastKind]: {
    classNames: string
}}

const Configurations : ToastConfiguration = {
    error: {
        classNames: "bg-error"
    },
    info: {
        classNames: "bg-info"
    },
    success: {
        classNames: "bg-success"
    },
    warning: {
        classNames: "bg-warning"
    }
}

const ToastComponent = memo(({toast, onClick, deleted} : {toast: Toast, onClick: () => any, deleted: boolean}) => {
    const currentConfiguration = Configurations[toast.type];

    return (
        <div onClick={onClick} className={classNames("w-full pointer-events-auto transition-transform duration-100 h-fit bg-muted rounded-lg overflow-hidden grid grid-cols-[8px_1fr] items-center shadow-sm shadow-foreground dark:shadow-none cursor-pointer",deleted ? (classes.slide_out + " pointer-events-none") : classes.slide_in)}>
            <div className={classNames("h-full",currentConfiguration.classNames)}></div>
            <div className="flex flex-col pl-4 p-2 dark:border-1 border-foreground/10 border-solid dark:border-l-0 rounded-r-lg">
                <h3 className="text-lg font-bold">{Capitalize(toast.type)}</h3>
                <p className="opacity-75 -mt-2">{toast.message}</p>
            </div>
        </div>
    )
}, (prev, next) => prev.toast.id === next.toast.id && prev.deleted === next.deleted)
