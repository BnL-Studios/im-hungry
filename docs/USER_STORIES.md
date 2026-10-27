# I'm Hungry! — Prioritised Product Backlog

> **Product goal:** Help home cooks answer *“What can I make with what I already have?”* quickly and reliably.  
> **MVP definition:** [`MVP.md`](MVP.md)  
> **Current delivery scope:** Two-person Scrum course; `Won't` means *not this time*, not rejected forever.  
> **Updated:** 2026-10-27

## Priority and size overview

MoSCoW follows the course: **Must** = MVP, **Should** = next important outcomes, **Could** = optional, **Won't (this time)** = explicitly outside the current course scope. Every story has **one position** in the list below; within each priority, its number is its proposed implementation order. Priority may change after reviews.

T-shirt sizes are **relative, not hours**: **S** = small and clear; **M** = several understood parts (reference: **US-02, Add an ingredient**, form + validation + API + database); **L** = significant work or uncertainty, but should still fit within one person's sprint. **No XL remains.** A size is a planning hypothesis; the two team members should confirm it together during refinement. In particular, **Could/Won't estimates are provisional** because the course recommends focusing estimation effort on near-term stories.

| Priority | Stories | S | M | L | Planned scope |
|:--|--:|--:|--:|--:|:--|
| **Must** | **8** | 3 | 4 | 1 | MVP |
| **Should** | **26** | 6 | 15 | 5 | Next after validation |
| **Could** | **28** | 7 | 15 | 6 | Optional enhancements |
| **Won't** | **13** | 0 | 8 | 5 | Excluded this course |
| **Total** | **75** | **16** | **42** | **17** | **Full product vision** |

### How to read the ordered backlog

Each heading begins with the **unique queue position**, followed by its **stable story ID** (which does not change when priority changes). Under each story is one compact metadata line: MoSCoW priority, estimated size and epic. Acceptance criteria stay collapsible for readability.

**The queue is ordered from top to bottom.** Stories from different epics are intentionally interleaved so dependencies, value and uncertainty can determine what is built first. Items requiring other features are positioned after them within their priority group where practical. Items in `Won't` should **not** be pulled into this course's sprints.

### First 14 stories for the classroom exercise

The earlier course material suggests initially discussing about 10–15 stories. Here are the first 14 **in priority order** (all eight MVP stories, then six follow-ups):

