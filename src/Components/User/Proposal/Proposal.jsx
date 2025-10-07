import { useState, useEffect } from "react"; // Import useState and useEffect
import Cookies from "universal-cookie";
import HeaderBlock from "../../HeaderBlock/HeaderBlock";
import FooterBlock from "../../FooterBlock/FooterBlock";
import ApprovedMessage from "./Results/ApprovedMeesage";
import NoApprovedMessage from "./Results/NoApprovedMessage";
import RecommendedMessage from "./Results/RecommendedMessage";
import CartelMessage from "./Results/CartelMessage";
import VirtualRecommended from "./Results/VirtualRecommended";

const Proposal = () => {
  // State for user's existing proposals
  const [myProposals, setMyProposals] = useState([]);
  const [isLoadingMyProposals, setIsLoadingMyProposals] = useState(false);
  const [myProposalsError, setMyProposalsError] = useState(null);

  const cookies = new Cookies();
  const userId = cookies.get("id");
  const API_URL = import.meta.env.VITE_API_URL;

  // Effect to fetch user's proposals on component mount
  useEffect(() => {
    if (userId) {
      setIsLoadingMyProposals(true);
      setMyProposalsError(null);
      fetch(`${API_URL}/api/proposals/${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok while fetching proposals."
            );
          }
          return response.json();
        })
        .then((data) => {
          setMyProposals(data || []);
        })
        .catch((error) => {
          console.error("Error fetching user's proposals:", error);
          setMyProposalsError(error.message);
          setMyProposals([]);
        })
        .finally(() => {
          setIsLoadingMyProposals(false);
        });
    }
  }, [userId, API_URL]);

  return (
    <>
      <HeaderBlock />
      <section id="proposal" className="container mx-auto min-h-170 p-10 grid gap-10 grid-cols-2">
        <div>
          <h2 className="text-yellow-aiesad text-4xl mb-6">
            Propuestas registradas
          </h2>
          <div>
            {isLoadingMyProposals && (
              <p className="text-gray-300">Cargando mis propuestas...</p>
            )}
            {myProposalsError && (
              <p className="text-red-400">
                Error al cargar propuestas: {myProposalsError}
              </p>
            )}
            {!isLoadingMyProposals &&
              !myProposalsError &&
              myProposals.length === 0 && (
                <p className="text-gray-400">
                  Aún no se han registrado propuestas.
                </p>
              )}
            {!isLoadingMyProposals &&
              !myProposalsError &&
              myProposals.length > 0 && (
                <>
                  {myProposals.map((proposal) => {
                    // Directly use the thematicLine name from the proposal object
                    const thematicLineName =
                      proposal.thematicLine || "No especificada";

                    return (
                      <div
                        key={proposal.id}
                        className="bg-gray-700 p-4 rounded-lg shadow relative"
                      >
                        {
                          //<span className={`absolute inline-block py-1 px-2 right-0 rounded-bl-sm rounded-tl-sm ${getStateClasses(proposal.state)}`}>{ proposal.state}</span>
                        }
                        <h3 className="text-xl text-blue-aiesad font-semibold mb-2">
                          {proposal.title}
                        </h3>
                        <p className="text-gray-400 text-xs mb-1">
                          Línea Temática:{" "}
                          <span className="text-gray-300">
                            {thematicLineName}
                          </span>
                        </p>
                        <p className="text-gray-300 mb-1 text-sm">
                          <strong className="text-gray-400">Propuesta: </strong>
                          {(() => {
                            const words = proposal.proposal.split(/\s+/);
                            const maxWords = 50;
                            if (words.length > maxWords) {
                              return words.slice(0, maxWords).join(" ") + "...";
                            }
                            return proposal.proposal;
                          })()}
                        </p>
                        <p className="text-gray-400 text-xs mb-1">
                          Creado:{" "}
                          {new Date(proposal.createdAt).toLocaleString(
                            "es-MX",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )}{" "}
                          horas
                          {/*Actualizado: {new Date(proposal.updatedAt).toLocaleString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}*/}
                        </p>
                        <div>
                          <strong className="text-gray-400 text-sm">
                            Autores:
                          </strong>
                          <ul className="list-disc list-inside ml-4 text-xs">
                            {proposal.authors.map((author) => (
                              <li key={author.id} className="text-gray-300">
                                {author.fullname}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
          </div>
        </div>
        <div>
          <h3 className="text-blue-aiesad text-3xl mb-6">Resultados</h3>
          <div id="evaluationMessage">
            {isLoadingMyProposals && <p className="text-gray-400">Cargando evaluaciones...</p>}
            {myProposalsError && <p className="text-red-500">Error: {myProposalsError}</p>}
            {!isLoadingMyProposals && !myProposalsError && myProposals.length === 0 && (
              <p className="text-gray-400">No se encontraron propuestas.</p>
            )}
            {!isLoadingMyProposals &&
              !myProposalsError &&
              myProposals.map((proposal) => (
                <div key={proposal.id} className="mb-6 p-4 border rounded-md bg-gray-800 text-gray-300">
                  <h3 className="text-lg font-semibold text-yellow-aiesad mb-2">
                    {proposal.title}
                  </h3>
                  {proposal.state === "Aceptado" && <ApprovedMessage />}
                  {proposal.state === "Aceptado con recomendaciones" && proposal.authors.some(author => author.attendanceMode === "Presencial") && (
                    <RecommendedMessage proposalId={proposal.id} authors={proposal.authors} />
                  )}
                  {proposal.state === "Aceptado con recomendaciones" && proposal.authors.every(author => author.attendanceMode === "Virtual") && (
                    <VirtualRecommended proposalId={proposal.id} />
                  )}
                  {proposal.state === "Rechazado" && proposal.authors.some(author => author.attendanceMode === "Presencial") && <CartelMessage />}
                  {proposal.state === "Rechazado" && proposal.authors.every(author => author.attendanceMode === "Virtual") && <NoApprovedMessage />}
                </div>
              ))}
          </div>
        </div>
      </section>
      <FooterBlock />
    </>
  );
};

export default Proposal;
