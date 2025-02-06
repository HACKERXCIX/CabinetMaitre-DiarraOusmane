import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import PricingInfo from "./appointment/PricingInfo";
import PersonalInfo from "./appointment/PersonalInfo";
import ConsultationType from "./appointment/ConsultationType";
import DateTimeSelection from "./appointment/DateTimeSelection";
import ConsultationDetails from "./appointment/ConsultationDetails";

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
      const fileExt = paymentReceipt.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('payment_receipts')
        .upload(fileName, paymentReceipt);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payment_receipts')
        .getPublicUrl(fileName);

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
      <PricingInfo />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInfo form={form} />
          <ConsultationType form={form} />
          <ConsultationDetails form={form} />
          <DateTimeSelection form={form} />

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