
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";

export type ClientLogo = Tables<'client_logos'>;

interface Props {
  isAdding: boolean;
  editingItem: ClientLogo;
  onSave: (item: ClientLogo) => void;
  onCancel: () => void;
}

const ClientLogoForm = ({ isAdding, editingItem, onSave, onCancel }: Props) => {
  const [logo, setLogo] = useState(editingItem);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLogo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(logo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        placeholder="Client Name"
        value={logo.name}
        onChange={handleChange}
        required
      />
      <Input
        name="image_url"
        placeholder="Image URL"
        value={logo.image_url}
        onChange={handleChange}
        required
      />
      <div className="flex gap-3 mt-4">
        <Button type="submit" className="bg-agency-purple text-white">
          {isAdding ? "Add Logo" : "Update Logo"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ClientLogoForm;
