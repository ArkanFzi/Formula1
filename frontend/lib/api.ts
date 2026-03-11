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
      next: { revalidate: 86400 },
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

/**
 * Fetch team colors from drivers endpoint, deduplicated by team.
 * Used to get real-time team colors from OpenF1 API.
 */
export async function fetchTeamColors() {
  try {
    const res = await fetch(`${API_BASE_URL}/drivers?session_key=latest`, {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return [];
    const drivers = await res.json();
    const seen = new Set<string>();
    return drivers
      .filter((d: { team_name: string; team_colour: string }) => {
        if (!d.team_name || !d.team_colour || seen.has(d.team_name)) return false;
        seen.add(d.team_name);
        return true;
      })
      .map((d: { team_name: string; team_colour: string }) => ({
        team_name: d.team_name,
        team_colour: d.team_colour,
      }));
  } catch (error) {
    console.error("DEBUG: fetchTeamColors fetch failed:", error);
    return [];
  }
}

/**
 * Fetch completed race rounds for current year.
 * Uses /sessions with session_name=Race for accuracy.
 */
export async function getCompletedRounds(year: number = 2025) {
  try {
    const [meetingsRes, sessionsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/meetings?year=${year}`, {
        next: { revalidate: 3600 },
        headers: { 'User-Agent': 'Mozilla/5.0' },
      }),
      fetch(`${API_BASE_URL}/sessions?session_name=Race&year=${year}`, {
        next: { revalidate: 3600 },
        headers: { 'User-Agent': 'Mozilla/5.0' },
      }),
    ]);

    const meetings = meetingsRes.ok ? await meetingsRes.json() : [];
    const sessions = sessionsRes.ok ? await sessionsRes.json() : [];

    const total = meetings.filter(
      (m: { meeting_name: string }) =>
        !m.meeting_name.toLowerCase().includes("pre-season") &&
        !m.meeting_name.toLowerCase().includes("test")
    ).length;

    const now = new Date();
    const completed = sessions.filter(
      (s: { date_end: string }) => new Date(s.date_end) < now
    ).length;

    return { completed, total };
  } catch {
    return { completed: 0, total: 0 };
  }
}