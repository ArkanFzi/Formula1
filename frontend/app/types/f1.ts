export interface OpenF1Driver {
  driver_number: number;
  full_name: string;
  last_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  headshot_url: string;
}

export interface DriverStanding {
  driver_number: number;
  points_current: number;
  position_current: number;
}

export interface CarPerformance {
  driver_number: number;
  speed: number;
  rpm: number;
  throttle: number;
  brake: number;
  n_gear: number;
  drs: number;
}

export interface PitStop {
  driver_number: number;
  stop_duration: number;
  lap_number: number;
}

export interface LapData {
  driver_number: number;
  lap_number: number;
  duration_sector_1: number;
  duration_sector_2: number;
  duration_sector_3: number;
}

export interface RaceControl {
  date: string;
  message: string;
  category: string;
  flag?: string;
}

export interface WeatherData {
  air_temperature: number;
  track_temperature: number;
  humidity: number;
  rainfall: number;
}
