import { NavLink, useNavigate } from "react-router-dom";
import "./GetActivate.css";

const GetActivate = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const displayGetActivateMessage = (status, message) => {
    let getactivateMessage = document.getElementsByClassName("getactivate__message")[0];
    let emailTag = document.getElementById("email");
    emailTag.value = "";
    getactivateMessage.getElementsByTagName("p")[0].innerHTML = "";
    getactivateMessage.getElementsByTagName("p")[0].innerHTML = message;
    getactivateMessage.classList.remove("error");
    getactivateMessage.classList.remove("success");
    getactivateMessage.classList.add(status);
    getactivateMessage.classList.remove("hidden");
    setTimeout(() => {
      getactivateMessage.classList.add("hidden");
      if(status === "success") {
        navigate("/user/signin");
      }
    }, 10000);
  };

  const getActivateAccount = (event) => {
    event.preventDefault();
    const emailTag = document.getElementById("email");
    let formData = {
      email: emailTag.value,
    };
    let dataJSON = JSON.stringify(formData);
    let options = {
      method: "POST",
      body: dataJSON,
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(`${API_URL}/api/users/getactivate/`, options)
      .then((response) => response.json())
      .then((data) => {
        if (!data.user) {
          displayGetActivateMessage("error","La cuenta ya se encuentra activa o el correo electrónico no está registrado.");
          return;
        }
        displayGetActivateMessage("success","Se ha enviado un correo con las instrucciones para activar su cuenta.");
      })
      .catch((error) => {
        console.log(error);
        displayGetActivateMessage("error","Ocurrió un error inesperado. Intente más tarde.");
      });
  }

  return (
    <div className="px-4 lg:px-20 xl:px-40 py-10 text-gray-600">
      <h2 className="text-2xl font-bold mb-4">Solicitar activación</h2>
      <p className="mb-10">
      ¿Ya está activa su cuenta?{" "}
      <NavLink to="/user/signin" className="text-blue-aiesad font-semibold hover:underline">Iniciar sesión</NavLink>
      </p>
      <div className="getactivate__message rounded p-3 mb-8 text-gray-50 hidden">
        <p></p>
      </div>
      <form className="getactivate__form" onSubmit={() => getActivateAccount(event)}>
        <div className="mb-8">
          <label htmlFor="email">Correo electrónico</label>
          <input type="email" name="email" id="email" required className="w-full py-3 border border-gray-200 shadow-sm focus-visible:border-yellow-600 rounded-md my-2 px-2" />
        </div>
        <div className="mb-8">
          <button type="submit" className="w-full py-3 bg-blue-aiesad hover:bg-blue-800 text-white rounded-md my-2">Solicitar activación</button>
        </div>
      </form>
    </div>
  );
}

export default GetActivate;
