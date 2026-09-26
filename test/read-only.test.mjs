import assert from "node:assert/strict";
import { assertReadOnlyQuery } from "../dist/sql.js";

assert.doesNotThrow(() => assertReadOnlyQuery("SELECT * FROM users"));
assert.doesNotThrow(() => assertReadOnlyQuery("WITH active AS (SELECT 1) SELECT * FROM active"));
assert.throws(() => assertReadOnlyQuery("DELETE FROM users"), /read-only/);
assert.throws(() => assertReadOnlyQuery("SELECT 1; DELETE FROM users"), /one statement/);
