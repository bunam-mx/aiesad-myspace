import { NavLink } from "react-router-dom";
import "./Recovery.css";

const Recovery = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const displayRecoveryMessage = (status, message) => {
    let recoveryMessage = document.getElementsByClassName("recovery__message")[0];
    recoveryMessage.getElementsByTagName("p")[0].innerHTML = "";
    recoveryMessage.getElementsByTagName("p")[0].innerHTML = message;
    recoveryMessage.classList.remove("error");
    recoveryMessage.classList.remove("success");
    recoveryMessage.classList.add(status);
    recoveryMessage.classList.remove("hidden");
    setTimeout(() => {
      recoveryMessage.classList.add("hidden");
    }, 10000);
  }

  const recoverPassword = (event) => {
    event.preventDefault();
    const emailTag = document.getElementsByName("email")[0];
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
    fetch(`${API_URL}/api/users/recovery/`, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          displayRecoveryMessage("error", data.error);
          return;
        } else if (data.user) {
          displayRecoveryMessage("success", "Se ha enviado un correo con las instrucciones para recuperar su contraseña.");
        } else {
          displayRecoveryMessage("error", "El correo electrónico no se encuentra registrado.");
        }
      })
      .catch((error) => {
        console.log(error);
        displayRecoveryMessage("error", "Ocurrió un error inesperado. Intente más tarde.");
      });
  }

  return (
    <div className="px-4 lg:px-20 xl:px-40 py-10 text-gray-600">
      <h2 className="text-2xl font-bold mb-4">Recuperar contraseña</h2>
      <p className="mb-10">
        ¿Ya cuenta con sus datos de acceso? <NavLink to={`${import.meta.env.VITE_BASE_URL}/user/signin`} className="text-darkblue-aiesad font-semibold hover:underline">Iniciar sesión</NavLink>
      </p>
      <div className="recovery__message rounded p-3 mb-8 text-gray-50 font-medium hidden">
        <p></p>
      </div>
      <form onSubmit={() => recoverPassword(event)}>
        <div className="mb-8">
          <label htmlFor="email">Correo electrónico</label>
          <input type="email" name="email" className="w-full py-3 border border-gray-200 shadow-sm focus-visible:border-gray-900 rounded-md my-2 px-2" />
        </div>
        <div className="mb-8 text-center">
          <button type="submit" className="btn-aiesad btn-darkblue-aiesad">Recuperar contraseña</button>
        </div>
      </form>
    </div>
  );
}

export default Recovery;
