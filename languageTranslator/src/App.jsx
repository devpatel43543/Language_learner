import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  // States for language selection
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("en");

  // States for text input/output
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  // UI states
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [targetDropdownOpen, setTargetDropdownOpen] = useState(false);
  const [sourceSearch, setSourceSearch] = useState("");
  const [targetSearch, setTargetSearch] = useState("");

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

  // Handle translation
  const handleTranslate = () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock translation (in a real app, this would be an API call)
      const mockTranslation = `Translated: ${inputText}`;
      setOutputText(mockTranslation);

      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        sourceLanguage,
        targetLanguage,
        inputText,
        outputText: mockTranslation,
        timestamp: new Date(),
      };

      setHistory((prev) => [newHistoryItem, ...prev].slice(0, 5));
      setIsTranslating(false);
    }, 1000);
  };

  // Swap languages
  const handleSwapLanguages = () => {
    if (sourceLanguage === "auto") return;

    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(outputText);
    setOutputText(inputText);
  };

  // Copy translated text
  const handleCopy = () => {
    if (!outputText) return;

    navigator.clipboard.writeText(outputText);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Clear input text
  const handleClear = () => {
    setInputText("");
    setOutputText("");
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          <span className="text-blue-600 dark:text-blue-400">Lingo</span>Translate
        </h1>
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

      {/* Main translator card */}
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
              className={`w-full text-left px-4 py-2 rounded-lg flex justify-between items-center ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
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
                    className={`w-full px-3 py-2 rounded-md ${
                      darkMode
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
                      className={`w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 ${
                        sourceLanguage === language.code
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
            disabled={sourceLanguage === "auto"}
            className={`p-2 rounded-full transition-all ${
              sourceLanguage === "auto"
                ? "opacity-50 cursor-not-allowed"
                : darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-blue-400"
                  : "bg-gray-100 hover:bg-gray-200 text-blue-600"
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
              className={`w-full text-left px-4 py-2 rounded-lg flex justify-between items-center ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
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
                    className={`w-full px-3 py-2 rounded-md ${
                      darkMode
                        ? "bg-gray-600 text-white placeholder-gray-400 border-gray-600"
                        : "bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300"
                    } border`}
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredTargetLanguages
                    .filter((lang) => lang.code !== "auto")
                    .map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setTargetLanguage(language.code)
                          setTargetDropdownOpen(false)
                          setTargetSearch("")
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 ${
                          targetLanguage === language.code
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

        {/* Text areas */}
        <div className="grid md:grid-cols-2 gap-0">
          {/* Input area */}
          <div
            className={`p-4 ${darkMode ? "bg-gray-800" : "bg-white"} md:border-r ${darkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Original Text</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{inputText.length} / 5000</span>
            </div>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => {
                  if (e.target.value.length <= 5000) {
                    setInputText(e.target.value)
                  }
                }}
                placeholder="Enter text to translate..."
                className={`w-full h-40 p-3 rounded-lg resize-none ${
                  darkMode
                    ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                    : "bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300"
                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              ></textarea>
              {inputText && (
                <button
                  onClick={handleClear}
                  className={`absolute top-2 right-2 p-1 rounded-full ${
                    darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-200 hover:bg-gray-300"
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
            <div className="flex justify-between mt-2">
              <button
                className={`text-sm flex items-center ${
                  darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
                disabled={!inputText}
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
                  className="mr-1"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                Listen
              </button>
              <button
                onClick={handleTranslate}
                disabled={!inputText || isTranslating}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !inputText || isTranslating
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isTranslating ? (
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
                    Translating...
                  </span>
                ) : (
                  "Translate"
                )}
              </button>
            </div>
          </div>

          {/* Output area */}
          <div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Translation</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{outputText.length} characters</span>
            </div>
            <div className="relative">
              <textarea
                value={outputText}
                readOnly
                placeholder="Translation will appear here..."
                className={`w-full h-40 p-3 rounded-lg resize-none ${
                  darkMode
                    ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                    : "bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300"
                } border`}
              ></textarea>
            </div>
            <div className="flex justify-between mt-2">
              <button
                className={`text-sm flex items-center ${
                  darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
                disabled={!outputText}
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
                  className="mr-1"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                Listen
              </button>
              <button
                onClick={handleCopy}
                disabled={!outputText}
                className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                  !outputText
                    ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                    : copied
                      ? "bg-green-600 text-white"
                      : darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                {copied ? (
                  <>
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
                      className="mr-2"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
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
                      className="mr-2"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent translations */}
      {history.length > 0 && (
        <div className={`mt-8 rounded-xl shadow-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className={`px-4 py-3 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
            <h2 className="font-medium">Recent Translations</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {history.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex justify-between text-sm mb-1">
                  <div className="flex items-center">
                    <span className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {getLanguageName(item.sourceLanguage)} → {getLanguageName(item.targetLanguage)}
                    </span>
                  </div>
                  <span className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p className="text-sm truncate">{item.inputText}</p>
                  <p className={`text-sm truncate ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                    {item.outputText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
  )
}

export default App