| Order | ID | Story | MoSCoW | Size |
|--:|:--|:--|:--|:--:|
| 01 | [US-02](#us-02) | Add an ingredient | Must | **M** |
| 02 | [US-01](#us-01) | View my inventory | Must | **M** |
| 03 | [US-05](#us-05) | Get a basic AI recipe from my inventory | Must | **L** |
| 04 | [US-68](#us-68) | Read a complete recipe in the app | Must | **S** |
| 05 | [US-67](#us-67) | Understand when no valid recipe can be offered | Must | **M** |
| 06 | [US-06](#us-06) | Choose a cooking mood | Must | **S** |
| 07 | [US-03](#us-03) | Correct an ingredient amount | Must | **M** |
| 08 | [US-04](#us-04) | Remove an ingredient | Must | **S** |
| 09 | [US-07](#us-07) | Try another suggestion | Should | **S** |
| 10 | [US-26](#us-26) | Choose a cuisine or food style | Should | **S** |
| 11 | [US-27](#us-27) | Set a maximum cooking time | Should | **M** |
| 12 | [US-28](#us-28) | Choose the number of servings | Should | **M** |
| 13 | [US-17](#us-17) | Create my own account | Should | **L** |
| 14 | [US-18](#us-18) | Sign in | Should | **L** |

---

## Must Have — MVP (8 stories)

A small working journey: save ingredients → request a genuinely feasible AI recipe → read it.

<a id="us-02"></a>

### 01 · US-02 — Add an ingredient

**Must · M · Inventory**

> As a home cook, I want to record an ingredient with the quantity I have, so that it can be considered for recipes.

<details>
<summary>Acceptance criteria</summary>

- I can enter a name, positive quantity, and a unit such as g, ml, or pcs.
- Invalid entries are rejected; valid entries are saved and appear after reopening the app.

</details>

<a id="us-01"></a>

### 02 · US-01 — View my inventory

**Must · M · Inventory**

> As a home cook, I want to see the ingredients and amounts I have at home, so that I can understand what the app can cook with.

<details>
<summary>Acceptance criteria</summary>

- Stored ingredient names, amounts, and units appear in a mobile list.
- An empty list is explained; data remains after closing and reopening the app.

</details>

<a id="us-05"></a>

### 03 · US-05 — Get a basic AI recipe from my inventory

**Must · L · Recipe discovery**

> As a home cook, I want a real AI-generated meal idea based on my recorded ingredients, so that I can find something feasible to cook without buying more food.

<details>
<summary>Acceptance criteria</summary>

- Using recorded ingredients with supported units, I can request one recipe and see a title, ingredients and basic preparation instructions in the app.
- The backend sends the current stored inventory to the real AI service and validates the returned ingredients against exact supported names, units and recorded amounts before showing the recipe as feasible.
- A proposed recipe using unavailable ingredients or excessive quantities is not presented as cookable; the request does not alter inventory.

</details>

<a id="us-68"></a>

### 04 · US-68 — Read a complete recipe in the app

**Must · S · Recipe discovery**

> As a home cook, I want to read a recipe’s quantities, estimated time and ordered cooking steps, so that I can prepare the suggested meal.

<details>
<summary>Acceptance criteria</summary>

- A valid recipe displays a title, estimated time, required amounts and readable ordered instructions.
- If an optional field is absent, the UI handles it clearly rather than inventing a value.

</details>

<a id="us-67"></a>

### 05 · US-67 — Understand when no valid recipe can be offered

**Must · M · Recipe discovery**

> As a home cook, I want a clear explanation when the app cannot generate a feasible recipe, so that I do not mistakenly trust an unavailable ingredient or a failed request.

<details>
<summary>Acceptance criteria</summary>

- An empty inventory, AI service failure, invalid response or no recipe fitting the recorded stock produces an understandable message.
- The app never labels an unvalidated recipe as cookable and gives me a way to retry when appropriate.

</details>

<a id="us-06"></a>

### 06 · US-06 — Choose a cooking mood

**Must · S · Recipe discovery**

> As a home cook, I want to choose the kind of food I feel like, so that the suggestion better suits my appetite.

<details>
<summary>Acceptance criteria</summary>

- I can choose Comfort food, Quick & easy, or Surprise me (default).
- The chosen mood is sent with the recipe request without overriding ingredient and quantity limits.

</details>

<a id="us-03"></a>

### 07 · US-03 — Correct an ingredient amount

**Must · M · Inventory**

> As a home cook, I want to change an ingredient quantity, so that recipes use the amount I actually have.

<details>
<summary>Acceptance criteria</summary>

- I can replace an existing quantity with another valid positive value.
- The saved value appears in the inventory and is used by the next recipe request.

</details>

<a id="us-04"></a>

### 08 · US-04 — Remove an ingredient

**Must · S · Inventory**

> As a home cook, I want to remove an ingredient that I no longer have, so that it is not used in new recipe suggestions.

<details>
<summary>Acceptance criteria</summary>

- I can delete an inventory entry.
- The deleted entry does not return on restart or appear in future recipe requests.

</details>

---

## Should Have — Next (26 stories)

Valuable additions after the MVP is demonstrated; these are not automatically part of the current sprint.

<a id="us-07"></a>

### 09 · US-07 — Try another suggestion

**Should · S · Recipe discovery**

> As a home cook, I want to ask for a different recipe without re-entering everything, so that I can find an option I prefer.

<details>
<summary>Acceptance criteria</summary>

- The existing inventory and selections are reused when I request another idea.
- Skipping or regenerating a recipe does not alter inventory.

</details>

<a id="us-26"></a>

### 10 · US-26 — Choose a cuisine or food style

**Should · S · Recipe discovery**

> As a home cook, I want to choose a cuisine or style of food, so that recipes better match my cravings.

<details>
<summary>Acceptance criteria</summary>

- I can select from a small, defined list of styles.
- The selection influences recommendations when feasible; inventory restrictions still apply.

</details>

<a id="us-27"></a>

### 11 · US-27 — Set a maximum cooking time

**Should · M · Recipe discovery**

> As a busy home cook, I want to specify how much time I have, so that suggested meals fit my schedule.

<details>
<summary>Acceptance criteria</summary>

- I can choose a maximum time before generating a recipe.
- The result displays its estimated time, and the app does not present an over-limit recipe as matching the filter.

</details>

<a id="us-28"></a>

### 12 · US-28 — Choose the number of servings

**Should · M · Recipe discovery**

> As a home cook, I want to specify how many portions I want, so that recipe amounts better match my meal.

<details>
<summary>Acceptance criteria</summary>

- I can select a supported serving count.
- Displayed quantities are sized accordingly and checked against available stock.

</details>

<a id="us-17"></a>

### 13 · US-17 — Create my own account

**Should · L · Accounts and dashboard**

> As a new home cook, I want to register a personal account, so that my data is kept separately from other people’s.

<details>
<summary>Acceptance criteria</summary>

- I can sign up using required account details and receive useful validation feedback.
- My account is associated with an isolated inventory; no other user's private data is shown.

</details>

<a id="us-18"></a>

### 14 · US-18 — Sign in

**Should · L · Accounts and dashboard**

> As a registered home cook, I want to sign in to my account, so that I can access my own inventory and recipes.

<details>
<summary>Acceptance criteria</summary>

- Valid credentials open my personal data; invalid credentials do not.
- I cannot access another account's data by changing an item identifier or request.

</details>

<a id="us-19"></a>

### 15 · US-19 — Stay signed in on my phone

**Should · M · Accounts and dashboard**

> As a registered home cook, I want to remain signed in between app launches, so that I can open my kitchen quickly.

<details>
<summary>Acceptance criteria</summary>

- My valid authenticated session persists across app restarts.
- Expired or revoked sessions require authentication again.

</details>

<a id="us-20"></a>

### 16 · US-20 — Sign out

**Should · S · Accounts and dashboard**

> As a registered home cook, I want to sign out of my account, so that another person using my device cannot access my profile.

<details>
<summary>Acceptance criteria</summary>

- A sign-out action ends the local session and returns me to the signed-out view.
- Previously cached personal information is no longer accessible through the signed-out interface.

</details>

<a id="us-15"></a>

### 17 · US-15 — Start cooking a selected recipe

**Should · M · Cooking and stock deduction**

> As a home cook, I want to enter a cooking session for a recipe, so that I can follow the recipe before confirming what I used.

<details>
<summary>Acceptance criteria</summary>

- I can start a recipe and view its ingredients and steps during cooking.
- Starting or abandoning a session does not deduct inventory.

</details>

<a id="us-69"></a>

### 18 · US-69 — Preview the ingredients I would use

**Should · M · Cooking and stock deduction**

> As a home cook, I want to review the ingredients and quantities that cooking a recipe would consume, so that I can check them before changing my food inventory.

<details>
<summary>Acceptance criteria</summary>

- Before confirming completion, I can see which ingredients and amounts would be deducted.
- Opening or dismissing the preview never changes stored stock.

</details>

<a id="us-10"></a>

### 19 · US-10 — Confirm cooking and deduct recorded quantities

**Should · L · Cooking and stock deduction**

> As a home cook, I want to confirm that I have used the displayed recipe amounts, so that my stored food quantities reflect what remains.

<details>
<summary>Acceptance criteria</summary>

- After seeing the deduction preview, I can confirm or cancel a cooking completion.
- Confirmation applies all valid ingredient deductions atomically; insufficient stock blocks the change and no quantity becomes negative.
- Cancellation or a failed transaction leaves inventory unchanged.

</details>

<a id="us-11"></a>

### 20 · US-11 — Adjust ingredients actually used

**Should · M · Cooking and stock deduction**

> As a home cook, I want to change the quantities I used before finishing a recipe, so that the inventory reflects what really happened.

<details>
<summary>Acceptance criteria</summary>

- I can change or clear a proposed deduction before confirming.
- Only validated quantities are deducted; attempts to consume more than recorded stock are blocked or require correction.

</details>

<a id="us-08"></a>

### 21 · US-08 — Save a recipe

**Should · M · Saved recipes and history**

> As a home cook, I want to save a recipe I like, so that I can return to it later.

<details>
<summary>Acceptance criteria</summary>

- I can explicitly save a displayed recipe.
- Its recipe content remains available after restarting the app.

</details>

<a id="us-09"></a>

### 22 · US-09 — Browse saved recipes

**Should · M · Saved recipes and history**

> As a returning home cook, I want to view and reopen my saved recipes, so that I do not have to generate a favourite again.

<details>
<summary>Acceptance criteria</summary>

- I see a saved-recipe list linked to my profile or current test data.
- Opening an entry shows its full saved ingredients and instructions.

</details>

<a id="us-16"></a>

### 23 · US-16 — Remove a saved recipe

**Should · S · Saved recipes and history**

> As a home cook, I want to remove a recipe from my saved collection, so that my favourites stay relevant.

<details>
<summary>Acceptance criteria</summary>

- I can unsave a recipe.
- It disappears from the saved collection while my inventory stays unchanged.

</details>

<a id="us-14"></a>

### 24 · US-14 — See recently suggested recipes

**Should · M · Saved recipes and history**

> As a returning home cook, I want to see recipes suggested to me recently, so that I can revisit an idea I did not save.

<details>
<summary>Acceptance criteria</summary>

- A recent-recipes list shows past suggestions in newest-first order.
- I can reopen a historical recipe without generating it again.

</details>

<a id="us-31"></a>

### 25 · US-31 — View dishes I have cooked

**Should · M · Saved recipes and history**

> As a returning home cook, I want to see recipes I previously marked as cooked, so that I can remember what meals I made.

<details>
<summary>Acceptance criteria</summary>

- A cooked-recipes history distinguishes finished meals from merely viewed suggestions.
- Each entry can be opened for its recipe information.

</details>

<a id="us-12"></a>

### 26 · US-12 — Re-add a familiar ingredient

**Should · M · Inventory**

> As a returning home cook, I want to reuse a previously entered ingredient name and unit, so that I do not have to type and configure it again.

<details>
<summary>Acceptance criteria</summary>

- Previously used entries are offered when adding an ingredient.
- I confirm the new quantity before it changes inventory.

</details>

<a id="us-13"></a>

### 27 · US-13 — Exclude ingredients I dislike

**Should · M · Food preferences**

> As a home cook, I want to record ingredients I do not want in meals, so that recipes avoid foods I dislike.

<details>
<summary>Acceptance criteria</summary>

- I can add and remove ingredients from an exclusion list.
- Recipe suggestions are checked against saved exclusions; this is not an allergy-safety guarantee.

</details>

<a id="us-25"></a>

### 28 · US-25 — Search my inventory

**Should · S · Inventory**

> As a home cook with many ingredients, I want to find an ingredient by name, so that I can update my stock quickly.

<details>
<summary>Acceptance criteria</summary>

- Typing part of an ingredient name narrows the list.
- Clearing the search restores the full list.

</details>

<a id="us-24"></a>

### 29 · US-24 — See a kitchen dashboard

**Should · S · Accounts and dashboard**

> As a signed-in home cook, I want to see my food inventory summary and recipe starting point together, so that I can begin cooking with minimal navigation.

<details>
<summary>Acceptance criteria</summary>

- A home view shows the essentials from my account and a clear recipe action.
- It handles an empty inventory without showing misleading counts.

</details>

<a id="us-21"></a>

### 30 · US-21 — Reset a forgotten password

**Should · L · Accounts and dashboard**

> As a registered home cook, I want to recover access when I forget my password, so that I can use my account again.

<details>
<summary>Acceptance criteria</summary>

- I can request a secure recovery flow for my account.
- Resetting a password invalidates the reset token and does not reveal whether an email exists.

</details>

<a id="us-22"></a>

### 31 · US-22 — Change my password

**Should · M · Accounts and dashboard**

> As a signed-in home cook, I want to change my account password, so that I can maintain control of my account.

<details>
<summary>Acceptance criteria</summary>

- I can update my password using the required verification.
- My old password is no longer accepted after a successful change.

</details>

<a id="us-23"></a>

### 32 · US-23 — Edit my personal details

**Should · M · Accounts and dashboard**

> As a signed-in home cook, I want to update my profile information, so that my account details stay accurate.

<details>
<summary>Acceptance criteria</summary>

- I can view and change the supported profile fields.
- Updated details persist and belong only to my account.

</details>

<a id="us-29"></a>

### 33 · US-29 — Delete my account and personal data

**Should · L · Accounts and dashboard**

> As a registered home cook, I want to delete my account, so that I can stop using the service without leaving my private kitchen data behind.

<details>
<summary>Acceptance criteria</summary>

- The app provides a deliberate, confirmed account-deletion flow.
- After processing, the account can no longer sign in and its stored personal data is handled according to the published retention/deletion policy.

</details>

<a id="us-30"></a>

### 34 · US-30 — Access my inventory on another device

**Should · M · Accounts and dashboard**

> As a registered home cook, I want to see the same inventory after signing in elsewhere, so that I am not tied to one phone.

<details>
<summary>Acceptance criteria</summary>

- Signing in on a second supported device loads the same account inventory.
- Updates are attributed to the correct account and are not mixed with another user's data.

</details>

---

## Could Have — Later (28 stories)

Optional improvements if validated by users and team capacity.

<a id="us-32"></a>

### 35 · US-32 — Sort inventory items

**Could · S · Inventory**

> As a home cook, I want to sort food by name or amount, so that I can scan my inventory more easily.

<details>
<summary>Acceptance criteria</summary>

- I can select a supported sorting order.
- Sorting changes presentation, not stored stock.

</details>

<a id="us-35"></a>

### 36 · US-35 — Avoid accidental duplicate entries

**Could · M · Inventory**

> As a home cook, I want to be warned when I add something already listed, so that my quantities do not become confusing.

<details>
<summary>Acceptance criteria</summary>

- Potential matching entries are shown before saving.
- I can choose to increase an existing amount or keep a separate item where appropriate.

</details>

<a id="us-34"></a>

### 37 · US-34 — Get common-item suggestions

**Could · M · Inventory**

> As a home cook, I want to see useful suggestions while entering a new ingredient, so that frequent items take less effort to add.

<details>
<summary>Acceptance criteria</summary>

- The add flow suggests common or previously used names matching my input.
- Suggestions never add quantities automatically.

</details>

<a id="us-33"></a>

### 38 · US-33 — Group inventory by category

**Could · M · Inventory**

> As a home cook, I want to group ingredients by food category, so that my food collection is easier to navigate.

<details>
<summary>Acceptance criteria</summary>

- Items can have a category such as dairy, vegetables, or pantry.
- The inventory can display meaningful groupings without hiding uncategorised items.

</details>

<a id="us-36"></a>

### 39 · US-36 — Convert between a few compatible inventory units

**Could · L · Inventory**

> As a home cook, I want common compatible quantities to be compared reliably, so that recipes can use food recorded in different units.

<details>
<summary>Acceptance criteria</summary>

- The app consistently converts only g ↔ kg and ml ↔ l; individual pieces (pcs) are not guessed to be a mass or volume.
- Unknown, ingredient-dependent or incompatible conversions are rejected rather than guessed.

</details>

<a id="us-37"></a>

### 40 · US-37 — Record expiry dates

**Could · M · Inventory**

> As a home cook, I want to add an expiry or use-by date to food, so that I know which items need attention.

<details>
<summary>Acceptance criteria</summary>

- An optional date can be saved or edited per relevant inventory item.
- Items without dates remain valid entries.

</details>

<a id="us-39"></a>

### 41 · US-39 — See food nearing expiry

**Could · S · Inventory**

> As a home cook, I want to see which foods may expire soon, so that I can decide what to use first.

<details>
<summary>Acceptance criteria</summary>

- Dated items are marked based on a clear configurable or documented threshold.
- Undated items are not inaccurately presented as expired.

</details>

<a id="us-38"></a>

### 42 · US-38 — Prioritise food expiring soon

**Could · M · Recipe discovery**

> As a home cook, I want to request recipes using ingredients near expiry, so that I can reduce food waste.

<details>
<summary>Acceptance criteria</summary>

- A user can choose to prioritise soon-expiring ingredients.
- Expiry preference never overrides actual ingredient availability and amounts.

</details>

<a id="us-40"></a>

### 43 · US-40 — See ingredient availability in a suggested recipe

**Could · M · Recipe discovery**

> As a home cook, I want to see which recipe ingredients I have and which are missing, so that I know whether a meal is practical.

<details>
<summary>Acceptance criteria</summary>

- Each ingredient is visibly marked available, insufficient, or missing.
- Statuses are calculated from stored quantities rather than assumed from AI output.

</details>

<a id="us-41"></a>

### 44 · US-41 — Allow recipes with a few missing ingredients

**Could · M · Recipe discovery**

> As a home cook, I want to choose whether recipes may require a small purchase, so that I can explore more meal options when my pantry is limited.

<details>
<summary>Acceptance criteria</summary>

- I can switch between strict inventory-only and an explicit flexible mode.
- Every missing ingredient and amount is clearly disclosed before cooking.

</details>

<a id="us-43"></a>

### 45 · US-43 — Add an item to my shopping list

**Could · M · Shopping and planning**

> As a home cook, I want to add something to a shopping list, so that I remember what to buy.

<details>
<summary>Acceptance criteria</summary>

- I can add an item name and optional quantity to a persistent shopping list.
- A newly added item appears in the list without silently changing my kitchen inventory.

</details>

<a id="us-70"></a>

### 46 · US-70 — Edit a shopping-list item

**Could · S · Shopping and planning**

> As a home cook, I want to correct a shopping-list item, so that my list stays accurate before I go shopping.

<details>
<summary>Acceptance criteria</summary>

- I can change the name or amount of an existing shopping-list item.
- Changes persist without changing kitchen inventory.

</details>

<a id="us-71"></a>

### 47 · US-71 — Remove a shopping-list item

**Could · S · Shopping and planning**

> As a home cook, I want to remove an item I no longer need to buy, so that my list only contains relevant purchases.

<details>
<summary>Acceptance criteria</summary>

- I can delete a selected shopping item.
- The removed item no longer appears on the list, and stored inventory is unchanged.

</details>

<a id="us-72"></a>

### 48 · US-72 — Mark a shopping-list item as purchased

**Could · S · Shopping and planning**

> As a home cook, I want to mark something as purchased, so that I can see what remains to buy.

<details>
<summary>Acceptance criteria</summary>

- I can mark an item bought and distinguish it from unpurchased items.
- Buying an item does not change inventory until an explicit stock-add action.

</details>

<a id="us-42"></a>

### 49 · US-42 — Add missing ingredients to a shopping list

**Could · M · Shopping and planning**

> As a home cook, I want to transfer missing recipe ingredients to a shopping list, so that I know what to buy.

<details>
<summary>Acceptance criteria</summary>

- I can explicitly add missing ingredients from a recipe.
- Items appear with useful amounts where known.

</details>

<a id="us-54"></a>

### 50 · US-54 — Mark pantry staples

**Could · M · Inventory**

> As a home cook, I want to specify pantry basics I usually have, so that recipe suggestions can reflect my actual kitchen.

<details>
<summary>Acceptance criteria</summary>

- I can explicitly opt in to individual staple ingredients and quantities.
- No staple is assumed present unless I have configured it or listed it.

</details>

<a id="us-45"></a>

### 51 · US-45 — Exclude dishes I dislike

**Could · M · Food preferences**

> As a home cook, I want to name specific dishes I never want suggested, so that recommendations avoid meals I already know I dislike.

<details>
<summary>Acceptance criteria</summary>

- I can maintain a list of excluded dishes or dish types.
- Suggestions matching those exclusions are filtered or clearly rejected.

</details>

<a id="us-46"></a>

### 52 · US-46 — Describe a custom craving

**Could · S · Food preferences**

> As a home cook, I want to describe my desired meal in my own words, so that I can request something more specific than presets.

<details>
<summary>Acceptance criteria</summary>

- I can enter an optional free-text preference.
- A custom request cannot bypass inventory constraints or required safety checks.

</details>

<a id="us-44"></a>

### 53 · US-44 — Choose a dietary pattern

**Could · L · Food preferences**

> As a home cook with dietary preferences, I want to set the eating pattern I follow, so that recipes better reflect my needs.

<details>
<summary>Acceptance criteria</summary>

- Supported patterns can be selected and removed.
- Generated ingredients are checked against the selected pattern where rules are verifiable; no medical guarantee is implied.

</details>

<a id="us-47"></a>

### 54 · US-47 — Follow one cooking step at a time

**Could · M · Cooking and stock deduction**

> As a home cook, I want to follow recipe steps in a distraction-free cooking view, so that I can stay focused while preparing food.

<details>
<summary>Acceptance criteria</summary>

- I can navigate between individual steps and see my place.
- Leaving the cooking view does not deduct ingredients.

</details>

<a id="us-48"></a>

### 55 · US-48 — Use cooking timers

**Could · M · Cooking and stock deduction**

> As a home cook, I want to start a timer for a recipe step, so that I can manage cooking without losing track of time.

<details>
<summary>Acceptance criteria</summary>

- A recipe step with a time can start or stop a timer.
- Timer state is clearly shown; lack of notification permissions is handled gracefully.

</details>

<a id="us-50"></a>

### 56 · US-50 — Search saved recipes

**Could · S · Saved recipes and history**

> As a home cook with many saved recipes, I want to find a saved dish by name, so that I can reuse it quickly.

<details>
<summary>Acceptance criteria</summary>

- Saved recipes can be searched by name.
- Search results only contain recipes from my collection.

</details>

<a id="us-49"></a>

### 57 · US-49 — Rate a recipe

**Could · M · Food preferences**

> As a returning home cook, I want to give feedback on a recipe I tried, so that future suggestions can better suit my taste.

<details>
<summary>Acceptance criteria</summary>

- I can record simple positive or negative feedback against a recipe.
- The app does not claim the model has learned preferences unless those ratings are actually used.

</details>

<a id="us-55"></a>

### 58 · US-55 — Compare a shortlist of meals

**Could · M · Recipe discovery**

> As a home cook, I want to compare several feasible meal ideas at once, so that I can choose without repeatedly regenerating.

<details>
<summary>Acceptance criteria</summary>

- A small list displays distinct recipe summaries with cooking time.
- Opening a recipe reveals full details, and each option respects inventory rules.

</details>

<a id="us-56"></a>

### 59 · US-56 — Get ingredient substitution ideas

**Could · L · Recipe discovery**

> As a home cook, I want to see safe, practical substitutes from my inventory, so that I can adapt a recipe when I lack one ingredient.

<details>
<summary>Acceptance criteria</summary>

- Suggestions distinguish verified substitutions from uncertain ones.
- The revised recipe and quantities must be checked again against available stock.

</details>

<a id="us-52"></a>

### 60 · US-52 — Scan a barcode to add food

**Could · L · Inventory**

> As a home cook, I want to scan a product barcode when entering food, so that I can avoid repetitive typing.

<details>
<summary>Acceptance criteria</summary>

- A recognised code can prefill available product information for my confirmation.
- Unrecognised codes allow manual entry; inventory is never changed without my confirmation.

</details>

<a id="us-53"></a>

### 61 · US-53 — See optional nutrition estimates

**Could · L · Recipe discovery**

> As a home cook, I want to see approximate nutrition for a recipe, so that I can make a more informed food choice.

<details>
<summary>Acceptance criteria</summary>

- Nutritional values, when available, are clearly labelled estimates and show a basis or source.
- Missing or unreliable nutritional data is shown as unavailable rather than invented as exact.

</details>

<a id="us-51"></a>

### 62 · US-51 — Put a saved recipe on a weekly meal plan

**Could · L · Shopping and planning**

> As a home cook, I want to place a saved recipe on a day of the coming week, so that I can plan upcoming meals.

<details>
<summary>Acceptance criteria</summary>

- I can assign or remove one saved recipe for a selected day in a simple seven-day view.
- Planned meals persist without deducting any ingredients until cooking is explicitly confirmed.

</details>

---

## Won't Have — Future vision (13 stories)

Deliberately excluded from this course delivery window; retain for later product decisions.

<a id="us-57"></a>

### 63 · US-57 — Open a protected administrator area

**Won't · L · Administration and reporting**

> As a service administrator, I want to access administration separately from the cooking app, so that I can manage the service without exposing private data.

<details>
<summary>Acceptance criteria</summary>

- Only authorised administrator accounts can open administration views.
- Ordinary users cannot access administrative data through UI or API routes.

</details>

<a id="us-58"></a>

### 64 · US-58 — View registered users

**Won't · M · Administration and reporting**

> As a service administrator, I want to see a list and total count of registered accounts, so that I can understand the service's user base.

<details>
<summary>Acceptance criteria</summary>

- The list and count reflect registered accounts and support basic filtering.
- Only essential account metadata is exposed to admins with a legitimate need.

</details>

<a id="us-59"></a>

### 65 · US-59 — See recent account activity

**Won't · M · Administration and reporting**

> As a service administrator, I want to see when accounts were last active, so that I can assess usage and spot dormant accounts.

<details>
<summary>Acceptance criteria</summary>

- Recent activity or last-login indicators are available only to authorised staff.
- Tracking, retention, and access follow the service's published privacy rules.

</details>

<a id="us-60"></a>

### 66 · US-60 — Measure active usage

**Won't · M · Administration and reporting**

> As a service administrator, I want to see daily or monthly active users, so that I can evaluate whether people return to the app.

<details>
<summary>Acceptance criteria</summary>

- The report defines exactly what qualifies as an active user.
- Metrics can be viewed for a selected time range without exposing ingredient lists or recipe text.

</details>

<a id="us-61"></a>

### 67 · US-61 — Measure recipe feature usage

**Won't · M · Administration and reporting**

> As a service administrator, I want to see how often users request and finish recipes, so that I can identify which parts of the product deliver value.

<details>
<summary>Acceptance criteria</summary>

- The report distinguishes generation requests from completed cooking sessions.
- Counts use aggregated activity and do not require displaying personal pantry contents.

</details>

<a id="us-62"></a>

### 68 · US-62 — See basic usage trends

**Won't · M · Administration and reporting**

> As a service administrator, I want to compare signups and use over time, so that I can assess adoption and identify changes.

<details>
<summary>Acceptance criteria</summary>

- Trends can be reviewed by an authorised admin for a chosen period.
- Charts show consistent labelled definitions and avoid misleading incomplete periods.

</details>

<a id="us-73"></a>

### 69 · US-73 — Create a shared household

**Won't · L · Households and integrations**

> As a registered home cook, I want to create a household, so that multiple members can use one common food inventory.

<details>
<summary>Acceptance criteria</summary>

- I can create a household and become its owner or initial member.
- The household has its own persistent inventory, separate from other households.

</details>

<a id="us-63"></a>

### 70 · US-63 — View my household’s shared inventory

**Won't · M · Households and integrations**

> As a household member, I want to view our household food inventory, so that I know what food is available to everyone.

<details>
<summary>Acceptance criteria</summary>

- When I belong to a household, I can open its existing shared ingredient list.
- People who are not authorised household members cannot read that inventory.

</details>

<a id="us-74"></a>

### 71 · US-74 — Update shared household stock

**Won't · M · Households and integrations**

> As a household member with edit access, I want to change a shared ingredient amount, so that other members see our current stock.

<details>
<summary>Acceptance criteria</summary>

- An authorised member can save a quantity update to the shared inventory.
- Other members reading the household inventory see the latest committed change; outsiders cannot update it.

</details>

<a id="us-64"></a>

### 72 · US-64 — Invite someone to my household

**Won't · L · Households and integrations**

> As a household owner, I want to invite a person to our shared food inventory, so that we can collaborate without sharing my account.

<details>
<summary>Acceptance criteria</summary>

- I can send or create one limited-purpose invitation to an existing household.
- Only someone accepting a valid invitation gains membership; expired or invalid invitations grant no access.

</details>

<a id="us-75"></a>

### 73 · US-75 — Remove a household member

**Won't · M · Households and integrations**

> As a household owner, I want to remove a person from my household, so that people who leave no longer have access to our stock.

<details>
<summary>Acceptance criteria</summary>

- I can revoke a member’s household access after confirming the action.
- Revoked members cannot read or update the household inventory.

</details>

<a id="us-65"></a>

### 74 · US-65 — Suggest ingredients from a single photo

**Won't · L · Households and integrations**

> As a home cook, I want ingredient suggestions from a photo, so that I can avoid typing every item I recognise in it.

<details>
<summary>Acceptance criteria</summary>

- A selected or captured image produces a reviewable list of probable ingredient names.
- The user must correct or confirm each item and amount before stock changes; uncertain recognition never silently alters inventory.

</details>

<a id="us-66"></a>

### 75 · US-66 — Import inventory candidates from one supported shopping file

**Won't · L · Inventory**

> As a home cook, I want to import purchases from a supported file, so that adding groceries takes less time.

<details>
<summary>Acceptance criteria</summary>

- One clearly documented input format (such as a simple CSV with names and quantities) can be previewed before import.
- Unrecognised entries can be corrected or excluded; only confirmed entries update inventory.

</details>

---

## XL splitting decisions

The original backlog contained some multi-part behaviours that would be **XL** if implemented as single user stories. They have been narrowed or split into independently testable vertical outcomes. Existing IDs are kept wherever possible, and new IDs are assigned to the additional outcomes.

| Original area | Resulting stories | Why this is smaller |
|:--|:--|:--|
| AI recipe generation (`US-05`) | **US-05** basic real-AI, quantity-checked recipe (**L**) → **US-68** readable full recipe (**S**) → **US-67** clear errors and failed recommendations (**M**) | Split generation, presentation and exceptional cases; limit MVP matching to explicitly supported units and ingredient names. |
| Cooking completion (`US-10`) | **US-69** preview (**M**) → **US-10** atomic confirmation (**L**) → **US-11** change actually used quantities (**M**) | Separate non-destructive preview, confirmed stock change and adjustments. |
| Shopping-list management (`US-43`) | **US-43** add (**M**) → **US-70** edit (**S**) → **US-71** delete (**S**) → **US-72** mark purchased (**S**) | Each change is a separate user goal and a demonstrable increment. |
| Shared households (`US-63` / `US-64`) | **US-73** create (**L**) → **US-63** view shared inventory (**M**) → **US-74** edit shared stock (**M**) → **US-64** invite (**L**) → **US-75** revoke access (**M**) | Creation, access, changes and membership are separately testable. |
| Ambiguous broad feature descriptions | **US-36** only compatible g/kg and ml/l; **US-51** one recipe/day weekly planner; **US-66** one documented file format | Explicitly restrict their scope to something plausibly achievable within a sprint. |

These are **proposed** sizes. If your chosen AI/authentication technology or team experience makes any L too big for one person in a sprint, split it further **before** bringing it into Sprint Planning. Do not create a 'frontend-only story' and 'backend-only story' as a substitute for independently usable outcomes.

## Dependencies, estimation and review

- **First prove the key risk.** US-05 (real AI using actual stock) is near the top, immediately after entering and viewing food. Don't postpone AI integration until the end of the course.
- **MVP traceability.** Six bullets in `MVP.md` map to eight Must stories: view (**US-01**), add (**US-02**), correct/delete (**US-03/04**), choose mood (**US-06**), generate one feasible recipe (**US-05**), and view results/handle failures (**US-68/67**). No post-MVP features were promoted to Must.
- **Check dependencies.** US-10 needs US-69; US-11 needs US-10; US-09 needs US-08; US-31 needs completion; US-18/19/20/21/22/23/29/30 need accounts and user data separation. US-38 needs expiry-date data; US-42 needs the missing-ingredient mode; household membership needs account permissions.
- **Refine together.** Compare every proposed size with **US-02 = M**, let both developers explain disagreements and revise uncertainty after technical spikes or sprint reviews. A new size is not a conversion to hours.
- **Use real completed work.** In subsequent sprint planning, compare the team's recent completed S/M/L stories against current capacity. Don't assume all 75 stories are deliverable during the course.
- **Vertical work / Definition of Done.** A selected story must work end-to-end through its required interface, services and persisted state; handle invalid input and failure states; pass appropriate tests and peer review; be demonstrable at Sprint Review. Setup, tests, CI and credentials are *implementation tasks*, not additional user stories.
- **Security boundaries.** An MVP may use an isolated demonstration identity, but must never expose a shared public pantry. Before public multi-user use, add authenticated authorisation, account-isolated storage and secure handling of personal data. The backend—not the AI model—is the authority on available ingredient quantities.

## Course references

- `03-prioritering.md`: ordered list; MoSCoW; MVP = Must; value, dependencies, risk and size affect ordering; Product Owner accountable with team discussion.
- `04-estimering-klädstorlekar.md`: relative S/M/L; compare with a known M; split XL; one-person-per-sprint upper bound for L; collaboratively refine estimates; don't translate sizes into hours.
- `05-mvp.md` / `06-user-stories.md`: small working vertical MVP and user-centred, testable stories (INVEST).

