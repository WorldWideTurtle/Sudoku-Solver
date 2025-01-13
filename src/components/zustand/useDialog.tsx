import { ReactNode } from "react";
import { create } from "zustand";

type UseDialogStore = {
    dialogContent: ReactNode
    isDialogOpen: boolean
    showDialog: (content : ReactNode) => any
    closeDialog: () => any
}

export const useDialog = create<UseDialogStore>((set)=>({
    dialogContent: undefined,
    isDialogOpen: false,
    showDialog: (content: ReactNode) => {
        set({
            isDialogOpen: true,
            dialogContent: content
        })
    },
    closeDialog: () => {
        set({
            isDialogOpen: false,
            dialogContent: null
        })
    }
}))