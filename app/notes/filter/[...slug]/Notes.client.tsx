"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  tag?: NoteTag;
}

const NotesClient = ({ tag }: NotesClientProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isFetching, isError, isSuccess } = useQuery({
    // тег — у ключі: для кожного фільтра свій кеш (undefined → "all", як у prefetch)
    queryKey: ["notes", tag ?? "all", search, page],
    queryFn: () => fetchNotes({ page, search, tag }),
    placeholderData: keepPreviousData,
    refetchOnMount: false, // перша сторінка вже в кеші з сервера
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  // після видалення останньої нотатки на сторінці page може стати неіснуючою —
  // коригуємо стан під час рендеру (умова не дає зациклитися)
  if (isSuccess && totalPages > 0 && page > totalPages) {
    setPage(totalPages);
  }

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value.trim());
      setPage(1); // новий пошук — з першої сторінки
    },
    300,
  );

  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearch} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>
      {isFetching && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && !isFetching && notes.length === 0 && (
        <ErrorMessage message="No notes found." />
      )}
      {notes.length > 0 && <NoteList notes={notes} />}
    </main>
  );
};

export default NotesClient;
