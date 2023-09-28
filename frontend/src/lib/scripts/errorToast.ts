import type { StatusResponse } from "$common/models/responseTypes";
import type { ToastSettings, ToastStore } from "@skeletonlabs/skeleton";

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
    return (status: StatusResponse) => {
        showErrorToast(status.status, toastStore);
    };
}