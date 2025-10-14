import { useEffect, useState } from "react";
import { formatTimeInUserZone } from "../../utils/timezone";

const normalizeWhitespace = (text = "") => text.replace(/[\s\u00a0]+/g, " ").trim();

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

  const renderParticipants = (participants = []) => {
    if (!participants.length) {
      return <p className="text-sm text-gray-400">No hay facilitadores registrados.</p>;
    }

    return (
      <ul className="space-y-2 text-sm text-gray-200">
        {participants.map((participant) => (
          <li key={participant.id} className="leading-relaxed">
            <strong>{participant.name}</strong>
            {participant.institution && (
              <span className="text-gray-400"> - {participant.institution}</span>
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
    return <p className="text-gray-400">No hay talleres programados para esta fecha.</p>;
  }

  return (
    <div className="space-y-6">
      {workshops.map((workshop) => {
        const startTime = formatTimeInUserZone(workshop.date, workshop.timeStart);
        const endTime = formatTimeInUserZone(workshop.date, workshop.timeEnd);
        const isExpanded = expandedWorkshops.has(workshop.id);
        const summary = buildPreview(workshop.purpose);
        const capacityLabel = `${workshop.registeredParticipants}/${workshop.participantCapacity}`;
        const modalityLabel =
          workshop.modality === "online"
            ? "En línea"
            : workshop.modality === "presencial"
              ? "Presencial"
              : workshop.modality ?? "";

        return (
          <article
            key={workshop.id}
            className={`rounded-xl bg-gray-900/60 border border-gray-800 p-6 shadow-lg transition border-opacity-60 ${
              isExpanded ? "border-yellow-aiesad/70" : "hover:border-yellow-aiesad/40"
            }`}
          >
            <header className="mb-4">
              <h4 className="text-xl font-semibold text-yellow-aiesad">
                {workshop.title}
              </h4>
              <p className="text-sm text-gray-400 mt-1">
                <i className="fas fa-clock"></i> {startTime} - {endTime}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                <i className="fas fa-users"></i> Cupo: {capacityLabel}
              </p>
              {modalityLabel && (
                <p className="text-sm text-gray-400 mt-1">
                  <i className="fas fa-graduation-cap"></i> Modalidad: {modalityLabel}
                </p>
              )}
              {workshop.modality === "online" && workshop.url && (
                <p className="text-sm text-gray-400 mt-1">
                  <i className="fas fa-link"></i>{" "}
                  <a
                    href={workshop.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Enlace al taller
                  </a>
                </p>
              )}
              {workshop.modality === "presencial" && workshop.place?.placeName && (
                <p className="text-sm text-gray-400 mt-1">
                  <i className="fas fa-map-marker-alt"></i> {workshop.place.placeName}
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
                    <h5 className="text-blue-aiesad font-semibold mb-1">Propósito</h5>
                    {renderMultiParagraphText(workshop.purpose)}
                  </div>
                )}

                {workshop.keyPoints && (
                  <div>
                    <h5 className="text-blue-aiesad font-semibold mb-1">Puntos clave</h5>
                    {renderMultiParagraphText(workshop.keyPoints)}
                  </div>
                )}

                {workshop.participantDeliverable && (
                  <div>
                    <h5 className="text-blue-aiesad font-semibold mb-1">
                      Entregable del participante
                    </h5>
                    {renderMultiParagraphText(workshop.participantDeliverable)}
                  </div>
                )}

                <div>
                  <h5 className="text-blue-aiesad font-semibold mb-1">Facilitadores</h5>
                  {renderParticipants(workshop.participants)}
                </div>
              </section>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default WorkshopList;
