import type { ReactNode } from "react";
import type { View } from "../data/types";
import { useStore } from "../state";

const nav: { id: View; label: string }[] = [
  { id: "mission", label: "Mission" },
  { id: "atlas", label: "Atlas" },
  { id: "materials", label: "Materials" },
  { id: "ember", label: "Ember" },
  { id: "brief", label: "Brief" },
  { id: "contributors", label: "Contributors" },
];

export function Shell({ children }: { children: ReactNode }) {
  const store = useStore();
  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <span className="mark" aria-hidden />
          <div>
            <strong>FlameGuard</strong>
            <em>CCU · NASA Space Apps 2026</em>
          </div>
        </div>
        <nav>
          {nav.map((item) => (
            <button
              key={item.id}
              className={store.view === item.id ? "active" : ""}
              onClick={() => store.setView(item.id)}
              aria-current={store.view === item.id ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>
      <p className="honesty">
        Measured numbers are cited. Screening math is labeled. This compares published results. It does not certify a
        material or a vehicle.
      </p>
      <main>{children}</main>
    </div>
  );
}
