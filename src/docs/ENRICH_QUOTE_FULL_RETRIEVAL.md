# Enrich Quote Page – Full Retrieval (All Columns, Actions, Inline/Bulk Edits, Search, Filter)

Single reference for **everything** on the Enrich Quote (Select Quote Line Items) page: columns, modals, BCP actions, inline/bulk edits, Search this list, Filter by.

---

## 0. Look and feel (from reference)

- **Header:** "← Back to Quote" (link/button, left), then "Enrich Quote" as main title below.
- **Filters:** "Filter by State" label + dropdown (All), "Filter by Product" label + dropdown (All); "Search this list" input with magnifying glass icon on the right.
- **Record summary:** "Show X to Y of Z records. N Records selected" between filters and table.
- **Column order:** Checkbox | Last Enriched Date | Line Number | Address | State | Products | Media | Bandwidth | LSI | Quantity | Billing Contact Person | Billing... | PO... | Invoice Shipping Details | GST app | Actions.
- **Column headers:** Each has a dropdown chevron (sort/filter). Abbreviated: "Billing...", "PO...", "GST app".
- **Line Number:** Display as 8-digit (e.g. 04787001).
- **Products:** Inline dropdown + pencil icon for edit.
- **Pagination:** Previous | Page X of Y | Next.
- **Update Parameter:** Red button, bottom right.

---

## 1. Entry and routing

| Item | Location | Notes |
|------|----------|--------|
| **Open Enrich Quote** | Quote 2 → "Enrich Quote - UI" button | `QuoteProposalPage.jsx`; `onEnrichQuoteClick()` → `setShowEnrichQuotePage(true)` in App |
| **App state** | `src/App.jsx` ~line 97 | `showEnrichQuotePage` (boolean) |
| **Page component** | `src/components/SelectQuoteLineItemsPage.jsx` | Props: `onBack`, `quote1Locations` |
| **Data source** | App passes `quote1Locations` | `locationsForSummaryTab?.length ? locationsForSummaryTab : locationsForDownstreamTabs` |

---

## 2. Columns and their actions

| Column | Purpose | Actions | Status in code |
|--------|---------|---------|----------------|
| **Checkbox** | Row selection | Select one; "Select all" in header | ✅ Implemented |
| **Last Enriched Date** | Display | Read-only | ✅ Implemented |
| **LSI** | Line item ID | Display; "Repeated" badge when LSI appears on multiple rows | ✅ Implemented |
| **Line Number** | Display | Read-only | ✅ Implemented |
| **Address** | Display | Read-only (can add inline edit later) | ✅ Implemented |
| **State** | Display / filter | Read-only in cell; filter by State above table | ✅ Implemented |
| **Products** | Product name | Inline dropdown; bulk edit bar when 2+ selected | ✅ Implemented |
| **Media** | Media type | Inline dropdown; bulk edit bar when 2+ selected | ✅ Implemented |
| **Bandwidth** | Bandwidth | Inline dropdown; bulk edit bar when 2+ selected | ✅ Implemented |
| **Quantity** | Quantity | Inline number input; bulk edit bar when 2+ selected | ✅ Implemented |
| **Billing Contact Person** | BCP name | **Actions:** (1) Inline dropdown to select BCP, (2) "+ Add BCP" option opens Add Billing Contact Person modal, (3) New names from modal added to dropdown; bulk edit when 2+ selected (future) | ✅ Dropdown + Add BCP modal |
| **Billing Details** | Legal Entity, Billing level, Billing Frequency, etc. | **Action:** Click cell to open **Billing Details** modal; edit sub-fields; Save/Cancel | ✅ Column + modal |
| **PO Group** | PO Number, PO Name, etc. | **Action:** Click cell to open **PO Group** modal; edit fields; Save/Cancel | ✅ Column + modal |
| **Invoice Shipping Details** | Shipping address / type | **Action:** Click cell to open **New Invoice – Shipping Address** modal; Save updates row | ✅ Column + modal |
| **GST applicable** | Yes/No | **Action:** Inline dropdown (Yes/No); bulk edit when 2+ selected (future) | ✅ Column + dropdown |
| **Actions** | Row menu | Chevron-down → **Delete**; opens Delete confirmation modal | ✅ Implemented |

---

## 3. Modals (Enrich Quote page)

