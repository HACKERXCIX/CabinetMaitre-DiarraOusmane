
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Admin = () => {
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est admin
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["checkAdmin"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('has_role', {
        _role: 'admin'
      });
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    // Rediriger si l'utilisateur n'est pas connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      }
    });
  }, [navigate]);

  // Rediriger si l'utilisateur n'est pas admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto mt-16">
        <h1 className="text-3xl font-bold mb-8">Administration</h1>
        <div className="grid gap-6">
          {/* Contenu de la page d'administration à venir */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Tableau de bord</h2>
            <p>Bienvenue dans l'interface d'administration.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
