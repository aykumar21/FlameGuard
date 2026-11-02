# FlameGuard

Interactive fire-safety intelligence for the NASA Space Apps challenge **Flame in Freefall**.

FlameGuard ranks NASA’s public microgravity combustion record against the cabin you are actually designing. The scientific point is narrow and uncomfortable: for some materials, lunar or Martian gravity is a worse flammability case than either Earth or free fall, and a large fire at exploration-atmosphere oxygen has been flown only in microgravity.

## Run

```bash
npm install
npm run check
npm run dev
```

Open the local URL Vite prints. `npm run build` typechecks and writes `dist/`.

## What to show a judge

1. Land on **Lunar surface**. Nomex is the default witness. The headline is the published lunar ULOI*, not a chatbot summary.
2. Open **Same witness, six cabins**. ISS air sits just under Nomex’s microgravity MOC*. Exploration air sits far above every published limit. The exposure index and the oxygen limit do not always pick the same mission, and the page says so.
3. Switch the witness to **Mylar**. Lunar gravity is the bottom of that table, 5.75 points below the 1 g mean (Olson & Ferkul 2012, Table I).
4. Open **Ember** and ask “Will a Test 1 pass keep a material safe on the Moon?” Every number in the answer is either that table or a labeled screening rule.
5. **Brief** prints a one-page flight fire brief with the method written out.

## What is measured, and what is not

Measured, and cited in the atlas:

- Olson & Ferkul, AIAA 2012-3492, Table I. Mylar G, Ultem 1000, Nomex HT90-40 at 1 g, Martian g, lunar g, and forced-flow microgravity.
- Saffire I–V concurrent spread rows from Combustion and Flame, DOI 10.1016/j.combustflame.2022.112559, Table 1.
- Saffire-VI atmospheres, heat release, CO/CO2, and the 981 s smoke threshold from NTRS 20240002981.
- FLEX cool flames, Nayagam et al., Combustion and Flame 2012.
- Detector placement and the deep-space gap list from OCHMO-TB-008.

Screening, and labeled as screening:

- Exposure index, an equal-weight comparison of limit overrun, oxygen mole fraction, detection, and suppression. Not a probability.
- Microgravity spread ratio `Vf ∝ O2% · √P · U`, anchored to Saffire-I at 0.18 cm/s. Withheld once gravity can drive its own flow.
- Straight lines between measured gravities. Below lunar g the lunar value is held. The 0 g row is kept off that curve.

Ember does not call an external model. If a question misses the corpus, it says so.

## Team

FlameGuard, National Chung Cheng University (CCU). Independent Space Apps project. Not a NASA flight product.
