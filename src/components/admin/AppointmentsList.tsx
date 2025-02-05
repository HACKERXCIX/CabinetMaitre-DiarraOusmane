
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

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Bien</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>
                {new Date(appointment.desired_date).toLocaleDateString()}
              </TableCell>
              <TableCell>{appointment.full_name}</TableCell>
              <TableCell>
                {appointment.properties?.title} - {appointment.properties?.location}
              </TableCell>
              <TableCell>
                {appointment.email}
                <br />
                {appointment.phone}
              </TableCell>
              <TableCell>{appointment.status}</TableCell>
              <TableCell>
                <div className="space-x-2">
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
                  >
                    Refuser
                  </Button>
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
