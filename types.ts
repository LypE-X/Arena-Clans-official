export enum GameType {
  VALORANT = 'Valorant',
  LOL = 'League of Legends',
}

export interface User {
  uid: string;
  name: string; // Titular
  email: string;
  phone: string;
  phoneVerified: boolean;
  teamId?: string;
  welcome_sent: boolean;
}

export interface Team {
  id: string;
  ownerUid: string;
  name: string;
  game: GameType;
  region: {
    country: string;
    state: string;
    city: string;
  };
  description: string;
  photoUrl: string;
  rating: number; // 0-5
  totalReviews: number;
}

export interface Review {
  id: string;
  targetTeamId: string;
  authorTeamId: string;
  authorTeamName: string;

  boaConduta: number;     // 1-5
  comunicacao: number;    // 1-5
  pontualidade: number;   // 1-5

  average: number;
  comment: string;
  timestamp: string;
}

export interface VideoEvidence {
  id: string;
  teamId: string;
  opponentTeamName: string;
  url: string; // Storage URL
  tags: string[];
  description: string;
  timestamp: string;
}

export interface TeamMessage {
  id: string;
  fromTeamId: string;
  toTeamId: string;
  text: string;
  timestamp: number;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: "message" | "info" | "success" | "warning";
  relatedTeamId?: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}