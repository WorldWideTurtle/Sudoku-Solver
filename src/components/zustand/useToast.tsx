import { create } from "zustand";

export type ToastKind = "info" | "error" | "success" | "warning"
export type Toast = {
    type: ToastKind,
    message: string,
    id?: number,
    count?: number
}

type ToastInternal = Toast & {id:number}

type UseToastStore = {
    allToasts: ToastInternal[]
    addToast: (toast: Toast) => void
    removeToast: (id: number) => void
    timeOutIds: {id: number, timeOut: NodeJS.Timeout}[]
}

export const useToast = create<UseToastStore>((set) => ({
    allToasts: [],
    timeOutIds: [],
    addToast: (toast: Toast) => {
        const id = performance.now();
        toast.id = id;

        const timeout = setTimeout(()=>{
            set((state)=>({
                allToasts: state.allToasts.filter(toastElement=>toastElement.id!==id)
            }))
        }, 5000)

        set((state)=>({
            allToasts: [
                ...state.allToasts,
                toast as ToastInternal
            ],
            timeOutIds: [
                ...state.timeOutIds,
                {id: id, timeOut: timeout}
            ]
        }))
    },
    removeToast: (id: number) => {
        set((state)=>({
            allToasts: state.allToasts.filter(toastElement=>toastElement.id!==id)
        }))
    }
}))