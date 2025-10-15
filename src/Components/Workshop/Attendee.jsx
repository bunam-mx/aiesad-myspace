import { useState, useEffect, useRef } from "react";
import Cookies from "universal-cookie";
import { formatTimeInUserZone } from "../../utils/timezone";

function WorkshopAttendee() {
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const notificationTimeoutRef = useRef();

  const cookies = new Cookies();
  const userId = cookies.get("id");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await fetch(`${API_URL}/api/workshops/attendee/${userId}`);
        if (!response.ok) {
          throw new Error("Error al obtener el workshop");
        }
        const data = await response.json();
        setWorkshop(data.workshop);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchWorkshop();
    } else {
      setLoading(false);
    }

    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, [userId, API_URL]);

  const showNotification = (message, type = "info", duration = 6000) => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }

    setNotification({ message, type });

    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  const dismissNotification = () => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setNotification(null);
  };

  const handleDeleteRegistration = async () => {
    if (!workshop) return;

    setIsDeleting(true);
    showNotification("Procesando eliminación...", "info");

    try {
      const response = await fetch(
        `${API_URL}/api/workshops/${workshop.id}/attendees/${userId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        showNotification("Se eliminó su registro al taller", "success");
        setWorkshop(null); // Clear the workshop data to show the "not registered" message
      } else {
        showNotification(
          data.error || "Error al eliminar el registro.",
          "error"
        );
      }
    } catch (err) {
      console.error("Error al eliminar el registro:", err);
      showNotification("Error de conexión. Inténtelo de nuevo.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    // Parseamos la fecha directamente sin crear Date object para evitar problemas de zona horaria
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="workshop mt-6 p-4 rounded-lg">
        <p className="text-gray-400">Cargando información del taller...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="workshop mt-6 p-4 rounded-lg">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!workshop) {
    return (
      <>
        {notification && (
          <div
            className={`fixed right-2 top-2 z-20 border px-4 py-3 text-sm rounded-lg shadow backdrop-blur transition ${
              notification.type === "success"
                ? "bg-green-600/80 border-green-300 text-white"
                : notification.type === "error"
                ? "bg-red-600/80 border-red-300 text-white"
                : "bg-blue-600/80 border-blue-300 text-white"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <span className="leading-relaxed">{notification.message}</span>
              <button
                type="button"
                onClick={dismissNotification}
                className="text-white/80 hover:text-white"
                aria-label="Cerrar notificación"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}
        <div className="workshop mt-6 p-4 rounded-lg">
          <p className="text-gray-400">No se ha registrado a ningún taller</p>
        </div>
      </>
    );
  }

  // Helper to capitalize first letter
  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const startTime = formatTimeInUserZone(workshop.date, workshop.timeStart);
  const endTime = formatTimeInUserZone(workshop.date, workshop.timeEnd);

  return (
    <>
      {notification && (
        <div
          className={`fixed right-2 top-2 z-20 border px-4 py-3 text-sm rounded-lg shadow backdrop-blur transition ${
            notification.type === "success"
              ? "bg-green-600/80 border-green-300 text-white"
              : notification.type === "error"
              ? "bg-red-600/80 border-red-300 text-white"
              : notification.type === "warning"
              ? "bg-yellow-400/90 border-yellow-200 text-black"
              : "bg-blue-600/80 border-blue-300 text-white"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <span className="leading-relaxed">{notification.message}</span>
            <button
              type="button"
              onClick={dismissNotification}
              className="text-white/80 hover:text-white"
              aria-label="Cerrar notificación"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
      <div className="workshop mt-6 p-4 rounded-lg bg-gray-800 text-gray-300">
        <h4 className="text-xl text-yellow-aiesad font-semibold mb-3">
          {workshop.title}
        </h4>
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">
            <i className="fas fa-calendar-alt"></i> {capitalizeFirst(formatDate(workshop.date))}
          </p>
          <p className="text-sm text-gray-400 mb-2">
            <i className="fas fa-clock"></i> {startTime} - {endTime}
          </p>
          {workshop.modality === "online" && (
            <p className="text-sm text-gray-400 mb-2">
              <i className="fas fa-link"></i> <a href={workshop.url} target="_blank" rel="noopener noreferrer" className="underline">Enlace al taller</a>
            </p>
          )}
          {workshop.modality === "presencial" && workshop.place && (
            <p className="text-sm text-gray-400 mb-2">
              <i className="fas fa-map-marker-alt"></i> {workshop.place.placeName}
            </p>
          )}
        </div>

        <div className="mb-4">
          <h5 className="text-blue-aiesad font-semibold mb-2">Propósito:</h5>
          <p className="text-sm text-gray-300">{workshop.purpose}</p>
        </div>

        <div className="mb-4">
          <h5 className="text-blue-aiesad font-semibold mb-2">Puntos clave:</h5>
          <p className="text-sm text-gray-300">{workshop.keyPoints}</p>
        </div>

        <div className="mb-4">
          <h5 className="text-blue-aiesad font-semibold mb-2">Entregable del participante:</h5>
          <p className="text-sm text-gray-300">{workshop.participantDeliverable}</p>
        </div>

        {workshop.participants && workshop.participants.length > 0 && (
          <div className="mb-4">
            <h5 className="text-blue-aiesad font-semibold mb-2">Facilitadores:</h5>
            <ul className="text-sm text-gray-300">
              {workshop.participants.map((participant) => (
                <li key={participant.id} className="mb-1">
                  <strong>{participant.name}</strong>
                  {participant.institution && (
                    <span className="text-gray-400">
                      {" "}
                      - {participant.institution}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="my-4 text-right">
          <button
            type="button"
            onClick={handleDeleteRegistration}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-full border border-red-500 px-4 py-1 text-sm text-red-500 transition focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            {isDeleting ? "Eliminando registro..." : "Eliminar mi registro"}
          </button>
        </div>
      </div>
    </>
  );
}

export default WorkshopAttendee;