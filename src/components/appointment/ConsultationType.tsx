import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn, useWatch } from "react-hook-form";

interface ConsultationTypeProps {
  form: UseFormReturn<any>;
}

const ConsultationType = ({ form }: ConsultationTypeProps) => {
  const consultationType = useWatch({
    control: form.control,
    name: "consultationType",
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="clientType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de client</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de client" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="particulier">Particulier</SelectItem>
                <SelectItem value="professionnel">Professionnel</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="consultationType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de consultation</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de consultation" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="presentiel">Présentiel</SelectItem>
                <SelectItem value="en_ligne">En ligne</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {consultationType === "en_ligne" && (
        <FormField
          control={form.control}
          name="onlinePlatform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plateforme en ligne</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez la plateforme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="google_meet">Google Meet</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default ConsultationType;