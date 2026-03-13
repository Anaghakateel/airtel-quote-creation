# Enrich Quote Page – Complete Retrieval (Everything Added So Far)

This document captures **everything** that has been added for the Enrich Quote page: entry, routing, data, state, actions, UI, and code locations.

---

## 1. Entry point and routing

- **Where:** Quote → Quote 2 flow (Add Products).
- **App state:** `showEnrichQuotePage` (boolean) in `src/App.jsx` (line ~97).
- **When true:** App renders `SelectQuoteLineItemsPage` instead of `QuoteProposalPage`.
- **Props passed to SelectQuoteLineItemsPage:**
  - `onBack={() => setShowEnrichQuotePage(false)}`
  - `quote1Locations={locationsForSummaryTab?.length ? locationsForSummaryTab : locationsForDownstreamTabs}`

**Data source for quote line items:**

- `locationsForSummaryTab`: Set when user clicks **Continue** on the Locations tab (Summary flow).
- `locationsForDownstreamTabs`: Set when user continues from Extracted Information to Locations.
- Each location has: `id`, `streetAddress`, `postalCode`, `city`, `state`, `country`, `source`, `circle`, `productsAssigned`.

---

## 2. How to open the Enrich Quote page

- **From Quote Proposal (Quote 2):** Click **"Enrich Quote - UI"** (top right of quote card).
- **Handler:** `QuoteProposalPage` receives `onEnrichQuoteClick` from App; it calls `onEnrichQuoteClick()`, which runs `setShowEnrichQuotePage(true)` in App.

**Files:**

- `src/App.jsx`: state and conditional render (lines 97, 613–617).
- `src/components/QuoteProposalPage.jsx`: "Enrich Quote - UI" button and `onEnrichQuoteClick` (lines 50–57).

---

## 3. Select Quote Line Items page (Enrich Quote UI)

- **Component:** `src/components/SelectQuoteLineItemsPage.jsx`.
- **Purpose:** Let the user select and manage quote line items (from locations) before updating the quote.

---

## 4. Actions on the Enrich Quote page

| Action | Description | Where |
|--------|-------------|--------|
| **Back** | Return to Quote Proposal (Quote 2). | Header; calls `onBack()`. |
| **Row selection** | Select one or more rows via checkbox. | Table: checkbox column + “select all” in header. |
| **Overflow menu (per row)** | Open row menu (chevron-down). | Actions column. |
| **Delete (single)** | Delete one record; opens “Delete this record?” modal. | Overflow menu → Delete. |
| **Delete (bulk)** | Delete all selected rows; opens “Delete N selected records?” modal. | Toolbar “Delete (N)” when selection exists. |
| **Repeated LSI** | Show “Repeated” badge when LSI value appears on multiple rows. | LSI column. |
| **Filter by State** | Restrict rows by state. | Filter controls above table. |
| **Filter by Product** | Restrict rows by product. | Filter controls above table. |
| **Search** | Search by BCP, product, address, state. | Search input above table. |
| **Pagination** | Previous / Page X of Y / Next. | Below table. |
| **Update Parameter** | Apply changes (e.g. send selected items to quote). | Button below table. |

---

## 5. Modals (on Enrich Quote page)

- **Delete confirmation:** Shown when user chooses Delete (single or bulk). Prompts “Delete this record?” or “Delete N selected records?” with Cancel and Delete. On confirm, rows are removed from the list (via `deletedIds`).

---

## 6. State used on the page (SelectQuoteLineItemsPage)

- `deletedIds` – Set of row ids to hide (soft delete).
- `deleteModalOpen` – Whether the delete confirmation modal is open.
- `deleteModalIds` – Ids to delete in the current modal (single or bulk).
- `openRowMenuId` – Id of the row whose overflow menu is open.
- `selectedIds` – Set of selected row ids (for bulk delete and future actions).
- `currentPage` – Pagination page index.
- `filterState` / `filterProduct` – Filters for state and product.
- `searchQuery` – Search text.
- `repeatedLsiSet` – Derived: LSI values that appear on more than one row (for “Repeated” badge).

