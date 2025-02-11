
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";

export default function Team() {
  useEffect(() => {
    document.title = "Cabinet Maître Diarra - Notre Équipe";
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
            className="max-w-5xl mx-auto"
          >
            <h1 className="text-4xl font-playfair font-bold text-primary mb-12 text-center">
              Notre Équipe
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="text-center mb-6">
                  <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden bg-accent/10">
                    {/* Image placeholder */}
                    <div className="w-full h-full flex items-center justify-center bg-accent/5">
                      <span className="text-4xl font-playfair text-accent">MD</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-playfair font-bold text-primary mb-2">
                    Maître DIARRA
                  </h2>
                  <p className="text-accent mb-4">Avocat Principal</p>
                  <div className="space-y-2">
                    <p className="text-primary/80 flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      <a href="tel:+2250707843777" className="hover:text-accent transition-colors">
                        +225 07 07 84 37 77
                      </a>
                    </p>
                    <p className="text-primary/80 flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      <a href="mailto:mdiarraousmane@gmail.com" className="hover:text-accent transition-colors">
                        mdiarraousmane@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
                <div className="text-primary/80 space-y-4">
                  <p>
                    Spécialisé dans le droit des affaires et l'immobilier, Maître DIARRA accompagne ses clients dans leurs projets juridiques depuis plus de 15 ans.
                  </p>
                  <p>
                    Expert en droit civil et en transactions immobilières, il met son expertise au service de particuliers et d'entreprises pour garantir la sécurité de leurs opérations.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-xl font-playfair font-bold text-primary mb-4">
                    Domaines d'expertise
                  </h3>
                  <ul className="space-y-3 text-primary/80">
                    <li>• Droit des affaires</li>
                    <li>• Droit immobilier</li>
                    <li>• Droit civil</li>
                    <li>• Transactions immobilières</li>
                    <li>• Contentieux</li>
                    <li>• Conseil juridique</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-playfair font-bold text-primary mb-4">
                    Formation
                  </h3>
                  <ul className="space-y-4 text-primary/80">
                    <li>
                      <div className="font-semibold">Master en Droit des Affaires</div>
                      <div className="text-sm">Université de Cocody, Abidjan</div>
                    </li>
                    <li>
                      <div className="font-semibold">CAPA (Certificat d'Aptitude à la Profession d'Avocat)</div>
                      <div className="text-sm">Barreau de Côte d'Ivoire</div>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
