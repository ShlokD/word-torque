import Image from "next/image";
import { useEffect, useState } from "preact/hooks";
import { useRouter } from "next/router";
import Link from "next/link";
const toTitle = (str) =>
  str?.[0]?.toUpperCase?.() + str?.slice(1)?.toLowerCase();

const WordLink = ({ word }) => {
  return (
    <Link href={`/?w=${word}`}>
      <a className="border-2 border-red-400 bg-red-400 p-1 text-white text-sm">
        {word}
      </a>
    </Link>
  );
};
const Meaning = ({ partOfSpeech, definitions }) => {
  return definitions?.map((def, i) => {
    return (
      <div
        className="py-4 flex flex-col gap-2 border-b-2"
        key={`definition-${i}`}
      >
        <p className="font-bold py-2 text-sm">{partOfSpeech.toUpperCase()}</p>
        <p className="text-xl w-full">{def.definition}</p>
        {def.antonyms.length > 0 && (
          <div className="text-gray-400 py-2 flex flex-row gap-2">
            Antonyms{" "}
            {def.antonyms.map((a, i) => (
              <WordLink key={`antonym-${i}`} word={a} />
            ))}
          </div>
        )}
        {def.synonyms.length > 0 && (
          <div className="text-gray-400 py-2 flex flex-row gap-2">
            See Also
            {def.synonyms.map((s, i) => (
              <WordLink key={`synonym-${i}`} word={s} />
            ))}
          </div>
        )}
      </div>
    );
  });
};
export default function Home() {
  const params = new URLSearchParams(global?.window?.location?.search);
  const w = params.get("w");
  const [word, setWord] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [appState, setAppState] = useState("READY");

  const fetchRandomWord = async () => {
    try {
      setAppState("LOADING");
      const res = await fetch("/api/random");
      const json = await res.json();
      setWord(json);
      setAppState("READY");
    } catch (_) {
      setWord({});
    }
  };

  const fetchWord = async (term = w) => {
    try {
      setAppState("LOADING");
      const res = await fetch(`/api/word?w=${term}`);
      const json = await res.json();
      setWord(json);
      setAppState("READY");
    } catch (_) {
      setWord({});
    }
  };

  const handleSearch = () => {
    if (searchTerm.length === 0) return;
    params.set("w", searchTerm);
    window.location.search = params.toString();
    setSearchTerm("");
  };

  useEffect(() => {
    if (!w) {
      fetchRandomWord();
    } else {
      fetchWord();
    }
  }, [w]);

  const playSound = () => {
    if (!word.word) return;
    const speech = new SpeechSynthesisUtterance();
    speech.lang = "en";
    speech.text = word.word;
    speech.rate = 0.5;
    speech.volume = 40;
    window.speechSynthesis.speak(speech);
  };

  const synonyms = word?.meanings?.flatMap((m) => m.synonyms);

  return (
    <div className="bg-red-700 w-full h-full min-h-screen flex flex-col">
      <header className="flex flex-row items-center justify-center p-4 gap-2 w-full text-white">
        <Image src="/abstract.png" height="64" width="64" alt=""></Image>
        <h1 className="font-bold text-3xl">Torque Dictionary</h1>
      </header>
      <main
        style={{ minHeight: "80vh" }}
        className="w-11/12 self-center bg-gray-100 p-2 my-4 flex flex-col"
      >
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            handleSearch(searchTerm);
          }}
          className="m-4 flex flex-row items-stretch justify-center"
        >
          <input
            className="p-4 w-9/12"
            type="search"
            placeholder="Search for a word..."
            aria-label="Search for a word"
            value={searchTerm}
            onChange={(ev) => setSearchTerm(ev.target.value)}
          ></input>
          <button
            className="bg-red-700 text-white p-4 w-3/12 shadow-lg"
            onClick={handleSearch}
            type="submit"
          >
            SEARCH
          </button>
        </form>
        {appState === "LOADING" && (
          <p className="text-center p-4 ">Looking...</p>
        )}
        {word?.word?.length > 0 && appState === "READY" && (
          <div className="flex flex-col m-4 bg-white p-4">
            <div className="flex flex-row items-center gap-4">
              <h2 className="text-4xl font-bold">{toTitle(word.word)}</h2>
              <p>{word.phonetics?.[0]?.text}</p>
              {global.window?.speechSynthesis && (
                <button className="mt-2" onClick={playSound}>
                  <Image
                    src="/volume-up.png"
                    height="32"
                    width="32"
                    alt="Play sound"
                  />
                </button>
              )}
            </div>
            <hr className="w-1/12 my-4 border-red-700 border-4" />
            {synonyms?.length > 0 && (
              <div className="flex flex-col">
                <p>Related</p>
                <div className="flex flex-row flex-wrap gap-2">
                  {synonyms?.map((syn, i) => {
                    return <WordLink key={`syn-${i}`} word={syn} />;
                  })}
                </div>
              </div>
            )}
            {word?.meanings?.map((meaning, i) => {
              return <Meaning {...meaning} key={`meaning-${i}`} />;
            })}
            {word?.meanings?.length === 0 && (
              <p>No definitions found. Please try another word</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
