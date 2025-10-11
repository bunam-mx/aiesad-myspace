import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { formatTimeInUserZone } from "../../utils/timezone";

function WorkshopBlock() {
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
  }, [userId, API_URL]);

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
      <div className="workshop mt-6 p-4 rounded-lg">
        <p className="text-gray-400">No se ha registrado a ningún taller</p>
      </div>
    );
  }

  // Helper to capitalize first letter
  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const startTime = formatTimeInUserZone(workshop.date, workshop.timeStart);
  const endTime = formatTimeInUserZone(workshop.date, workshop.timeEnd);

  return (
    <div className="workshop mt-6 p-4 rounded-lg bg-gray-800 text-gray-300">
      <h4 className="text-xl text-yellow-aiesad font-semibold mb-3">{workshop.title}</h4>
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
                  <span className="text-gray-400"> - {participant.institution}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default WorkshopBlock;