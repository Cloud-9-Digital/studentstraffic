import "./lib/load-script-env.mjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local", override: true });

const API_HOST =
  process.env.LEADSQUARED_API_HOST ??
  "https://api-in21.leadsquared.com/v2/LeadManagement.svc";
const ACCESS_KEY = process.env.LEADSQUARED_ACCESS_KEY;
const SECRET_KEY = process.env.LEADSQUARED_SECRET_KEY;
const PAGE_SIZE = 1000;
const UPDATE_BATCH_SIZE = 25;
// LeadSquared documents a 25-call/5-second limit. A single worker keeps this
// process below the limit even when the account has other API traffic.
const MAX_PARALLEL_UPDATES = 1;
const UPDATE_INTERVAL_MS = 1_250;
const REQUEST_TIMEOUT_MS = 30_000;

const owners = [
  { name: "Abirami", id: "fe342789-31d1-11ee-9c75-024bdf37e3a6" },
  { name: "Prema", id: "b897d147-33e0-11f1-8105-029c69a77f49" },
  { name: "Shoba Rajan", id: "1088e0c7-26f6-11ef-9a96-02dedb6f8889" },
];

const lists = [
  {
    name: "Thiruvallur NEET Data 2026",
    id: "f578eac3-80fc-11f1-882a-0a3e2d4af31f",
  },
  {
    name: "Chennai NEET Data 2026",
    id: "5daadd4a-80fc-11f1-882a-0a3e2d4af31f",
  },
  {
    name: "Kancheepuram NEET Data 2026",
    id: "6fea8dc5-80fc-11f1-882a-0a3e2d4af31f",
  },
];

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function authQuery() {
  if (!ACCESS_KEY || !SECRET_KEY) {
    throw new Error(
      "LEADSQUARED_ACCESS_KEY and LEADSQUARED_SECRET_KEY are required.",
    );
  }

  return new URLSearchParams({
    accessKey: ACCESS_KEY,
    secretKey: SECRET_KEY,
  });
}

async function request(path, options = {}) {
  const url = `${API_HOST}${path}?${authQuery()}`;

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS,
    );

    try {
      const response = await fetch(url, {
        ...options,
        cache: "no-store",
        signal: controller.signal,
      });
      const text = await response.text();
      let body;

      try {
        body = JSON.parse(text);
      } catch {
        body = {};
      }

      if (response.status === 429 || response.status >= 500) {
        const retryAfter = Number(response.headers.get("retry-after"));
        const delay = Number.isFinite(retryAfter)
          ? Math.max(6_000, retryAfter * 1000)
          : Math.max(6_000, Math.min(30_000, 1_000 * 2 ** attempt));
        await sleep(delay);
        continue;
      }

      if (!response.ok) {
        throw new Error(`LeadSquared request failed with HTTP ${response.status}.`);
      }

      return body;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error("LeadSquared request failed after retry limit.");
}

function properties(lead) {
  return Object.fromEntries(
    (lead.LeadPropertyList ?? []).map(({ Attribute, Value }) => [Attribute, Value]),
  );
}

async function retrieveListLeadIds(listId) {
  const first = await request("/Leads/Retrieve/BySearchParameter", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      SearchParameters: { ListId: listId, RetrieveBehaviour: "1" },
      Columns: { Include_CSV: "ProspectID,CreatedOn" },
      Sorting: { ColumnName: "CreatedOn", Direction: "1" },
      Paging: { PageIndex: 1, PageSize: PAGE_SIZE },
    }),
  });

  const total = Number(first.RecordCount ?? 0);
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const leadIds = [];

  for (let page = 1; page <= pageCount; page += 1) {
    const result =
      page === 1
        ? first
        : await request("/Leads/Retrieve/BySearchParameter", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              SearchParameters: { ListId: listId, RetrieveBehaviour: "1" },
              Columns: { Include_CSV: "ProspectID,CreatedOn" },
              Sorting: { ColumnName: "CreatedOn", Direction: "1" },
              Paging: { PageIndex: page, PageSize: PAGE_SIZE },
            }),
          });

    for (const lead of result.Leads ?? []) {
      const prospectId = properties(lead).ProspectID;
      if (prospectId) leadIds.push(prospectId);
    }

    if (page < pageCount) await sleep(250);
  }

  if (leadIds.length !== total) {
    throw new Error(`List returned ${leadIds.length}/${total} lead IDs.`);
  }

  return { leadIds, total };
}

