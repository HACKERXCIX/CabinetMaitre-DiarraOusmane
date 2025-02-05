
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const MenuEditor = () => {
  const [menus, setMenus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .order('order_index');

    if (error) {
      toast.error('Erreur lors du chargement des menus');
      return;
    }

    setMenus(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, id?: string) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const menuData = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        content: formData.get('content'),
        order_index: parseInt(formData.get('order_index') as string),
      };

      if (id) {
        const { error } = await supabase
          .from('menus')
          .update(menuData)
          .eq('id', id);

        if (error) throw error;
        toast.success('Menu mis à jour avec succès');
      } else {
        const { error } = await supabase
          .from('menus')
          .insert(menuData);

        if (error) throw error;
        toast.success('Menu créé avec succès');
      }

      loadMenus();
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        {menus.map((menu) => (
          <form
            key={menu.id}
            onSubmit={(e) => handleSubmit(e, menu.id)}
            className="space-y-4 p-4 border rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`title-${menu.id}`}>Titre</Label>
                <Input
                  id={`title-${menu.id}`}
                  name="title"
                  defaultValue={menu.title}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`slug-${menu.id}`}>Slug</Label>
                <Input
                  id={`slug-${menu.id}`}
                  name="slug"
                  defaultValue={menu.slug}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`order-${menu.id}`}>Ordre</Label>
                <Input
                  id={`order-${menu.id}`}
                  name="order_index"
                  type="number"
                  defaultValue={menu.order_index}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor={`content-${menu.id}`}>Contenu</Label>
              <Textarea
                id={`content-${menu.id}`}
                name="content"
                defaultValue={menu.content}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </form>
        ))}
      </div>
    </div>
  );
};

export default MenuEditor;
