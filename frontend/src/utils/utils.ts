import {CustomErrorResponse, IAlertInfo} from "../types";
import axios from "axios";

export const processError = (e: unknown): IAlertInfo => {
    let errorTitle = "Unknown error";
    let errorDetail = "An error occurred";

    if (axios.isAxiosError<CustomErrorResponse>(e)) {
        errorTitle = e.response?.data.title ?? e.name;
        errorDetail = e.response?.data.detail ?? e.message;
    } else if (e instanceof Error) {
        errorTitle = e.name;
        errorDetail = e.message;
    } else {
        console.error("Caught a non-JavaScript error:", e);
    }

    return {
        error: true,
        title: errorTitle,
        detail: errorDetail,
    };
};
