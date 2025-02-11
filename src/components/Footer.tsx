
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";
import { motion } from "framer-motion";

const TikTokIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

interface IconProps extends Omit<LucideProps, "ref"> {
  name: string;
}

const DynamicIcon = ({ name, ...props }: IconProps) => {
  if (name === "TikTok") {
    return <TikTokIcon />;
  }
  
  const LucideIcon = (Icons as any)[name];
  if (!LucideIcon) {
    console.warn(`Icon ${name} not found`);
    return null;
  }
  
  return <LucideIcon {...props} />;
};

const Footer = () => {
  const { data: socialLinks } = useQuery({
    queryKey: ["socialLinks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .is("deleted_at", null)
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  return (
    <footer className="bg-primary py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="max-w-4xl text-center mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <p className="text-4xl font-playfair font-bold text-accent mb-2">40+</p>
                <p className="text-white text-sm">ans d'expérience</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <p className="text-4xl font-playfair font-bold text-accent mb-2">4000+</p>
                <p className="text-white text-sm">clients satisfaits</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <p className="text-4xl font-playfair font-bold text-accent mb-2">100%</p>
                <p className="text-white text-sm">engagement</p>
              </motion.div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-3xl mx-auto">
              Le Cabinet Maître Diarra se distingue par son engagement constant envers l'excellence et la rigueur. Notre réputation repose sur une expertise juridique éprouvée et un accompagnement sur mesure, garantissant des solutions efficaces et adaptées aux besoins de chacun.
            </p>
          </div>
          <div className="flex gap-6 mb-4">
            {socialLinks?.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent transition-colors"
                aria-label={`Visitez notre page ${link.name}`}
              >
                <DynamicIcon name={link.icon_name} size={24} />
              </a>
            ))}
          </div>
          <p className="text-white text-sm">
            © {new Date().getFullYear()} Cabinet Maître Diarra. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
