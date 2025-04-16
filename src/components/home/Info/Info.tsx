import { JSX } from "react";

function Info({ className = "" }: { className?: string }): JSX.Element {
  return (
    <div
      className={"relative px-10 py-5 border-2 rounded-4xl " + className}
      style={{ borderColor: "#D2AE8EFF" }}
    >
      <div className="text-lg">Date</div>
      <div className="pt-5 text-2xl font-semibold">Привет, Name</div>
      <div className="pt-7 text-lg">Department</div>
      <div className="text-xl">Description</div>
      <img
        className="absolute right-10 bottom-0 h-64"
        src="/src/assets/images/my_info.png"
        alt=""
      />
    </div>
  );
}

export default Info;
