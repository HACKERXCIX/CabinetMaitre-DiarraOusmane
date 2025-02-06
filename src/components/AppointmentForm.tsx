import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  clientType: z.enum(["particulier", "professionnel"]),
  consultationType: z.enum(["presentiel", "en_ligne"]),
  onlinePlatform: z.enum(["whatsapp", "zoom", "google_meet"]).optional(),
  consultationObject: z.string().min(5, "L'objet de la consultation est requis"),
  consultationSummary: z.string().min(10, "Le résumé de la consultation est requis"),
  desiredDate: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
  appointmentTime: z.string().min(1, "Veuillez sélectionner une heure"),
});

const AppointmentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientType: "particulier",
      consultationType: "presentiel",
    },
  });

  const consultationType = form.watch("consultationType");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentReceipt(e.target.files[0]);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!paymentReceipt) {
      toast.error("Veuillez ajouter le reçu de paiement");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload payment receipt
      const fileExt = paymentReceipt.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('payment_receipts')
        .upload(fileName, paymentReceipt);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment_receipts')
        .getPublicUrl(fileName);

      // Create appointment with full_name
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          first_name: values.firstName,
          last_name: values.lastName,
          full_name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          phone: values.phone,
          client_type: values.clientType,
          consultation_type: values.consultationType,
          online_platform: values.onlinePlatform,
          consultation_object: values.consultationObject,
          consultation_summary: values.consultationSummary,
          desired_date: format(values.desiredDate, 'yyyy-MM-dd'),
          appointment_time: values.appointmentTime,
          payment_receipt_url: publicUrl,
        });

      if (appointmentError) throw appointmentError;

      toast.success("Votre demande de rendez-vous a été enregistrée avec succès");
      form.reset();
      setPaymentReceipt(null);
    } catch (error: any) {
      toast.error("Erreur lors de l'enregistrement: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6 p-4 bg-accent/10 rounded-lg text-sm">
        <p className="mb-2">
          La consultation pour les clients particuliers est de 50.000 FCFA et la consultation 
          pour les clients professionnels est à partir de 100.000 FCFA.
        </p>
        <p>
          La consultation est payée d'avance par mobile money:
        </p>
        <ul className="list-disc ml-4 mt-2">
          <li>Orange Money : 0707843777</li>
          <li>Wave : 0172248585</li>
        </ul>
        <p className="mt-2">
          Après paiement, vous pourrez confirmer l'heure et la date de votre rendez-vous. 
          Veuillez remplir ce formulaire en nous montrant la capture du reçu de votre consultation.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre prénom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="votre@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone (WhatsApp)</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre numéro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
          </div>

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

          <div>
            <FormLabel>Reçu de paiement</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1"
            />
            {paymentReceipt && (
              <p className="text-sm text-green-600 mt-1">
                Fichier sélectionné: {paymentReceipt.name}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Envoi en cours..." : "Valider ma prise de rendez-vous"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AppointmentForm;