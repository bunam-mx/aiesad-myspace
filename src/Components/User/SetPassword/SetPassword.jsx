import { useParams, NavLink, useNavigate } from "react-router-dom";
import "./SetPassword.css";

const SetPassword = () => {
  const { userHash } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const displaySetPasswordMessage = (status) => {
    let setPasswordMessage = document.getElementsByClassName("setpassword__message")[0];
    setPasswordMessage.getElementsByTagName("p")[0].innerHTML = "";
    if(status) {
      setPasswordMessage.classList.add("success");
      setPasswordMessage.getElementsByTagName("p")[0].innerHTML = "Contraseña establecida correctamente.";
    } else {
      setPasswordMessage.classList.add("error");
      setPasswordMessage.getElementsByTagName("p")[0].innerHTML = "No fue posible establecer la contraseña. Solicite un nuevo enlace.";
    }
    setPasswordMessage.classList.add(status);
    setPasswordMessage.classList.remove("hidden");
    setTimeout(() => {
      setPasswordMessage.classList.remove("error");
      setPasswordMessage.classList.remove("success");
      setPasswordMessage.classList.add("hidden");
      navigate("/user/signin");
    }, 5000);
  };

  const setNewPassword = (event) => {
    event.preventDefault();
    const passwordTag = document.getElementsByName("password")[0];
    const passwordConfirmTag = document.getElementsByName("passwordconfirm")[0];

    if (passwordTag.value !== passwordConfirmTag.value) {
      return;
    } else {
      let formData = {
        hash: userHash,
        password: passwordTag.value,
      };

      let dataJSON = JSON.stringify(formData);

      let options = {
        method: "POST",
        body: dataJSON,
        headers: {
          "Content-Type": "application/json",
        },
      };

      fetch(`${API_URL}/api/users/changepassword`, options)
        .then((response) => response.json())
        .then((data) => {
          displaySetPasswordMessage(data.newPassword)
        });
    }
  };

  if (userHash) {
    return (
      <div className="px-4 lg:px-20 xl:px-40 py-10 text-gray-600">
        <h2 className="text-2xl mb-4">Establecer contraseña</h2>
        <p className="mb-10">&nbsp;</p>
        <div className="setpassword__message rounded p-3 mb-8 text-gray-50 font-medium hidden">
          <p></p>
        </div>
        <form
          className="setpassword__form"
          onSubmit={() => setNewPassword(event)}
        >
          <div className="mb-8">
            <label htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full py-3 border border-gray-200 shadow-sm focus-visible:border-yellow-600 rounded-md my-2 px-2"
            />
          </div>
          <div className="mb-8">
            <label htmlFor="passwordconfirm">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="passwordconfirm"
              id="passwordconfirm"
              className="w-full py-3 border border-gray-200 shadow-sm focus-visible:border-yellow-600 rounded-md my-2 px-2"
            />
          </div>
          <div className="mb-8">
            <button type="submit" className="w-full py-3 bg-yellow-aiesad text-gray-50 rounded-md shadow-sm hover:bg-yellow-600">
              Establecer contraseña
            </button>
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <div className="px-4 lg:px-20 xl:px-40 py-10 text-gray-600">
        <h2 className="text-2xl mb-4">Establecer contraseña</h2>
        <p className="mb-10">&nbsp;</p>
        <p className="setpassword__message rounded p-3 mb-8 text-gray-50 font-medium bg-orange-700">
          El enlace para establecer contraseña no es válido.
        </p>
        <div className="mt-20 mb-10">
          ¿Su enlace no funciona?{" "}
          <NavLink to="/user/recovery" className="text-blue-aiesad font-semibold hover:underline">Solicitar recuperación</NavLink>
        </div>
        <div className="mb-8">
          <NavLink to="/" className="bg-blue-aiesad hover:bg-blue-700 text-white rounded-md p-3 w-full block text-center">
            Ir al inicio
          </NavLink>
        </div>
      </div>
    );
  }
};

export default SetPassword;
