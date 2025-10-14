import { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import HeaderBlock from "../../HeaderBlock/HeaderBlock";
import FooterBlock from "../../FooterBlock/FooterBlock";
import EventsBlock from "../../EventsBlock/EventsBlock";
import WorkshopList from "../../Workshop/List";
import { getUserTimeZone } from "../../../utils/timezone";
import "./Agenda.css";

const Agenda = () => {
  //const cookies = new Cookies();
  // const userId = cookies.get("id");
  // Helper para formatear la fecha como "Lunes 20 de Octubre de 2025"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Ajustamos la zona horaria para evitar errores de un día
    const correctedDate = new Date(
      date.valueOf() + date.getTimezoneOffset() * 60000
    );
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    const formattedDate = new Intl.DateTimeFormat("es-ES", options)
      .format(correctedDate)
      .replace(",", "");
    // Capitalizar el primer caracter
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };
  const eventDates = ["2025-10-20", "2025-10-21", "2025-10-22"];
  const [selectedDate, setSelectedDate] = useState(eventDates[0]);
  const headerRef = useRef(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const userTimeZoneLabel = getUserTimeZone();
  const shouldHideTimeZoneNotice = userTimeZoneLabel === "America/Mexico_City";

  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsHeaderVisible(entry.isIntersecting);
    });

    observer.observe(headerElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <HeaderBlock />
      <section id="agenda" className="container mx-auto min-h-170 p-10">
        <header
          ref={headerRef}
          className="flex flex-col items-start gap-6 mb-8 text-left md:mb-20"
        >
          <nav className="md:flex md:items-start">
            {eventDates.map((date) => {
            const isActive = selectedDate === date;
            return (
              <button
                key={date}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={`text-yellow-aiesad w-full md:w-auto my-2 text-sm px-4! btn-aiesad mx-1 transition-colors duration-200 ${
                  isActive
                    ? "btn-yellow-aiesad text-dark-aiesad"
                    : "text-gray-400 hover:text-yellow-aiesad"
                }`}
                aria-pressed={isActive}
              >
                {formatDate(date)}
              </button>
            );
          })}
          </nav>
          <div
            className="user-timezone"
            style={shouldHideTimeZoneNotice ? { display: "none" } : undefined}
          >
            <i className="fas fa-globe-americas"></i>{" "}
            <small>
              Horarios convertidos desde Ciudad de México a su zona horaria:{" "}
              {userTimeZoneLabel}
            </small>
          </div>
        </header>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <EventsBlock key={selectedDate} date={selectedDate} />
          </div>
          <div>
            <h2 className="text-3xl text-blue-aiesad -mt-14 mb-4 border-b font-semibold">
              Talleres
            </h2>
            <WorkshopList key={selectedDate} date={selectedDate} />
          </div>
        </div>
      </section>
      {!isHeaderVisible && (
        <div id="day-indicator">
          <i className="fas fa-calendar-week"></i>{" "}
          <small>
            Visualizando el programa del día {formatDate(selectedDate)}
          </small>
        </div>
      )}
      <FooterBlock />
    </>
  );
};

export default Agenda;
