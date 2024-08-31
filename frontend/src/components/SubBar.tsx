import React from "react";

interface Props {
    children: React.ReactNode;
}

export function SubBar({children}: Props) {
    return <div className="p-4 bg-white border-b border-gray-200 h-20 flex items-center">
        {children}
    </div>;
}
