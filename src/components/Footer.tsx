
import { Facebook, Instagram, Linkedin, Youtube, MessagesSquare } from "lucide-react";
import { BrandTiktok } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://facebook.com/",
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://youtube.com/",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/",
    },
    {
      name: "WhatsApp Business",
      icon: MessagesSquare,
      url: "https://business.whatsapp.com/",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/",
    },
    {
      name: "TikTok",
      icon: BrandTiktok,
      url: "https://tiktok.com/",
    },
  ];

  return (
    <footer className="bg-primary py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="flex gap-6 mb-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent transition-colors"
                aria-label={`Visitez notre page ${link.name}`}
              >
                <link.icon size={24} />
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
