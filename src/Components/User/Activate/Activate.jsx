import { useParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const Activate = () => {
  const { userHash } = useParams();
  const [data, setData] = useState(null);
  let activateCount = 0;

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
        const response = await fetch(`${API_URL}/api/users/activate`, options);
        const result = await response.json();
        console.log(result);
        if (activateCount === 0) {
          setData(result);
          activateCount++;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }
  }, []);


  return (
    <div className="px-4 lg:px-20 xl:px-40 py-10 text-gray-600">
      {data !== null ? (
        <>
          {data.user === true ? (
            <>
              <h2 className="text-2xl font-bold mb-10">Cuenta activa</h2>
              <div>&nbsp;</div>
              <p className="mb-4 leading-7 bg-green-200 rounded p-3 text-green-800">
                Su cuenta se ha activado con éxito.
              </p>
              <p className="my-8 leading-7">
                Le invitamos a consultar la{" "} <a href="https://cuaed.unam.mx/encuentroaiesad2025/index.html#agenda" rel="noopener noreferrer" className="text-yellow-aiesad font-semibold hover:underline">agenda</a> del evento y la información sobre nuestros <a href="https://cuaed.unam.mx/encuentroaiesad2025/invitados.html#panelistas" rel="noopener noreferrer" className="text-yellow-aiesad font-semibold hover:underline">invitados</a>.
              </p>
              <p className="mt-10">
                <NavLink to="/user/signin" className="bg-yellow-aiesad hover:bg-yellow-600 text-white rounded-md p-3 w-full block text-center">Iniciar sesión</NavLink>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-10">Activar cuenta</h2>
              <div>&nbsp;</div>
              <p className="leading-7 rounded p-3 mb-8 text-red-800 bg-red-100 font-medium">
                El enlace para activar la cuenta no es válido.
              </p>
              <p className="mt-10">
                <NavLink to="/user/getactivate/" className="bg-yellow-aiesad hover:bg-yellow-600 text-white rounded-md p-3 w-full block text-center">
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
          <p className="leading-7 rounded p-3 mb-8 text-red-800 bg-red-100 font-medium">
            El enlace para activar la cuenta no es válido.
          </p>
          <p className="mt-10">
            <NavLink to="/user/getactivate/" className="bg-yellow-aiesad hover:bg-yellow-600 text-white rounded-md p-3 w-full block text-center">Solicitar recuperación</NavLink>
          </p>
        </>
      )}
    </div>
  );
};

export default Activate;
