import { useState, useEffect } from "react";

export default function WordLearningApp() {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  // States for language selection
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("es");

  // States for text input/output
  const [inputText, setInputText] = useState("");
  const [learningData, setLearningData] = useState(null);

  // UI states
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [targetDropdownOpen, setTargetDropdownOpen] = useState(false);
  const [sourceSearch, setSourceSearch] = useState("");
  const [targetSearch, setTargetSearch] = useState("");
  const [activeTab, setActiveTab] = useState("translation");

  // History state
  const [history, setHistory] = useState([]);

  // Sample language options
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
  ];

  // Filter languages based on search
  const filteredSourceLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(sourceSearch.toLowerCase())
  );

  const filteredTargetLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(targetSearch.toLowerCase())
  );

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Handle word learning
  const handleLearnWord = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);

    try {
      const response = await fetch(`${backendUrl}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          english_word: inputText.toLowerCase(),
          target_language: getLanguageName(targetLanguage),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch translation");
      }

      const data = await response.json();
      setLearningData(data);

      // Add to history
      setHistory((prev) => [data, ...prev].slice(0, 10));
    } catch (error) {
      console.error("Error fetching translation:", error);
      setLearningData(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Swap languages
  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  // Copy text
  const handleCopy = (text, type) => {
    if (!text) return;

    navigator.clipboard.writeText(text);
    setCopied(type);

    setTimeout(() => {
      setCopied("");
    }, 2000);
  };

  // Clear input text
  const handleClear = () => {
    setInputText("");
    setLearningData(null);
  };

  // Get language name by code
  const getLanguageName = (code) => {
    const language = languages.find((lang) => lang.code === code);
    return language ? language.name : code;
  };
  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-blue-600 dark:text-blue-400">Word</span>Wise
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Learn words with meanings and examples</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? "bg-gray-800 text-yellow-400" : "bg-gray-200 text-gray-700"}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </header>

        {/* Main learning card */}
        <div className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          {/* Language selection */}
          <div
            className={`flex items-center justify-between p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            {/* Source language dropdown */}
            <div className="relative w-2/5">
              <button
                onClick={() => {
                  setSourceDropdownOpen(!sourceDropdownOpen)
                  setTargetDropdownOpen(false)
                }}
                className={`w-full text-left px-4 py-2 rounded-lg flex justify-between items-center ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                <span>{getLanguageName(sourceLanguage)}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${sourceDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {sourceDropdownOpen && (
                <div
                  className={`absolute z-10 mt-1 w-full rounded-lg shadow-lg ${darkMode ? "bg-gray-700" : "bg-white"}`}
                >
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="Search languages..."
                      value={sourceSearch}
                      onChange={(e) => setSourceSearch(e.target.value)}
                      className={`w-full px-3 py-2 rounded-md ${darkMode
                          ? "bg-gray-600 text-white placeholder-gray-400 border-gray-600"
                          : "bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300"
                        } border`}
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredSourceLanguages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setSourceLanguage(language.code)
                          setSourceDropdownOpen(false)
                          setSourceSearch("")
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 ${sourceLanguage === language.code
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                            : ""
                          }`}
                      >
                        {language.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Swap button */}
            <button
              onClick={handleSwapLanguages}
              className={`p-2 rounded-full transition-all ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-blue-400" : "bg-gray-100 hover:bg-gray-200 text-blue-600"
                }`}
              aria-label="Swap languages"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 10l5 5 5-5"></path>
                <path d="M7 14l5-5 5 5"></path>
              </svg>
            </button>

            {/* Target language dropdown */}
            <div className="relative w-2/5">
              <button
                onClick={() => {
                  setTargetDropdownOpen(!targetDropdownOpen)
                  setSourceDropdownOpen(false)
                }}
                className={`w-full text-left px-4 py-2 rounded-lg flex justify-between items-center ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                <span>{getLanguageName(targetLanguage)}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${targetDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {targetDropdownOpen && (
                <div
                  className={`absolute z-10 mt-1 w-full rounded-lg shadow-lg ${darkMode ? "bg-gray-700" : "bg-white"}`}
                >
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="Search languages..."
                      value={targetSearch}
                      onChange={(e) => setTargetSearch(e.target.value)}
                      className={`w-full px-3 py-2 rounded-md ${darkMode
                          ? "bg-gray-600 text-white placeholder-gray-400 border-gray-600"
                          : "bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300"
                        } border`}
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredTargetLanguages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setTargetLanguage(language.code)
                          setTargetDropdownOpen(false)
                          setTargetSearch("")
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 ${targetLanguage === language.code
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                            : ""
                          }`}
                      >
                        {language.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input area */}
          <div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Enter a word to learn</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{inputText.length} characters</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter a word (e.g., beautiful, happy, computer)..."
                className={`w-full px-4 py-3 rounded-lg ${darkMode
                    ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                    : "bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300"
                  } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleLearnWord()
                  }
                }}
              />
              {inputText && (
                <button
                  onClick={handleClear}
                  className={`absolute top-3 right-3 p-1 rounded-full ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  aria-label="Clear text"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={handleLearnWord}
                disabled={!inputText || isProcessing}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${!inputText || isProcessing
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Learning...
                  </span>
                ) : (
                  "Learn Word"
                )}
              </button>
            </div>
          </div>

          {/* Results area */}
          {learningData && (
            <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              {/* Tab navigation */}
              <div className={`flex border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <button
                  onClick={() => setActiveTab("translation")}
                  className={`px-4 py-3 text-sm font-medium ${activeTab === "translation"
                      ? darkMode
                        ? "bg-gray-700 text-blue-400 border-b-2 border-blue-400"
                        : "bg-gray-50 text-blue-600 border-b-2 border-blue-600"
                      : darkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Translation
                </button>
                <button
                  onClick={() => setActiveTab("meaning")}
                  className={`px-4 py-3 text-sm font-medium ${activeTab === "meaning"
                      ? darkMode
                        ? "bg-gray-700 text-blue-400 border-b-2 border-blue-400"
                        : "bg-gray-50 text-blue-600 border-b-2 border-blue-600"
                      : darkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Meaning
                </button>
                <button
                  onClick={() => setActiveTab("examples")}
                  className={`px-4 py-3 text-sm font-medium ${activeTab === "examples"
                      ? darkMode
                        ? "bg-gray-700 text-blue-400 border-b-2 border-blue-400"
                        : "bg-gray-50 text-blue-600 border-b-2 border-blue-600"
                      : darkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Examples
                </button>
              </div>

              {/* Tab content */}
              <div className="p-4">
                {activeTab === "translation" && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{learningData.english_word}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">English</p>
                        </div>
                        <button
                          onClick={() => handleCopy(learningData.english_word, "english")}
                          className={`p-2 rounded-lg ${copied === "english"
                              ? "bg-green-600 text-white"
                              : darkMode
                                ? "bg-gray-600 hover:bg-gray-500"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        >
                          {copied === "english" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600 dark:text-blue-400"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>

                    <div className={`p-4 rounded-lg ${darkMode ? "bg-blue-900/30" : "bg-blue-50"}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold mb-1 text-blue-600 dark:text-blue-400">
                            {learningData.translation}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{learningData.target_language}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(learningData.translation, "translation")}
                          className={`p-2 rounded-lg ${copied === "translation"
                              ? "bg-green-600 text-white"
                              : darkMode
                                ? "bg-gray-600 hover:bg-gray-500"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        >
                          {copied === "translation" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "meaning" && (
                  <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">Definition</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{learningData.meaning}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(learningData.meaning, "meaning")}
                        className={`ml-4 p-2 rounded-lg ${copied === "meaning"
                            ? "bg-green-600 text-white"
                            : darkMode
                              ? "bg-gray-600 hover:bg-gray-500"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                      >
                        {copied === "meaning" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "examples" && (
                  <div className="space-y-4">
                    {Object.entries(learningData.examples).map(([key, example], index) => (
                      <div key={key} className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                              Example {index + 1}
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{example}</p>
                          </div>
                          <button
                            onClick={() => handleCopy(example, `example${index + 1}`)}
                            className={`ml-4 p-2 rounded-lg ${copied === `example${index + 1}`
                                ? "bg-green-600 text-white"
                                : darkMode
                                  ? "bg-gray-600 hover:bg-gray-500"
                                  : "bg-gray-200 hover:bg-gray-300"
                              }`}
                          >
                            {copied === `example${index + 1}` ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}