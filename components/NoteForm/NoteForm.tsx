"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import { TAGS, type NewNote } from "@/types/note";
import css from "./NoteForm.module.css";

const subscribeNoop = () => () => {};

export default function NoteForm() {
  const fieldId = useId();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const [titleError, setTitleError] = useState("");

  // на сервері localStorage немає: HTML мав би порожню чернетку, а клієнт —
  // збережену, і defaultValue розійшлися б при гідратації (тема 15, §8.2).
  // Тому поля рендеримо лише на клієнті після гідратації: getServerSnapshot
  // (false) діє на сервері й під час гідратації, далі — true
  const isMounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  // кожна зміна поля одразу йде в чернетку (name поля = ключ NewNote)
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      // списки зараз неактивні (ми на сторінці створення), а NotesClient після
      // повернення не перезапитує дані (refetchOnMount: false) — тож оновлюємо всі
      queryClient.invalidateQueries({
        queryKey: ["notes"],
        refetchType: "all",
      });
      clearDraft();
      goBack();
    },
  });

  // на маршрут, з якого відкрили створення; якщо сторінку відкрили напряму
  // (нова вкладка, закладка) — історії в застосунку немає, тож до списку
  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/notes/filter/all");
    }
  };

  const handleSubmit = (formData: FormData) => {
    // as лише «вірить» TS: тому name полів збігаються з ключами NewNote,
    // а tag обмежений <select> зі списку TAGS
    const values = Object.fromEntries(formData) as unknown as NewNote;

    // minLength браузер перевіряє лише для введеного вручну тексту, а не для
    // відновленого з чернетки — тому довжину заголовка перевіряємо й тут
    if (values.title.trim().length < 3) {
      setTitleError("Title must be at least 3 characters");
      return;
    }
    setTitleError("");
    mutation.mutate(values);
  };

  // Cancel чернетку не очищає — її можна дописати пізніше
  const handleCancel = () => goBack();

  if (!isMounted) return null;

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          id={`${fieldId}-title`}
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft.title}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={50}
        />
        {titleError && <span className={css.error}>{titleError}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={handleChange}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          onChange={handleChange}
        >
          {TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {mutation.isError && (
        <span className={css.error}>
          Could not create the note, please try again.
        </span>
      )}

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
