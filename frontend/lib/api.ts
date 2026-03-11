const API_BASE_URL = "https://api.openf1.org/v1";

/**
 * Fetch the latest meeting.
 */
export async function getLatestMeeting() {
  try {
    const res = await fetch(`${API_BASE_URL}/meetings?meeting_key=latest`, {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] || null;
  } catch (error) {   
    console.error("DEBUG: getLatestMeeting fetch failed:", error);
    return null;
  }
}

/**
 * Fetch the latest session for the given meeting.
 */
export async function getLatestSession() {
  try {
    const res = await fetch(`${API_BASE_URL}/sessions?session_key=latest`, {
      next: { revalidate: 300 },
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] || null;
  } catch (error) {
    console.error("DEBUG: getLatestSession fetch failed:", error);
    return null;
  }
}

/**
 * Fetch driver standings for a specific session.
 */
export async function getDriverStandings(session_key: number | string = "latest") {
  try {
    const res = await fetch(`${API_BASE_URL}/championship_drivers?session_key=${session_key}`, {
      next: { revalidate: 600 },
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.sort((a: { position_current: number }, b: { position_current: number }) => a.position_current - b.position_current);
  } catch (error) {
    console.error(`DEBUG: getDriverStandings(${session_key}) fetch failed:`, error);
    return [];
  }
}

/**
 * Fetch team standings for a specific session.
 */
export async function getTeamStandings(session_key: number | string = "latest") {
  try {
    const res = await fetch(`${API_BASE_URL}/championship_teams?session_key=${session_key}`, {
      next: { revalidate: 600 },
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.sort((a: { position_current: number }, b: { position_current: number }) => a.position_current - b.position_current);
  } catch (error) {
    console.error(`DEBUG: getTeamStandings(${session_key}) fetch failed:`, error);
    return [];
  }
}

/**
 * Fetch drivers for a specific session.
 */
export async function getDrivers(session_key: number | string = "latest") {
  try {
    const res = await fetch(`${API_BASE_URL}/drivers?session_key=${session_key}`, {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(`DEBUG: getDrivers(${session_key}) fetch failed:`, error);
    return [];
  }
}

/**
 * Fetch session results for a specific session.
 */
export async function getSessionResults(session_key: number | string = "latest") {
  try {
    const res = await fetch(`${API_BASE_URL}/session_result?session_key=${session_key}`, {
      next: { revalidate: 300 },
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.sort((a: { position: number }, b: { position: number }) => a.position - b.position);
  } catch (error) {
    console.error(`DEBUG: getSessionResults(${session_key}) fetch failed:`, error);
    return [];
  }
}

/**
 * Fetch meetings for a specific year.
 */
export async function getMeetings(year: number = 2024) {
  try {
    const res = await fetch(`${API_BASE_URL}/meetings?year=${year}`, {
      next: { revalidate: 86400 }, // Schedule rarely changes
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.sort((a: { date_start: string }, b: { date_start: string }) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());
  } catch (error) {
    console.error(`DEBUG: getMeetings(${year}) fetch failed:`, error);
    return [];
  }
}
