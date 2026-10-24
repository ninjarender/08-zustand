import { cache } from "react";
import type { Metadata } from "next";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { OG_IMAGE } from "@/lib/seo";
import NoteDetailsClient from "./NoteDetails.client";
import css from "./NoteDetails.module.css";

type Props = {
  params: Promise<{ id: string }>;
};

// generateMetadata і сторінка — окремі виклики; axios, на відміну від fetch,
// Next не дедуплікує — cache з React дає один запит на рендер (тема 15, §1.2)
const getNote = cache(fetchNoteById);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const note = await getNote(id);
  const description = note.content.slice(0, 100) || `Note tagged ${note.tag}`;

  return {
    title: `Note: ${note.title} | NoteHub`,
    description,
    openGraph: {
      title: `Note: ${note.title}`,
      description,
      url: `/notes/${id}`,
      siteName: "NoteHub",
      images: [{ ...OG_IMAGE, alt: note.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

const NoteDetails = async ({ params }: Props) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => getNote(id),
  });

  return (
    <main className={css.main}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetailsClient />
      </HydrationBoundary>
    </main>
  );
};

export default NoteDetails;
