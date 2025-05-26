import { NavLink, useParams } from "react-router-dom";
import "./HeaderBlock.css";

const HeaderBlock = () => {
  const { userState } = useParams();
  return (
    <header>
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <NavLink to="/" className="inline-block">
              <img src="/images/aiesad-2025.png" alt="AIESAD 2025" width={260} />
            </NavLink>
          </div>
          <div className="md:col-span-2 content-center">
            <nav className="text-sm">
              <ul>
                <li>
                  <NavLink
                    to="/user/agenda"
                    className={({ isActive }) =>
                      (userState === "agenda" || isActive) ? "text-gray-300 active" : "text-gray-300"
                    }
                  >
                    agenda
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/user/proposal"
                    className={({ isActive }) =>
                      (userState === "proposal" || isActive) ? "text-gray-300 active" : "text-gray-300"
                    }
                  >
                    propuesta
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/user/profile"
                    className={({ isActive }) =>
                      (userState === "profile" || isActive) ? "text-gray-300 active" : "text-gray-300"
                    }
                  >
                    perfil
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/user/signout"
                    className={({ isActive }) =>
                      (userState === "signout" || isActive) ? "text-gray-300 active" : "text-gray-300"
                    }
                  >
                    cerrar sesión
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBlock;
