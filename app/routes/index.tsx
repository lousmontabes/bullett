import { Link } from "@remix-run/react";
import _ from "lodash";
import { useEffect, useState } from "react";

const Modal = ({
  open,
  day,
  entry,
  onClose,
  onChange,
  theme,
}: {
  open: boolean;
  day: number;
  entry: string;
  onClose: Function;
  onChange: Function;
  theme: Object;
}) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onClose();
    }
  };

  return (
    <div
      className={`${
        !open ? "hidden" : ""
      } fixed top-0 left-0 flex h-full w-full items-center justify-center shadow-md`}
      onClick={onClose}
    >
      <div
        className={`flex h-full w-full flex-col justify-items-stretch border-2 ${theme.background} p-4 md:h-80 md:w-80 border-${theme.text}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between">
          <span>May {day + 1}</span>
          <span className="cursor-pointer" onClick={onClose}>
            ✕
          </span>
        </div>
        <textarea
          type="text"
          className={`my-4 flex w-full flex-1 resize-none bg-transparent font-serif placeholder:text-${theme.text}`}
          defaultValue={entry}
          placeholder="You haven't logged this day yet. Write something down! ✍️"
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          spellCheck={false}
        ></textarea>
      </div>
    </div>
  );
};

const Month = ({ n, theme }: { n: number; theme: Object }) => {
  const [editingEntry, setEditingEntry] = useState<number | null>(null);
  const [entries, setEntries] = useState([]);

  const onChangeEntry = (newEntry: string) => {
    const newEntries = [...entries];
    newEntries[editingEntry] = newEntry;
    setEntries(newEntries);
    localStorage.setItem("entries", JSON.stringify(newEntries));
  };

  const onClickDay = (n: number) => setEditingEntry(n);

  const closeModal = () => setEditingEntry(null);

  useEffect(() => {
    const emptyArray = new Array(n).fill("");
    const storedEntries = localStorage.getItem("entries");
    setEntries(JSON.parse(storedEntries) || emptyArray);
  }, []);

  return (
    <div>
      <div className="relative m-4 mb-8 block text-6xl md:m-4 md:mb-16">
        May
      </div>
      <div className="grid grid-cols-1 justify-items-stretch md:grid-cols-7">
        {entries.map((entry: string, n: number) => (
          <button
            key={n}
            className={`relative box-border inline-flex h-36 cursor-pointer flex-col items-start overflow-hidden border-2 border-transparent p-4 text-left font-serif hover:border-${theme.text}`}
            onClick={() => onClickDay(n)}
          >
            <div className="mb-2 font-sans">{n + 1}</div>
            <div className="opacity-75">{entry}</div>
            <div
              className={`absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-${theme.background}`}
            ></div>
          </button>
        ))}
      </div>
      {editingEntry !== null && (
        <Modal
          open={editingEntry !== null}
          day={editingEntry}
          entry={entries[editingEntry]}
          onClose={closeModal}
          onChange={onChangeEntry}
          theme={theme}
        />
      )}
    </div>
  );
};

export default function Index() {
  const THEME_ZINC = {
    background: "bg-zinc-800",
    text: "text-white",
  };
  const THEME_SLATE = { background: "bg-slate-800", text: "text-white" };
  const THEME_VIOLET = { background: "bg-violet-100", text: "text-zinc-800" };
  const THEME_EMERALD = { background: "bg-emerald-100", text: "text-zinc-800" };
  const THEME_SKY = { background: "bg-sky-100", text: "text-zinc-800" };

  const themes = [
    THEME_ZINC,
    THEME_SLATE,
    THEME_VIOLET,
    THEME_EMERALD,
    THEME_SKY,
  ];

  const [showSettingsBar, setShowSettingsBar] = useState(false);
  const [theme, setTheme] = useState(THEME_ZINC);

  const changeTheme = (theme) => {
    localStorage.setItem("theme", JSON.stringify(theme));
    setTheme(theme);
  };

  useEffect(() => {
    const defaultTheme = THEME_ZINC;
    const storedTheme = localStorage.getItem("theme");
    setTheme(JSON.parse(storedTheme) || defaultTheme);
  }, []);

  return (
    <>
      <div
        className={`top-0 left-0 z-50 flex w-full items-center gap-4 p-8 py-4 ${
          showSettingsBar ? "bg-white" : `${theme.text} ${theme.background}`
        }`}
      >
        <div
          className="cursor-pointer text-2xl"
          onClick={() => setShowSettingsBar(!showSettingsBar)}
        >
          {showSettingsBar ? "✕" : "☰"}
        </div>
        {showSettingsBar &&
          themes.map((theme, i) => (
            <button
              key={`theme-${i}`}
              className={`h-8 w-8 cursor-pointer rounded-full ${theme.background}`}
              onClick={() => changeTheme(theme)}
            ></button>
          ))}
      </div>
      <main
        className={`relative min-h-screen ${theme.background} p-4 py-1 font-sans ${theme.text} md:p-5 md:py-1`}
      >
        <Month n={31} theme={theme} />
      </main>
    </>
  );
}
