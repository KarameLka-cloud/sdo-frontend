import { ChangeEvent, JSX, useState } from "react";
import { UserType } from "@/interfaces/api/UserType.ts";
import Input from "@/components/ui/custom/Input";
import User from "@/components/ui/custom/User";
import Loader from "@/components/ui/custom/Loader";
import DataMessage from "@/components/ui/custom/DataMessage";
import { useFiltered } from "@/hooks/useFiltered.ts";
import { useGetUsersQuery } from "@/services/store/features/user.ts";
import OverflowScrollBlock from "@/components/ui/custom/OverflowScrollBlock";
import { isUserInRole, USER_ROLES } from "@/constants/roles.ts";

type UsersTab = "users" | "admins" | "mentors" | "department_heads";

function Users(): JSX.Element {
  const { data, error, isLoading } = useGetUsersQuery("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<UsersTab>("users");
  const hasSearch = search.trim().length > 0;
  const filteredUsers = useFiltered<UserType>(data, search);

  // Фильтруем администраторов (ADMIN)
  const admins =
    data?.filter((user: UserType) => isUserInRole(user, USER_ROLES.ADMIN)) ||
    [];
  const filteredAdmins = useFiltered<UserType>(admins, search);

  // Фильтруем кураторов/наставников (MENTOR)
  const curators =
    data?.filter((user: UserType) => isUserInRole(user, USER_ROLES.MENTOR)) ||
    [];
  const filteredCurators = useFiltered<UserType>(curators, search);

  // Фильтруем начальников отделов (DEPARTMENT_HEAD)
  const heads =
    data?.filter((user: UserType) =>
      isUserInRole(user, USER_ROLES.DEPARTMENT_HEAD),
    ) || [];
  const filteredHeads = useFiltered<UserType>(heads, search);

  const renderContent = (
    items: UserType[] | undefined,
    emptyMessage: string,
  ) => {
    if (error) return <DataMessage type={"error"} />;
    if (isLoading) return <Loader />;
    if (items && items.length > 0) {
      return items.map((item: UserType) => (
        <User key={item.id} user={item} className="mt-3" />
      ));
    }
    if (hasSearch) {
      return (
        <p className="mx-auto mt-4 w-fit py-3 px-4 border border-gray-300 rounded-xl bg-slate-50 text-gray-600 text-center">
          {emptyMessage}
        </p>
      );
    }
    return <DataMessage type={"noData"} />;
  };

  return (
    <OverflowScrollBlock>
      {/* Tabs */}
      <div className="flex items-center w-full gap-0 mb-5 border-b border-gray-300 sticky top-0 bg-white z-10">
        <button
          type="button"
          className={`flex-1 py-3.5 px-4 border-none border-b-[0.15rem] border-transparent bg-transparent text-gray-600 text-[0.95rem] font-semibold leading-tight text-center cursor-pointer transition-all duration-200 hover:text-gray-800 ${
            activeTab === "users" ? "text-blue-700 border-b-blue-700" : ""
          }`}
          onClick={() => setActiveTab("users")}
        >
          Все пользователи
        </button>
        <button
          type="button"
          className={`flex-1 py-3.5 px-4 border-none border-b-[0.15rem] border-transparent bg-transparent text-gray-600 text-[0.95rem] font-semibold leading-tight text-center cursor-pointer transition-all duration-200 hover:text-gray-800 ${
            activeTab === "admins" ? "text-blue-700 border-b-blue-700" : ""
          }`}
          onClick={() => setActiveTab("admins")}
        >
          Администраторы
        </button>
        <button
          type="button"
          className={`flex-1 py-3.5 px-4 border-none border-b-[0.15rem] border-transparent bg-transparent text-gray-600 text-[0.95rem] font-semibold leading-tight text-center cursor-pointer transition-all duration-200 hover:text-gray-800 ${
            activeTab === "department_heads"
              ? "text-blue-700 border-b-blue-700"
              : ""
          }`}
          onClick={() => setActiveTab("department_heads")}
        >
          Руководители отделов
        </button>
        <button
          type="button"
          className={`flex-1 py-3.5 px-4 border-none border-b-[0.15rem] border-transparent bg-transparent text-gray-600 text-[0.95rem] font-semibold leading-tight text-center cursor-pointer transition-all duration-200 hover:text-gray-800 ${
            activeTab === "mentors" ? "text-blue-700 border-b-blue-700" : ""
          }`}
          onClick={() => setActiveTab("mentors")}
        >
          Наставники
        </button>
      </div>

      {/* Search Container */}
      <div className="bg-white pb-4 z-9 relative">
        <Input
          type={"text"}
          name={"search"}
          placeholder={"Поиск"}
          className="w-full p-2.5 shadow-sm"
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>): void =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* Content */}
      <div className="max-h-[calc(100vh-280px)] overflow-y-auto pt-0">
        {activeTab === "users" &&
          renderContent(filteredUsers, `Пользователь "${search}" не найден`)}

        {activeTab === "admins" &&
          renderContent(filteredAdmins, `Администратор "${search}" не найден`)}

        {activeTab === "mentors" &&
          renderContent(filteredCurators, `Наставник "${search}" не найден`)}

        {activeTab === "department_heads" &&
          renderContent(
            filteredHeads,
            `Руководитель отдела "${search}" не найден`,
          )}
      </div>
    </OverflowScrollBlock>
  );
}

export default Users;
