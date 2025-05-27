import { NavLink, useNavigate } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const displaySignUpMessage = (status, message) => {
    let signupMessage = document.getElementsByClassName("signup__message")[0];
    signupMessage.getElementsByTagName("p")[0].innerHTML = "";
    signupMessage.getElementsByTagName("p")[0].innerHTML = message;
    signupMessage.classList.remove("error");
    signupMessage.classList.remove("success");
    signupMessage.classList.add(status);
    signupMessage.classList.remove("hidden");
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    setTimeout(() => {
      signupMessage.classList.add("hidden");
      if(status === "success") {
        navigate("/");
      }
    }, 10000);
  }

  const sendSignUp = (event) => {
    event.preventDefault();

    const emailTag = document.getElementsByName("email")[0];
    const emailConfirmTag = document.getElementsByName("emailconfirm")[0];
    const passwordTag = document.getElementsByName("password")[0];
    const passwordConfirmTag = document.getElementsByName("passwordconfirm")[0];
    const nameTag = document.getElementsByName("name")[0];
    const lastnameTag = document.getElementsByName("lastname")[0];
    const entityTag = document.getElementsByName("entity")[0];
    const curpTag = document.getElementsByName("curp")[0];
    const studyLevelTag = document.getElementsByName("studylevel")[0];
    const attendanceModeTag = document.getElementsByName("attendanceMode")[0]; // Get the new select

    if(emailTag.value !== emailConfirmTag.value) {
      displaySignUpMessage("error", "Los correos no coinciden");
      return;
    }

    if(passwordTag.value !== passwordConfirmTag.value) {
      displaySignUpMessage("error", "Las contraseñas no coinciden");
      return;
    }

    let formData = {
      email: emailTag.value,
      password: passwordTag.value,
      name: nameTag.value,
      lastname: lastnameTag.value,
      entity: entityTag.value,
      curp: curpTag.value,
      studyLevel: studyLevelTag.value,
      attendanceMode: attendanceModeTag.value // Add the new field to formData
    };

    let dataJSON = JSON.stringify(formData);

    let options = {
      method: "POST",
      body: dataJSON,
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(`${API_URL}/api/users/signup/`, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          displaySignUpMessage("error", data.error);
          return;
        }
        displaySignUpMessage("success", "Registro exitoso. Se ha enviado un correo con las instrucciones para activar su cuenta.");
      })
      .catch((error) => {
        console.log(error);
        displaySignUpMessage("error", "Ocurrió un error inesperado. Intente más tarde.");
      });
  }

  return (
    <div className="px-4 lg:px-10 py-10 text-gray-600">
      <h2 className="text-2xl mb-4">Registro</h2>
      <p className="mb-10">
        ¿Ya cuenta con registro?{" "}
        <NavLink to={`${import.meta.env.VITE_BASE_URL}/user/signin`} className="text-blue-aiesad font-semibold hover:underline">Iniciar sesión</NavLink>
      </p>
      <div className="signup__message rounded p-3 mb-8 text-gray-50 font-medium hidden">
        <p></p>
      </div>
      <form className="xl:grid xl:grid-cols-2 xl:gap-4" autoComplete="off" onSubmit={() => sendSignUp(event)}>
        <div className="mb-8 col-span-2 mt-4 content-start">
          <a
            href="https://lib.cuaed.unam.mx/portales/aviso-privacidad-simplificado.html"
            target="_blank"
            rel="noreferrer"
            className="mb-3 underline text-gray-500 font-medium block"
          >
            Aviso de privacidad simplificado de la Coordinación de Universidad
            Abierta y Educación Digital de la UNAM
          </a>
          <label htmlFor="privacyterms" id="privacyterms" className="w-full py-3 my-2 px-2">
            <input
              type="checkbox"
              name="privacyterms"
              value="privacy"
              id="privacy"
              className="border-2 align-text-top border-gray-300 p-2 rounded checked:bg-blue-700"
              required
            />{" "}
            He leído el Aviso de Privacidad
          </label>
        </div>
        <div className="mb-8 content-start">
          <label htmlFor="email">
            Correo electrónico
          </label>
          <input type="email" name="email" className="w-full py-3 border border-gray-200 shadow-sm focus-visible:border-blue-700 rounded-md my-2 px-2" />
        </div>
        <div className="mb-8 content-start">
          <label htmlFor="emailconfirm">
            Confirmar correo electrónico
          </label>
          <input
            type="email"
            name="emailconfirm"
            className="w-full py-3 border border-gray-200 shadow-sm focus-visible:border-blue-700 rounded-md my-2 px-2"
          />
        </div>
        <div className="mb-8 content-start">
          <label htmlFor="password">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            className="w-full py-3 border border-gray-200 shadow-sm focus-visible:border-blue-700 rounded-md my-2 px-2"
          />
        </div>
        <div className="mb-8 content-start">
          <label htmlFor="passwordconfirm">
            Confirmar contraseña
          </label>
          <input
            type="password"
            name="passwordconfirm"
            className="w-full py-3 border border-gray-200 shadow-sm focus-visible:border-blue-700 rounded-md my-2 px-2"
          />
        </div>
        <div className="mb-8 content-start">
          <label htmlFor="name">
            Nombre(s)
          </label>
          <input
            type="text"
            className="w-full py-3 border border-gray-200 shadow-sm focus-visible:border-blue-700 rounded-md my-2 px-2"
            name="name"
            id="name"
            required
          />
          <p className="text-sm text-yellow-700">
            Como desea que aparezca en su constancia
          </p>
        </div>
        <div className="mb-8 content-start">
          <label htmlFor="lastname">
            Apellido(s)
          </label>
          <input
            type="text"
            className="w-full py-3 border border-gray-200 shadow-sm focus-visible:border-blue-700 rounded-md my-2 px-2"
            name="lastname"
            id="lastname"
            required
          />
          <p className="text-sm text-yellow-700">
            Como desea que aparezca en su constancia
          </p>
        </div>
        <div className="mb-8 content-start">
          <label htmlFor="entity">Entidad / Institución</label>
          <input
            type="text"
            className="w-full py-3 border border-gray-200 shadow-sm focus-visible:border-blue-700 rounded-md my-2 px-2"
            name="entity"
            id="entity"
            required
          />
        </div>
        <div className="mb-8 content-start">
          <label htmlFor="curp">CURP / ID / DNI</label>
          <input
            type="text"
            className="w-full py-3 border border-gray-200 shadow-sm focus-visible:border-blue-700 rounded-md my-2 px-2"
            name="curp"
            id="curp"
            required
            minLength="18"
            maxLength="18"
          />
          <p className="text-sm text-red-800">
            Favor de verificar. Si está incorrecta, no se emitirá constancia
          </p>
        </div>
        <div className="mb-8 content-start">
          <label htmlFor="studylevel">Grado máximo de estudios</label>
          <select name="studylevel" className="w-full py-3 border border-gray-200 shadow-sm bg-white rounded-md my-2 px-2" id="studyLevel" required>
            <option value="">Seleccione una opción</option>
            <option value="Secundaria">Secundaria</option>
            <option value="Bachillerato">Bachillerato</option>
            <option value="Licenciatura">Licenciatura</option>
            <option value="Maestría">Maestría</option>
            <option value="Doctorado">Doctorado</option>
          </select>
        </div>
        <div className="mb-8 content-start">
          <label htmlFor="attendanceMode">Modalidad de asistencia</label>
          <select name="attendanceMode" className="w-full py-3 border border-gray-200 shadow-sm bg-white rounded-md my-2 px-2" id="attendanceMode" required>
            <option value="">Seleccione una opción</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
          </select>
        </div>
        <div className="col-span-2 text-center">
          <button type="submit" className="btn-aiesad btn-blue-aiesad">
            Completar registro
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
