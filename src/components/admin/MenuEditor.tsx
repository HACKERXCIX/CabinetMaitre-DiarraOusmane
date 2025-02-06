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
      .order('order_index', { ascending: true });

    if (error) {
      toast.error('Erreur lors du chargement des menus');
      return;
    }

    setMenus(data || []);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const menuData = {
        title: String(formData.get('title')),
        slug: String(formData.get('slug')),
        content: String(formData.get('content')),
        order_index: parseInt(String(formData.get('order_index'))) || 0
      };

      const { error } = await supabase
        .from('menus')
        .insert(menuData);

      if (error) throw error;
      
      toast.success('Menu créé avec succès');
      loadMenus();
      e.currentTarget.reset();
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Titre</label>
          <input type="text" name="title" id="title" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium">Slug</label>
          <input type="text" name="slug" id="slug" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium">Contenu</label>
          <textarea name="content" id="content" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
          <label htmlFor="order_index" className="block text-sm font-medium">Index de l'ordre</label>
          <input type="number" name="order_index" id="order_index" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <Button type="submit" className="w-full">Créer Menu</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Contenu</TableHead>
            <TableHead>Index de l'ordre</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menus.map((menu) => (
            <TableRow key={menu.id}>
              <TableCell>{menu.title}</TableCell>
              <TableCell>{menu.slug}</TableCell>
              <TableCell>{menu.content}</TableCell>
              <TableCell>{menu.order_index}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MenuEditor;