| Modal | Trigger | Actions | Status |
|-------|---------|---------|--------|
| **Delete this record / Delete N selected records** | Row menu → Delete, or toolbar "Delete (N)" | Cancel; Delete (add ids to `deletedIds`, clear from `selectedIds`) | ✅ Implemented |
| **Billing Details** | Click Billing Details cell | Edit Billing level, Legal Entity, Billing Frequency; Save / Cancel | ✅ Implemented |
| **PO Group** | Click PO Group cell | Edit PO Number, PO Name; Save / Cancel | ✅ Implemented |
| **Add Billing Contact Person (Add BCP)** | BCP dropdown → "+ Add BCP" | First Name, Last Name, Designation; Save adds new name to `newBcpNames` and dropdown options | ✅ Implemented |
| **New Invoice – Shipping Address (Existing Invoice)** | Click Invoice Shipping Details cell | Shipping Address field; Save sets row to "New Invoice" / Cancel | ✅ Implemented |

---

## 3a. Retrieval: Billing Details and PO Group sub-columns and values

### Billing Details – sub-columns and values

| Sub-column | Control | Value / options | Persisted to (cellEdits) |
|------------|---------|-----------------|---------------------------|
| **Legal Entity** | Text input | Text; placeholder "Legal Entity" | `billingLegalEntity` |
| **Bill Details Type** | Text input (or select) | Text; placeholder "e.g. Standard" | `billingBillDetailsType` |
| **Store** | Text input | Text; placeholder "Store" | `billingStore` |
| **Billing level** | Select | "Account Level", "PO Level", "LSI Level" | `billingDetailsSummary` |
| **Billing Frequency** | Text input | Text; placeholder "e.g. Monthly" | `billingFrequency` |
| **Credit Period** | Text input | Text; placeholder "e.g. 30 days" | `billingCreditPeriod` |
| **Bill Dispatch method** | Text input | Text; placeholder "e.g. Email" | `billingDispatchMethod` |
| **Bill Mode** | Text input (or select) | Text; placeholder "e.g. Prepaid/Postpaid" | `billingMode` |
| **Bill Payment Method** | Text input (or select) | Text; placeholder "e.g. NEFT, Card" | `billingPaymentMethod` |

**Table column:** "Billing..." shows `billingDetailsSummary` (Billing level). Click cell → opens Billing Details modal with all 9 sub-columns.

---

### PO Group – sub-columns and values

| Sub-column | Control | Value / options | Persisted to (cellEdits) |
|------------|---------|-----------------|---------------------------|
| **PO** | Text input | PO number/reference; placeholder "PO" | `poNumber` (and `poGroupSummary` for table display) |
| **PO Received Date** | Date input | Date value | `poReceivedDate` |
| **PO Amount** | Text/number input | Amount; placeholder "PO Amount" | `poAmount` |
| **PO Expiry Date** | Date input | Date value | `poExpiryDate` |
| **PO Terms** | Text input | Text; placeholder "PO Terms" | `poTerms` |
| **PO OE Received Date** | Date input | Date value (OE = Order Entry) | `poOeReceivedDate` |

**Table column:** "PO..." shows `poGroupSummary` (e.g. PO number or "PO - date"). Click cell → opens PO Group modal with all 6 sub-columns.

---

## 3b. Retrieval: Billing Details modal (full)

- **Trigger:** Click on "Billing..." cell for a row → `setBillingDetailsModalRow(row)`.
- **Open:** `billingDetailsModalRow != null`.
- **Layout:** Overlay `bg-black/50`, centered card `max-w-2xl`, title "Billing Details", 2-column grid of fields, footer Cancel + Save.
- **Fields (all persisted on Save):** Legal Entity, Bill Details Type, Store, Billing level (select: Account Level / PO Level / LSI Level), Billing Frequency, Credit Period, Bill Dispatch method, Bill Mode, Bill Payment Method.
- **State:** `billingModalLevel`, `billingModalLegalEntity`, `billingModalBillDetailsType`, `billingModalStore`, `billingModalFrequency`, `billingModalCreditPeriod`, `billingModalDispatchMethod`, `billingModalMode`, `billingModalPaymentMethod`.
- **Cancel:** `setBillingDetailsModalRow(null)`.
- **Save:** All 9 values written to `cellEdits[rowId]`: `billingDetailsSummary`, `billingLegalEntity`, `billingBillDetailsType`, `billingStore`, `billingFrequency`, `billingCreditPeriod`, `billingDispatchMethod`, `billingMode`, `billingPaymentMethod`.

