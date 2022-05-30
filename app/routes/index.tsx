import { Link } from "@remix-run/react";
import _ from "lodash";
import { useEffect, useState } from "react";

const Modal = ({
  open,
  day,
  entry,
  onClose,
  onChange,
}: {
  open: boolean;
  day: number;
  entry: string;
  onClose: Function;
  onChange: Function;
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
        className="flex h-full w-full flex-col justify-items-stretch border-2 bg-zinc-800 p-4 md:h-80 md:w-80"
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
          className="my-4 flex w-full flex-1 resize-none bg-transparent font-serif"
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

const Month = ({ n }: { n: number }) => {
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
            className="relative box-border inline-flex h-36 cursor-pointer flex-col items-start overflow-hidden border-2 border-transparent p-4 text-left font-serif hover:border-white"
            onClick={() => onClickDay(n)}
          >
            <div className="mb-2 font-sans">{n + 1}</div>
            <div className="text-zinc-300">{entry}</div>
            <div className="absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-zinc-800"></div>
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
        />
      )}
    </div>
  );
};

export default function Index() {
  return (
    <main className="relative min-h-screen bg-zinc-800 p-4 font-sans text-white md:p-16">
      <Month n={31} />
    </main>
  );
}
