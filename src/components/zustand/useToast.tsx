import { create } from "zustand";

export type ToastKind = "info" | "error" | "success" | "warning"
export type Toast = {
    type: ToastKind,
    message: string,
    id?: number
}

type ToastInternal = Toast & {id:number}

type UseToastStore = {
    allToasts: ToastInternal[]
    addToast: (toast: Toast) => void
    removeToast: (id: number) => void
}

export const useToast = create<UseToastStore>((set) => ({
    allToasts: [],
    addToast: (toast: Toast) => {
        const id = Math.random() * 1e12;
        toast.id = id;

        setTimeout(()=>{
            set((state)=>({
                allToasts: state.allToasts.filter(toastElement=>toastElement.id!==id)
            }))
        }, 5000)

        set((state)=>({
            allToasts: [
                ...state.allToasts,
                toast as ToastInternal
            ]
        }))
    },
    removeToast: (id: number) => {
        set((state)=>({
            allToasts: state.allToasts.filter(toastElement=>toastElement.id!==id)
        }))
    }
}))