import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultMissionId, missions } from "./data/missions";
import { defaultWitnessId, witnesses } from "./data/materials";
import type { Scenario, View } from "./data/types";
import { assess, type Assessment } from "./lib/model";

const STORAGE = "flameguard-v1";

type Persisted = {
  view: View;
  missionId: string;
  custom: boolean;
  oxygenPct: number;
  pressurePsia: number;
  flowCms: number;
  gravityG: number;
  scenario: Scenario;
  witnessId: string;
  query: string;
  asked: string;
};

type Store = Persisted & {
  assessment: Assessment;
  setView: (view: View) => void;
  selectMission: (id: string) => void;
  setOxygen: (value: number) => void;
  setPressure: (value: number) => void;
  setFlow: (value: number) => void;
  setGravity: (value: number) => void;
  setScenario: (value: Scenario) => void;
  setWitness: (id: string) => void;
  setQuery: (value: string) => void;
  ask: (value?: string) => void;
};

const Ctx = createContext<Store | null>(null);

function missionById(id: string) {
  return missions.find((item) => item.id === id) ?? missions.find((item) => item.id === defaultMissionId)!;
}

function witnessById(id: string) {
  return witnesses.find((item) => item.id === id) ?? witnesses.find((item) => item.id === defaultWitnessId)!;
}

function initial(): Persisted {
  const base = missionById(defaultMissionId);
  const fallback: Persisted = {
    view: "mission",
    missionId: base.id,
    custom: false,
    oxygenPct: base.oxygenPct,
    pressurePsia: base.pressurePsia,
    flowCms: base.flowCms,
    gravityG: base.gravityG,
    scenario: "visible",
    witnessId: defaultWitnessId,
    query: "",
    asked: "",
  };
  try {
    const raw = sessionStorage.getItem(STORAGE);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    if (!parsed || typeof parsed !== "object") return fallback;
    const mission = missionById(String(parsed.missionId ?? ""));
    const witness = witnessById(String(parsed.witnessId ?? ""));
    return {
      ...fallback,
      ...parsed,
      missionId: mission.id,
      witnessId: witness.id,
      view: (["mission", "atlas", "materials", "ember", "brief", "contributors"] as View[]).includes(parsed.view as View)
        ? (parsed.view as View)
        : "mission",
      scenario: parsed.scenario === "cool" ? "cool" : "visible",
    };
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(initial);

  useEffect(() => {
    sessionStorage.setItem(STORAGE, JSON.stringify(state));
  }, [state]);

  const assessment = useMemo(() => {
    const base = missionById(state.missionId);
    const witness = witnessById(state.witnessId);
    return assess({
      mission: {
        ...base,
        name: state.custom ? `${base.name} · adjusted` : base.name,
        oxygenPct: state.oxygenPct,
        pressurePsia: state.pressurePsia,
        flowCms: state.flowCms,
        gravityG: state.gravityG,
      },
      witness,
      oxygenPct: state.oxygenPct,
      pressurePsia: state.pressurePsia,
      flowCms: state.flowCms,
      gravityG: state.gravityG,
      scenario: state.scenario,
    });
  }, [state]);

  const store = useMemo<Store>(() => {
    const patch = (partial: Partial<Persisted>) => setState((current) => ({ ...current, ...partial }));
    return {
      ...state,
      assessment,
      setView: (view) => patch({ view }),
      selectMission: (id) => {
        const mission = missionById(id);
        patch({
          missionId: mission.id,
          custom: false,
          oxygenPct: mission.oxygenPct,
          pressurePsia: mission.pressurePsia,
          flowCms: mission.flowCms,
          gravityG: mission.gravityG,
        });
      },
      setOxygen: (oxygenPct) => patch({ oxygenPct, custom: true }),
      setPressure: (pressurePsia) => patch({ pressurePsia, custom: true }),
      setFlow: (flowCms) => patch({ flowCms, custom: true }),
      setGravity: (gravityG) => patch({ gravityG, custom: true }),
      setScenario: (scenario) => patch({ scenario }),
      setWitness: (witnessId) => patch({ witnessId: witnessById(witnessId).id }),
      setQuery: (query) => patch({ query }),
      ask: (value) => {
        const next = (value ?? state.query).trim();
        patch({ query: next, asked: next });
      },
    };
  }, [state, assessment]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const store = useContext(Ctx);
  if (!store) throw new Error("Store missing");
  return store;
}
