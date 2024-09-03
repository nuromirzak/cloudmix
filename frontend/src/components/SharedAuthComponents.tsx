import React from "react";
import {Link} from "react-router-dom";

interface AuthFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode;
}

export const AuthFormContainer: React.FC<AuthFormProps> = ({onSubmit, children}) => {
    return (
        <div className="h-dvh flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <form className="space-y-6" onSubmit={onSubmit}>
                    {children}
                </form>
            </div>
        </div>
    );
};

interface AuthHeaderProps {
    title: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({title}) => {
    return (
        <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {title}
            </h2>
        </div>
    );
};

interface AuthSubmitButtonProps {
    label: string;
    disabled?: boolean;
}

export const AuthSubmitButton: React.FC<AuthSubmitButtonProps> = ({label, disabled}) => {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            {label}
        </button>
    );
};

interface AuthLinkProps {
    text: string;
    linkText: string;
    to: string;
}

export const AuthLink: React.FC<AuthLinkProps> = ({text, linkText, to}) => {
    return (
        <div className="text-sm text-center mt-6">
            <p className="text-gray-600">
                {text}{" "}
                <Link to={to} className="font-medium text-indigo-600 hover:text-indigo-500">
                    {linkText}
                </Link>
            </p>
        </div>
    );
};