---

## 7. Data flow

1. **Line items:** Built from `quote1Locations` via `buildLineItemsFromQuote1(quote1Locations)`. If there are no locations, `FALLBACK_LINE_ITEMS` is used.
2. **Displayed rows:** Line items minus `deletedIds`, then filtered by state/product and search, then paginated.
3. **Delete:** Adding ids to `deletedIds` hides them from the list; selection is updated so deleted ids are removed from `selectedIds`.

---

## 8. File index

| File | Role |
|------|------|
| `src/App.jsx` | `showEnrichQuotePage` state; renders `SelectQuoteLineItemsPage` or `QuoteProposalPage`; passes `onBack` and `quote1Locations`. |
| `src/components/QuoteProposalPage.jsx` | “Enrich Quote - UI” button; calls `onEnrichQuoteClick`. |
| `src/components/SelectQuoteLineItemsPage.jsx` | Full Enrich Quote page: table, selection, overflow menu, delete modal, filters, pagination, Update Parameter, Back. |
| `src/docs/ENRICH_QUOTE_PAGE_AND_ACTIONS.md` | This retrieval document. |

---

## 9. Code-level reference (SelectQuoteLineItemsPage.jsx)

**Constants:**
- `PAGE_SIZE = 10`, `FILTER_ALL = 'All'`
- `COLUMNS`: lastEnrichedDate, lsi, lineNumber, address, state, productName, media, bandwidth, quantity, billingContactPerson
- `FALLBACK_LINE_ITEMS`: 12 rows when no locations; LSI repeats every 3 rows (`80260000478XX...`)

**Data helpers:**
- `buildLineItemsFromQuote1(locations)`: maps each location to `{ id, lastEnrichedDate, lsi, lineNumber, address, state, productName, media, bandwidth, quantity, billingContactPerson }`. Uses `loc.id`, `loc.streetAddress`, `loc.state`; LSI = `80260000478${group}.padStart(2,'0')}...` with group = floor(i/3)+1.
- `getFallbackLineItems()`: returns 12 items with ids `fallback-1`..`fallback-12`, states Karnataka/Maharashtra/Tamil Nadu, products Internet/SD WAN/MPLS.

**State (all in SelectQuoteLineItemsPage):**
- `selectedIds` (Set), `deletedIds` (Set), `deleteModalOpen` (bool), `deleteModalIds` (array), `openRowMenuId` (id | null), `currentPage` (number), `filterState`, `filterProduct`, `searchQuery` (string), `rowMenuRef` (ref).

**Derived (useMemo):**
- `allLineItems`: buildLineItemsFromQuote1(quote1Locations) or FALLBACK_LINE_ITEMS
- `stateOptions`, `productOptions`: unique state/product from allLineItems
- `filteredItems`: allLineItems minus deletedIds, then filter by state/product and search (BCP, product, address, state)
- `repeatedLsiSet`: Set of LSI values that appear more than once in filteredItems
- `items`: current page slice of filteredItems (start = (page-1)*PAGE_SIZE)

**Handlers:**
- `toggleSelect(id)`, `toggleSelectAll()`: update selectedIds
- `openDeleteModal(ids)`: set deleteModalIds, open modal, close row menu
- `confirmDelete()`: add deleteModalIds to deletedIds, remove from selectedIds, close modal
- `useEffect`: close row menu on outside click (rowMenuRef)

**UI sections (in order):**
1. Header: "Select Quote Line Items" + Back button (chevron-left icon)
2. Filters: Search input, State dropdown, Product dropdown
3. Table: checkbox column, 10 data columns from COLUMNS, Actions column (chevron-down → Delete)
4. LSI cell: value + "Repeated" badge (amber) when LSI in repeatedLsiSet
5. Pagination bar: Bulk "Delete (N)" when selectedIds.size > 0, Previous, "Page X of Y", Next
6. Update Parameter button (below card)
7. Delete modal: overlay; title "Delete this record?" or "Delete N selected records?"; Cancel / Delete buttons
