import { JSX } from "react";
import style from "./Home.module.css";
import Info from "../../../components/home/Info/Info.tsx";
// import { useSelector, useDispatch } from "react-redux";
// import { increment, decrement } from "../../../features/user/userSlice.ts";

function Home(): JSX.Element {
  // const dispatch = useDispatch();
  // const user = useSelector((state) => state);

  // useEffect(() => {
  //   dispatch(getUser());
  // }, [dispatch]);

  // console.log(user);

  // const value = useSelector((state) => state.value.value);
  // const dispatch = useDispatch();

  return (
    <>
      <Info className={style.info} />
      {/* <div>{value}</div> */}
      {/* <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button> */}
    </>
  );
}

export default Home;
