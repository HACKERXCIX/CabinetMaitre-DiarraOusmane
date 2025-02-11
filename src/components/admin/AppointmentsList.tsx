
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { utils as xlsxUtils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet, FileText } from "lucide-react";

interface Appointment {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  desired_date: string;
  appointment_time: string;
  status: 'pending' | 'approved' | 'rejected';
  property_id: string | null;
  payment_receipt_url: string | null;
  properties?: {
    title: string;
    location: string;
    type: string;
  } | null;
  created_at: string;
}

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [statusFilter, searchQuery, appointments]);

  const validateStatus = (status: string): 'pending' | 'approved' | 'rejected' => {
    if (status === 'pending' || status === 'approved' || status === 'rejected') {
      return status;
    }
    return 'pending'; // Valeur par défaut si le statut n'est pas valide
  };

  const loadAppointments = async () => {
    try {
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

      if (error) throw error;

      const validatedData: Appointment[] = (data || []).map(item => ({
        ...item,
        status: validateStatus(item.status),
      })) as Appointment[];

      setAppointments(validatedData);
      setFilteredAppointments(validatedData);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des rendez-vous: ' + error.message);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.full_name?.toLowerCase().includes(query) ||
        app.email?.toLowerCase().includes(query) ||
        app.properties?.title?.toLowerCase().includes(query)
      );
    }

    setFilteredAppointments(filtered);
  };

  const exportToExcel = () => {
    try {
      const data = filteredAppointments.map(app => ({
        'Date': new Date(app.desired_date).toLocaleDateString(),
        'Heure': formatTime(app.appointment_time),
        'Client': app.full_name,
        'Email': app.email,
        'Téléphone': app.phone,
        'Type': getAppointmentType(app),
        'Bien': app.properties?.title || 'Consultation',
        'Statut': app.status
      }));

      const ws = xlsxUtils.json_to_sheet(data);
      const wb = xlsxUtils.book_new();
      xlsxUtils.book_append_sheet(wb, ws, "Rendez-vous");
      writeFile(wb, "rendez-vous.xlsx");
      toast.success('Export Excel réussi');
    } catch (error: any) {
      toast.error('Erreur lors de l\'export Excel: ' + error.message);
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      const tableData = filteredAppointments.map(app => [
        new Date(app.desired_date).toLocaleDateString(),
        formatTime(app.appointment_time),
        app.full_name,
        app.email,
        app.phone,
        getAppointmentType(app),
        app.properties?.title || 'Consultation',
        app.status
      ]);

      autoTable(doc, {
        head: [['Date', 'Heure', 'Client', 'Email', 'Téléphone', 'Type', 'Bien', 'Statut']],
        body: tableData,
      });

      doc.save('rendez-vous.pdf');
      toast.success('Export PDF réussi');
    } catch (error: any) {
      toast.error('Erreur lors de l\'export PDF: ' + error.message);
    }
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Statut mis à jour avec succès');
      await loadAppointments();
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getAppointmentType = (appointment: Appointment) => {
    return appointment.property_id ? "Demande de visite" : "Demande de consultation";
  };

  const formatTime = (time: string) => {
    try {
      return new Date(`1970-01-01T${time}`).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return time;
    }
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

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="approved">Approuvé</SelectItem>
              <SelectItem value="rejected">Refusé</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Rechercher un client, email ou bien..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[300px]"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={exportToExcel}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={exportToPDF}>
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
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
            {filteredAppointments.map((appointment) => (
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
    </div>
  );
};

export default AppointmentsList;
