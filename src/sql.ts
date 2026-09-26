const allowed = ["SELECT", "SHOW", "DESCRIBE", "EXPLAIN", "WITH"];

export function assertReadOnlyQuery(sql: string) {
  if (sql.includes(";")) throw new Error("Only one statement is allowed.");
  if (!allowed.some((verb) => sql.trim().toUpperCase().startsWith(verb))) throw new Error("Only read-only SQL is allowed.");
}
