// S7 stage 3: merge scripts/s7-followers-output.json into authorsSample.js
//
// For each author with a successful fetch, append/update mediaSignals.linkedinFollowers
// (number) and mediaSignals.linkedinConnections ("500+" string for the bucket case).
// Also writes a fetchedAt timestamp so we know when the value was captured.
//
// Patches authorsSample.js by regex per id (idempotent — re-running is safe).
// Authors with no successful fetch are left unchanged.
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const here = url.fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(here, "..");
const samplePath = path.resolve(root, "src/data/authorsSample.js");
const fetchedPath = path.resolve(here, "s7-followers-output.json");

if (!fs.existsSync(fetchedPath)) {
  console.error(`No fetch output at ${fetchedPath}. Run --fetch first.`);
  process.exit(1);
}

const fetched = JSON.parse(fs.readFileSync(fetchedPath, "utf8"));
const okFetches = fetched.filter((r) => r.followers != null || r.connections != null);
console.log(`Fetched records: ${fetched.length}, with data: ${okFetches.length}`);

// Sanity stats
const stats = {
  withFollowers: fetched.filter((r) => r.followers != null).length,
  withConnections: fetched.filter((r) => r.connections != null).length,
  bothMissing: fetched.filter((r) => r.followers == null && r.connections == null).length,
  errored: fetched.filter((r) => r.error).length,
};
console.log("Stats:", stats);

let src = fs.readFileSync(samplePath, "utf8");
let patched = 0;
let alreadyHadField = 0;

for (const r of okFetches) {
  // Find author block by "id": "..."
  const idEsc = r.id.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  // Find "mediaSignals": {  ... } block within this author
  const blockRe = new RegExp(
    `("id":\\s*"${idEsc}"[\\s\\S]*?"mediaSignals":\\s*\\{)([\\s\\S]*?)(\\n\\s*\\})`,
    "m",
  );

  const match = src.match(blockRe);
  if (!match) {
    console.warn(`  ! id "${r.id}" — block not found; skipping`);
    continue;
  }

  const [full, head, body, tail] = match;

  // If linkedinFollowers field already present, replace it
  let newBody = body;
  const liFieldRe = /\s*"linkedinFollowers":\s*[^,\n}]+,?/;
  const liConnRe = /\s*"linkedinConnections":\s*[^,\n}]+,?/;
  const liFetchedRe = /\s*"linkedinFetchedAt":\s*"[^"]*",?/;

  if (liFieldRe.test(newBody) || liConnRe.test(newBody)) {
    alreadyHadField += 1;
    newBody = newBody.replace(liFieldRe, "");
    newBody = newBody.replace(liConnRe, "");
    newBody = newBody.replace(liFetchedRe, "");
  }

  // Append our fields right before the closing `}` of mediaSignals.
  // Body ends with the last field, we want to add a trailing-comma'd entry.
  let inject = "";
  if (r.followers != null) inject += `,\n      "linkedinFollowers": ${r.followers}`;
  if (r.connections != null) inject += `,\n      "linkedinConnections": ${JSON.stringify(r.connections)}`;
  inject += `,\n      "linkedinFetchedAt": ${JSON.stringify(r.fetchedAt)}`;

  // Body shape: it's the inner of the object; if non-empty, ends with a value not a comma.
  // We append after the last value, before `\n  }` closing.
  const newBlock = head + newBody.replace(/[\s,]*$/, "") + inject + tail;
  src = src.replace(full, newBlock);
  patched += 1;
}

fs.writeFileSync(samplePath, src);
console.log(`Patched authorsSample.js: ${patched} authors enriched (${alreadyHadField} already had field, replaced)`);
