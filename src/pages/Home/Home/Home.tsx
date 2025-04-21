import { JSX } from "react";
import style from "./Home.module.css";
import Info from "../../../components/home/Info/Info.tsx";
import { useGetUserByDataQuery } from "../../../features/user/user.ts";

function Home(): JSX.Element {
  const { data, error, isLoading } = useGetUserByDataQuery("me");

  function getName(user: string): string {
    return user.split(" ")[1];
  }

  return (
    <>
      <div>
        {error ? (
          <>Ошибка получения данных</>
        ) : isLoading ? (
          <>Загрузка...</>
        ) : data ? (
          <>
            <Info
              className={style.info}
              date="Date"
              name={getName(data.name)}
              department={data.department}
              description={data.description}
            />
          </>
        ) : null}
      </div>
    </>
  );
}

export default Home;
