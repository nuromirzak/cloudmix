import {create} from "zustand";
import {User, UserSchema} from "../types";
import {z} from "zod";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";

const AuthStateSchema = z.object({
    user: UserSchema.nullable(),
});
type AuthState = z.infer<typeof AuthStateSchema>;

type AuthActions = {
    setUser: (user: User | null) => void
    logout: () => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        immer((set) => {
            return {
                user: null,
                setUser: (user) => {
                    set((state) => {
                        state.user = user;
                    });
                },
                logout: () => {
                    set((state) => {
                        state.user = null;
                    });
                },
            };
        }),
        {
            name: "auth",
        },
    ),
);
