export interface ChatMembers {
    userId: number |null;
    communityId: number;
    userName: string;
    avatar?: string;
    status?: string;
    lastSeen?: string;
    lastMessage?: string;
    lastMessageTime?: string;
    lastMessageFormattedTime?: string;
    isCommunityManager?: boolean;
    unreadMessageCount: number;
    isCommunityGroup: boolean;
}
