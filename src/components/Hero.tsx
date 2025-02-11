
import { motion } from "framer-motion";
import { Gavel, Building, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleAppointment = () => {
    const appointmentSection = document.getElementById('appointment-section');
    if (appointmentSection) {
      appointmentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-accent/5 to-white pt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="invisible inline-block px-4 py-1 mb-6 bg-accent/10 text-accent rounded-full font-inter text-sm">
              Cabinet d'Avocats & Immobilier
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-playfair font-bold text-primary mb-6"
          >
            Excellence Juridique & Immobilière
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-primary/80 mb-12 font-inter"
          >
            Une expertise reconnue au service de vos projets juridiques et immobiliers
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            <ServiceCard
              icon={<Gavel className="w-8 h-8" />}
              title="Conseil Juridique"
              description="Expertise en droit des affaires et droit civil"
            />
            <ServiceCard
              icon={<Building className="w-8 h-8" />}
              title="Gestion Immobilière"
              description="Administration de vos biens immobiliers"
            />
            <ServiceCard
              icon={<Briefcase className="w-8 h-8" />}
              title="Transactions"
              description="Accompagnement achat et vente"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => navigate('/services')}
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-inter"
            >
              Nos Services
            </button>
            <button 
              onClick={handleAppointment}
              className="px-8 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-inter"
            >
              Prendre RDV
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-muted">
    <div className="text-accent mb-4">{icon}</div>
    <h3 className="text-xl font-playfair font-bold text-primary mb-2">{title}</h3>
    <p className="text-primary/70 font-inter text-sm">{description}</p>
  </div>
);

export default Hero;
