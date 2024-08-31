import React, {forwardRef, ForwardRefRenderFunction} from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const InputComponent: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
    {error, ...props},
    ref,
) => {
    return (
        <div className="mb-4">
            <input
                {...props}
                ref={ref}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export const Input = forwardRef(InputComponent);

Input.displayName = "Input";
