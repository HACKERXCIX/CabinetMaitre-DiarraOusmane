import { useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Briefcase,
  House,
  DollarSign,
  Handshake,
  FileText,
  Scale,
  Shield,
  User,
  ChartBar,
  Building,
  Heart,
  ScrollText,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    title: "Conseil Juridique et Assistance Légale",
    description: [
      "Rédaction, révision et négociation de contrats commerciaux, immobiliers, de vente ou de location",
      "Assistance dans les procédures judiciaires pour des litiges commerciaux, administratifs ou familiaux",
      "Médiation et résolution de conflits à l'amiable",
      "Rédaction d'actes juridiques tels que mises en demeure ou accords de règlement",
    ],
    icon: <Scale className="w-10 h-10 text-primary" />,
  },
  {
    title: "Gestion de Biens et Patrimoine",
    description: [
      "Supervision de biens immobiliers (location, vente, gestion des locataires)",
      "Administration de successions et répartition des biens selon les directives légales",
      "Mandat de gestion pour affaires immobilières ou financières en cas d'absence ou d'incapacité",
      "Expertise et estimation de biens immobiliers ou commerciaux",
    ],
    icon: <House className="w-10 h-10 text-primary" />,
  },
  {
    title: "Transactions Immobilières",
    description: [
      "Recherche d'acheteurs, de locataires ou de biens immobiliers adaptés aux besoins des clients",
      "Négociation des meilleures conditions pour la vente ou l'achat",
      "Assistance dans les ventes aux enchères judiciaires",
      "Régularisation de situations foncières complexes",
    ],
    icon: <Building className="w-10 h-10 text-primary" />,
  },
  {
    title: "Recouvrement de Créances",
    description: [
      "Recouvrement amiable et négociation avec les débiteurs",
      "Actions en justice pour récupération de créances, en collaboration avec huissiers et avocats",
      "Gestion de créances douteuses pour maximiser les chances de recouvrement",
      "Suivi des paiements et respect des accords post-recouvrement",
    ],
    icon: <DollarSign className="w-10 h-10 text-primary" />,
  },
  {
    title: "Représentation et Négociation Commerciale",
    description: [
      "Négociation et conclusion d'affaires au nom d'entreprises ou particuliers",
      "Recherche de partenaires stratégiques pour investissements ou collaborations",
      "Assistance dans la création d'entreprises (statuts, enregistrement, recherche de financement)",
    ],
    icon: <Handshake className="w-10 h-10 text-primary" />,
  },
  {
    title: "Accompagnement en Cas de Difficultés Financières",
    description: [
      "Gestion de crise pour des situations financières complexes (dettes importantes, liquidité)",
      "Négociation d'arrangements avec les créanciers",
      "Élaboration de plans de restructuration pour stabilisation financière",
    ],
    icon: <ChartBar className="w-10 h-10 text-primary" />,
  },
  {
    title: "Représentation dans les Litiges et Arbitrages",
    description: [
      "Représentation des intérêts de nos clients devant les tribunaux",
      "Gestion des litiges commerciaux liés à des contrats ou différends",
      "Arbitrage privé pour résoudre les litiges hors des tribunaux",
    ],
    icon: <Scale className="w-10 h-10 text-primary" />,
  },
  {
    title: "Enquêtes et Vérifications",
    description: [
      "Vérification de la solvabilité de partenaires commerciaux",
      "Enquête sur les antécédents financiers et commerciaux",
      "Audit pour garantir la conformité des transactions avec les réglementations",
    ],
    icon: <Shield className="w-10 h-10 text-primary" />,
  },
  {
    title: "Formalités Administratives et Bureaucratiques",
    description: [
      "Prise en charge des démarches administratives (autorisations, permis, licences)",
      "Enregistrement de documents légaux auprès des autorités",
      "Assistance pour récupérer des documents officiels",
    ],
    icon: <FileText className="w-10 h-10 text-primary" />,
  },
  {
    title: "Services de Fiducie et de Gestion Fiduciaire",
    description: [
      "Gestion de biens ou d'actifs pour tiers selon des contrats de fiducie",
      "Création et gestion de fonds pour des projets spécifiques ou héritiers",
    ],
    icon: <Briefcase className="w-10 h-10 text-primary" />,
  },
  {
    title: "Courtage Matrimonial",
    description: [
      "Sélection de profils compatibles selon les critères du client",
      "Organisation de rencontres et accompagnement dans le processus décisionnel",
      "Conseils en relations et confidentialité des échanges",
    ],
    icon: <Heart className="w-10 h-10 text-primary" />,
  },
  {
    title: "Déclarations d'Impôts et Réclamations Fiscales",
    description: [
      "Préparation et optimisation des déclarations fiscales",
      "Représentation en cas de litiges fiscaux",
      "Suivi des remboursements et rectifications",
    ],
    icon: <ScrollText className="w-10 h-10 text-primary" />,
  },
  {
    title: "Généalogie",
    description: [
      "Recherche et identification des héritiers dans des successions complexes",
      "Reconstitution d'arbres généalogiques et analyse d'archives",
      "Assistance lors de litiges successoraux",
    ],
    icon: <Users className="w-10 h-10 text-primary" />,
  },
  {
    title: "Transactions et Négociations Contractuelles",
    description: [
      "Négociation des termes des transactions",
      "Préparation de documents légaux (contrats)",
      "Suivi des paiements et conformité avec les régulations",
    ],
    icon: <FileText className="w-10 h-10 text-primary" />,
  },
];

const Services = () => {
  useEffect(() => {
    document.title = "Cabinet Maître Diarra - Nos Services";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4">{service.icon}</div>
                  <CardTitle className="text-xl font-playfair">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm space-y-2">
                    {service.description.map((item, i) => (
                      <p key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {item}
                      </p>
                    ))}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Services;
