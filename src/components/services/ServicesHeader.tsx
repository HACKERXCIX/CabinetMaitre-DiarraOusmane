
import { motion } from "framer-motion";

const ServicesHeader = () => {
  return (
    <div className="max-w-4xl mx-auto text-center mb-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-playfair font-bold text-primary mb-6"
      >
        Nos Services
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg text-muted-foreground"
      >
        Une expertise complète au service de vos besoins juridiques et
        administratifs
      </motion.p>
    </div>
  );
};

export default ServicesHeader;
