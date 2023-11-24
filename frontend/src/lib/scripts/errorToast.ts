import type { ToastSettings, ToastStore } from "@skeletonlabs/skeleton";
import type { ErrorResponse } from "backend/src/helperTypes";

export function showErrorToast(message: string, toastStore: ToastStore) {
    const t: ToastSettings = {
        background: 'variant-filled-error',
        hideDismiss: true,
        timeout: 5000,
        message
    };
    toastStore.trigger(t);
}

export function showApiErrorToast(toastStore: ToastStore) {
    return ({ error }: ErrorResponse<string>) => {
        showErrorToast(error, toastStore);
    };
}