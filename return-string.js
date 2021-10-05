import fs from "fs";
import { useInstanceString } from "./use.js";

(async () => {
    const module = await WebAssembly.instantiate(await fs.promises.readFile("./string-example.wasm"));

    // String used for testing (from command line or hard-coded)
    const count = parseInt(process.argv[2] ?? "3");
    useInstanceString(module, () => module.instance.exports.write_bs(count), str => {
        console.log(str);
    });
})();
