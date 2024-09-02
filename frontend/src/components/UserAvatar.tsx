import {UserResponse} from "../types";
import {clsx} from "clsx";

interface UserAvatarProps {
    user: UserResponse;
}

const getColorClass = (letter: string) => {
    const colors = [
        "bg-blue-600",
        "bg-red-600",
        "bg-green-600",
        "bg-yellow-500",
        "bg-indigo-600",
        "bg-purple-600",
        "bg-pink-600",
        "bg-orange-500",
        "bg-rose-600",
        "bg-violet-600",
    ];
    const index = letter.toLowerCase().charCodeAt(0) % colors.length;
    return colors[index];
};

export const UserAvatar = ({user}: UserAvatarProps) => {
    const firstLetter = user.username.charAt(0).toUpperCase();
    const colorClass = getColorClass(firstLetter);

    return (
        <div
            className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold",
                colorClass,
                {hidden: !user},
            )}
        >
            {firstLetter}
        </div>
    );
};
