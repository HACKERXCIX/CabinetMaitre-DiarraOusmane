
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Save } from "lucide-react";

interface ServiceFormProps {
  initialData?: {
    title: string;
    description: string[];
    icon_name: string;
  };
  onSubmit: (data: { title: string; description: string[]; icon_name: string }) => void;
  onCancel: () => void;
}

const ServiceForm = ({ initialData, onSubmit, onCancel }: ServiceFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || [""],
    icon_name: initialData?.icon_name || "",
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Titre</label>
        <Input
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          placeholder="Titre du service"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Nom de l'icône
        </label>
        <Input
          value={formData.icon_name}
          onChange={(e) =>
            setFormData({ ...formData, icon_name: e.target.value })
          }
          placeholder="Nom de l'icône (ex: scale, house, etc.)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Description (une ligne par point)
        </label>
        <Textarea
          value={formData.description?.join("\n")}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value.split("\n").filter(Boolean),
            })
          }
          placeholder="Description du service (un point par ligne)"
          rows={5}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" /> Annuler
        </Button>
        <Button onClick={() => onSubmit(formData)}>
          <Save className="mr-2 h-4 w-4" /> Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default ServiceForm;
