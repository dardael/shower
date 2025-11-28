export interface AddMenuItemRequest {
  text: string;
}

export interface ReorderMenuItemsRequest {
  orderedIds: string[];
}

export interface MenuItemDTO {
  id: string;
  text: string;
  position: number;
}

export interface GetMenuItemsResponse {
  items: MenuItemDTO[];
}

export interface AddMenuItemResponse {
  message: string;
  item: MenuItemDTO;
}

export interface ReorderMenuItemsResponse {
  message: string;
}

export interface DeleteMenuItemResponse {
  message: string;
}

export interface MenuErrorResponse {
  error: string;
}
