import { Atlas } from "./components/Atlas";
import { Brief } from "./components/Brief";
import { Contributors } from "./components/Contributors";
import { Ember } from "./components/Ember";
import { Materials } from "./components/Materials";
import { Mission } from "./components/Mission";
import { Shell } from "./components/Shell";
import { useStore } from "./state";

export function App() {
  const { view } = useStore();
  return (
    <Shell>
      {view === "mission" && <Mission />}
      {view === "atlas" && <Atlas />}
      {view === "materials" && <Materials />}
      {view === "ember" && <Ember />}
      {view === "brief" && <Brief />}
      {view === "contributors" && <Contributors />}
    </Shell>
  );
}
