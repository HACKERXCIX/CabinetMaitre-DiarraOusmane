
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon_name: string;
  order_index: number;
}

const SocialLinksTab = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const queryClient = useQueryClient();

  const { data: socialLinks, isLoading } = useQuery({
    queryKey: ["socialLinks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .is("deleted_at", null)
        .order("order_index");
      if (error) throw error;
      return data as SocialLink[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newLink: Omit<SocialLink, "id">) => {
      const { data, error } = await supabase
        .from("social_links")
        .insert([newLink])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
      toast.success("Réseau social ajouté avec succès");
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Erreur lors de l'ajout: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (link: SocialLink) => {
      const { error } = await supabase
        .from("social_links")
        .update(link)
        .eq("id", link.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
      toast.success("Réseau social mis à jour avec succès");
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("social_links")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
      toast.success("Réseau social supprimé avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression: " + error.message);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({
      id,
      newIndex,
    }: {
      id: string;
      newIndex: number;
    }) => {
      const { error } = await supabase
        .from("social_links")
        .update({ order_index: newIndex })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
    },
    onError: (error) => {
      toast.error("Erreur lors du réordonnancement: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const link = {
      name: formData.get("name") as string,
      url: formData.get("url") as string,
      icon_name: formData.get("icon_name") as string,
      order_index: socialLinks ? socialLinks.length + 1 : 1,
    };

    if (editingLink) {
      updateMutation.mutate({ ...editingLink, ...link });
    } else {
      createMutation.mutate(link);
    }
  };

  const handleMove = (link: SocialLink, direction: "up" | "down") => {
    if (!socialLinks) return;
    const currentIndex = link.order_index;
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 1 || newIndex > socialLinks.length) return;

    const otherLink = socialLinks.find((l) => l.order_index === newIndex);
    if (otherLink) {
      reorderMutation.mutate({ id: otherLink.id, newIndex: currentIndex });
    }
    reorderMutation.mutate({ id: link.id, newIndex });
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Réseaux Sociaux</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setEditingLink(null)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Ajouter un réseau social
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLink ? "Modifier" : "Ajouter"} un réseau social
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nom
                </label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingLink?.name}
                  required
                />
              </div>
              <div>
                <label htmlFor="url" className="block text-sm font-medium mb-1">
                  URL
                </label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  defaultValue={editingLink?.url}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="icon_name"
                  className="block text-sm font-medium mb-1"
                >
                  Nom de l'icône
                </label>
                <Input
                  id="icon_name"
                  name="icon_name"
                  defaultValue={editingLink?.icon_name}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingLink ? "Mettre à jour" : "Ajouter"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {socialLinks?.map((link) => (
          <Card key={link.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{link.name}</h3>
                <p className="text-sm text-gray-500">{link.url}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleMove(link, "up")}
                  disabled={link.order_index === 1}
                >
                  <ArrowUp size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleMove(link, "down")}
                  disabled={
                    socialLinks && link.order_index === socialLinks.length
                  }
                >
                  <ArrowDown size={16} />
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingLink(link)}
                    >
                      <Pencil size={16} />
                    </Button>
                  </DialogTrigger>
                </Dialog>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Êtes-vous sûr de vouloir supprimer ce réseau social ?"
                      )
                    ) {
                      deleteMutation.mutate(link.id);
                    }
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SocialLinksTab;
