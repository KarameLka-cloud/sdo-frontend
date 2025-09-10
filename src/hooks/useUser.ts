import {useState, useEffect} from "react";
import {UserType} from "../interfaces/api/UserType.ts";
import {LOCAL_STORAGE_NAMES} from "../constants/api.ts";

export const useUser = () => {
    const [user, setUser] = useState<UserType>({});

    useEffect(() => {
        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_NAMES.USER);
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
