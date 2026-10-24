import { notFound } from "next/navigation";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import { TAGS, type NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";

// список нотаток рендеримо на кожен запит (SSR), як /notes у ДЗ №6
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string[] }>;
};

const isNoteTag = (value: string): value is NoteTag =>
  (TAGS as readonly string[]).includes(value);

const NotesByTag = async ({ params }: Props) => {
  const { slug } = await params;

  // фільтруємо за першим сегментом; «all» — усі нотатки, тег не передаємо
  if (slug[0] !== "all" && !isNoteTag(slug[0])) {
    notFound(); // невідомий тег не надсилаємо бекенду
  }
  const tag = slug[0] === "all" ? undefined : slug[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    // той самий ключ, що в useQuery на клієнті при першому рендері
    queryKey: ["notes", tag ?? "all", "", 1],
    queryFn: () => fetchNotes({ page: 1, search: "", tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* key: при зміні тега стан клієнта (сторінка, пошук) починається з нуля */}
      <NotesClient key={tag ?? "all"} tag={tag} />
    </HydrationBoundary>
  );
};

export default NotesByTag;
