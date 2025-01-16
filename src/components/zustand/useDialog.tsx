import { ReactNode } from "react";
import { create } from "zustand";

type DialogOptions = {
    title: string
    content: ReactNode
}

type UseDialogStore = {
    options: DialogOptions
    isDialogOpen: boolean
    showDialog: (options: DialogOptions) => any
    closeDialog: () => any
}

const baseOptions : DialogOptions = {
    title: "",
    content: undefined
}

export const useDialog = create<UseDialogStore>((set)=>({
    options: baseOptions,
    isDialogOpen: false,
    showDialog: (options: DialogOptions) => {
        set({
            isDialogOpen: true,
            options: options
        })
    },
    closeDialog: () => {
        set({
            isDialogOpen: false,
            options: baseOptions
        })
    }
}))