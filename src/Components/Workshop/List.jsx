import { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import { formatTimeInUserZone } from "../../utils/timezone";

const normalizeWhitespace = (text = "") =>
  text.replace(/[\s\u00a0]+/g, " ").trim();

const buildPreview = (text, maxLength = 220) => {
  const normalized = normalizeWhitespace(text);
  if (!normalized) {
    return "";
  }
  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength).trimEnd()}…`
    : normalized;
};

const renderMultiParagraphText = (text) => {
  if (!text) {
    return null;
  }

  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={index} className="whitespace-pre-line">
        {paragraph}
      </p>
    ));
};

function WorkshopList({ date }) {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedWorkshops, setExpandedWorkshops] = useState(() => new Set());
  const [notification, setNotification] = useState(null);
  const notificationTimeoutRef = useRef();
  const [registeringId, setRegisteringId] = useState(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/workshops/date/${date}`
        );
        if (!response.ok) {
          throw new Error("No se pudieron cargar los talleres");
        }
        const data = await response.json();
        setWorkshops(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setWorkshops([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, [date]);

  useEffect(
    () => () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    },
    []
  );

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

  const handleWorkshopRegistration = async (workshopId) => {
    const cookies = new Cookies();
    const currentUserId = cookies.get("id");

    if (!currentUserId) {
      showNotification(
        "Debe iniciar sesión para registrarse al taller",
        "warning"
      );
      return;
    }

    try {
      setRegisteringId(workshopId);
      showNotification("Procesando registro...", "info");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/workshops/${workshopId}/attendees`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: currentUserId }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setWorkshops((prevWorkshops) =>
          prevWorkshops.map((workshop) =>
            workshop.id === workshopId ? data : workshop
          )
        );
        showNotification(
          "¡Registro exitoso! Ahora puede ver los detalles del taller desde su perfil.",
          "success"
        );
      } else {
        showNotification(
          data.error ||
            "Error al registrarse al taller. Inténtelo de nuevo más tarde.",
          "error"
        );
      }
    } catch (registrationError) {
      console.error(registrationError);
      showNotification(
        "Error de conexión. Inténtelo de nuevo más tarde.",
        "error"
      );
    } finally {
      setRegisteringId(null);
    }
  };

  const renderParticipants = (participants = []) => {
    if (!participants.length) {
      return (
        <p className="text-sm text-gray-400">
          No hay facilitadores registrados.
        </p>
      );
    }

    return (
      <ul className="space-y-2 text-sm text-gray-200">
        {participants.map((participant) => (
          <li key={participant.id} className="leading-relaxed">
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
    );
  };

  if (loading) {
    return <p className="text-gray-400">Cargando talleres...</p>;
  }

  if (error) {
    return <p className="text-red-400">Error: {error}</p>;
  }

  if (!workshops.length) {
    return (
      <p className="text-gray-400">
        No hay talleres programados para esta fecha.
      </p>
    );
  }

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
      <div className={`relative space-y-6 ${notification ? "pt-16" : ""}`}>
        {workshops.map((workshop) => {
          const startTime = formatTimeInUserZone(
            workshop.date,
            workshop.timeStart
          );
          const endTime = formatTimeInUserZone(workshop.date, workshop.timeEnd);
          const isExpanded = expandedWorkshops.has(workshop.id);
          const summary = buildPreview(workshop.purpose);
          const totalCapacity = workshop.participantCapacity ?? 0;
          const registeredParticipants = workshop.registeredParticipants ?? 0;
          const remainingSlots = Math.max(
            totalCapacity - registeredParticipants,
            0
          );
          const modalityLabel =
            workshop.modality === "online"
              ? "Virtual"
              : workshop.modality === "presencial"
              ? "Presencial"
              : workshop.modality ?? "";
          const modalityIconClass =
            workshop.modality === "online"
              ? "fas fa-globe-americas"
              : workshop.modality === "presencial"
              ? "fas fa-building"
              : "fas fa-graduation-cap";

          return (
            <article
              key={workshop.id}
              className={`rounded-xl bg-gray-900/60 border border-gray-800 p-6 shadow-lg transition border-opacity-60 ${
                isExpanded
                  ? "border-yellow-aiesad/70"
                  : "hover:border-yellow-aiesad/40"
              }`}
            >
              <header className="mb-4">
                <h4 className="text-xl font-semibold text-yellow-aiesad">
                  {workshop.title}
                </h4>
                <p className="text-sm text-gray-400 mt-1">
                  <i className="fas fa-clock"></i> {startTime} - {endTime}
                </p>
                {workshop.place?.placeName && (
                  <p className="text-sm text-gray-400 mt-1">
                    <i className="fas fa-map-marker-alt"></i>{" "}
                    {workshop.place.placeName}
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-1">
                  <i className="fas fa-users"></i> Cupo:{" "}
                  {registeredParticipants}/{totalCapacity}
                </p>
                {modalityLabel && (
                  <p className="text-sm text-gray-400 mt-1">
                    <i className={modalityIconClass}></i> {modalityLabel}
                  </p>
                )}
              </header>

              {summary && (
                <p className="text-sm text-gray-300 leading-relaxed">
                  {summary}
                </p>
              )}

              <button
                type="button"
                className="event-toggle mt-4"
                onClick={() => {
                  setExpandedWorkshops((prev) => {
                    const updated = new Set(prev);
                    if (updated.has(workshop.id)) {
                      updated.delete(workshop.id);
                    } else {
                      updated.add(workshop.id);
                    }
                    return updated;
                  });
                }}
                aria-expanded={isExpanded}
                aria-controls={`workshop-details-${workshop.id}`}
              >
                {isExpanded ? "Ocultar detalles" : "Ver detalles"}
                <span className="toggle-icon" aria-hidden="true">
                  {isExpanded ? "−" : "+"}
                </span>
              </button>

              {isExpanded && (
                <section
                  id={`workshop-details-${workshop.id}`}
                  className="mt-4 space-y-4 text-sm leading-relaxed text-gray-200"
                >
                  {workshop.purpose && (
                    <div>
                      <h5 className="text-blue-aiesad font-semibold mb-1">
                        Propósito
                      </h5>
                      {renderMultiParagraphText(workshop.purpose)}
                    </div>
                  )}

                  {workshop.keyPoints && (
                    <div>
                      <h5 className="text-blue-aiesad font-semibold mb-1">
                        Puntos clave
                      </h5>
                      {renderMultiParagraphText(workshop.keyPoints)}
                    </div>
                  )}

                  {workshop.participantDeliverable && (
                    <div>
                      <h5 className="text-blue-aiesad font-semibold mb-1">
                        Entregable del participante
                      </h5>
                      {renderMultiParagraphText(
                        workshop.participantDeliverable
                      )}
                    </div>
                  )}

                  <div>
                    <h5 className="text-blue-aiesad font-semibold mb-1">
                      Facilitadores
                    </h5>
                    {renderParticipants(workshop.participants)}
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="text-sm text-gray-400 mt-1">
                      <i className="fas fa-users"></i> Lugares disponibles:{" "}
                      {remainingSlots}
                    </p>
                    <div className="text-right">
                      <button
                        type="button"
                        className={`inline-flex items-center justify-center rounded-full border px-4 py-1 text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          remainingSlots === 0
                            ? "cursor-not-allowed border-gray-500 text-gray-500"
                            : "border-yellow-aiesad text-yellow-aiesad hover:bg-yellow-aiesad/10"
                        } ${registeringId === workshop.id ? "opacity-70" : ""}`}
                        onClick={() => handleWorkshopRegistration(workshop.id)}
                        disabled={
                          remainingSlots === 0 || registeringId === workshop.id
                        }
                      >
                        {remainingSlots === 0
                          ? "Cupo lleno"
                          : registeringId === workshop.id
                          ? "Registrando..."
                          : "Registrarse"}
                      </button>
                    </div>
                  </div>
                </section>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}

export default WorkshopList;
