import { ARCHETYPES_A } from './a.mjs'
import { ARCHETYPES_B } from './b.mjs'
import { ARCHETYPES_C } from './c.mjs'
import { ARCHETYPES_D } from './d.mjs'
import { EXTRA, CATEGORY_OVERRIDES, NAME_OVERRIDES } from './overrides.mjs'

export const ARCHETYPES = { ...ARCHETYPES_A, ...ARCHETYPES_B, ...ARCHETYPES_C, ...ARCHETYPES_D, ...EXTRA }

export function resolveArchetype(categorySlug, group, name) {
  const byName = NAME_OVERRIDES[name]
  if (byName) return { key: byName, archetype: ARCHETYPES[byName] }
  const byCategory = CATEGORY_OVERRIDES[`${categorySlug}:${group}`]
  const key = byCategory || group
  return { key, archetype: ARCHETYPES[key] }
}

export function allArchetypeKeys() {
  return Object.keys(ARCHETYPES)
}
