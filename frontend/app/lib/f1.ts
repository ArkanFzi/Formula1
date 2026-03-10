import { 
  OpenF1Driver, 
  DriverStanding, 
  CarPerformance, 
  PitStop, 
  LapData, 
  RaceControl, 
  WeatherData 
} from "../types/f1";

const BASE_URL = "https://api.openf1.org/v1";

/**
 * Fetch all drivers for the latest session.
 */
export async function fetchDrivers(): Promise<OpenF1Driver[]> {
  try {
    const res = await fetch(`${BASE_URL}/drivers?session_key=latest`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch drivers");
    const data: OpenF1Driver[] = await res.json();
    
    const seen = new Set<number>();
    return data.filter((d) => {
      if (seen.has(d.driver_number)) return false;
      seen.add(d.driver_number);
      return !!d.headshot_url;
    });
  } catch (error) {
    console.error("Fetch drivers error:", error);
    return [];
  }
}

/**
 * Fetch a specific driver by their driver number.
 */
export async function fetchDriverByNumber(driver_number: number): Promise<OpenF1Driver | null> {
  const url = `${BASE_URL}/drivers?driver_number=${driver_number}&session_key=latest`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data: OpenF1Driver[] = await res.json();
    return data[0] || null;
  } catch (error) {
    console.error(`DEBUG: fetchDriverByNumber failed for URL: ${url}`);
    console.error(`DEBUG: Error details:`, error);
    return null;
  }
}

/**
 * Fetch championship standings for the latest session.
 */
export async function fetchDriverStandings(): Promise<DriverStanding[]> {
  try {
    const res = await fetch(`${BASE_URL}/championship_drivers?session_key=latest`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

/**
 * Fetch the most recent telemetry for a specific driver.
 */
export async function fetchDriverPerformance(driver_number: number): Promise<CarPerformance | null> {
  try {
    const res = await fetch(`${BASE_URL}/car_data?driver_number=${driver_number}&session_key=latest`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
      next: { revalidate: 10 },
    });
    if (!res.ok) return null;
    const data: CarPerformance[] = await res.json();
    return data.length > 0 ? data[data.length - 1] : null;
  } catch {
    return null;
  }
}

/**
 * Fetch best pit stop for a driver in the latest session.
 */
export async function fetchBestPitStop(driver_number: number): Promise<PitStop | null> {
  try {
    const res = await fetch(`${BASE_URL}/pit?driver_number=${driver_number}&session_key=latest`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data: PitStop[] = await res.json();
    if (data.length === 0) return null;
    return data.reduce((prev, curr) => (prev.stop_duration < curr.stop_duration ? prev : curr));
  } catch {
    return null;
  }
}

/**
 * Fetch latest lap data including sectors for a driver.
 */
export async function fetchLatestLap(driver_number: number): Promise<LapData | null> {
  try {
    const res = await fetch(`${BASE_URL}/laps?driver_number=${driver_number}&session_key=latest`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const data: LapData[] = await res.json();
    return data.length > 0 ? data[data.length - 1] : null;
  } catch {
    return null;
  }
}

/**
 * Fetch recent race control messages.
 */
export async function fetchRaceControl(): Promise<RaceControl[]> {
  try {
    const res = await fetch(`${BASE_URL}/race_control?session_key=latest`, {
      next: { revalidate: 15 },
    });
    if (!res.ok) return [];
    const data: RaceControl[] = await res.json();
    return data.slice(-10).reverse(); // Latest 10 messages
  } catch {
    return [];
  }
}

/**
 * Fetch latest weather conditions.
 */
export async function fetchLatestWeather(): Promise<WeatherData | null> {
  try {
    const res = await fetch(`${BASE_URL}/weather?session_key=latest`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data: WeatherData[] = await res.json();
    return data.length > 0 ? data[data.length - 1] : null;
  } catch {
    return null;
  }
}

/**
 * Fetch all recent laps for all drivers to build a leaderboard.
 */
export async function fetchAllLaps(): Promise<LapData[]> {
  try {
    const res = await fetch(`${BASE_URL}/laps?session_key=latest`, {
      next: { revalidate: 20 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

/**
 * Fetch the current session info and flag status.
 */
export async function fetchSessionStatus() {
  try {
    const [sessionRes, raceControlRes] = await Promise.all([
      fetch(`${BASE_URL}/sessions?session_key=latest`, { next: { revalidate: 300 } }),
      fetch(`${BASE_URL}/race_control?session_key=latest&category=Flag`, { next: { revalidate: 15 } })
    ]);

    const sessionData = sessionRes.ok ? await sessionRes.json() : [];
    const flagData = raceControlRes.ok ? await raceControlRes.json() : [];

    return {
      name: sessionData[0]?.session_name || "Unknown Session",
      status: flagData.length > 0 ? flagData[flagData.length - 1].flag : "GREEN"
    };
  } catch (error) {
    console.error("DEBUG: fetchSessionStatus failed:", error);
    return { name: "Live Session", status: "GREEN" };
  }
}

/**
 * Fetch lap history for a specific driver.
 */
export async function fetchDriverLaps(driver_number: number): Promise<LapData[]> {
  try {
    const res = await fetch(`${BASE_URL}/laps?driver_number=${driver_number}&session_key=latest`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: LapData[] = await res.json();
    return data.slice(-20); // Last 20 laps
  } catch {
    return [];
  }
}
