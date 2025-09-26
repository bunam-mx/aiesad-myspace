import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const RecommendedMessage = ({ proposalId }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [comments, setComments] = useState([]); // State to store comments
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to manage errors

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${API_URL}/api/histories/${proposalId}`);
        if (!response.ok) {
          throw new Error("Error al obtener los comentarios");
        }
        const data = await response.json();
        setComments(data); // Store comments in state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [proposalId, API_URL]);

  return (
    <div className="bg-gray-100 border-t-3 border-orange-300 text-gray-700 text-sm leading-7 px-4 py-3 relative">
      <p>Nos complace informarle que su propuesta ha sido <strong className="font-bold">aceptada con modificaciones</strong> para formar parte del <strong className="font-bold">programa virtual</strong> del <strong className="font-bold">XXI Encuentro AIESAD 2025</strong>, tras una revisión cuidadosa por parte del Comité evaluador.</p>
      <p>Valoramos especialmente su contribución al enfoque innovador, académico y social que este espacio busca promover. Su participación enriquecerá sin duda el diálogo y la reflexión colectiva durante el evento. Agradecemos que considere los comentarios de los revisores pares y que actualice su resumen en esta misma plataforma <strong className="font-bold">entre el 22 y 26 de septiembre</strong>.</p>
      <div className="bg-gray-200 my-4 p-4 rounded" id="comments-section">
        {loading && <p className="text-gray-500">Cargando comentarios...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && comments.length === 0 && (
          <p className="text-gray-500">No hay comentarios disponibles.</p>
        )}
        {!loading && !error && comments.length > 0 && (
          <>
            <h4 className="font-bold text-blue-aiesad text-lg border-b border-blue-aiesad mb-2">Comentarios</h4>
            <ul className="list-disc list-inside">
              {comments.map((comment) => (
                <li key={comment.id} className="text-gray-700">{comment.comment}</li>
              ))}
            </ul>
          </>
        )}
        <p className="text-center mt-6 mb-2">
          <NavLink
            to={`${import.meta.env.VITE_BASE_URL}/user/editproposal/${proposalId}`}
            className="bg-blue-aiesad text-gray-50 hover:bg-blue-900 py-2 px-4 rounded"
          >
            actualizar resumen
          </NavLink>
        </p>
      </div>
      <p>Le pedimos estar atenta/o a futuras comunicaciones y no dude en escribirnos al correo <a href="mailto:encuentroaiesad2025@cuaed.unam.mx">encuentroaiesad2025@cuaed.unam.mx</a> si tiene alguna consulta.</p>
      <p>Le agradecemos su interés, compromiso y disposición para compartir su experiencia con nuestra comunidad.</p>
      <div className="mt-4">
        <p className="mb-2">Con un cordial saludo,</p>
        <p>El comité organizador</p>
        <p>XXI Encuentro AIESAD 2025</p>
        <p><a href="mailto:encuentroaiesad2025@cuaed.unam.mx">encuentroaiesad2025@cuaed.unam.mx</a></p>
      </div>
    </div>
  );
};

export default RecommendedMessage;
