export interface CreatePageContentRequest {
  menuItemId: string;
  content: string;
  heroText?: string | null;
}

export interface PageContentResponse {
  id: string;
  menuItemId: string;
  content: string;
  heroMediaUrl: string | null;
  heroMediaType: 'image' | 'video' | null;
  heroText: string | null;
  createdAt: string;
  updatedAt: string;
}
