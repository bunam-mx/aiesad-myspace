import { NavLink, useParams } from "react-router-dom";
import { useState } from "react"; // Added useState
import "./HeaderBlock.css";

const HeaderBlock = () => {
  const { userState } = useParams();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // State for dropdown

  return (
    <header>
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <a href={`${import.meta.env.VITE_HOME_URL}`} className="inline-block">
              <img src={`${import.meta.env.VITE_BASE_URL}/images/aiesad-2025.png`} alt="AIESAD 2025" width={260} />
            </a>
          </div>
          <div className="md:col-span-2 content-center">
            <nav className="text-sm">
              <ul>
                <li>
                  <a href={`${import.meta.env.VITE_HOME_URL}`} className="inline-block text-gray-300">
                    <i className="fas fa-home"></i> {/* Ensure className is used for FontAwesome if that's the intention */}
                  </a>
                </li>
                <li>
                  <NavLink
                    to={`${import.meta.env.VITE_BASE_URL}/user/agenda`}
                    className={({ isActive }) =>
                      (userState === "agenda" || isActive) ? "text-gray-300 active" : "text-gray-300"
                    }
                  >
                    programa
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`${import.meta.env.VITE_BASE_URL}/user/proposal`}
                    className={({ isActive }) =>
                      (userState === "proposal" || isActive) ? "text-gray-300 active" : "text-gray-300"
                    }
                  >
                    mis propuestas
                  </NavLink>
                </li>
                {/* Profile Dropdown Start */}
                <li className="relative"> {/* Added relative for dropdown positioning */}
                  <button
                    type="button"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsProfileDropdownOpen(false), 150)} // Close on blur with a small delay
                    className={`text-gray-300 focus:outline-none inline-flex items-center ${(userState === "profile" || (typeof window !== 'undefined' && window.location.pathname.includes('/user/profile'))) ? "active" : ""}`}
                  >
                    <i className="fas fa-user text-gray-300 hover:text-blue-600"></i>
                    <span className="ml-1 text-xs">{isProfileDropdownOpen ? '▲' : '▼'}</span> {/* Text-based caret */}
                  </button>
                  {isProfileDropdownOpen && (
                    <ul className="absolute right-0 mt-2 py-1 w-48 bg-gray-800 rounded-md shadow-xl z-20"> {/* Dropdown styles */}
                      <li>
                        <NavLink
                          to={`${import.meta.env.VITE_BASE_URL}/user/profile`}
                          className={({ isActive }) =>
                            `block w-full text-left px-4 py-2 text-sm text-gray-300 ${isActive ? 'font-semibold text-white' : ''}`
                          }
                          onClick={() => setIsProfileDropdownOpen(false)} // Close dropdown on click
                        >
                          editar perfil
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={`${import.meta.env.VITE_BASE_URL}/user/signout`}
                          className={({ isActive }) =>
                            `block w-full text-left px-4 py-2 text-sm text-gray-300 ${isActive ? 'font-semibold text-white' : ''}`
                          }
                          onClick={() => setIsProfileDropdownOpen(false)} // Close dropdown on click
                        >
                          cerrar sesión
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
                {/* Profile Dropdown End - The old "cerrar sesión" li is removed */}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBlock;
