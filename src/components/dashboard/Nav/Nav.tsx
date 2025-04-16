import { JSX, ReactNode } from "react";
import { NavLink, NavLinkRenderProps } from "react-router-dom";

const navLinks: { id: number; name: string; path: string; icon?: ReactNode }[] =
  [
    {
      id: 1,
      name: "Главная",
      path: "home",
      icon: (
        <svg
          className="h-8 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            d="M80 212v236a16 16 0 0 0 16 16h96V328a24 24 0 0 1 24-24h80a24 24 0 0 1 24 24v136h96a16 16 0 0 0 16-16V212"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          ></path>
          <path
            d="M480 256L266.89 52c-5-5.28-16.69-5.34-21.78 0L32 256"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          ></path>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M400 179V64h-48v69"
          ></path>
        </svg>
      ),
    },
    {
      id: 2,
      name: "Моя карьера",
      path: "career",
      icon: (
        <svg
          className="h-8 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            d="M344 144c-3.92 52.87-44 96-88 96s-84.15-43.12-88-96c-4-55 35-96 88-96s92 42 88 96z"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          ></path>
          <path
            d="M256 304c-87 0-175.3 48-191.64 138.6C62.39 453.52 68.57 464 80 464h352c11.44 0 17.62-10.48 15.65-21.4C431.3 352 343 304 256 304z"
            fill="none"
            stroke="currentColor"
            stroke-miterlimit="10"
            stroke-width="32"
          ></path>
        </svg>
      ),
    },
    {
      id: 3,
      name: "Мои достижения",
      path: "achievements",
      icon: (
        <svg
          className="h-8 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <circle
            cx="256"
            cy="352"
            r="112"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          ></circle>
          <circle
            cx="256"
            cy="352"
            r="48"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          ></circle>
          <path
            d="M147 323L41.84 159.32a32 32 0 0 1-1.7-31.61l31-62A32 32 0 0 1 99.78 48h312.44a32 32 0 0 1 28.62 17.69l31 62a32 32 0 0 1-1.7 31.61L365 323"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          ></path>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M371 144H37"
          ></path>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M428.74 52.6L305 250"
          ></path>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M140.55 144L207 250"
          ></path>
        </svg>
      ),
    },
    {
      id: 4,
      name: "Мои стажеры",
      path: "interns",
      icon: (
        <svg
          className="h-8 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            d="M402 168c-2.93 40.67-33.1 72-66 72s-63.12-31.32-66-72c-3-42.31 26.37-72 66-72s69 30.46 66 72z"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          ></path>
          <path
            d="M336 304c-65.17 0-127.84 32.37-143.54 95.41c-2.08 8.34 3.15 16.59 11.72 16.59h263.65c8.57 0 13.77-8.25 11.72-16.59C463.85 335.36 401.18 304 336 304z"
            fill="none"
            stroke="currentColor"
            stroke-miterlimit="10"
            stroke-width="32"
          ></path>
          <path
            d="M200 185.94c-2.34 32.48-26.72 58.06-53 58.06s-50.7-25.57-53-58.06C91.61 152.15 115.34 128 147 128s55.39 24.77 53 57.94z"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          ></path>
          <path
            d="M206 306c-18.05-8.27-37.93-11.45-59-11.45c-52 0-102.1 25.85-114.65 76.2c-1.65 6.66 2.53 13.25 9.37 13.25H154"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-miterlimit="10"
            stroke-width="32"
          ></path>
        </svg>
      ),
    },
  ];

