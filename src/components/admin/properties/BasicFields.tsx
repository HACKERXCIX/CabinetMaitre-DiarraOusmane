
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PropertyType } from "./types";

interface BasicFieldsProps {
  propertyTypes: PropertyType[];
}

const BasicFields = ({ propertyTypes }: BasicFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="title">Titre</Label>
        <Input id="title" name="title" required />
      </div>

      <div>
        <Label htmlFor="type">Type d'annonce</Label>
        <select
          id="type"
          name="type"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          <option value="vente">Vente</option>
          <option value="location">Location</option>
        </select>
      </div>

      <div>
        <Label htmlFor="property_type">Type de bien</Label>
        <select
          id="property_type"
          name="property_type"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          {propertyTypes.map((type) => (
            <option key={type.id} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="price">Prix</Label>
        <Input type="number" id="price" name="price" required />
      </div>

      <div>
        <Label htmlFor="surface">Surface (m²)</Label>
        <Input type="number" id="surface" name="surface" required />
      </div>
    </>
  );
};

export default BasicFields;
