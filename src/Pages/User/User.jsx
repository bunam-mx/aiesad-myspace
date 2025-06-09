import { NavLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import SignIn from "../../Components/User/SignIn/SignIn";
import SignUp from "../../Components/User/SignUp/SignUp";
import Activate from "../../Components/User/Activate/Activate";
import GetActivate from "../../Components/User/GetActivate/GetActivate";
import Recovery from "../../Components/User/Recovery/Recovery";
import SetPassword from "../../Components/User/SetPassword/SetPassword";
import Profile from "../../Components/User/Profile/Profile";
import Proposal from "../../Components/User/Proposal/Proposal";
import Agenda from "../../Components/User/Agenda/Agenda";

function User() {
  const { userState } = useParams();
  const navigate = useNavigate();

  const userStateForm = (userState) => {
    if (userState === "signin") {
      return <SignIn />;
    } else if (userState === "signup") {
      return <SignUp />;
    } else if (userState === "activate") {
      return <Activate />;
    } else if (userState === "getactivate") {
      return <GetActivate />;
    } else if (userState === "recovery") {
      return <Recovery />;
    } else if (userState === "setpassword") {
      return <SetPassword />;
    } else if (userState === "signout") {
      const cookies = new Cookies();
      cookies.remove("id", { path: "/" });
      cookies.remove("email", { path: "/" });
      cookies.remove("name", { path: "/" });
      cookies.remove("lastname", { path: "/" });
      cookies.remove("userType", { path: "/" });
      cookies.remove("qrcode", { path: "/" });
      cookies.remove("entity", { path: "/" });
      cookies.remove("account", { path: "/" });
      cookies.remove("curp", { path: "/" });
      cookies.remove("studyLevel", { path: "/" });
      window.location.href = `${import.meta.env.VITE_HOME_URL}/`;
      return null; 
    } else {
      return <SignIn />;
    }
  };

  if (userState === "profile" || userState === "proposal" || userState === "agenda") {
    const cookies = new Cookies();
    if(cookies.get("id") === undefined) {
      navigate(`${import.meta.env.VITE_BASE_URL}/user/signin`);
      return null;
    } else {
      if (userState === "profile") {
        return <Profile />;
      } else if (userState === "proposal") {
        return <Proposal />;
      } else if (userState === "agenda") {
        return <Agenda />;
      } else {
        return <Profile />;
      }
    }
  } else {
    return (
      <section className="md:grid md:grid-cols-2">
        <div className="px-4 lg:px-20 xl:px-40 min-h-screen max-h-max content-center">
          <h1 className="py-18">
            <a href={`${import.meta.env.VITE_HOME_URL}`}>
              <img src={`${import.meta.env.VITE_BASE_URL}/images/aiesad-2025.png`} alt="AIESAD 2025" width={260} />
            </a>
          </h1>
          <h2 className="text-4xl text-gray-100 !font-extralight">
            "Mejor educación para más"
          </h2>
          <h3 className="text-2xl text-gray-300 !font-extralight my-2">
            Educación digital, accesible y transformadora
          </h3>
          <h4 className="text-4xl leading-tight my-18 text-gray-100">
            Sé parte de este <br /> <span className="text-blue-aiesad">importante encuentro</span> <br /> educativo
          </h4>
          <p className="mt-20 border-b border-b-gray-200 pb-1">
            <a href={`${import.meta.env.VITE_ROOT_URL}/index.html#agenda`} className="text-gray-300" rel="noopener noreferrer">Regresar a la agenda</a>
          </p>
        </div>
        <div className="bg-gray-100 min-h-screen max-h-max content-center">{userStateForm(userState)}</div>
      </section>
    );
  }
}

export default User;
