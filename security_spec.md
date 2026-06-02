# Security Specification: HabitFlow

## 1. Data Invariants
- Each habit document MUST belong to a specific user (identified by `userId` matching `request.auth.uid`).
- Users can only read, write, update, or delete their own habit records. No sharing is permitted with other users' accounts.
- `history` is represented as an array of date strings (YYYY-MM-DD format). Its size must be constrained (e.g. maximum of 1000 entries) to prevent Abuse/Denial of Wallet.
- Critical identity fields like `userId`, `id`, and system fields like `createdAt` are immutable after creation.
- Fields like `name` must be constrained in string length (e.g. maximum 100 characters).

## 2. The "Dirty Dozen" Malicious Payloads
The following payloads attempt to break security invariants and must be blocked with `PERMISSION_DENIED`.

1. **Spoofed User ID Creation**: Creating a habit with a `userId` belonging to another user.
2. **Unauthenticated Write**: An unauthenticated user attempts to create a habit.
3. **Malicious ID Poisoning**: Specifying a 1MB malicious string as the document ID.
4. **Immutability Breach on ID Update**: Trying to mutate the `userId` field to a different value in an edit.
5. **Malicious Excess History Array Growth**: Pushing 10,000 dates in history to trigger Denial of Wallet.
6. **Self-Rating Privilege Escalation**: Injecting extra system properties (like `role: 'admin'`) into the habit document.
7. **Name Field Boundary Abuse**: Setting a habit name of 50,000 characters.
8. **Invalid Enum Setting for Category**: Setting category to an unapproved category (e.g., `'unapproved-category'`).
9. **Cross-User Data Scraping (List Query)**: Querying all habits without restricting to own `userId`.
10. **Cross-User Single Document Read**: Accessing another user's habit document with a known ID.
11. **Cross-User Illegal Delete**: Attempting to delete another user's habit.
12. **Future Tampering**: Tampering with `createdAt` or setting future invalid date formats.

## 3. The Test Runner Template (firestore.rules.test.ts)
A mock testing structure to ensure security logic is robust.

```typescript
// firestore.rules.test.ts
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

// Test implementation suite confirming permission denials on the 12 vectors.
```
