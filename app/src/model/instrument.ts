interface Level {
  id: number;
  name: string;
}

export interface Instrument {
  id: number;
  name: string;
  levels: Level[];
}