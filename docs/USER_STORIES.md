# I'm Hungry! — Product Backlog

> **Product goal:** Help home cooks answer *“What can I make with what I already have?”* quickly and reliably.
>
> **Scope:** The full product vision, including features beyond the first MVP.  
> **MVP:** [`MVP.md`](MVP.md) · **Reviewed:** 2026-10-27

## Backlog at a glance

| Priority | Stories | What it means |
|:--|--:|:--|
| [**Must Have · MVP**](#must-have--mvp-6-stories) | 6 | The smallest complete, testable app |
| [**Should Have**](#should-have--next-25-stories) | 25 | Strong candidates after MVP feedback |
| [**Could Have**](#could-have--later-25-stories) | 25 | Optional improvements and experiments |
| [**Won't Have This Time**](#wont-have-this-time--future-vision-10-stories) | 10 | Longer-term vision, beyond the course delivery window |
| **Total** | **66** | A product backlog, **not** a 66-story sprint plan |

**For the initial course exercise:** Start by discussing **US-01–US-14** (14 stories). Only **US-01–US-06** belong to the MVP. The other stories are retained for future refinement, not promised for this course.

### How to read these stories

- **Priority** uses MoSCoW for the *current course delivery window*, not permanent product importance. A category is not a sprint commitment.
- **Epics** group stories by user goal. Each story has a stable ID and a user-centred statement. Expand its **Acceptance criteria** to see how it will be verified.
- **Order** of story IDs is only a reference; because stories are grouped by epic, their numbers may not appear sequentially. Reorder work based on value, dependencies, risk, and sprint reviews.
- **Personas:** *Home cook* (primary, e.g. a student or young adult cooking at home), *returning home cook*, *registered home cook*, and *service administrator*. These describe contexts, not necessarily application permissions.

**MVP safety boundary:** Use one isolated demo/test identity. Do not release shared multi-user data without authentication, authorisation, and per-user data separation. The backend validates ingredient availability and quantities; AI is not the inventory authority.

---

## Must Have — MVP (6 stories)

The first complete user journey: **record food → choose a mood → get a usable AI recipe**. These six stories correspond to the six MVP capabilities in `MVP.md`.

### Inventory

#### `US-01` View my inventory

> As a home cook, I want to see the ingredients and amounts I have at home, so that I can understand what the app can cook with.

<details>
<summary>Acceptance criteria</summary>

- Stored ingredient names, amounts, and units appear in a mobile list.
- An empty list is explained; data remains after closing and reopening the app.

</details>

#### `US-02` Add an ingredient

> As a home cook, I want to record an ingredient with the quantity I have, so that it can be considered for recipes.

<details>
<summary>Acceptance criteria</summary>

- I can enter a name, positive quantity, and a unit such as g, ml, or pcs.
- Invalid entries are rejected; valid entries are saved and appear after reopening the app.

</details>

#### `US-03` Correct an ingredient amount

> As a home cook, I want to change an ingredient quantity, so that recipes use the amount I actually have.

<details>
<summary>Acceptance criteria</summary>

- I can replace an existing quantity with another valid positive value.
- The saved value appears in the inventory and is used by the next recipe request.

</details>

#### `US-04` Remove an ingredient

> As a home cook, I want to remove an ingredient that I no longer have, so that it is not used in new recipe suggestions.

<details>
<summary>Acceptance criteria</summary>

- I can delete an inventory entry.
- The deleted entry does not return on restart or appear in future recipe requests.

</details>

### Recipe discovery

#### `US-05` Get a recipe from what I have

> As a home cook, I want to get an AI-generated recipe using the ingredients I own, so that I can decide what to cook without buying extra food.

<details>
<summary>Acceptance criteria</summary>

- I get one recipe with title, estimated time, ingredient quantities, and cooking instructions.
- The backend rejects outputs requiring unlisted ingredients or more than stored amounts; unknown units are not silently converted.
- An empty inventory, unavailable service, or no valid recipe produces a clear message; no false claim of availability is shown.

</details>

#### `US-06` Choose a cooking mood

> As a home cook, I want to choose the kind of food I feel like, so that the suggestion better suits my appetite.

<details>
<summary>Acceptance criteria</summary>

- I can choose Comfort food, Quick & easy, or Surprise me (default).
- The chosen mood is sent with the recipe request without overriding ingredient and quantity limits.

</details>

---

## Should Have — Next (25 stories)

Important improvements to explore after the core flow has been tested. Prioritise them through feedback; do not assume all 25 will fit into the course.

### Inventory

#### `US-12` Re-add a familiar ingredient

> As a returning home cook, I want to reuse a previously entered ingredient name and unit, so that I do not have to type and configure it again.

<details>
<summary>Acceptance criteria</summary>

- Previously used entries are offered when adding an ingredient.
- I confirm the new quantity before it changes inventory.

</details>

#### `US-25` Search my inventory

> As a home cook with many ingredients, I want to find an ingredient by name, so that I can update my stock quickly.

<details>
<summary>Acceptance criteria</summary>

- Typing part of an ingredient name narrows the list.
- Clearing the search restores the full list.

</details>

### Recipe discovery

#### `US-07` Try another suggestion

> As a home cook, I want to ask for a different recipe without re-entering everything, so that I can find an option I prefer.

<details>
<summary>Acceptance criteria</summary>

- The existing inventory and selections are reused when I request another idea.
- Skipping or regenerating a recipe does not alter inventory.

</details>

#### `US-26` Choose a cuisine or food style

> As a home cook, I want to choose a cuisine or style of food, so that recipes better match my cravings.

<details>
<summary>Acceptance criteria</summary>

- I can select from a small, defined list of styles.
- The selection influences recommendations when feasible; inventory restrictions still apply.

</details>

#### `US-27` Set a maximum cooking time

> As a busy home cook, I want to specify how much time I have, so that suggested meals fit my schedule.

<details>
<summary>Acceptance criteria</summary>

- I can choose a maximum time before generating a recipe.
- The result displays its estimated time, and the app does not present an over-limit recipe as matching the filter.

</details>

#### `US-28` Choose the number of servings

> As a home cook, I want to specify how many portions I want, so that recipe amounts better match my meal.

<details>
<summary>Acceptance criteria</summary>

- I can select a supported serving count.
- Displayed quantities are sized accordingly and checked against available stock.

</details>

### Cooking and stock deduction

#### `US-10` Finish cooking and deduct stock

> As a home cook, I want to confirm I cooked a recipe and used its planned ingredients, so that my inventory reflects what is left.

<details>
<summary>Acceptance criteria</summary>

- The app previews proposed deductions and asks for confirmation.
- A successful confirmation updates all affected inventory quantities together and never produces negative stock; cancellation changes nothing.

</details>

#### `US-11` Adjust ingredients actually used

> As a home cook, I want to change the quantities I used before finishing a recipe, so that the inventory reflects what really happened.

<details>
<summary>Acceptance criteria</summary>

- I can change or clear a proposed deduction before confirming.
- Only validated quantities are deducted; attempts to consume more than recorded stock are blocked or require correction.

</details>

#### `US-15` Start cooking a selected recipe

> As a home cook, I want to enter a cooking session for a recipe, so that I can follow the recipe before confirming what I used.

<details>
<summary>Acceptance criteria</summary>

- I can start a recipe and view its ingredients and steps during cooking.
- Starting or abandoning a session does not deduct inventory.

</details>

### Saved recipes and history

#### `US-08` Save a recipe

> As a home cook, I want to save a recipe I like, so that I can return to it later.

<details>
<summary>Acceptance criteria</summary>

- I can explicitly save a displayed recipe.
- Its recipe content remains available after restarting the app.

</details>

#### `US-09` Browse saved recipes

> As a returning home cook, I want to view and reopen my saved recipes, so that I do not have to generate a favourite again.

<details>
<summary>Acceptance criteria</summary>

- I see a saved-recipe list linked to my profile or current test data.
- Opening an entry shows its full saved ingredients and instructions.

</details>

#### `US-14` See recently suggested recipes

> As a returning home cook, I want to see recipes suggested to me recently, so that I can revisit an idea I did not save.

<details>
<summary>Acceptance criteria</summary>

- A recent-recipes list shows past suggestions in newest-first order.
- I can reopen a historical recipe without generating it again.

</details>

#### `US-16` Remove a saved recipe

> As a home cook, I want to remove a recipe from my saved collection, so that my favourites stay relevant.

<details>
<summary>Acceptance criteria</summary>

- I can unsave a recipe.
- It disappears from the saved collection while my inventory stays unchanged.

</details>

#### `US-31` View dishes I have cooked

> As a returning home cook, I want to see recipes I previously marked as cooked, so that I can remember what meals I made.

<details>
<summary>Acceptance criteria</summary>

- A cooked-recipes history distinguishes finished meals from merely viewed suggestions.
- Each entry can be opened for its recipe information.

</details>

### Food preferences

#### `US-13` Exclude ingredients I dislike

> As a home cook, I want to record ingredients I do not want in meals, so that recipes avoid foods I dislike.

<details>
<summary>Acceptance criteria</summary>

- I can add and remove ingredients from an exclusion list.
- Recipe suggestions are checked against saved exclusions; this is not an allergy-safety guarantee.

</details>

### Accounts and dashboard

#### `US-17` Create my own account

> As a new home cook, I want to register a personal account, so that my data is kept separately from other people’s.

<details>
<summary>Acceptance criteria</summary>

- I can sign up using required account details and receive useful validation feedback.
- My account is associated with an isolated inventory; no other user's private data is shown.

</details>

#### `US-18` Sign in

> As a registered home cook, I want to sign in to my account, so that I can access my own inventory and recipes.

<details>
<summary>Acceptance criteria</summary>

- Valid credentials open my personal data; invalid credentials do not.
- I cannot access another account's data by changing an item identifier or request.

</details>

#### `US-19` Stay signed in on my phone

> As a registered home cook, I want to remain signed in between app launches, so that I can open my kitchen quickly.

<details>
<summary>Acceptance criteria</summary>

- My valid authenticated session persists across app restarts.
- Expired or revoked sessions require authentication again.

</details>

#### `US-20` Sign out

> As a registered home cook, I want to sign out of my account, so that another person using my device cannot access my profile.

<details>
<summary>Acceptance criteria</summary>

- A sign-out action ends the local session and returns me to the signed-out view.
- Previously cached personal information is no longer accessible through the signed-out interface.

</details>

#### `US-21` Reset a forgotten password

> As a registered home cook, I want to recover access when I forget my password, so that I can use my account again.

<details>
<summary>Acceptance criteria</summary>

- I can request a secure recovery flow for my account.
- Resetting a password invalidates the reset token and does not reveal whether an email exists.

</details>

#### `US-22` Change my password

> As a signed-in home cook, I want to change my account password, so that I can maintain control of my account.

<details>
<summary>Acceptance criteria</summary>

- I can update my password using the required verification.
- My old password is no longer accepted after a successful change.

</details>

#### `US-23` Edit my personal details

> As a signed-in home cook, I want to update my profile information, so that my account details stay accurate.

<details>
<summary>Acceptance criteria</summary>

- I can view and change the supported profile fields.
- Updated details persist and belong only to my account.

</details>

#### `US-24` See a kitchen dashboard

> As a signed-in home cook, I want to see my food inventory summary and recipe starting point together, so that I can begin cooking with minimal navigation.

<details>
<summary>Acceptance criteria</summary>

- A home view shows the essentials from my account and a clear recipe action.
- It handles an empty inventory without showing misleading counts.

</details>

#### `US-29` Delete my account and personal data

> As a registered home cook, I want to delete my account, so that I can stop using the service without leaving my private kitchen data behind.

<details>
<summary>Acceptance criteria</summary>

- The app provides a deliberate, confirmed account-deletion flow.
- After processing, the account can no longer sign in and its stored personal data is handled according to the published retention/deletion policy.

</details>

#### `US-30` Access my inventory on another device

> As a registered home cook, I want to see the same inventory after signing in elsewhere, so that I am not tied to one phone.

<details>
<summary>Acceptance criteria</summary>

- Signing in on a second supported device loads the same account inventory.
- Updates are attributed to the correct account and are not mixed with another user's data.

</details>

---

## Could Have — Later (25 stories)

Ideas with potential value that can be tested and refined later, once higher-priority needs are met.

### Inventory

#### `US-32` Sort inventory items

> As a home cook, I want to sort food by name or amount, so that I can scan my inventory more easily.

<details>
<summary>Acceptance criteria</summary>

- I can select a supported sorting order.
- Sorting changes presentation, not stored stock.

</details>

#### `US-33` Group inventory by category

> As a home cook, I want to group ingredients by food category, so that my food collection is easier to navigate.

<details>
<summary>Acceptance criteria</summary>

- Items can have a category such as dairy, vegetables, or pantry.
- The inventory can display meaningful groupings without hiding uncategorised items.

</details>

#### `US-34` Get common-item suggestions

> As a home cook, I want to see useful suggestions while entering a new ingredient, so that frequent items take less effort to add.

<details>
<summary>Acceptance criteria</summary>

- The add flow suggests common or previously used names matching my input.
- Suggestions never add quantities automatically.

</details>

#### `US-35` Avoid accidental duplicate entries

> As a home cook, I want to be warned when I add something already listed, so that my quantities do not become confusing.

<details>
<summary>Acceptance criteria</summary>

- Potential matching entries are shown before saving.
- I can choose to increase an existing amount or keep a separate item where appropriate.

</details>

#### `US-36` Use flexible ingredient units

> As a home cook, I want to record and understand commonly used units, so that I can track ingredients in realistic kitchen quantities.

<details>
<summary>Acceptance criteria</summary>

- Supported compatible units can be converted consistently, with conversion rules stated.
- Unsupported comparisons are flagged instead of silently assumed.

</details>

#### `US-37` Record expiry dates

> As a home cook, I want to add an expiry or use-by date to food, so that I know which items need attention.

<details>
<summary>Acceptance criteria</summary>

- An optional date can be saved or edited per relevant inventory item.
- Items without dates remain valid entries.

</details>

#### `US-39` See food nearing expiry

> As a home cook, I want to see which foods may expire soon, so that I can decide what to use first.

<details>
<summary>Acceptance criteria</summary>

- Dated items are marked based on a clear configurable or documented threshold.
- Undated items are not inaccurately presented as expired.

</details>

#### `US-52` Scan a barcode to add food

> As a home cook, I want to scan a product barcode when entering food, so that I can avoid repetitive typing.

<details>
<summary>Acceptance criteria</summary>

- A recognised code can prefill available product information for my confirmation.
- Unrecognised codes allow manual entry; inventory is never changed without my confirmation.

</details>

#### `US-54` Mark pantry staples

> As a home cook, I want to specify pantry basics I usually have, so that recipe suggestions can reflect my actual kitchen.

<details>
<summary>Acceptance criteria</summary>

- I can explicitly opt in to individual staple ingredients and quantities.
- No staple is assumed present unless I have configured it or listed it.

</details>

### Recipe discovery

#### `US-38` Prioritise food expiring soon

> As a home cook, I want to request recipes using ingredients near expiry, so that I can reduce food waste.

<details>
<summary>Acceptance criteria</summary>

- A user can choose to prioritise soon-expiring ingredients.
- Expiry preference never overrides actual ingredient availability and amounts.

</details>

#### `US-40` See ingredient availability in a suggested recipe

> As a home cook, I want to see which recipe ingredients I have and which are missing, so that I know whether a meal is practical.

<details>
<summary>Acceptance criteria</summary>

- Each ingredient is visibly marked available, insufficient, or missing.
- Statuses are calculated from stored quantities rather than assumed from AI output.

</details>

#### `US-41` Allow recipes with a few missing ingredients

> As a home cook, I want to choose whether recipes may require a small purchase, so that I can explore more meal options when my pantry is limited.

<details>
<summary>Acceptance criteria</summary>

- I can switch between strict inventory-only and an explicit flexible mode.
- Every missing ingredient and amount is clearly disclosed before cooking.

</details>

#### `US-53` See optional nutrition estimates

> As a home cook, I want to see approximate nutrition for a recipe, so that I can make a more informed food choice.

<details>
<summary>Acceptance criteria</summary>

- Nutritional values, when available, are clearly labelled estimates and show a basis or source.
- Missing or unreliable nutritional data is shown as unavailable rather than invented as exact.

</details>

#### `US-55` Compare a shortlist of meals

> As a home cook, I want to compare several feasible meal ideas at once, so that I can choose without repeatedly regenerating.

<details>
<summary>Acceptance criteria</summary>

- A small list displays distinct recipe summaries with cooking time.
- Opening a recipe reveals full details, and each option respects inventory rules.

</details>

#### `US-56` Get ingredient substitution ideas

> As a home cook, I want to see safe, practical substitutes from my inventory, so that I can adapt a recipe when I lack one ingredient.

<details>
<summary>Acceptance criteria</summary>

- Suggestions distinguish verified substitutions from uncertain ones.
- The revised recipe and quantities must be checked again against available stock.

</details>

### Cooking and stock deduction

#### `US-47` Follow one cooking step at a time

> As a home cook, I want to follow recipe steps in a distraction-free cooking view, so that I can stay focused while preparing food.

<details>
<summary>Acceptance criteria</summary>

- I can navigate between individual steps and see my place.
- Leaving the cooking view does not deduct ingredients.

</details>

#### `US-48` Use cooking timers

> As a home cook, I want to start a timer for a recipe step, so that I can manage cooking without losing track of time.

<details>
<summary>Acceptance criteria</summary>

- A recipe step with a time can start or stop a timer.
- Timer state is clearly shown; lack of notification permissions is handled gracefully.

</details>

### Saved recipes and history

#### `US-50` Search saved recipes

> As a home cook with many saved recipes, I want to find a saved dish by name, so that I can reuse it quickly.

<details>
<summary>Acceptance criteria</summary>

- Saved recipes can be searched by name.
- Search results only contain recipes from my collection.

</details>

### Food preferences

#### `US-44` Choose a dietary pattern

> As a home cook with dietary preferences, I want to set the eating pattern I follow, so that recipes better reflect my needs.

<details>
<summary>Acceptance criteria</summary>

- Supported patterns can be selected and removed.
- Generated ingredients are checked against the selected pattern where rules are verifiable; no medical guarantee is implied.

</details>

#### `US-45` Exclude dishes I dislike

> As a home cook, I want to name specific dishes I never want suggested, so that recommendations avoid meals I already know I dislike.

<details>
<summary>Acceptance criteria</summary>

- I can maintain a list of excluded dishes or dish types.
- Suggestions matching those exclusions are filtered or clearly rejected.

</details>

#### `US-46` Describe a custom craving

> As a home cook, I want to describe my desired meal in my own words, so that I can request something more specific than presets.

<details>
<summary>Acceptance criteria</summary>

- I can enter an optional free-text preference.
- A custom request cannot bypass inventory constraints or required safety checks.

</details>

#### `US-49` Rate a recipe

> As a returning home cook, I want to give feedback on a recipe I tried, so that future suggestions can better suit my taste.

<details>
<summary>Acceptance criteria</summary>

- I can record simple positive or negative feedback against a recipe.
- The app does not claim the model has learned preferences unless those ratings are actually used.

</details>

### Shopping and planning

#### `US-42` Add missing ingredients to a shopping list

> As a home cook, I want to transfer missing recipe ingredients to a shopping list, so that I know what to buy.

<details>
<summary>Acceptance criteria</summary>

- I can explicitly add missing ingredients from a recipe.
- Items appear with useful amounts where known.

</details>

#### `US-43` Manage a shopping list

> As a home cook, I want to add, change, and remove shopping items, so that I can plan groceries beyond one recipe.

<details>
<summary>Acceptance criteria</summary>

- I can manually edit the list and mark items as purchased.
- Shopping activity does not silently change inventory until I confirm stock additions.

</details>

#### `US-51` Plan meals for the week

> As a home cook, I want to organise recipes across upcoming days, so that I can reduce daily decision-making.

<details>
<summary>Acceptance criteria</summary>

- I can assign selected recipes to days in a simple weekly view.
- The plan clearly distinguishes suggested use from confirmed inventory consumption.

</details>

---

## Won't Have This Time — Future vision (10 stories)

Features kept visible for the long-term vision, but explicitly excluded from this course delivery window.

### Administration and reporting

#### `US-57` Open a protected administrator area

> As a service administrator, I want to access administration separately from the cooking app, so that I can manage the service without exposing private data.

<details>
<summary>Acceptance criteria</summary>

- Only authorised administrator accounts can open administration views.
- Ordinary users cannot access administrative data through UI or API routes.

</details>

#### `US-58` View registered users

> As a service administrator, I want to see a list and total count of registered accounts, so that I can understand the service's user base.

<details>
<summary>Acceptance criteria</summary>

- The list and count reflect registered accounts and support basic filtering.
- Only essential account metadata is exposed to admins with a legitimate need.

</details>

#### `US-59` See recent account activity

> As a service administrator, I want to see when accounts were last active, so that I can assess usage and spot dormant accounts.

<details>
<summary>Acceptance criteria</summary>

- Recent activity or last-login indicators are available only to authorised staff.
- Tracking, retention, and access follow the service's published privacy rules.

</details>

#### `US-60` Measure active usage

> As a service administrator, I want to see daily or monthly active users, so that I can evaluate whether people return to the app.

<details>
<summary>Acceptance criteria</summary>

- The report defines exactly what qualifies as an active user.
- Metrics can be viewed for a selected time range without exposing ingredient lists or recipe text.

</details>

#### `US-61` Measure recipe feature usage

> As a service administrator, I want to see how often users request and finish recipes, so that I can identify which parts of the product deliver value.

<details>
<summary>Acceptance criteria</summary>

- The report distinguishes generation requests from completed cooking sessions.
- Counts use aggregated activity and do not require displaying personal pantry contents.

</details>

#### `US-62` See basic usage trends

> As a service administrator, I want to compare signups and use over time, so that I can assess adoption and identify changes.

<details>
<summary>Acceptance criteria</summary>

- Trends can be reviewed by an authorised admin for a chosen period.
- Charts show consistent labelled definitions and avoid misleading incomplete periods.

</details>

### Households and integrations

#### `US-63` Share a household inventory

> As a home cook living with others, I want to share one food inventory with my household, so that we do not each need to maintain separate stock lists.

<details>
<summary>Acceptance criteria</summary>

- Authorised household members see the shared list and its latest updates.
- Accounts outside the household cannot view or modify it.

</details>

#### `US-64` Invite household members

> As a household owner, I want to invite another person to our shared inventory, so that we can collaborate while controlling access.

<details>
<summary>Acceptance criteria</summary>

- I can invite and remove members using a clear permissions flow.
- Revoked members lose access to shared data.

</details>

#### `US-65` Identify food from a photo

> As a home cook, I want to get suggested ingredient entries from a photo, so that adding several items takes less manual effort.

<details>
<summary>Acceptance criteria</summary>

- Recognised items are suggestions that require my confirmation and quantity input.
- Uncertain recognition can be corrected or discarded without changing stock.

</details>

#### `US-66` Import grocery purchase data

> As a home cook, I want to import a supported grocery purchase list, so that I can update inventory after shopping with less effort.

<details>
<summary>Acceptance criteria</summary>

- A supported import previews recognised and unrecognised items before any stock change.
- I approve the additions and quantities; failed imports leave existing inventory intact.

</details>

---

## MVP traceability

| Bullet in `MVP.md` | Story IDs |
|---|---|
| See inventory | US-01 |
| Add inventory item | US-02 |
| Change quantity or remove item | US-03, US-04 |
| Choose cooking mood | US-06 |
| AI recipe from actual available stock | US-05 |
| Read recipe or a clear failure state | US-05 |

## Working with this backlog in Scrum

- **Product Goal:** Help a home cook answer 'What can I make with what I already have?' quickly and reliably.
- **First goal:** Complete and demonstrate US-01–US-06 as a vertical mobile → backend → database (and AI) journey, ideally around Sprint 2–3 as the course suggests. Inventory must persist; recipe output cannot be a hard-coded mock.
- **Initial classroom subset:** The teacher asks for approximately **10–15 user stories** for the initial exercise. If only that many are needed on the board right now, start with **US-01–US-14**. Keep this larger document as the product vision backlog, **not** a 66-item sprint plan.
- **Refinement:** Discuss size, dependencies, and acceptance tests before pulling a story into a Sprint. US-05 (real AI generation) and US-10 (confirmed stock deduction) are particular complexity risks; split them into independently demonstrable end-to-end behaviours if needed, not 'frontend only' and 'backend only'.
- **Ordering:** MoSCoW is a broad scope classification. Within a category, the Product Owner/team should maintain an actual delivery order based on value, risk, dependencies, and observations at Sprint Reviews. Story IDs are stable references, **not** permanent priority numbers.
- **INVEST / Three Cs:** Stories should be independent where practical, negotiable, valuable, estimable, small, and testable. The written text is the *Card*, refinement discussion is the *Conversation*, and the criteria are *Confirmation*. Acceptance criteria are draft examples and may be refined collaboratively.
- **Definition of Done:** Every selected story's user outcome works across the required layers, stores/retrieves real data when applicable, handles errors and invalid input, has appropriate tests, has been reviewed by the other team member, and is demo-ready. Authentication, privacy and validation controls are release quality requirements, not optional polish.
- **Technical work is not a user story:** Repository scaffolding, CI, schema migrations, AI credentials, deployment configuration, automated test wiring, and accessibility checks belong as **tasks** linked to the relevant stories, not as invented user needs.

## Open product decisions (not additional MVP scope)

- Will the first test use one local/demo test profile or one server-side test identity? In either case isolate access; no publicly readable shared pantry.
- What ingredient vocabulary, units, and permitted conversions will the backend initially understand? MVP can restrict units to `g`, `ml`, and `pcs` and reject unsupported unit comparisons rather than guessing.
- What should the app do if a user says they have 'eggs' but the recipe returns 'large eggs', or requests a pantry staple they have not entered? Agree on explicit mapping/validation rules before accepting AI output.
- For post-MVP cooking completion, should '0 remaining' remove an inventory entry or retain it at zero? Define this before US-10 / US-11.
- Which user data and events are genuinely necessary for later admin reports, and what consent/retention rules apply? Define that before collecting analytics.

## Sources and conventions

- **Course material:** `05-mvp.md` and `06-user-stories.md` supplied by the teacher: one small vertical MVP by around Sprint 2–3; clear exclusions; user-focused stories; INVEST, Three Cs, epics and technical tasks kept separate.
- **Exact MVP template:** Teacher-provided `mvp(1).md`, used without additional sections in [`MVP.md`](MVP.md).
- **Scrum / backlog:** [Scrum.org — What is a Product Backlog?](https://www.scrum.org/resources/what-is-a-product-backlog) (emergent, ordered and continuously refined).
- **MoSCoW:** [Agile Business Consortium — What is MoSCoW Prioritization?](https://www.agilebusiness.org/resource/what-is-moscow-prioritization/) (priorities must be relative to a named timeframe, not treated as lifetime commitments).
- **User stories:** [Atlassian — User stories](https://www.atlassian.com/agile/project-management/user-stories) (persona, outcome, value, acceptance criteria).
