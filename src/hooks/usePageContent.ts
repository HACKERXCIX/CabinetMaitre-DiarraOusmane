
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PageContent {
  subtitle?: string;
  title?: string;
  description?: string;
  appointment_title?: string;
}

export const usePageContent = (pageName: string, sectionName: string) => {
  return useQuery({
    queryKey: ["pageContent", pageName, sectionName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_contents")
        .select("content")
        .eq("page_name", pageName)
        .eq("section_name", sectionName)
        .is("deleted_at", null)
        .maybeSingle();

      if (error) {
        console.error("Error fetching page content:", error);
        return null;
      }

      return data?.content as PageContent | null;
    },
  });
};
