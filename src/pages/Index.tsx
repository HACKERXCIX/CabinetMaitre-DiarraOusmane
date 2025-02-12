
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AppointmentForm from "../components/AppointmentForm";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { usePageContent } from "@/hooks/usePageContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: heroContent } = usePageContent("home", "hero");
  const { data: expertiseContent } = usePageContent("home", "expertise");

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    document.title = "Cabinet Maître Diarra - Accueil";
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <Hero />
      <main>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-block px-4 py-1 mb-6 bg-accent text-primary rounded-full font-inter text-sm"
              >
                {expertiseContent?.subtitle || "Nos Domaines d'Expertise"}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl font-playfair font-bold text-primary mb-6"
              >
                {expertiseContent?.title || "Services Juridiques & Immobiliers"}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-primary/80 font-inter"
              >
                {expertiseContent?.description || "Une approche personnalisée pour répondre à vos besoins spécifiques"}
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard 
                  key={service.id} 
                  title={service.title}
                  description={service.description[0]} 
                  icon={service.icon_name} 
                  index={index} 
                />
              ))}
            </div>
          </div>
        </section>

        <section id="appointment-section" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-playfair font-bold text-primary mb-6"
              >
                {heroContent?.appointment_title || "Prendre Rendez-vous"}
              </motion.h2>
            </div>
            <AppointmentForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const ServiceCard = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 * index }}
    className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-accent"
  >
    <span className="text-4xl mb-4 block">{icon}</span>
    <h3 className="text-xl font-playfair font-bold text-primary mb-3">{title}</h3>
    <p className="text-primary/80 font-inter">{description}</p>
  </motion.div>
);

export default Index;
