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
  const [editingProposalId, setEditingProposalId] = useState(null); // State for tracking the proposal being edited
  const [submitMessage, setSubmitMessage] = useState({
    text: "",
    type: "",
    visible: false,
  }); // State for submission message

  // State for user's existing proposals
  const [myProposals, setMyProposals] = useState([]);
  const [isLoadingMyProposals, setIsLoadingMyProposals] = useState(false);
  const [myProposalsError, setMyProposalsError] = useState(null);

  // State for thematic lines
  const [thematicLines, setThematicLines] = useState([]);
  const [isLoadingThematicLines, setIsLoadingThematicLines] = useState(false);
  const [selectedThematicLineId, setSelectedThematicLineId] = useState("");


  const cookies = new Cookies();
  const userId = cookies.get("id");
  const attendanceMode = cookies.get("attendanceMode");

  // Helper function to get Tailwind CSS classes based on proposal state
  const getStateClasses = (state) => {
    switch (state) {
      case 'Enviado':
        return 'bg-gray-500 text-white';
      case 'En proceso':
        return 'bg-blue-500 text-black';
      case 'Aceptado':
        return 'bg-green-500 text-white';
      case 'Aceptado con recomendaciones':
        return 'bg-orange-500 text-white';
      case 'Rechazado':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-400 text-black'; // Default fallback
    }
  };

  // Participant Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]); // Changed from selectedParticipant to selectedParticipants (array)
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL; // Assuming API_URL is needed
  const MAX_WORDS = 500;

  // Effect to fetch thematic lines
  useEffect(() => {
    setIsLoadingThematicLines(true);
    fetch(`${API_URL}/api/thematiclines/`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok while fetching thematic lines.");
        }
        return response.json();
      })
      .then(data => {
        setThematicLines(data || []);
      })
      .catch(error => {
        console.error("Error fetching thematic lines:", error);
        setThematicLines([]); 
      })
      .finally(() => {
        setIsLoadingThematicLines(false);
      });
  }, [API_URL]);

  // Function to fetch user's proposals
  const fetchMyProposals = () => {
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
  };

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

  const handleThematicLineChange = (event) => {
    setSelectedThematicLineId(event.target.value);
  };

  const handleStartEdit = (proposalToEdit) => {
    setEditingProposalId(proposalToEdit.id);
    setProposalTitle(proposalToEdit.title);
    setProposalText(proposalToEdit.proposal);
    // Filter out the current user from the authors list when populating selectedParticipants
    const otherParticipants = proposalToEdit.authors.filter(author => author.id !== parseInt(userId));
    setSelectedParticipants(otherParticipants || []);

    // Find the ID of the thematic line based on its name
    const proposalThematicLineName = proposalToEdit.thematicLine;
    const foundThematicLine = thematicLines.find(line => line.thematicLine === proposalThematicLineName);
    setSelectedThematicLineId(foundThematicLine ? String(foundThematicLine.id) : "");

    setSubmitMessage({ text: "", type: "", visible: false }); // Clear any previous messages
    window.scrollTo(0, 0); // Scroll to top to see the form
  };

  const handleCancelEdit = () => {
    setEditingProposalId(null);
    setProposalTitle("");
    setProposalText("");
    setSelectedParticipants([]);
    setSelectedThematicLineId("");
    setSubmitMessage({ text: "", type: "", visible: false });
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

    if (!selectedThematicLineId) {
      setSubmitMessage({
        text: "Debe seleccionar una línea temática.",
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
      thematicLineId: parseInt(selectedThematicLineId),
    };

    try {
      let response;
      let result;

      if (editingProposalId) {
        // Editing existing proposal
        response = await fetch(
          `${API_URL}/api/proposals/${editingProposalId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              // 'Authorization': `Bearer ${cookies.get('token')}`,
            },
            body: JSON.stringify(proposalData),
          }
        );
      } else {
        // Creating new proposal
        response = await fetch(`${API_URL}/api/proposals/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${cookies.get('token')}`,
          },
          body: JSON.stringify(proposalData),
        });
      }

      result = await response.json();

      if (response.ok) {
        setSubmitMessage({
          text: editingProposalId
            ? "Propuesta actualizada con éxito!"
            : "Propuesta enviada con éxito!",
          type: "success",
          visible: true,
        });
        window.scrollTo(0, 0); // Scroll to top
        fetchMyProposals(); // Re-fetch proposals to update the list
        if (editingProposalId) {
          // Delay resetting the form to allow the user to see the success message
          setTimeout(() => {
            handleCancelEdit(); // Reset form after editing
          }, 3000); // 3-second delay
        } else {
          // Optionally, reset the form for new submission
          setProposalTitle("");
          setProposalText("");
          setSelectedParticipants([]);
          setSelectedThematicLineId("");
          // Optionally, hide message after a delay for new submissions too
          // setTimeout(() => {
          //   setSubmitMessage({ text: "", type: "", visible: false });
          // }, 3000);
        }
      } else {
        setSubmitMessage({
          text: `Error al ${
            editingProposalId ? "actualizar" : "enviar"
          } la propuesta: ${result.message || "Intente de nuevo."}`,
          type: "error",
          visible: true,
        });
        window.scrollTo(0, 0); // Scroll to top
      }
    } catch (error) {
      setSubmitMessage({
        text: `Error de conexión: ${
          error.message || "No se pudo conectar al servidor."
        }`,
        type: "error",
        visible: true,
      });
      window.scrollTo(0, 0); // Scroll to top
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <HeaderBlock />
      <section id="proposal" className="container mx-auto min-h-170 p-10">
        <h2 className="text-yellow-aiesad text-4xl mb-6">Ponencias propuestas</h2>
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="new-proposal">
            <h3 className="text-blue-aiesad text-3xl mb-2">
              {editingProposalId ? "Editar Propuesta" : "Nueva propuesta"}
            </h3>
            <p className="mb-6 text-gray-400 text-lg">Modo de presentación <span className="inline-block px-2 bg-blue-aiesad text-gray-300 rounded-sm">{attendanceMode}</span></p>
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
                  Título
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
                  Resumen
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
              <div id="thematicLine" className="mb-8">
                <label htmlFor="thematicLineSelect" className="block text-gray-300 mb-2">
                  Línea Temática
                </label>
                <select
                  id="thematicLineSelect"
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-blue-aiesad focus:border-blue-aiesad text-gray-700"
                  value={selectedThematicLineId}
                  onChange={handleThematicLineChange}
                  disabled={isSubmitting || isLoadingThematicLines}
                  name="thematicLineId"
                >
                  <option value="">
                    {isLoadingThematicLines ? "Cargando líneas..." : "Seleccione una línea temática"}
                  </option>
                  {thematicLines.map((line) => (
                    <option key={line.id} value={line.id}>
                      {line.thematicLine}
                    </option>
                  ))}
                </select>
              </div>
              {/* Participant Search Section */}
              <div id="participants" className="mb-8">
                <label
                  htmlFor="participantSearch"
                  className="block text-gray-300 mb-2"
                >
                  Buscar y agregar participante
                </label>
                <div className="relative mb-2">
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
                <p className="text-sm text-yellow-600">Si los participantes aún no se han registrado, puede agregarlos posteriormente editando la propuesta</p>
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
              {/*<button
                type="submit"
                className="bg-blue-aiesad text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={
                  isSubmitting || (wordCount > MAX_WORDS && proposalText !== "")
                }
              >
                {isSubmitting
                  ? editingProposalId
                    ? "Actualizando..."
                    : "Enviando..."
                  : editingProposalId
                  ? "Actualizar Propuesta"
                  : "Enviar Propuesta"}
              </button>*/}
              {editingProposalId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="ml-4 bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancelar Edición
                </button>
              )}
            </form>
          </div>
          <div className="my-proposals ml-0 lg:ml-4 mt-10 lg:mt-0">
            <h3 className="text-blue-aiesad text-3xl mb-6">Propuestas registradas</h3>
            {isLoadingMyProposals && <p className="text-gray-300">Cargando mis propuestas...</p>}
            {myProposalsError && <p className="text-red-400">Error al cargar propuestas: {myProposalsError}</p>}
            {!isLoadingMyProposals && !myProposalsError && myProposals.length === 0 && (
              <p className="text-gray-400">Aún no se han registrado propuestas.</p>
            )}
            {!isLoadingMyProposals && !myProposalsError && myProposals.length > 0 && (
              <ul className="space-y-6">
                {myProposals.map(proposal => {
                  // Directly use the thematicLine name from the proposal object
                  const thematicLineName = proposal.thematicLine || "No especificada";

                  return (
                    <li key={proposal.id} className="bg-gray-700 p-4 rounded-lg shadow relative">
                      {
                        //<span className={`absolute inline-block py-1 px-2 right-0 rounded-bl-sm rounded-tl-sm ${getStateClasses(proposal.state)}`}>{ proposal.state}</span>
                      }
                      <h3 className="text-xl text-blue-aiesad font-semibold mb-2">{proposal.title}</h3>
                      <p className="text-gray-400 text-xs mb-1">
                        Línea Temática: <span className="text-gray-300">{thematicLineName}</span>
                      </p>
                      <p className="text-gray-300 mb-1 text-sm">
                        <strong className="text-gray-400">Propuesta: </strong> 
                        {
                          (() => {
                            const words = proposal.proposal.split(/\s+/);
                            const maxWords = 50;
                            if (words.length > maxWords) {
                              return words.slice(0, maxWords).join(' ') + '...';
                            }
                            return proposal.proposal;
                          })()
                        }
                      </p>
                      <p className="text-gray-400 text-xs mb-1">
                        Creado: {new Date(proposal.createdAt).toLocaleString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })} horas
                        {/*Actualizado: {new Date(proposal.updatedAt).toLocaleString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}*/}
                      </p>
                      <div>
                        <strong className="text-gray-400 text-sm">Autores:</strong>
                        <ul className="list-disc list-inside ml-4 text-xs">
                          {proposal.authors.map(author => (
                            <li key={author.id} className="text-gray-300">{author.fullname}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 text-right">
                        {proposal.editable !== false && (
                          <button
                            onClick={() => handleStartEdit(proposal)}
                            className="bg-yellow-aiesad text-black px-4 py-1 rounded-md hover:bg-yellow-600 text-sm"
                            disabled={isSubmitting}
                          >
                            Editar
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
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
