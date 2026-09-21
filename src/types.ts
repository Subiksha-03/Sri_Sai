export type GalleryImage = {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description: string | null;
  sort_order: number;
  created_at: string;
};

export type EnquiryForm = {
  name: string;
  phone: string;
  email: string;
  service_type: string;
  message: string;
};
