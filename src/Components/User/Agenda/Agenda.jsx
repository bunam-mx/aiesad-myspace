import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import HeaderBlock from "../../HeaderBlock/HeaderBlock";
import FooterBlock from "../../FooterBlock/FooterBlock";
import ApprovedMessage from "../Proposal/Results/ApprovedMeesage";
import NoApprovedMessage from "../Proposal/Results/NoApprovedMessage";
import RecommendedMessage from "../Proposal/Results/RecommendedMessage";

const Agenda = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const userId = cookies.get("id");
  const [proposals, setProposals] = useState([]); // State to store all proposals
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to manage errors

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await fetch(`${API_URL}/api/proposals/${userId}`);
        if (!response.ok) {
          throw new Error("Error al obtener las propuestas");
        }
        const data = await response.json();
        setProposals(data); // Store all proposals in state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [userId]);

  return (
    <>
      <HeaderBlock />
      <section id="agenda" className="container mx-auto min-h-170 p-10">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-yellow-aiesad text-4xl mb-6">Mi agenda</h2>
            <div>
              <iframe
                src="https://calendar.google.com/calendar/embed?src=encuentroaiesad2025%40cuaed.unam.mx&ctz=America%2FMexico_City"
                style={{ border: 0 }}
                width="800"
                height="600"
                frameBorder="0"
                scrolling="no"
                className="max-w-2xl mx-auto"
              ></iframe>
            </div>
          </div>
          <div id="evaluationMessage">
            {loading && <p className="text-gray-400">Cargando evaluaciones...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!loading && !error && proposals.length === 0 && (
              <p className="text-gray-400">No se encontraron propuestas.</p>
            )}
            {!loading &&
              !error &&
              proposals.map((proposal) => (
                <div key={proposal.id} className="mb-6 p-4 border rounded-md bg-gray-800 text-gray-300">
                  <h3 className="text-lg font-semibold text-yellow-aiesad mb-2">
                    {proposal.title}
                  </h3>
                  {proposal.state === "Aceptado" && <ApprovedMessage />}
                  {proposal.state === "Aceptado con recomendaciones" && (
                    <RecommendedMessage proposalId={proposal.id} />
                  )}
                  {proposal.state === "Rechazado" && <NoApprovedMessage />}
                </div>
              ))}
          </div>
        </div>
      </section>
      <FooterBlock />
    </>
  );
};

export default Agenda;
