import { ComboboxFreeTextItem } from '@vendure-io/ui/components/molecules/combobox-free-text';

export { ComboboxFreeText } from '@vendure-io/ui/components/molecules/combobox-free-text';
export type {
    ComboboxFreeTextItem,
    ComboboxFreeTextProps,
} from '@vendure-io/ui/components/molecules/combobox-free-text';

/**
 * @description
 * Narrows the suggestions for a {@link ComboboxFreeText} whose items come from a local
 * list rather than a server query — the component itself does no filtering, since
 * server-driven suggestions arrive already filtered.
 *
 * While the value is untouched (empty, or exactly one of the items) the full list is
 * returned, so a small known set stays browsable without typing; once the value is
 * something of the user's own it narrows to substring matches.
 */
export function filterComboboxFreeTextItems<T extends ComboboxFreeTextItem>(
    items: readonly T[],
    value: string,
): T[] {
    const filter = value.trim().toLowerCase();
    const normalized = (item: T) => item.value.trim().toLowerCase();
    const isUntouched = filter === '' || items.some(item => normalized(item) === filter);
    return items.filter(item => isUntouched || normalized(item).includes(filter));
}
