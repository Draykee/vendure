import type { DashboardUserContext } from '../user-context/dashboard-user-context.js';

import { NavMenuConfig, NavMenuItem, NavMenuSection } from './nav-menu-extensions.js';

/**
 * Sorts by the optional `order` prop ascending, then alphabetically by title.
 * Ported unchanged from nav-main.tsx.
 */
function sortByOrder<T extends { order?: number; title: string }>(a: T, b: T) {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA === orderB) {
        return a.title.localeCompare(b.title);
    }
    return orderA - orderB;
}

function passesPermission(item: NavMenuItem | NavMenuSection, ctx: DashboardUserContext): boolean {
    if (!item.requiresPermission) {
        return true;
    }
    const permissions = Array.isArray(item.requiresPermission)
        ? item.requiresPermission
        : [item.requiresPermission];
    return ctx.hasPermissions(permissions);
}

const warnedIds = new Set<string>();

/**
 * Warns once per key. Also used by the nav menu helpers, which swallow a throw from a
 * composed predicate and would otherwise report nothing.
 */
export function warnOnce(id: string, message: string) {
    if (warnedIds.has(id)) {
        return;
    }
    warnedIds.add(id);
    // eslint-disable-next-line no-console
    console.warn(message);
}

/**
 * @description
 * Clears the once-per-key warning dedup state. Intended for tests, so that a
 * suite exercising the same failing entry twice sees a warning each time.
 *
 * @since 3.8.0
 */
export function resetNavMenuWarnings() {
    warnedIds.clear();
}

function isVisibleFor(item: NavMenuItem | NavMenuSection, ctx: DashboardUserContext): boolean {
    if (!item.isVisible) {
        return true;
    }
    try {
        return item.isVisible(ctx);
    } catch (e) {
        // Fail open. An extension bug must not blank the sidebar. Note this rule is
        // specific to presentation; route access control must fail CLOSED.
        warnOnce(
            `isVisible:${item.id}`,
            `[Dashboard] The isVisible predicate for nav entry "${item.id}" threw, so the ` +
                `entry is being shown. ${String(e)}`,
        );
        return true;
    }
}

/**
 * @description
 * Filters and sorts the nav menu config for the given user. Pure, so it can be unit
 * tested without rendering.
 *
 * Returns entries of both placements in one pass; callers partition by `placement`.
 *
 * @since 3.8.0
 */
export function resolveNavMenu(
    config: NavMenuConfig,
    ctx: DashboardUserContext,
): Array<NavMenuSection | NavMenuItem> {
    return config.sections
        .slice()
        .sort(sortByOrder)
        .map(section => {
            if ('items' in section) {
                const items = (section.items ?? [])
                    .filter(item => passesPermission(item, ctx) && isVisibleFor(item, ctx))
                    .sort(sortByOrder);
                return { ...section, items };
            }
            return section;
        })
        .filter(section => {
            if (!isVisibleFor(section, ctx)) {
                return false;
            }
            if ('items' in section) {
                return !!section.items && section.items.length > 0;
            }
            return passesPermission(section as NavMenuItem, ctx);
        });
}
