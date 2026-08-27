import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const sourcePath = path.join(process.cwd(), "src/data/publicTrustProfile.ts");
const source = await fs.readFile(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022
  },
  fileName: sourcePath
}).outputText;

function evaluateProfile(env) {
  const localModule = { exports: {} };
  const exports = localModule.exports;
  const processStub = { env };
  const evaluate = new Function("exports", "module", "process", compiled);
  evaluate(exports, localModule, processStub);
  return localModule.exports;
}

const completeEvidence = {
  NEXT_PUBLIC_BIOAXIS_LEGAL_NAME: "QA legal entity",
  NEXT_PUBLIC_BIOAXIS_LEGAL_EVIDENCE: "QA registration record",
  NEXT_PUBLIC_BIOAXIS_OPERATING_REGION: "QA operating region",
  NEXT_PUBLIC_BIOAXIS_OPERATING_EVIDENCE: "QA address record",
  NEXT_PUBLIC_BIOAXIS_BUSINESS_EMAIL: "sourcing@qa-enterprise.example",
  NEXT_PUBLIC_BIOAXIS_CONTACT_EVIDENCE: "QA domain ownership record",
  NEXT_PUBLIC_BIOAXIS_RESPONSE_TARGET: "Within two QA business days",
  NEXT_PUBLIC_BIOAXIS_RESPONSE_EVIDENCE: "QA response policy",
  NEXT_PUBLIC_BIOAXIS_EVIDENCE_AS_OF: "2020-01-02"
};

const cases = [
  {
    name: "empty configuration fails closed",
    env: {},
    expectedVerified: 0
  },
  {
    name: "facts without evidence remain unpublished",
    env: {
      NEXT_PUBLIC_BIOAXIS_LEGAL_NAME: "MUST NOT PUBLISH",
      NEXT_PUBLIC_BIOAXIS_EVIDENCE_AS_OF: "2020-01-02"
    },
    expectedVerified: 0,
    forbiddenValue: "MUST NOT PUBLISH"
  },
  {
    name: "complete evidence publishes all required facts",
    env: completeEvidence,
    expectedVerified: 4
  },
  {
    name: "consumer email is not an enterprise contact",
    env: {
      ...completeEvidence,
      NEXT_PUBLIC_BIOAXIS_BUSINESS_EMAIL: "must-not-publish@gmail.com"
    },
    expectedVerified: 3,
    forbiddenValue: "must-not-publish@gmail.com"
  },
  {
    name: "invalid calendar date fails closed",
    env: {
      ...completeEvidence,
      NEXT_PUBLIC_BIOAXIS_EVIDENCE_AS_OF: "2020-02-31"
    },
    expectedVerified: 0
  },
  {
    name: "future evidence date fails closed",
    env: {
      ...completeEvidence,
      NEXT_PUBLIC_BIOAXIS_EVIDENCE_AS_OF: "2999-01-01"
    },
    expectedVerified: 0
  }
];

const failures = [];

async function sourceFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(entryPath) : [entryPath];
  }));
  return files.flat();
}

for (const testCase of cases) {
  const profile = evaluateProfile(testCase.env);
  const { publicTrustEvidenceSummary, publicTrustFacts } = profile;

  if (publicTrustEvidenceSummary.required !== 4) {
    failures.push(`${testCase.name}: expected 4 required facts, got ${publicTrustEvidenceSummary.required}`);
  }

  if (publicTrustEvidenceSummary.verified !== testCase.expectedVerified) {
    failures.push(`${testCase.name}: expected ${testCase.expectedVerified} verified, got ${publicTrustEvidenceSummary.verified}`);
  }

  if (publicTrustEvidenceSummary.complete !== (testCase.expectedVerified === 4)) {
    failures.push(`${testCase.name}: completion flag does not match verified count`);
  }

  if (testCase.forbiddenValue && publicTrustFacts.some((fact) => fact.value.includes(testCase.forbiddenValue))) {
    failures.push(`${testCase.name}: incomplete value leaked into public facts`);
  }

  console.log(`${testCase.name}: ${publicTrustEvidenceSummary.verified}/4 verified`);
}

const consumerEmailPattern = /[A-Z0-9._%+-]+@(126\.com|163\.com|gmail\.com|hotmail\.com|icloud\.com|outlook\.com|qq\.com|yahoo\.com)/i;
for (const file of await sourceFiles(path.join(process.cwd(), "src"))) {
  const contents = await fs.readFile(file, "utf8");
  if (consumerEmailPattern.test(contents)) {
    failures.push(`${path.relative(process.cwd(), file)}: production source exposes a consumer-domain email address`);
  }
}

console.log("production source consumer-email scan: no public personal address");

if (failures.length > 0) {
  console.error("Trust evidence regression failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Trust evidence regression passed.");
