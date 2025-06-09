import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const SignIn = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const navigate = useNavigate();

  const displayLoginMessage = (message) => {
    let signinMessage = document.getElementsByClassName("signin__message")[0];
    signinMessage.getElementsByTagName("p")[0].innerHTML = "";
    signinMessage.getElementsByTagName("p")[0].innerHTML = message;
    signinMessage.classList.remove("hidden");
    setTimeout(() => {
      signinMessage.classList.add("hidden");
    }, 10000);
  };

  const sendLogin = (event) => {
    event.preventDefault();
    const emailTag = document.getElementById("email");
    const passwordTag = document.getElementById("password");

    let formData = {
      email: emailTag.value,
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

    fetch(`${API_URL}/api/users/signin/`, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          displayLoginMessage(data.error);
          return;
        }
        cookies.set("id", data.user.id, { path: "/" });
        cookies.set("email", data.user.email, { path: "/" });
        cookies.set("attendanceMode", data.user.attendanceMode, { path: "/" });
        cookies.set("name", data.user.sigeco.name, { path: "/" });
        cookies.set("lastname", data.user.sigeco.lastname, { path: "/" });
        cookies.set("userType", data.user.userType, { path: "/" });
        cookies.set("qrcode", data.user.qrcode, { path: "/" });
        cookies.set("entity", data.user.sigeco.entity, { path: "/" });
        cookies.set("curp", data.user.sigeco.curp, { path: "/" });
        cookies.set("studyLevel", data.user.sigeco.studyLevel, { path: "/" });
        
        navigate(`${import.meta.env.VITE_BASE_URL}/user/agenda`);
      })
      .catch((error) => {
        console.log(error);
        displayLoginMessage("Ocurrió un error inesperado. Intente más tarde.");
      });
  };
  return (
    <div className="px-4 lg:px-20 xl:px-40 py-10 text-gray-600">
      <h2 className="text-2xl mb-4">Iniciar sesión</h2>
      <p className="mb-10">
        ¿Aún no se ha registrado? <NavLink to={`${import.meta.env.VITE_BASE_URL}/user/signup`} className="text-yellow-aiesad font-semibold hover:underline">Registro</NavLink>
      </p>
      <div className="signin__message bg-red-800 rounded p-3 mb-8 text-gray-50 font-medium hidden">
        <p></p>
      </div>
      <form onSubmit={() => sendLogin(event)}>
        <div className="mb-8">
          <label htmlFor="email" className="font-medium">
            Correo electrónico
          </label>
          <input type="email" name="email" id="email" required className="w-full py-3 border border-gray-200 shadow-sm focus-visible:border-yellow-600 rounded-md my-2 px-2" />
        </div>
        <div className="mb-8">
          <label htmlFor="password" className="font-medium">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            className="w-full py-3 border border-gray-200 shadow-sm focus-visible:border-yellow-600 rounded-md my-2 px-2 "
          />
        </div>
        <div className="mb-8">
          <p className="mb-10">
            ¿No recuerda su contraseña?{" "}
            <NavLink to={`${import.meta.env.VITE_BASE_URL}/user/recovery`} className="text-yellow-aiesad font-semibold hover:underline">Recuperar contraseña</NavLink>
          </p>
        </div>
        <div className="mb-8 text-center">
          <button type="submit" className="btn-aiesad btn-yellow-aiesad">
            Iniciar sesión
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
