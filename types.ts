export interface Activity {
  title: string;
  description: string;
}

export interface ChronicleData {
  placeName: string;
  namedAfter: string;
  backstory: string;
  secret: string; // New field for the "Did you know?" hook
  vibe: string;
  activities: Activity[];
  isGeneric: boolean; // True if the user searched for something like "1st Cross"
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface ChronicleResponse {
  data: ChronicleData | null;
  sources: GroundingSource[];
  error?: string;
}