interface Level {
  id: number;
  name: string;
}

export interface Sector {
  id: number;
  name: string;
  levels: Level[];
}