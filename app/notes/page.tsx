import { redirect } from "next/navigation";

// список нотаток тепер живе в /notes/filter/[...slug] — старий маршрут веде туди
const Notes = () => {
  redirect("/notes/filter/all");
  return null;
};

export default Notes;
