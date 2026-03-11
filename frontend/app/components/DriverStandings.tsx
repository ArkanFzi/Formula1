import { getDriverStandings, getDrivers } from "../../lib/api";
import DriverStandingsClient from "./DriverStandingsClient";

type DriverStandingItem = {
  driver_number: number;
  position_current: number;
  points_current: number;
};

type OpenF1Driver = {
  driver_number: number;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  headshot_url: string;
};

export default async function DriverStandings() {
  let [standings, drivers] = await Promise.all([
    getDriverStandings("latest"),
    getDrivers("latest"),
  ]);

  if (!standings || standings.length === 0) {
    standings = await getDriverStandings(9839);
  }
  if (!drivers || drivers.length === 0) {
    drivers = await getDrivers(9839);
  }

  if (!standings || standings.length === 0) {
    return (
      <div className="p-8 text-center text-white/20 font-mono text-[10px] uppercase tracking-[0.4em]">
        DRIVER_STANDINGS.NULL
      </div>
    );
  }

  const enriched = standings.slice(0, 10).map((s: DriverStandingItem) => ({
    ...s,
    driver: drivers.find((d: OpenF1Driver) => d.driver_number === s.driver_number) ?? null,
  }));

  return <DriverStandingsClient standings={enriched} />;
}