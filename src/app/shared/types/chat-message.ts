export interface ChatMessage {
  _id?: string;
  message: string;
  sender_id: number;
  receiver_id: number;
  community_id: number;
  createdAt: string;
  updatedAt?: string;
  is_read?: boolean;
  sender_name?: string;
}

export interface GroupedChats {
  [key: string]: ChatMessage[];
}
