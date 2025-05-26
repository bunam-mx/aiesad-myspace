import { useState, useEffect } from "react"; // Import useState and useEffect
import Cookies from "universal-cookie";
import HeaderBlock from "../../HeaderBlock/HeaderBlock";
import FooterBlock from "../../FooterBlock/FooterBlock";

const Proposal = () => {
  const [proposalText, setProposalText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [wordCountColor, setWordCountColor] = useState("text-green-500");
  const [proposalTitle, setProposalTitle] = useState(""); // State for proposal title
  const [isSubmitting, setIsSubmitting] = useState(false); // State for submission status
  const [submitMessage, setSubmitMessage] = useState({
    text: "",
    type: "",
    visible: false,
  }); // State for submission message

  // State for user's existing proposals
  const [myProposals, setMyProposals] = useState([]);
  const [isLoadingMyProposals, setIsLoadingMyProposals] = useState(false);
  const [myProposalsError, setMyProposalsError] = useState(null);

  const cookies = new Cookies();
  const userId = cookies.get("id");

  // Participant Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]); // Changed from selectedParticipant to selectedParticipants (array)
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL; // Assuming API_URL is needed
  const MAX_WORDS = 500;

  useEffect(() => {
    // Calculate words: split by space and filter out empty strings
    const words = proposalText.trim().split(/\s+/).filter(Boolean);
    const currentWordCount = words.length;
    setWordCount(currentWordCount);

    // Determine color based on word count
    if (currentWordCount >= 0 && currentWordCount <= 350) {
      setWordCountColor("text-green-500");
    } else if (currentWordCount >= 351 && currentWordCount <= 490) {
      setWordCountColor("text-orange-500");
    } else if (currentWordCount >= 491 && currentWordCount <= MAX_WORDS) {
      setWordCountColor("text-red-500");
    } else if (currentWordCount > MAX_WORDS) {
      setWordCountColor("text-red-700 font-bold"); // Emphasize exceeding limit
    }
  }, [proposalText]);

  // Debounced search effect
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoadingSearch(true);
    const timerId = setTimeout(() => {
      fetch(`${API_URL}/api/sigecos/search/${searchTerm}`)
        .then((response) => response.json())
        .then((data) => {
          setSearchResults(data || []);
          setShowResults(true);
        })
        .catch((error) => {
          console.error("Error fetching participants:", error);
          setSearchResults([]);
          setShowResults(true); // Show results (empty or error message) even on error
        })
        .finally(() => {
          setIsLoadingSearch(false);
        });
    }, 500); // Debounce time: 500ms

    return () => clearTimeout(timerId); // Cleanup timeout
  }, [searchTerm, API_URL]);

  // Effect to fetch user's proposals on component mount
  useEffect(() => {
    if (userId) {
      setIsLoadingMyProposals(true);
      setMyProposalsError(null);
      fetch(`${API_URL}/api/proposals/${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok while fetching proposals.");
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
  }, [userId, API_URL]); // Dependency array includes userId and API_URL

  const handleTextChange = (event) => {
    const newText = event.target.value;
    // Basic check to prevent excessive typing beyond a reasonable limit if needed,
    // though the primary feedback is visual.
    // For a hard limit, you might split, count, and then rejoin only up to MAX_WORDS.
    setProposalText(newText);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // setSelectedParticipant(null); // No longer needed to clear single selection here
  };

  const handleSelectParticipant = (participant) => {
    // Add participant only if not already selected
    if (!selectedParticipants.find((p) => p.id === participant.id)) {
      setSelectedParticipants((prevSelected) => [...prevSelected, participant]);
    }
    setSearchTerm(""); // Clear search term
    setSearchResults([]);
    setShowResults(false); // Hide results after selection
  };

  // New handler to remove a selected participant
  const handleRemoveParticipant = (participantId) => {
    setSelectedParticipants((prevSelected) =>
      prevSelected.filter((p) => p.id !== participantId)
    );
  };

  const handleTitleChange = (event) => {
    setProposalTitle(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ text: "", type: "", visible: false }); // Clear previous messages

    // Validate proposal text word count
    if (wordCount > MAX_WORDS) {
      setSubmitMessage({
        text: `Tu propuesta excede el límite de ${MAX_WORDS} palabras. Por favor, ajústala.`,
        type: "error",
        visible: true,
      });
      setIsSubmitting(false);
      return;
    }
    if (!proposalTitle.trim()) {
      setSubmitMessage({
        text: "El título de la propuesta no puede estar vacío.",
        type: "error",
        visible: true,
      });
      setIsSubmitting(false);
      return;
    }
    if (!proposalText.trim()) {
      setSubmitMessage({
        text: "La descripción de la propuesta no puede estar vacía.",
        type: "error",
        visible: true,
      });
      setIsSubmitting(false);
      return;
    }

    const userIds = [userId, ...selectedParticipants.map((p) => p.id)];
    // Remove duplicates if userId could also be in selectedParticipants (e.g., user selects themselves)
    const uniqueUserIds = [...new Set(userIds)];

    const proposalData = {
      title: proposalTitle,
      proposal: proposalText,
      userIds: uniqueUserIds,
    };

    try {
      const response = await fetch(`${API_URL}/api/proposals/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include Authorization header if needed, e.g., for bearer token
          // 'Authorization': `Bearer ${cookies.get('token')}`,
        },
        body: JSON.stringify(proposalData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage({
          text: "Propuesta enviada con éxito!",
          type: "success",
          visible: true,
        });
        // Optionally, reset the form
        setProposalTitle("");
        setProposalText("");
        setSelectedParticipants([]);
        // navigate('/dashboard'); // or to a success page
      } else {
        setSubmitMessage({
          text: `Error al enviar la propuesta: ${result.message || "Intente de nuevo."}`, // Corrected template literal
          type: "error",
          visible: true,
        });
      }
    } catch (error) {
      setSubmitMessage({
        text: `Error de conexión: ${
          error.message || "No se pudo conectar al servidor."
        }`,
        type: "error",
        visible: true,
      });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <HeaderBlock />
      <section id="proposal" className="container mx-auto min-h-170 p-10">
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="new-proposal">
            <h2 className="text-yellow-aiesad text-4xl mb-6">Mi propuesta</h2>
            <form onSubmit={handleSubmit}>
              {" "}
              {/* Attach handleSubmit to form */}
              {/* Submission Message Display */}
              {submitMessage.visible && (
                <div
                  className={`p-3 mb-4 rounded-md text-sm ${
                    submitMessage.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}
              <div id="submission" className="mb-8">
                <label
                  htmlFor="proposalTitle"
                  className="block text-gray-300 mb-2"
                >
                  Título de la Propuesta:
                </label>
                <input
                  type="text"
                  id="proposalTitle"
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-blue-aiesad focus:border-blue-aiesad text-gray-700"
                  placeholder="Escribe el título de tu propuesta..."
                  name="proposalTitle"
                  value={proposalTitle} // Bind value to state
                  onChange={handleTitleChange} // Handle changes
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="proposalTextArea"
                  className="block text-gray-300 mb-2"
                >
                  Descripción de la Propuesta:
                </label>
                <textarea
                  id="proposalTextArea"
                  className="w-full h-64 p-2 border border-gray-300 rounded-md focus:ring-blue-aiesad focus:border-blue-aiesad resize-none text-gray-700"
                  placeholder={`Escribe tu propuesta aquí (máximo ${MAX_WORDS} palabras)...`}
                  value={proposalText}
                  onChange={handleTextChange}
                  name="proposalText"
                  disabled={isSubmitting}
                />
                <div className={`mt-2 text-sm ${wordCountColor}`}>
                  Palabras: {wordCount} / {MAX_WORDS}
                  {wordCount > MAX_WORDS && (
                    <span className="ml-2 font-bold">
                      ¡Has excedido el límite de palabras!
                    </span>
                  )}
                </div>
              </div>
              {/* Participant Search Section */}
              <div id="participants" className="mb-8">
                <label
                  htmlFor="participantSearch"
                  className="block text-gray-300 mb-2"
                >
                  Buscar y Agregar Participante:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="participantSearch"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-aiesad focus:border-blue-aiesad text-gray-700"
                    placeholder="Escribe para buscar participantes..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() =>
                      searchTerm &&
                      searchResults.length > 0 &&
                      setShowResults(true)
                    }
                    disabled={isSubmitting}
                  />
                  {isLoadingSearch && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Buscando...
                    </div>
                  )}
                  {showResults && searchResults.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                      {searchResults.map((participant) => (
                        <li
                          key={participant.id}
                          className="p-2 hover:bg-blue-aiesad hover:text-white cursor-pointer text-gray-700"
                          onClick={() => handleSelectParticipant(participant)}
                        >
                          {participant.fullname}
                        </li>
                      ))}
                    </ul>
                  )}
                  {showResults &&
                    searchResults.length === 0 &&
                    searchTerm &&
                    !isLoadingSearch && (
                      <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 p-2 text-gray-500 shadow-lg">
                        No se encontraron participantes.
                      </div>
                    )}
                </div>
              </div>
              {/* Display selected participants */}
              {selectedParticipants.length > 0 && (
                <div className="mb-8">
                  <label className="block text-gray-300 mb-2">
                    Participantes Seleccionados:
                  </label>
                  <ul className="list-none p-0 m-0">
                    {selectedParticipants.map((p) => (
                      <li
                        key={p.id}
                        className="flex justify-between items-center bg-gray-700 text-gray-50 p-2 rounded-md mb-2 shadow"
                      >
                        <span>{p.fullname}</span>
                        <button
                          type="button" // Important: type="button" to prevent form submission
                          onClick={() => handleRemoveParticipant(p.id)}
                          className="ml-4 text-red-400 hover:text-red-200"
                          aria-label={`Remover a ${p.fullname}`}
                          disabled={isSubmitting}
                        >
                          <i className="fas fa-times-circle"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* TODO: Add a submit button for the form */}
              <button
                type="submit"
                className="bg-blue-aiesad text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={
                  isSubmitting || (wordCount > MAX_WORDS && proposalText !== "")
                }
              >
                {isSubmitting ? "Enviando..." : "Enviar Propuesta"}
              </button>
            </form>
          </div>
          <div className="my-proposals ml-0 lg:ml-4 mt-10 lg:mt-0">
            <h2 className="text-yellow-aiesad text-4xl mb-6">Mis Propuestas Cargadas</h2>
            {isLoadingMyProposals && <p className="text-gray-300">Cargando mis propuestas...</p>}
            {myProposalsError && <p className="text-red-400">Error al cargar propuestas: {myProposalsError}</p>}
            {!isLoadingMyProposals && !myProposalsError && myProposals.length === 0 && (
              <p className="text-gray-400">Aún no has cargado ninguna propuesta.</p>
            )}
            {!isLoadingMyProposals && !myProposalsError && myProposals.length > 0 && (
              <ul className="space-y-6">
                {myProposals.map(proposal => (
                  <li key={proposal.id} className="bg-gray-700 p-4 rounded-lg shadow">
                    <h3 className="text-xl text-blue-aiesad font-semibold mb-2">{proposal.title}</h3>
                    <p className="text-gray-300 mb-1 text-sm">
                      <strong className="text-gray-400">Propuesta:</strong> {proposal.proposal.substring(0, 150)}{proposal.proposal.length > 150 ? '...' : ''}
                    </p>
                    <p className="text-gray-400 text-xs mb-1">
                      Creado: {new Date(proposal.createdAt).toLocaleDateString()} - 
                      Actualizado: {new Date(proposal.updatedAt).toLocaleDateString()}
                    </p>
                    <div>
                      <strong className="text-gray-400 text-sm">Autores:</strong>
                      <ul className="list-disc list-inside ml-4 text-xs">
                        {proposal.authors.map(author => (
                          <li key={author.id} className="text-gray-300">{author.fullname}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
      <FooterBlock />
    </>
  );
};

export default Proposal;
