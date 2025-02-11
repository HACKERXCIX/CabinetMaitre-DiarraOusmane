
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AdditionalFields = () => {
  return (
    <>
      <div>
        <Label htmlFor="rooms">Nombre de pièces</Label>
        <Input type="number" id="rooms" name="rooms" />
      </div>

      <div>
        <Label htmlFor="location">Localisation</Label>
        <Input id="location" name="location" required />
      </div>

      <div>
        <Label htmlFor="architecture_style">Style architectural</Label>
        <Input id="architecture_style" name="architecture_style" />
      </div>

      <div className="col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
      </div>
    </>
  );
};

export default AdditionalFields;
