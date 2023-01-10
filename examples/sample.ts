// npx ts-node examples/sample.ts --name mizchi --age 34 --dry xxx 1
import { z } from "zod";
import { parse } from "zodiarg";

const parsed = parse(
  {
    options: {
      entry: z.string().describe("your server entry point"),
      watch: z.string().describe("watch directory"),
    },
    flags: {
    },
    args: [
    ],
    alias: {
    }
  },
  process.argv.slice(2),
  // Options(default)
  { help: true, helpWithNoArgs: true }
);

type ParsedInput = typeof parsed; // Inferenced by Zod

main(parsed).catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main(input: ParsedInput) {
  console.log('Parsed Input', input);
}