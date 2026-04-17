import { useQuery } from "@tanstack/react-query";
import { listPublishedArticles } from "../services/listPublishedArticles";

export function useListPublishedArticles() {
  const methods = useQuery({
    queryKey: ["published-articles"],
    queryFn: listPublishedArticles,
  });

  return methods;
}
