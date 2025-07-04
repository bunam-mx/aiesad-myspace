import { useParams, NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const Activate = () => {
  const { userHash } = useParams();
  const [data, setData] = useState(null);
  const activateCount = useRef(0);

  useEffect(() => {
    if (userHash !== undefined) {
      let options = {
        method: "POST",
        body: JSON.stringify({
          hash: userHash,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const fetchData = async () => {
        try {
          const response = await fetch(
            `${API_URL}/api/users/activate`,
            options
          );
          const result = await response.json();
          if (activateCount.current === 0) {
            setData(result);
            activateCount.current++;
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [userHash]);

  return (
    <div className="px-4 lg:px-20 xl:px-40 py-10 text-gray-600">
      {data !== null ? (
        <>
          {data.user === true ? (
            <>
              <h2 className="text-2xl font-bold mb-10">Cuenta activa</h2>
              <div>&nbsp;</div>
              <p className="my-8 leading-7 bg-green-200 rounded p-3 text-green-800">
                Su cuenta se ha activado con éxito.
              </p>
              <p className="mt-10 text-center">
                <NavLink
                  to={`${import.meta.env.VITE_BASE_URL}/user/signin`}
                  className="btn-aiesad btn-yellow-aiesad"
                >
                  Iniciar sesión
                </NavLink>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-10">Activar cuenta</h2>
              <div>&nbsp;</div>
              <p className="leading-7 rounded p-3 my-8 text-red-800 bg-red-100 font-medium">
                El enlace para activar la cuenta no es válido.
              </p>
              <p className="mt-10 text-center">
                <NavLink
                  to={`${import.meta.env.VITE_BASE_URL}/user/getactivate/`}
                  className="btn-aiesad btn-yellow-aiesad"
                >
                  Solicitar recuperación
                </NavLink>
              </p>
            </>
          )}
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-10">Activar cuenta</h2>
          <div>&nbsp;</div>
          <p className="leading-7 rounded p-3 my-8 text-red-800 bg-red-100 font-medium">
            El enlace para activar la cuenta no es válido.
          </p>
          <p className="mt-10">
            <NavLink
              to={`${import.meta.env.VITE_BASE_URL}/user/getactivate/`}
              className="btn-aiesad btn-yellow-aiesad"
            >
              Solicitar recuperación
            </NavLink>
          </p>
        </>
      )}
    </div>
  );
};

export default Activate;
