
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "lucide-react";
import dynamic from "next/dynamic";
import { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

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
  name: keyof typeof dynamicIconImports | "TikTok";
}

const DynamicIcon = ({ name, ...props }: IconProps) => {
  if (name === "TikTok") {
    return <TikTokIcon />;
  }
  
  const LucideIcon = dynamic(dynamicIconImports[name as keyof typeof dynamicIconImports]);
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
                <DynamicIcon name={link.icon_name as IconProps["name"]} size={24} />
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
