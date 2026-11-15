import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultMissionId, missions } from "./data/missions";
import { defaultWitnessId, witnesses } from "./data/materials";
import type { Scenario, View } from "./data/types";
import { assess, type Assessment } from "./lib/model";

const STORAGE = "flameguard-v1";
const VIEWS: View[] = ["mission", "atlas", "materials", "ember", "brief", "contributors"];

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

function numIn(value: string | null, min: number, max: number): number | null {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return null;
  return parsed;
}

function readHash(): Partial<Persisted> | null {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw.includes("=")) return null;
  const params = new URLSearchParams(raw);
  const view = params.get("view");
  const missionId = params.get("mission");
  const witnessId = params.get("witness");
  if (!view && !missionId && !witnessId) return null;
  const next: Partial<Persisted> = {};
  if (view && VIEWS.includes(view as View)) next.view = view as View;
  if (missionId && missions.some((item) => item.id === missionId)) {
    const mission = missionById(missionId);
    next.missionId = mission.id;
    if (params.get("custom") === "1") {
      next.custom = true;
      const oxygenPct = numIn(params.get("o2"), 15, 40);
      const pressurePsia = numIn(params.get("p"), 4, 16);
      const flowCms = numIn(params.get("u"), 0, 40);
      const gravityG = numIn(params.get("g"), 0, 1);
      if (oxygenPct != null) next.oxygenPct = oxygenPct;
      if (pressurePsia != null) next.pressurePsia = pressurePsia;
      if (flowCms != null) next.flowCms = flowCms;
      if (gravityG != null) next.gravityG = gravityG;
    } else {
      next.custom = false;
      next.oxygenPct = mission.oxygenPct;
      next.pressurePsia = mission.pressurePsia;
      next.flowCms = mission.flowCms;
      next.gravityG = mission.gravityG;
    }
  }
  if (witnessId && witnesses.some((item) => item.id === witnessId)) next.witnessId = witnessId;
  if (params.has("view")) next.scenario = params.get("flame") === "cool" ? "cool" : "visible";
  return next;
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
  const hashed = readHash();
  try {
    const raw = hashed ? null : sessionStorage.getItem(STORAGE);
    if (!raw) return { ...fallback, ...hashed };
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    if (!parsed || typeof parsed !== "object") return { ...fallback, ...hashed };
    const mission = missionById(String(parsed.missionId ?? ""));
    const witness = witnessById(String(parsed.witnessId ?? ""));
    return {
      ...fallback,
      ...parsed,
      missionId: mission.id,
      witnessId: witness.id,
      view: VIEWS.includes(parsed.view as View) ? (parsed.view as View) : "mission",
      scenario: parsed.scenario === "cool" ? "cool" : "visible",
      ...hashed,
    };
  } catch {
    return { ...fallback, ...hashed };
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(initial);

  useEffect(() => {
    sessionStorage.setItem(STORAGE, JSON.stringify(state));
    const params = new URLSearchParams();
    params.set("view", state.view);
    params.set("mission", state.missionId);
    params.set("witness", state.witnessId);
    if (state.scenario === "cool") params.set("flame", "cool");
    if (state.custom) {
      params.set("custom", "1");
      params.set("o2", String(state.oxygenPct));
      params.set("p", String(state.pressurePsia));
      params.set("u", String(state.flowCms));
      params.set("g", String(state.gravityG));
    }
    const next = `#${params.toString()}`;
    if (window.location.hash !== next) window.history.replaceState(null, "", next);
  }, [state]);

  useEffect(() => {
    const onHash = () => {
      const hashed = readHash();
      if (!hashed) return;
      setState((current) => ({ ...current, ...hashed }));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

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
