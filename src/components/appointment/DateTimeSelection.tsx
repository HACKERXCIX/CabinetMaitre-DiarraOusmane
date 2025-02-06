import { Calendar } from "@/components/ui/calendar";
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
import { UseFormReturn } from "react-hook-form";
import { fr } from "date-fns/locale";

interface DateTimeSelectionProps {
  form: UseFormReturn<any>;
}

const DateTimeSelection = ({ form }: DateTimeSelectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="desiredDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date souhaitée</FormLabel>
            <FormControl>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date < new Date() || date < new Date("1900-01-01")
                }
                locale={fr}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="appointmentTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Heure souhaitée</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une heure" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Array.from({ length: 9 }, (_, i) => i + 9).map((hour) => (
                  <SelectItem key={hour} value={`${hour}:00`}>
                    {`${hour}:00`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DateTimeSelection;