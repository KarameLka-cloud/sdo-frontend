import { JSX } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import LogoLink from "../../ui/LogoLink/LogoLink.tsx";
import LogoutButton from "../../ui/LogoutButton/LogoutButton.tsx";
import { logout } from "../../../services/auth.ts";

function Header({ className = "" }: { className?: string }): JSX.Element {
  const navigate: NavigateFunction = useNavigate();

  const handleLogout: (e: {
    preventDefault: () => void;
  }) => Promise<void> = async (e: {
    preventDefault: () => void;
  }): Promise<void> => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const result: { success: boolean } = await logout();
    if (result.success) {
      navigate("login");
    } else {
      navigate("login");
    }
  };

  return (
    <div className={"w-full h-13 py-2 bg-gray-50 " + className}>
      <div className="flex items-center justify-between w-7xl h-full mx-auto px-4">
        <LogoLink href="/" className="h-full" />
        <div className="flex items-center">
          <div className="mr-5 text-sm text-gray-700">Иванов Иван Иванович</div>
          <LogoutButton className="h-5" onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
}

export default Header;
