export interface CreatePageContentRequest {
  menuItemId: string;
  content: string;
}

export interface PageContentResponse {
  id: string;
  menuItemId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
