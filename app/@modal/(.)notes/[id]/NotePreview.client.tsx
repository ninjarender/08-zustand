"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api";
import css from "./NotePreview.module.css";

const NotePreview = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  // модалка — це реальний URL /notes/[id]: закрити = повернутися в історії
  // на сторінку, з якої її відкрили (бекдроп, Escape і кнопка Back)
  return (
    <Modal onClose={router.back}>
      <div className={css.container}>
        {isLoading && <p>Loading, please wait...</p>}
        {!isLoading && (error || !note) && <p>Something went wrong.</p>}
        {note && (
          <div className={css.item}>
            <button className={css.backBtn} onClick={() => router.back()}>
              Back
            </button>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.tag}>{note.tag}</p>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>
              {note.updatedAt
                ? `Updated at: ${note.updatedAt}`
                : `Created at: ${note.createdAt}`}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NotePreview;
