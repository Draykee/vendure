import { describe, expect, it } from 'vitest';

import { BUILT_IN_NAV_ITEM_IDS, BUILT_IN_NAV_SECTION_IDS } from './nav-menu-ids.js';

describe('built-in nav ids', () => {
    // setNavVisibility and keepOnlyNavItems match sections and items from one id space,
    // so an id shared by a section and an item targets both. Naming an item would then
    // hide its whole section, and no unmatched-id warning would fire, because the id
    // did match - twice.
    it('never gives a section and an item the same id', () => {
        const sectionIds = Object.values(BUILT_IN_NAV_SECTION_IDS);
        const itemIds: string[] = Object.values(BUILT_IN_NAV_ITEM_IDS);
        expect(sectionIds.filter(id => itemIds.includes(id))).toEqual([]);
    });

    it('never repeats an item id', () => {
        const itemIds = Object.values(BUILT_IN_NAV_ITEM_IDS);
        expect(new Set(itemIds).size).toBe(itemIds.length);
    });
});
