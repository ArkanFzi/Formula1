import { getTeamStandings, fetchTeamColors } from "../../lib/api";
import TeamStandingsClient from "./TeamStandingsClient";

export default async function TeamStandings() {
  let [standings, teamColors] = await Promise.all([
    getTeamStandings("latest"),
    fetchTeamColors(),
  ]);

  if (!standings || standings.length === 0) {
    standings = await getTeamStandings(9839);
  }

  const colorMap: Record<string, string> = Object.fromEntries(
    teamColors.map((t: { team_name: string; team_colour: string }) => [
      t.team_name,
      t.team_colour ? `#${t.team_colour}` : "#e10600",
    ])
  );

  if (!standings || standings.length === 0) {
    return (
      <div className="p-8 text-center text-white/20 font-mono text-[10px] uppercase tracking-[0.4em]">
        CONSTRUCTORS_DATA.NULL
      </div>
    );
  }

  return <TeamStandingsClient standings={standings} colorMap={colorMap} />;
}