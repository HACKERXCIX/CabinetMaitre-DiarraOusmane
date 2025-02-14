
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string[];
  icon_name: string;
  index: number;
}

const DynamicIcon = ({ name }: { name: string }) => {
  // Mapping des noms d'icônes personnalisés vers les icônes Lucide
  const iconMapping: { [key: string]: string } = {
    "Assistance Juridique": "Scale",
    "Transactions immobilières": "Home"
  };

  // Utiliser le mapping ou le nom direct si non trouvé
  const iconName = iconMapping[name] || name;
  const IconComponent = (Icons as any)[iconName];
  
  return IconComponent ? <IconComponent className="w-10 h-10 text-primary" /> : null;
};

const ServiceCard = ({ title, description, icon_name, index }: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="mb-4">
            <DynamicIcon name={icon_name} />
          </div>
          <CardTitle className="text-xl font-playfair">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm space-y-2">
            {description.map((item, i) => (
              <p key={i} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {item}
              </p>
            ))}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;
