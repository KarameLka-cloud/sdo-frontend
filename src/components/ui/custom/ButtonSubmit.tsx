import { JSX } from "react";

interface ButtonSubmitType {
  children: string;
  loading?: boolean;
  className?: string;
}

function ButtonSubmit({
  children,
  loading,
  className,
}: ButtonSubmitType): JSX.Element {
  return (
    <button
      type="submit"
      className={
        loading
          ? `flex w-fit min-h-9 items-center justify-center gap-1.5 px-5 py-2.5 border-0 rounded-md bg-gray-500 text-white cursor-wait ${className || ""}`
          : `flex w-fit min-h-9 items-center justify-center gap-1.5 px-5 py-2.5 border-0 rounded-md bg-green-600 text-white text-sm font-medium text-center uppercase tracking-wide cursor-pointer transition-all duration-200 hover:bg-green-700 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${className || ""}`
      }
      disabled={loading}
    >
      {loading ? (
        <div className="inline-block w-3 h-3 mx-2 border-[3px] border-white border-b-black rounded-full animate-spin"></div>
      ) : (
        <div>{children}</div>
      )}
    </button>
  );
}

export default ButtonSubmit;
