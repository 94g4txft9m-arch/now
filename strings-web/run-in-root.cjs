/**
 * Spustí `npm` v koreňovom priečinku repozitára (kde je app/, next.config.js).
 * Rieši situáciu, keď používateľ spustí skripty z priečinka strings-web/ — Next
 * inak môže brať nesprávny pracovný adresár a hľadať app/ v strings-web/.
 */
const { spawnSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const npmArgs = process.argv.slice(2);

if (npmArgs.length === 0) {
  console.error("Usage: node run-in-root.cjs <npm arguments...>");
  console.error('Example: node run-in-root.cjs run dev');
  process.exit(1);
}

const result = spawnSync("npm", npmArgs, {
  cwd: root,
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    INIT_CWD: root,
  },
});

process.exit(result.status ?? 0);
