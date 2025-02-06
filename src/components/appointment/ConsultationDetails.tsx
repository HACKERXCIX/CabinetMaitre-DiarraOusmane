import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface ConsultationDetailsProps {
  form: UseFormReturn<any>;
}

const ConsultationDetails = ({ form }: ConsultationDetailsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="consultationObject"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Objet de la consultation</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Consultation juridique" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="consultationSummary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Résumé de la consultation</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Décrivez brièvement l'objet de votre consultation" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ConsultationDetails;