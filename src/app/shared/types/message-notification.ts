export interface MessageNotification {
  _id: string;
  message: string;
  sender_id: number;
  sender_name: string;
  receiver_id: number;
  community_id: number;
  community_short_name: string;
  community_name: string;
  is_group: boolean;
  is_read: boolean;
  createdAt: string;
}
