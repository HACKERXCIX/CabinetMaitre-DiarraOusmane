
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        properties (
          title,
          location,
          type
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erreur lors du chargement des rendez-vous');
      return;
    }

    setAppointments(data);
  };

  const updateStatus = async (id: string, status: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success('Statut mis à jour avec succès');
      loadAppointments();
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getAppointmentType = (appointment: any) => {
    if (appointment.property_id) {
      return "Demande de visite";
    } else {
      return "Demande de consultation";
    }
  };

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reçu de paiement</DialogTitle>
          </DialogHeader>
          {selectedReceipt && (
            <div className="mt-4">
              <img 
                src={selectedReceipt} 
                alt="Reçu de paiement" 
                className="w-full max-h-[600px] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date et Heure</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Bien</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>
                {new Date(appointment.desired_date).toLocaleDateString()} à {formatTime(appointment.appointment_time)}
              </TableCell>
              <TableCell>{appointment.full_name}</TableCell>
              <TableCell>
                {appointment.properties?.title 
                  ? `${appointment.properties.title} - ${appointment.properties.location}`
                  : "Consultation"
                }
              </TableCell>
              <TableCell>
                {appointment.email}
                <br />
                {appointment.phone}
              </TableCell>
              <TableCell>{getAppointmentType(appointment)}</TableCell>
              <TableCell>{appointment.status}</TableCell>
              <TableCell>
                <div className="space-x-2">
                  {!appointment.property_id && appointment.payment_receipt_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedReceipt(appointment.payment_receipt_url)}
                      className="mb-2"
                    >
                      Voir le reçu
                    </Button>
                  )}
                  <div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isLoading || appointment.status === 'approved'}
                      onClick={() => updateStatus(appointment.id, 'approved')}
                    >
                      Approuver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isLoading || appointment.status === 'rejected'}
                      onClick={() => updateStatus(appointment.id, 'rejected')}
                      className="ml-2"
                    >
                      Refuser
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppointmentsList;
