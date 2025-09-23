import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import HeaderBlock from "../../HeaderBlock/HeaderBlock";
import FooterBlock from "../../FooterBlock/FooterBlock";

const EditProposal = () => {
  const { proposalId } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [proposalData, setProposalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proposalText, setProposalText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/proposals/detail/${proposalId}`
        );
        if (!response.ok) throw new Error("Error al obtener la propuesta");
        const data = await response.json();
        setProposalData(data);
        setProposalText(data.proposal);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProposal();
  }, [proposalId, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage("");
    try {
      const response = await fetch(`${API_URL}/api/proposals/${proposalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposal: proposalText }),
      });
      if (!response.ok) throw new Error("Error al guardar la propuesta");
      setSaveMessage("Resumen actualizado correctamente.");
      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      setSaveMessage("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500">Cargando propuesta...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!proposalData) return null;

  return (
    <>
      <HeaderBlock />
      <section className="container mx-auto min-h-170 p-10">
        <h2 className="text-4xl font-bold mb-4 text-yellow-aiesad">
          Editar resumen de propuesta
        </h2>
        <div className="mb-8">
          <h3 className="text-3xl font-semibold mb-4 text-gray-200">
            {proposalData.title}
          </h3>
        </div>
        <div className="mb-4">
          <p className="text-lg text-gray-300">
            Línea temática:{" "}
            <strong className="text-gray-200">{proposalData.thematicLine?.thematicLine}</strong>
          </p>
        </div>
        <div className="mb-8">
          <p className="text-lg text-gray-300">Autores:{" "}<strong className="text-gray-200">
          {proposalData.authors
            .map((a) =>
              a.sigeco ? `${a.sigeco.name} ${a.sigeco.lastname}` : a.email
            )
            .join(", ")}
            </strong></p>
        </div>
        <div className="py-2">
          {saveMessage && (
          <p className="mt-2 py-2 text-center bg-green-600 text-gray-50">{saveMessage}</p>
        )}
        </div>
        <form onSubmit={handleSubmit} className="mb-4">
          <label className="block mb-2 font-semibold text-yellow-aiesad text-lg">Resumen</label>
          <textarea
            className="w-full border rounded p-2 min-h-[200px]"
            value={proposalText}
            onChange={(e) => setProposalText(e.target.value)}
            required
          />
          <button
            type="submit"
            className="mt-4 bg-blue-aiesad text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={saving}
          >
            Guardar cambios
          </button>
        </form>
      </section>
      <FooterBlock />
    </>
  );
};

export default EditProposal;
