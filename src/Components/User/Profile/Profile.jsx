import { useState } from "react";
import Cookies from "universal-cookie";
import HeaderBlock from "../../HeaderBlock/HeaderBlock";
import FooterBlock from "../../FooterBlock/FooterBlock";
import "./Profile.css";

const Profile = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const user = {
    id: cookies.get("id"),
    email: cookies.get("email"),
    attendanceMode: cookies.get("attendanceMode"),
    name: cookies.get("name"),
    lastname: cookies.get("lastname"),
    userType: cookies.get("userType"),
    qrcode: cookies.get("qrcode"),
    entity: cookies.get("entity"),
    curp: cookies.get("curp"),
    studyLevel: cookies.get("studyLevel"),
  };

  const initialUserData = [
    {
      label: "Modalidad de asistencia",
      value: user.attendanceMode,
      type: "text",
      inputName: "attendanceMode",
      colStart: 1,
      editable: false,
    },
    {
      label: "Correo electrónico",
      value: user.email,
      type: "email",
      inputName: "email",
      colStart: 2,
      editable: false,
    },
    {
      label: "Nombre(s)",
      value: user.name,
      type: "text",
      inputName: "name",
      colStart: 1,
      editable: true,
    },
    {
      label: "Apellido(s)",
      value: user.lastname,
      type: "text",
      inputName: "lastname",
      colStart: 2,
      editable: true,
    },
    {
      label: "Entidad / Institución",
      value: user.entity,
      type: "text",
      inputName: "entity",
      colStart: 1,
      editable: true,
    },
    {
      label: "CURP / ID / DNI",
      value: user.curp,
      type: "text",
      inputName: "curp",
      colStart: 1,
      editable: true,
    },
    {
      label: "Grado máximo de estudios",
      value: user.studyLevel,
      type: "text",
      inputName: "studyLevel",
      colStart: 2,
      editable: true,
    },
  ];

  let profileMessage = document.getElementsByClassName("profile__message")[0];

  const [editableFieldsData, setEditableFieldsData] = useState(
    initialUserData.map(field => ({ ...field, currentValue: field.value, isEditing: false }))
  );

  const [message, setMessage] = useState({ text: '', type: '', visible: false });

  const handleInputChange = (inputName, newValue) => {
    setEditableFieldsData(prevFields =>
      prevFields.map(f =>
        f.inputName === inputName ? { ...f, currentValue: newValue } : f
      )
    );
  };

  const handleToggleEdit = async (inputNameToToggle) => {
    const fieldToUpdate = editableFieldsData.find(f => f.inputName === inputNameToToggle);
    if (!fieldToUpdate) return;

    if (fieldToUpdate.isEditing) { 
      try {
        const response = await fetch(`${API_URL}/api/sigecos/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ field: fieldToUpdate.inputName, value: fieldToUpdate.currentValue }),
        });
        const result = await response.json();

        if (response.ok && result.status === true) {
          setMessage({ text: result.message , type: 'success', visible: true });
          setEditableFieldsData(prevFields =>
            prevFields.map(f =>
              f.inputName === inputNameToToggle ? { ...f, value: fieldToUpdate.currentValue, isEditing: false } : f
            )
          );
        } else {
          setMessage({ text: result.message, type: 'error', visible: true });
          setEditableFieldsData(prevFields =>
            prevFields.map(f =>
              f.inputName === inputNameToToggle ? { ...f, isEditing: false } : f
            )
          );
        }
      } catch (error) {
        setMessage({ text: `Error de conexión: ${error.message || 'No se pudo conectar al servidor.'}`, type: 'error', visible: true });
        setEditableFieldsData(prevFields =>
          prevFields.map(f =>
            f.inputName === inputNameToToggle ? { ...f, isEditing: false } : f
          )
        );
      }
      setTimeout(() => {
        profileMessage.classList.add("hidden");
      }, 10000);
    } else { 
      setEditableFieldsData(prevFields =>
        prevFields.map(f =>
          f.inputName === inputNameToToggle
            ? { ...f, isEditing: true, currentValue: f.value }
            : f
        )
      );
      setMessage({ text: '', type: '', visible: false });
    }
  };

  return (
    <>
      <HeaderBlock />
      <section id="profile" className="container mx-auto min-h-170 p-10">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid justify-items-center xl:content-center mt-20 xl:mt-0">
            <img src={`${API_URL}${user.qrcode}`} alt="QR Code" width={300} />
          </div>
          <div className="mt-10 md:mt-0">
            <h2 className="text-yellow-aiesad text-4xl">Mi información</h2>
            {/* Message display area */}
            <div 
              className={`profile__message rounded p-3 my-4 text-gray-50 font-medium ${message.type} ${message.visible ? '' : 'hidden'}`}
            >
              <p>{message.text}</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 py-8 text-gray-300">
              {editableFieldsData.map((field) => (
                <div
                  key={field.inputName}
                  className={`profile-item mb-8 ${field.inputName === "email" ? " col-start-2" : ""}`}
                >
                  <label htmlFor={field.inputName} className="block">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.inputName}
                    id={field.inputName}
                    className={`w-8/10 py-3 border shadow-sm ${field.inputName === "email" || field.inputName === "attendanceMode" ? " rounded-md" : "rounded-tl-md rounded-bl-md"} ${field.isEditing ? "is-editing" : ""} my-2 px-2`}
                    required
                    disabled={field.editable ? !field.isEditing : true}
                    value={field.currentValue || ""} // Controlled input
                    onChange={(e) => handleInputChange(field.inputName, e.target.value)} // Handle changes
                    minLength={field.inputName === "curp" ? 18 : undefined}
                    maxLength={field.inputName === "curp" ? 18 : undefined}
                  />
                  {field.editable && (
                    <button 
                      className="w-1/10 py-3 rounded-tr-md rounded-br-md"
                      onClick={() => handleToggleEdit(field.inputName)}
                    >
                      <i className={`fas ${field.isEditing ? "fa-save" : "fa-edit"}`}></i>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <FooterBlock />
    </>
  );
};

export default Profile;
