import fs from "fs";
import { useNewInstanceString } from "./use.js";

(async () => {
    const module = await WebAssembly.instantiate(await fs.promises.readFile("./string-example.wasm"));

    // String used for testing (from command line or hard-coded)
    const testString = process.argv[2] ?? "How many letter a's are there in this string? Three!";
    useNewInstanceString(module, testString, (stringAddress) => {
        const result = module.instance.exports.count_as(stringAddress);
        console.log(result);
    });
})();
