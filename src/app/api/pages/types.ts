export interface PublicPageContentResponse {
  id: string;
  menuItemId: string;
  content: string;
  heroMediaUrl: string | null;
  heroMediaType: 'image' | 'video' | null;
  heroText: string | null;
}
