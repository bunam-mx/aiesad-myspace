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
      case "Enviado":
        return "bg-gray-500 text-white";
      case "En proceso":
        return "bg-blue-500 text-black";
      case "Aceptado":
        return "bg-green-500 text-white";
      case "Aceptado con recomendaciones":
        return "bg-orange-500 text-white";
      case "Rechazado":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-black"; // Default fallback
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
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Network response was not ok while fetching thematic lines."
          );
        }
        return response.json();
      })
      .then((data) => {
        setThematicLines(data || []);
      })
      .catch((error) => {
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
  }, [userId, API_URL]); // Dependency array includes userId and API_URL

  

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
        <h2 className="text-yellow-aiesad text-4xl mb-6">
          Propuestas registradas
        </h2>
        <div className="grid lg:grid-cols-2 gap-10">
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
                        {new Date(proposal.createdAt).toLocaleString("es-MX", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}{" "}
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
      </section>
      <FooterBlock />
    </>
  );
};

export default Proposal;
