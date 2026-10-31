// Wspólne podstawy archetypów. Generator dodaje unikalną sygnaturę każdego materiału.
export const P = (o) => ({
  state: 'solid',
  movement: 'static',
  density: 1200,
  hardness: 3,
  melting: 1200,
  boiling: null,
  ignition: null,
  conductivity: 0.02,
  ph: 7,
  radioactivity: 0,
  solubility: 0,
  flammable: 0,
  tags: [],
  behavior: 'Materiał stały; pozostaje w miejscu do czasu reakcji.',
  color: '#8a8f98',
  pattern: 'grain',
  ...o
})

export const tags = (...t) => t
