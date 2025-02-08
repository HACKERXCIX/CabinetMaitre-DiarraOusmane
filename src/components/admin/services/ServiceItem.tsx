
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string[];
  icon_name: string;
}

interface ServiceItemProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

const ServiceItem = ({ service, onEdit, onDelete }: ServiceItemProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{service.title}</span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onEdit(service)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="destructive" onClick={() => onDelete(service.id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-2">
          {service.description.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
