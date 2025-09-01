import {useState, useEffect} from "react";

interface User {
    department?: string;
    description?: string;
    name?: string;
    role?: string;
    role_name?: string;
}

export const useUser = () => {
    const [user, setUser] = useState<User>({});

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
        department: user.department || "",
        description: user.description || "",
        name: user.name || "",
        role: user.role || "",
        role_name: user.role_name || "",
    };
};
