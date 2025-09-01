import {useState, useEffect} from "react";
import {UserType} from "../types/api/UserType.ts";

export const useUser = () => {
    const [user, setUser] = useState<UserType>({});

    useEffect(() => {
        try {
            const stored = localStorage.getItem("user");
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch {
            setUser({});
        }
    }, []);

    return {
        name: user.name || "",
        department: user.department || "",
        description: user.description || "",
        role: user.role || "",
        role_name: user.role_name || "",
    };
};
