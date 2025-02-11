
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Mail, Phone, Award, BookOpen, Scale, Users } from "lucide-react";

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
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h1 className="text-5xl font-playfair font-bold text-primary mb-4">
                Notre Équipe
              </h1>
              <p className="text-xl text-primary/70 max-w-2xl mx-auto">
                Une équipe d'experts dédiée à votre succès juridique
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Profil Principal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-5 bg-white rounded-2xl shadow-lg overflow-hidden border border-accent/20"
              >
                <div className="aspect-[4/3] relative bg-gradient-to-br from-accent/20 to-accent/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 rounded-full bg-white shadow-lg flex items-center justify-center">
                      <span className="text-5xl font-playfair text-accent">MD</span>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-playfair font-bold text-primary mb-2">
                      Maître DIARRA
                    </h2>
                    <p className="text-lg text-accent mb-4">Avocat Principal</p>
                    <div className="flex flex-col gap-3">
                      <a
                        href="tel:+2250707843777"
                        className="inline-flex items-center justify-center gap-2 text-primary/80 hover:text-accent transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                        <span>+225 07 07 84 37 77</span>
                      </a>
                      <a
                        href="mailto:mdiarraousmane@gmail.com"
                        className="inline-flex items-center justify-center gap-2 text-primary/80 hover:text-accent transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                        <span>mdiarraousmane@gmail.com</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Informations complémentaires */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-7 space-y-6"
              >
                {/* Expertise */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-accent/20">
                  <h3 className="text-2xl font-playfair font-bold text-primary mb-6 flex items-center gap-3">
                    <Award className="w-6 h-6 text-accent" />
                    Domaines d'expertise
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Droit des affaires",
                      "Droit immobilier",
                      "Droit civil",
                      "Transactions immobilières",
                      "Contentieux",
                      "Conseil juridique"
                    ].map((domain, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 rounded-lg bg-accent/5 text-primary/80"
                      >
                        <Scale className="w-4 h-4 text-accent" />
                        {domain}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formation */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-accent/20">
                  <h3 className="text-2xl font-playfair font-bold text-primary mb-6 flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-accent" />
                    Formation
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-accent/5">
                      <h4 className="font-semibold text-lg text-primary mb-1">Master en Droit des Affaires</h4>
                      <p className="text-primary/70">Université de Cocody, Abidjan</p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/5">
                      <h4 className="font-semibold text-lg text-primary mb-1">CAPA (Certificat d'Aptitude à la Profession d'Avocat)</h4>
                      <p className="text-primary/70">Barreau de Côte d'Ivoire</p>
                    </div>
                  </div>
                </div>

                {/* Engagements */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-accent/20">
                  <h3 className="text-2xl font-playfair font-bold text-primary mb-6 flex items-center gap-3">
                    <Users className="w-6 h-6 text-accent" />
                    Notre engagement
                  </h3>
                  <div className="space-y-4 text-primary/80">
                    <p className="leading-relaxed">
                      Notre cabinet s'engage à fournir une assistance juridique proactive et transparente, 
                      adaptée aux exigences spécifiques de chaque secteur. Nous mettons l'accent sur 
                      l'écoute attentive de nos clients pour une compréhension approfondie de leurs besoins.
                    </p>
                    <p className="leading-relaxed">
                      Notre approche multidisciplinaire et notre réactivité exemplaire nous permettent 
                      d'offrir des solutions juridiques optimales et sur mesure pour chaque situation.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
