import { NavLink } from "react-router-dom";
import "./HeaderBlock.css";

const HeaderBlock = () => {
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
            <nav>
              <ul>
                <li>
                  <NavLink to="/user/agenda" className="text-gray-300">
                    Mi agenda
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/user/proposal" className="text-gray-300">
                    Mi propuesta
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/user/profile" className="text-gray-300">
                    Mi perfil
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