---

## 3c. Retrieval: PO Group modal (full)

- **Trigger:** Click on "PO..." cell for a row → `setPoGroupModalRow(row)`.
- **Open:** `poGroupModalRow != null`.
- **Layout:** Overlay `bg-black/50`, centered card `max-w-2xl`, title "PO Group", 2-column grid, footer Cancel + Save.
- **Fields (all persisted on Save):** PO (text), PO Received Date (date), PO Amount (text), PO Expiry Date (date), PO Terms (text), PO OE Received Date (date).
- **State:** `poModalNumber`, `poModalReceivedDate`, `poModalAmount`, `poModalExpiryDate`, `poModalTerms`, `poModalOeReceivedDate`.
- **Cancel:** `setPoGroupModalRow(null)`.
- **Save:** All 6 values written to `cellEdits[rowId]`: `poGroupSummary` (display, set to PO or "—"), `poNumber`, `poReceivedDate`, `poAmount`, `poExpiryDate`, `poTerms`, `poOeReceivedDate`.

---

## 3d. Retrieval: Billing Contact Person modal (Add BCP) (full)

- **Trigger:** In Billing Contact Person dropdown, choose option "+ Add BCP" → `setAddBcpModalOpen(true)` (and `setEditingCell(null)` if inline-edit was open).
- **Open:** `addBcpModalOpen === true`.
- **Layout:** Overlay `bg-black/50`, centered card `max-w-md`, title "Add Billing Contact Person", vertical stack of fields, footer Cancel + Save.
- **Fields (all uncontrolled inputs):**
  1. **First Name** – `<input type="text" id="bcp-first" placeholder="First Name" />`.
  2. **Last Name** – `<input type="text" id="bcp-last" placeholder="Last Name" />`.
  3. **Designation** – `<input type="text" placeholder="Designation" />`.
- **Cancel:** `setAddBcpModalOpen(false)`.
- **Save:** Reads `document.getElementById('bcp-first')?.value` and `document.getElementById('bcp-last')?.value`; if either non-empty, appends `` `${first} ${last}`.trim() `` to `newBcpNames`; then `setAddBcpModalOpen(false)`. Designation is not stored. New name appears in BCP dropdown for all rows.
- **Modal location:** `SelectQuoteLineItemsPage.jsx` ~lines 929–948.

---

## 4. Billing Contact Person – all actions

| Action | Description | Status |
|--------|-------------|--------|
| **Display** | Show current BCP for row (or "—") | ✅ Implemented |
| **Select from list** | Inline dropdown: choose existing BCP (options from data + `newBcpNames`) | ✅ Implemented |
| **Add BCP** | "+ Add BCP" in dropdown opens Add Billing Contact Person modal; Save adds name to `newBcpNames` | ✅ Implemented |
| **Bulk set BCP** | When 2+ selected, use "Apply to N selected" bar: choose BCP and click Apply | ✅ Implemented |

---

## 5. Inline edits and bulk edits (Quote 1 style)

| Concept | Description | Status |
|--------|-------------|--------|
| **Inline edit** | **Click-to-edit:** cell shows value + pencil (visible on hover). Click pencil → cell shows dropdown/input; change or blur saves to `cellEdits` and closes edit. Products, Media, Bandwidth, Quantity, BCP, GST. | ✅ Implemented |
| **Bulk edit** | When 2+ rows selected, click pencil on a cell → **per-column popover** appears below cell with: one control (select/input for that column), "Update N selected items" checkbox, Cancel, Save. Same pattern as Quote 1 (DataTableSection). | ✅ Implemented |
| **Editable fields** | productName, media, bandwidth, quantity, billingContactPerson, gstApplicable (inline); Billing Details, PO Group, Invoice Shipping via modals. | ✅ Implemented |
| **cellEdits state** | `{ [rowId]: { fieldName: value } }`; used for all editable fields and modal saves. | ✅ Implemented |
| **Billing Details / PO Group Save** | Save updates `cellEdits` (billingDetailsSummary, poGroupSummary) so column reflects saved values. | ✅ Implemented |

---

## 6. Search and filter

| Element | Description | Status |
|---------|-------------|--------|
| **Search this list** | Input placeholder "Search this list"; filters by BCP, product, address, state (uses `cellEdits` for BCP/product) | ✅ Implemented |
| **Filter by...** | "Filter by" label + State dropdown + Product dropdown | ✅ Implemented |

