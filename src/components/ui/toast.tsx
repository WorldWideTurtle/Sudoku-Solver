import { useShallow } from "zustand/react/shallow"
import { Toast, ToastKind, useToast } from "../zustand/useToast"
import { Capitalize } from "../../lib/util/StringUitl";
import classNames from "classnames";
import { memo } from "react";

export function ToastContainer() {
    const [toasts, deleteToast] = useToast(useShallow((state)=>[state.allToasts,state.removeToast]));

    return (
        <div className="fixed right-0 bottom-0 p-6 max-w-[450px] w-full flex flex-col gap-2 z-[100]">
            {toasts.map((e,i)=>(
                <ToastComponent key={i} onClick={()=>deleteToast(e.id)} toast={e} />
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

const ToastComponent = memo(({toast, onClick} : {toast: Toast, onClick: () => any}) => {
    const currentConfiguration = Configurations[toast.type];

    return (
        <div onClick={onClick} className="w-full h-fit bg-muted rounded-lg overflow-hidden grid grid-cols-[8px_1fr] items-center shadow-sm shadow-foreground dark:shadow-none cursor-pointer">
            <div className={classNames("h-full",currentConfiguration.classNames)}></div>
            <div className="flex flex-col pl-4 p-2 dark:border-1 border-foreground/10 border-solid dark:border-l-0 rounded-r-lg">
                <h3 className="text-lg font-bold">{Capitalize(toast.type)}</h3>
                <p className="opacity-75 -mt-2">{toast.message}</p>
            </div>
        </div>
    )
}, (prev, next) => prev.toast.id === next.toast.id)
