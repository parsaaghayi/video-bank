import { toast } from "react-toastify"

export enum ToastType {
    success = 'success',
    warning = 'warning',
    error = 'error',
}

export const notify = (text:string , type:ToastType) => {
    if(type === "success") { 
        toast.success(text , {
            theme : "colored"
        })
    } else if( type === "error") {
        toast.error(text , {
            theme : "colored"
        })
    } else if(type === 'warning') {
        toast.warn(text , {
            theme : "colored"
        })
    }
}