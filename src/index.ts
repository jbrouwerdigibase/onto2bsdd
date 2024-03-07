import * as fs from "fs";
import csv from "csv-parser";
import { Command } from "commander";
import { Onto2bsdd } from "./models/onto2bsdd";
import { OntoBsddQueryResult } from "./models/onto2bsddTypes";
import { UploadImportFile } from "./utils/bsddUploadTypes";

const program = new Command();
program
  .version("0.1.0")
  .option("-i, --input <path>", "input CSV file")
  .option("-o, --output <path>", "output JSON file")
  .option("-h, --header <path>", "header JSON file")
  .parse(process.argv);

const options = program.opts();
if (!options.input || !options.output || !options.header) {
  console.error("Error: input, output, and header options are required");
  process.exit(1);
}

const header: UploadImportFile = JSON.parse(
  fs.readFileSync(options.header, "utf8")
);

const csvObjects: OntoBsddQueryResult[] = [];
fs.createReadStream(options.input)
  .pipe(csv())
  .on("data", (data: OntoBsddQueryResult) => csvObjects.push(data))
  .on("end", () => {
    const result = Onto2bsdd.fromCSV(csvObjects, header);
    fs.writeFileSync(options.output, result);
  });
