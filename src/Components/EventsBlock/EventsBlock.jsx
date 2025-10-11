import { useState, useEffect } from "react";
import "./EventsBlock.css";
import { formatTimeInUserZone } from "../../utils/timezone";

const EventsBlock = ({ date }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEvents, setExpandedEvents] = useState(() => new Set());

  const handleToggleEvent = (eventId) => {
    setExpandedEvents((prev) => {
      const updated = new Set(prev);
      if (updated.has(eventId)) {
        updated.delete(eventId);
      } else {
        updated.add(eventId);
      }
      return updated;
    });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/events/date/${date}`
        );
        if (!response.ok) {
          throw new Error("La respuesta de la red no fue exitosa");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [date]); // El efecto se ejecuta cada vez que la prop 'date' cambia

  return (
    <section className="eventsForDay">
      <div className="events">
        {loading && <p>Cargando eventos...</p>}
        {error && <p>Error al cargar eventos: {error}</p>}
        {!loading &&
          !error &&
          (events.length > 0 ? (
            events.map((event) => {
              const sortedParticipants = [...(event.participants ?? [])].sort(
                (a, b) => (a?.order ?? 0) - (b?.order ?? 0)
              );
              const eventDate = event.date ?? date;
              const startTime = formatTimeInUserZone(eventDate, event.timeStart);
              const endTime = formatTimeInUserZone(eventDate, event.timeEnd);
              const timeRange = startTime
                ? endTime
                  ? `${startTime} - ${endTime}`
                  : startTime
                : "";
              const isExpanded = expandedEvents.has(event.id);
              const panelId = `event-info-${event.id}`;

              return (
                <article
                  key={event.id}
                  className={isExpanded ? "expanded" : "collapsed"}
                >
                  <header>
                    <h4 className="text-xl font-semibold">
                      <span className={`event-icon ${event.eventType}`}></span>{" "}
                      {event.title}
                    </h4>
                    <div className="schedule">
                      <span>
                        <i className="fas fa-clock"></i>{" "}
                        {timeRange}
                      </span>
                      {event.place?.placeName && (
                        <span>
                          <i className="fas fa-map-marker-alt"></i>{" "}
                          {event.place.placeName}
                        </span>
                      )}
                    </div>
                  </header>
                  <button
                    type="button"
                    className="event-toggle"
                    onClick={() => handleToggleEvent(event.id)}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                  >
                    {isExpanded ? "Ocultar detalles" : "Ver detalles"}
                    <span className="toggle-icon" aria-hidden="true">
                      {isExpanded ? "−" : "+"}
                    </span>
                  </button>
                  <div
                    className={`eventInfo ${isExpanded ? "expanded" : ""}`}
                    id={panelId}
                  >
                    {event.description && (
                      <h5 className="event-description">{event.description}</h5>
                    )}
                    <div className="participants">
                      {sortedParticipants.length > 0 ? (
                        <ul>
                          {sortedParticipants.map((participant) => (
                            <li
                              key={participant.id}
                              className={`participant${
                                participant.isModerator ? " moderator" : ""
                              }`}
                            >
                              <div className="participant-header">
                                {participant.isModerator && (
                                  <p className="participant-badge">Moderador</p>
                                )}
                                <h5>{participant.name}</h5>
                              </div>
                              {participant.institution && (
                                <p className="participant-institution">
                                  {participant.institution}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="no-participants">
                          No hay participantes registrados.
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <p>No hay eventos para este día.</p>
          ))}
      </div>
    </section>
  );
};

export default EventsBlock;