---

## 7. Other page actions and UI

| Item | Description | Status |
|------|-------------|--------|
| **Back** | Return to Quote Proposal; calls `onBack()` | ✅ Implemented |
| **Row selection** | Checkbox per row; "Select all" in header; `selectedIds` (Set) | ✅ Implemented |
| **Repeated LSI** | Badge "Repeated" in LSI cell when LSI value appears on multiple rows | ✅ Implemented |
| **Pagination** | Previous, "Page X of Y", Next; PAGE_SIZE 10 | ✅ Implemented |
| **Bulk Delete** | Toolbar "Delete (N)" when selection; opens Delete N records modal | ✅ Implemented |
| **Update Parameter** | Button below table (primary action) | ✅ Implemented (no handler yet) |

---

## 8. State (current and to add)

**Current state in SelectQuoteLineItemsPage:**

- `selectedIds`, `deletedIds`, `deleteModalOpen`, `deleteModalIds`, `openRowMenuId`, `currentPage`, `filterState`, `filterProduct`, `searchQuery`, `rowMenuRef`

**Added:**

- `cellEdits` – `{ [rowId]: { field: value } }` for all editable fields and modal saves
- `billingDetailsModalRow`, `billingModalLevel` – Billing Details modal; Save writes billingDetailsSummary to cellEdits
- `poGroupModalRow`, `poModalNumber`, `poModalName` – PO Group modal; Save writes poGroupSummary to cellEdits
- `addBcpModalOpen`, `newBcpNames` – Add BCP modal and new names for BCP dropdown
- `existingInvoiceModalRow` – New Invoice – Shipping Address modal
- `editingCell` – `{ rowId, column }` for the cell being edited; enables click-to-edit and per-column bulk popover
- `applyBulkEditToSelected`, `bulkEditPopoverPosition`, `bulkEditPopoverValue` – bulk edit popover (Quote 1 style); Save applies to selectedIds or single row
- `getCellValue(row, field)` – returns `cellEdits[row.id]?.[field] ?? row[field]`
- `mediaOptions`, `bandwidthOptions` – derived from allLineItems (for inline and bulk dropdowns)

---

## 9. Data shape (row / line item)

**Current:** id, lastEnrichedDate, lsi, lineNumber, address, state, productName, media, bandwidth, quantity, billingContactPerson

**To add for Billing Details, PO Group, Invoice Shipping, GST:**

- Billing: legalEntity, billDetailsType, store, billingLevel, billingFrequency, creditPeriod, billDispatchMethod, billMode, billPaymentMethod
- PO Group: poGroup fields (e.g. poNumber, poName, etc.)
- Invoice: invoiceShippingDetails, invoiceShippingType (e.g. sameAsBcp, existingInvoice)
- gstApplicable (e.g. "Yes", "No")

---

## 10. What’s in place vs optional

**In place:** Entry/routing, Back, Search this list, Filter by State/Product, table with all columns (including Billing Details, PO Group, Invoice Shipping Details, GST), row selection, overflow menu + Delete, single + bulk delete modal, Repeated LSI, inline dropdowns/input for Products/Media/Bandwidth/Quantity/BCP/GST, Billing Details / PO Group / Add BCP / Existing Invoice modals with Save persisting to `cellEdits`, bulk edit bar (“Apply to N selected”) for Product/Media/Bandwidth/Qty/BCP/GST, pagination, Update Parameter button.

**Optional / future:** More Billing Details fields (Bill Details Type, Store, Credit Period, etc.) and persisting them; expandable Billing/PO sub-columns in the table; Update Parameter handler (e.g. submit to API).

---

## 11. File index

| File | Role |
|------|------|
| `src/App.jsx` | showEnrichQuotePage; render SelectQuoteLineItemsPage with onBack, quote1Locations |
| `src/components/QuoteProposalPage.jsx` | "Enrich Quote - UI" button, onEnrichQuoteClick |
| `src/components/SelectQuoteLineItemsPage.jsx` | Full page: table, columns, modals, search, filter, inline/bulk edit (to be extended) |
| `src/docs/ENRICH_QUOTE_PAGE_AND_ACTIONS.md` | Shorter retrieval (existing) |
| `src/docs/ENRICH_QUOTE_FULL_RETRIEVAL.md` | This document (full columns, actions, BCP, edits, search, filter) |
