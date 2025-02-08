
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ServiceCard from "@/components/services/ServiceCard";
import ServicesHeader from "@/components/services/ServicesHeader";

interface Service {
  id: string;
  title: string;
  description: string[];
  icon_name: string;
}

const Services = () => {
  useEffect(() => {
    document.title = "Cabinet Maître Diarra - Nos Services";
  }, []);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Service[];
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-24">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <ServicesHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} {...service} index={index} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Services;
