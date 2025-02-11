
export interface Property {
  id?: string;
  title: string;
  description: string;
  type: string;
  property_type: string;
  price: number;
  location: string;
  surface: number;
  rooms: number | null;
  architecture_style: string | null;
  images: string[];
  videos: string[];
}

export interface PropertyType {
  id: string;
  name: string;
}

export interface PropertyFormProps {
  property?: Property;
  onSuccess?: () => void;
}