const sdoLinks: { id: number; name: string; path: string; icon?: ReactNode }[] =
  [
    {
      id: 1,
      name: "База знаний",
      path: "knowledge",
      icon: (
        <svg
          className="h-8 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <rect
            x="32"
            y="96"
            width="64"
            height="368"
            rx="16"
            ry="16"
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="32"
          ></rect>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M112 224h128"
          ></path>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M112 400h128"
          ></path>
          <rect
            x="112"
            y="160"
            width="128"
            height="304"
            rx="16"
            ry="16"
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="32"
          ></rect>
          <rect
            x="256"
            y="48"
            width="96"
            height="416"
            rx="16"
            ry="16"
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="32"
          ></rect>
          <path
            d="M422.46 96.11l-40.4 4.25c-11.12 1.17-19.18 11.57-17.93 23.1l34.92 321.59c1.26 11.53 11.37 20 22.49 18.84l40.4-4.25c11.12-1.17 19.18-11.57 17.93-23.1L445 115c-1.31-11.58-11.42-20.06-22.54-18.89z"
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="32"
          ></path>
        </svg>
      ),
    },
    {
      id: 2,
      name: "Мое обучение",
      path: "education",
      icon: (
        <svg
          className="h-8 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            d="M256 160c16-63.16 76.43-95.41 208-96a15.94 15.94 0 0 1 16 16v288a16 16 0 0 1-16 16c-128 0-177.45 25.81-208 64c-30.37-38-80-64-208-64c-9.88 0-16-8.05-16-17.93V80a15.94 15.94 0 0 1 16-16c131.57.59 192 32.84 208 96z"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          ></path>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M256 160v288"
          ></path>
        </svg>
      ),
    },
    {
      id: 3,
      name: "ЕДО",
      path: "edo",
      icon: (
        <svg
          className="h-8 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <rect
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="32"
            x="48"
            y="80"
            width="416"
            height="384"
            rx="48"
          ></rect>
          <circle cx="296" cy="232" r="24" fill="currentColor"></circle>
          <circle cx="376" cy="232" r="24" fill="currentColor"></circle>
          <circle cx="296" cy="312" r="24" fill="currentColor"></circle>
          <circle cx="376" cy="312" r="24" fill="currentColor"></circle>
          <circle cx="136" cy="312" r="24" fill="currentColor"></circle>
          <circle cx="216" cy="312" r="24" fill="currentColor"></circle>
          <circle cx="136" cy="392" r="24" fill="currentColor"></circle>
          <circle cx="216" cy="392" r="24" fill="currentColor"></circle>
          <circle cx="296" cy="392" r="24" fill="currentColor"></circle>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="32"
            stroke-linecap="round"
            d="M128 48v32"
          ></path>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="32"
            stroke-linecap="round"
            d="M384 48v32"
          ></path>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="32"
            d="M464 160H48"
          ></path>
        </svg>
      ),
    },
  ];

function Nav({ className = "" }: { className?: string }): JSX.Element {
  return (
    <nav
      className={"flex flex-col w-xs pt-20 px-6 pb-6" + className}
      style={{ backgroundColor: "#E6D2C0FF" }}
    >
      {navLinks.map(
        ({ id, name, path, icon }): JSX.Element => (
          <NavLink
            key={id}
            to={path}
            className={({ isActive }: NavLinkRenderProps): string =>
              isActive
                ? "inline-flex items-center px-1 pt-1 font-medium leading-5 text-gray-900 focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out"
                : "inline-flex items-center px-1 pt-1 font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
            }
          >
            {icon} {name}
          </NavLink>
        )
      )}

      <hr className="my-2.5 border-t-2 border-dashed border-gray-500" />

      <p className="mb-2.5 text-xl font-bold text-center text-gray-500">
        Корпоративный университет
      </p>

      {sdoLinks.map(
        ({ id, name, path, icon }): JSX.Element => (
          <NavLink
            key={id}
            to={path}
            className={({ isActive }: NavLinkRenderProps): string =>
              isActive
                ? "inline-flex items-center px-1 pt-1 font-medium leading-5 text-gray-900 focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out"
                : "inline-flex items-center px-1 pt-1 font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
            }
          >
            {icon} {name}
          </NavLink>
        )
      )}
    </nav>
  );
}

export default Nav;
