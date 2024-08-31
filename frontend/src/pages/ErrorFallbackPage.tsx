import {useRouteError, Link} from "react-router-dom";
import {ExclamationCircleIcon, QuestionMarkCircleIcon} from "@heroicons/react/24/outline";
import {processError} from "../utils/utils.ts";

export function ErrorFallbackPage() {
    const error = useRouteError();

    const is404 = !error;
    const title = is404 ? "Page not found" : "An error occurred";
    const processedError = processError(error);
    const detail = is404
        ? "The page you're looking for doesn't exist."
        : processedError.detail;

    const Icon = is404 ? QuestionMarkCircleIcon : ExclamationCircleIcon;
    const iconColor = is404 ? "text-blue-400" : "text-red-400";

    return (
        <div className="flex items-center justify-center h-dvh bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-6 sm:p-10 bg-white shadow-lg rounded-xl">
                <div className="text-center">
                    <Icon className={`mx-auto h-12 w-12 ${iconColor}`}/>
                    <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900">{title}</h2>
                    <p className="mt-2 text-sm text-gray-600">{detail}</p>
                </div>
                <div className="mt-8">
                    <Link
                        to="/"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
