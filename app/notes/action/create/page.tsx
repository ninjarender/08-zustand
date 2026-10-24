import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import { OG_IMAGE } from "@/lib/seo";
import css from "./CreateNote.module.css";

export const metadata: Metadata = {
  title: "Create note | NoteHub",
  description: "Create a new note in NoteHub: add a title, content and a tag.",
  openGraph: {
    title: "Create note | NoteHub",
    description:
      "Create a new note in NoteHub: add a title, content and a tag.",
    url: "/notes/action/create",
    siteName: "NoteHub",
    images: [{ ...OG_IMAGE, alt: "Create note | NoteHub" }],
  },
};

const CreateNote = () => {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
};

export default CreateNote;
