
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PageContent {
  id: string;
  page_name: string;
  section_name: string;
  content: any;
}

const ContentTab = () => {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<any>(null);

  const loadContents = async () => {
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .is('deleted_at', null)
        .order('page_name');

      if (error) throw error;
      setContents(data || []);
    } catch (error: any) {
      toast.error('Erreur lors du chargement du contenu: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContents();
  }, []);

  const handleEdit = (content: PageContent) => {
    setEditingId(content.id);
    setEditedContent(content.content);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedContent(null);
  };

  const handleSave = async (contentId: string) => {
    try {
      const { error } = await supabase
        .from('page_contents')
        .update({ content: editedContent })
        .eq('id', contentId);

      if (error) throw error;

      toast.success('Contenu mis à jour avec succès');
      handleCancel();
      loadContents();
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour: ' + error.message);
    }
  };

  const renderEditForm = (content: any) => {
    const renderField = (key: string, value: any, path: string[] = []) => {
      if (Array.isArray(value)) {
        return (
          <div key={key} className="space-y-2">
            <Label>{key}</Label>
            {value.map((item, index) => (
              <div key={index} className="pl-4 border-l-2 border-gray-200">
                {typeof item === 'object' ? (
                  Object.entries(item).map(([k, v]) => 
                    renderField(k, v, [...path, key, index.toString()])
                  )
                ) : (
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newContent = {...editedContent};
                      let current = newContent;
                      for (let i = 0; i < path.length - 1; i++) {
                        current = current[path[i]];
                      }
                      current[path[path.length - 1]][index] = e.target.value;
                      setEditedContent(newContent);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        );
      } else if (typeof value === 'object') {
        return (
          <div key={key} className="space-y-2">
            <Label>{key}</Label>
            <div className="pl-4 border-l-2 border-gray-200">
              {Object.entries(value).map(([k, v]) => renderField(k, v, [...path, key]))}
            </div>
          </div>
        );
      } else {
        return (
          <div key={key} className="space-y-2">
            <Label>{key}</Label>
            {typeof value === 'string' && value.length > 100 ? (
              <Textarea
                value={value}
                onChange={(e) => {
                  const newContent = {...editedContent};
                  let current = newContent;
                  for (let i = 0; i < path.length; i++) {
                    current = current[path[i]];
                  }
                  current[key] = e.target.value;
                  setEditedContent(newContent);
                }}
              />
            ) : (
              <Input
                value={value}
                onChange={(e) => {
                  const newContent = {...editedContent};
                  let current = newContent;
                  for (let i = 0; i < path.length; i++) {
                    current = current[path[i]];
                  }
                  current[key] = e.target.value;
                  setEditedContent(newContent);
                }}
              />
            )}
          </div>
        );
      }
    };

    return (
      <div className="space-y-4">
        {Object.entries(content).map(([key, value]) => renderField(key, value))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {contents.map((content) => (
        <Card key={content.id}>
          <CardHeader>
            <CardTitle className="capitalize">
              {content.page_name} - {content.section_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingId === content.id ? (
              <div className="space-y-4">
                {renderEditForm(editedContent)}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Annuler
                  </Button>
                  <Button onClick={() => handleSave(content.id)}>
                    Enregistrer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
                  {JSON.stringify(content.content, null, 2)}
                </pre>
                <div className="flex justify-end">
                  <Button onClick={() => handleEdit(content)}>
                    Modifier
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContentTab;
