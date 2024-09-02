import React, {forwardRef, ForwardRefRenderFunction, useState} from "react";
import {EyeIcon, EyeSlashIcon} from "@heroicons/react/20/solid";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    isPassword?: boolean;
}

const InputComponent: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
    {error, isPassword = false, ...props},
    ref,
) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="mb-4">
            <div className="relative">
                <input
                    {...props}
                    ref={ref}
                    type={isPassword ? (showPassword ? "text" : "password") : props.type}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    style={{paddingRight: isPassword ? "2.5rem" : undefined}}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400"/>
                        ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400"/>
                        )}
                    </button>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export const Input = forwardRef(InputComponent);

Input.displayName = "Input";
