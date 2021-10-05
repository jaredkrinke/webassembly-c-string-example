import fs from "fs";
import { use, useInstanceAllocation, useInstanceString } from "./use.js";

(async () => {
    const module = await WebAssembly.instantiate(await fs.promises.readFile("./string-example.wasm"));

    // String used for testing (from command line or hard-coded)
    const count = parseInt(process.argv[2] ?? "3");

    // Call the function and get back a buffer: [size (32-bit unsigned int), byte1, byte2, ...]
    useInstanceString(module, () => module.instance.exports.write_bs(count), str => {
        console.log(str);
    })
})();
