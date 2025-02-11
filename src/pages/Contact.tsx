
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Mail, Phone, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {
  useEffect(() => {
    document.title = "Cabinet Maître Diarra - Contact";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-playfair font-bold text-primary mb-8 text-center">
              Nos Coordonnées
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md border border-accent"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="font-playfair font-bold text-xl mb-2 text-primary">Adresse</h2>
                    <p className="text-primary/80 leading-relaxed">
                      Cocody 2 plateaux non loin du commissariat du 12e
                      <br />
                      Treichville non loin du commissariat du 2e
                      <br />
                      Abidjan, Côte d'Ivoire
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 mb-6">
                  <Phone className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="font-playfair font-bold text-xl mb-2 text-primary">Téléphone</h2>
                    <p className="text-primary/80 leading-relaxed">
                      +225 07 07 84 37 77
                      <br />
                      +225 01 02 46 52 52
                      <br />
                      +225 05 96 75 30 30
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white p-6 rounded-lg shadow-md border border-accent"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <Mail className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="font-playfair font-bold text-xl mb-2 text-primary">Email</h2>
                    <p className="text-primary/80">
                      <a 
                        href="mailto:mdiarraousmane@gmail.com"
                        className="hover:text-accent transition-colors"
                      >
                        mdiarraousmane@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="font-playfair font-bold text-xl mb-2 text-primary">Horaires</h2>
                    <p className="text-primary/80">Lundi - Vendredi: 8h00 - 17h00</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
