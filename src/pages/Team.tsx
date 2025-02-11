
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Mail, Phone, BookOpen, Scale, Users, Award } from "lucide-react";

export default function Team() {
  useEffect(() => {
    document.title = "Cabinet Maître Diarra - Notre Équipe";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-accent/5">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto"
          >
            {/* En-tête */}
            <div className="text-center mb-20">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-6xl font-playfair font-bold text-primary mb-6"
              >
                Notre Cabinet
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-primary/70 max-w-3xl mx-auto leading-relaxed"
              >
                Une expertise juridique d'excellence au service de vos intérêts, combinant tradition et modernité 
                pour des solutions juridiques sur mesure.
              </motion.p>
            </div>

            {/* Section principale */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Profil Principal */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden border border-accent/10"
              >
                <div className="aspect-[16/9] relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-accent/5 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-white/90 shadow-2xl backdrop-blur-sm flex items-center justify-center border-4 border-accent/20">
                      <span className="text-6xl font-playfair text-accent">MD</span>
                    </div>
                  </div>
                </div>
                <div className="p-10">
                  <div className="text-center">
                    <h2 className="text-4xl font-playfair font-bold text-primary mb-6">
                      Maître DIARRA
                    </h2>
                    <div className="flex flex-col gap-4 max-w-md mx-auto">
                      <a
                        href="tel:+2250707843777"
                        className="inline-flex items-center justify-center gap-3 p-4 rounded-xl bg-accent/5 text-primary/80 hover:bg-accent/10 transition-colors group"
                      >
                        <Phone className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                        <span>+225 07 07 84 37 77</span>
                      </a>
                      <a
                        href="mailto:mdiarraousmane@gmail.com"
                        className="inline-flex items-center justify-center gap-3 p-4 rounded-xl bg-accent/5 text-primary/80 hover:bg-accent/10 transition-colors group"
                      >
                        <Mail className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                        <span>mdiarraousmane@gmail.com</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Parcours et Expertise */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="space-y-8"
              >
                {/* Formation */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-accent/10">
                  <h3 className="text-2xl font-playfair font-bold text-primary mb-6 flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-accent" />
                    Formation
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                      <h4 className="font-semibold text-lg text-primary">CAPA - Barreau de Côte d'Ivoire</h4>
                      <p className="text-primary/70 mt-1">Certificat d'Aptitude à la Profession d'Avocat</p>
                    </div>
                    <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                      <h4 className="font-semibold text-lg text-primary">Master en Droit des Affaires</h4>
                      <p className="text-primary/70 mt-1">Université de Cocody, Abidjan</p>
                    </div>
                  </div>
                </div>

                {/* Expertises */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-accent/10">
                  <h3 className="text-2xl font-playfair font-bold text-primary mb-6 flex items-center gap-3">
                    <Award className="w-6 h-6 text-accent" />
                    Domaines d'expertise
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
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
                        className="flex items-center gap-3 p-4 rounded-xl bg-accent/5 border border-accent/10 text-primary/80 hover:bg-accent/10 transition-colors group"
                      >
                        <Scale className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                        {domain}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Section Engagement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-12 bg-white p-10 rounded-3xl shadow-xl border border-accent/10"
            >
              <h3 className="text-2xl font-playfair font-bold text-primary mb-6 flex items-center gap-3">
                <Users className="w-6 h-6 text-accent" />
                Notre engagement
              </h3>
              <div className="grid md:grid-cols-2 gap-8 text-primary/80">
                <p className="leading-relaxed">
                  Notre cabinet s'engage à fournir une assistance juridique proactive et transparente, 
                  adaptée aux exigences spécifiques de chaque secteur. Nous mettons l'accent sur 
                  l'écoute attentive de nos clients pour une compréhension approfondie de leurs besoins.
                </p>
                <p className="leading-relaxed">
                  Notre approche multidisciplinaire et notre réactivité exemplaire nous permettent 
                  d'offrir des solutions juridiques optimales et sur mesure pour chaque situation.
                  Nous nous engageons à défendre vos intérêts avec excellence et détermination.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
