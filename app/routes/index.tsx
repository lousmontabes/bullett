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
        className="flex h-80 w-80 flex-col justify-items-stretch border-2 bg-zinc-800 p-4 "
        onClick={(e) => e.stopPropagation()}
      >
        {day + 1}
        <textarea
          type="text"
          className="my-4 flex w-full flex-1 resize-none bg-transparent font-serif"
          defaultValue={entry}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
          spellCheck={false}
        ></textarea>
      </div>
    </div>
  );
};

const Month = ({ n }: { n: number }) => {
  const [editingEntry, setEditingEntry] = useState<number | null>(null);
  const [entries, setEntries] = useState(new Array(n).fill(""));

  const onChangeEntry = (newEntry: string) => {
    const newEntries = [...entries];
    newEntries[editingEntry] = newEntry;
    setEntries(newEntries);
    localStorage.setItem("entries", JSON.stringify(newEntries));
  };

  const onClickDay = (n: number) => setEditingEntry(n);

  const closeModal = () => setEditingEntry(null);

  useEffect(() => {
    const storedEntries = localStorage.getItem("entries");
    setEntries(JSON.parse(storedEntries));
  }, []);

  return (
    <div>
      <div className="relative mb-16 block text-6xl">May</div>
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
    <main className="relative min-h-screen bg-zinc-800 p-16 font-sans text-white">
      <Month n={31} />
    </main>
  );
}