function targetOwnerIndex(index, total) {
  const firstTarget = Math.ceil(total / 3);
  const secondTarget = firstTarget * 2;
  return index < firstTarget ? 0 : index < secondTarget ? 1 : 2;
}

function buildBatches(leadIds, total) {
  const batches = [];

  for (let index = 0; index < leadIds.length; index += UPDATE_BATCH_SIZE) {
    const ownerIndex = targetOwnerIndex(index, total);
    batches.push({
      leadIds: leadIds.slice(index, index + UPDATE_BATCH_SIZE),
      owner: owners[ownerIndex],
    });
  }

  return batches;
}

async function updateBatch(batch) {
  const result = await request("/Lead/Bulk/UpdateV2", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      SearchByKey: "ProspectId",
      Options: { PushNonExistentLeadsToUnProcessedList: false },
      LeadPropertiesList: batch.leadIds.map((ProspectId) => ({
        Fields: [
          { Attribute: "ProspectId", Value: ProspectId },
          { Attribute: "OwnerId", Value: batch.owner.id },
        ],
      })),
    }),
  });

  const successCount = Number(result.Status?.SuccessCount ?? 0);
  if (successCount !== batch.leadIds.length) {
    throw new Error(
      `Owner update processed ${successCount}/${batch.leadIds.length} leads.`,
    );
  }

  return successCount;
}

async function verifyList(list, expectedTotal) {
  const first = await request("/Leads/Retrieve/BySearchParameter", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      SearchParameters: { ListId: list.id, RetrieveBehaviour: "1" },
      Columns: { Include_CSV: "ProspectID,OwnerId" },
      Sorting: { ColumnName: "CreatedOn", Direction: "1" },
      Paging: { PageIndex: 1, PageSize: PAGE_SIZE },
    }),
  });

  const total = Number(first.RecordCount ?? 0);
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const counts = new Map(owners.map((owner) => [owner.name, 0]));
  const ownerNamesById = new Map(owners.map((owner) => [owner.id, owner.name]));
  let observed = 0;

  for (let page = 1; page <= pageCount; page += 1) {
    const result =
      page === 1
        ? first
        : await request("/Leads/Retrieve/BySearchParameter", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              SearchParameters: { ListId: list.id, RetrieveBehaviour: "1" },
              Columns: { Include_CSV: "ProspectID,OwnerId" },
              Sorting: { ColumnName: "CreatedOn", Direction: "1" },
              Paging: { PageIndex: page, PageSize: PAGE_SIZE },
            }),
          });

    for (const lead of result.Leads ?? []) {
      const ownerId = properties(lead).OwnerId;
      const ownerName = ownerNamesById.get(ownerId) ?? "Other/unassigned";
      counts.set(ownerName, (counts.get(ownerName) ?? 0) + 1);
      observed += 1;
    }

    if (page < pageCount) await sleep(250);
  }

  if (observed !== expectedTotal) {
    throw new Error(`Verification observed ${observed}/${expectedTotal} leads.`);
  }

  return Object.fromEntries(counts);
}

const apply = process.argv.includes("--apply");
const selectedList = process.argv.find((argument) => argument.startsWith("--list="));
const selectedLists = selectedList
  ? lists.filter((list) => list.name === selectedList.slice("--list=".length))
  : lists;

if (selectedLists.length === 0) {
  throw new Error("Unknown list. Use one of the configured list names.");
}

if (!apply) {
  console.log("Dry run only. Re-run with --apply to change LeadSquared owners.");
}

for (const list of selectedLists) {
  const { leadIds, total } = await retrieveListLeadIds(list.id);
  const batches = buildBatches(leadIds, total);

  console.log(`${list.name}: ${total} leads, ${batches.length} update batches.`);

  if (apply) {
    for (let index = 0; index < batches.length; index += MAX_PARALLEL_UPDATES) {
      const group = batches.slice(index, index + MAX_PARALLEL_UPDATES);
      await Promise.all(group.map(updateBatch));
      console.log(
        `${list.name}: processed ${Math.min(index + group.length, batches.length)}/${batches.length} batches.`,
      );
      if (index + MAX_PARALLEL_UPDATES < batches.length) {
        await sleep(UPDATE_INTERVAL_MS);
      }
    }
  }

  if (apply) {
    console.log(`${list.name}: verified target distribution`, await verifyList(list, total));
  }
}
