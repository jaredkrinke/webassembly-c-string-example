import fs from "fs";

(async () => {
    const module = await WebAssembly.instantiate(await fs.promises.readFile("./string-example.wasm"));

    // String used for testing (from command line or hard-coded)
    const testString = process.argv[2] ?? "How many letter a's are there in this string? Three!";
    const nullTerminatedString = testString + "\0";
    const encodedString = (new TextEncoder()).encode(nullTerminatedString);
    const stringAddress = module.instance.exports.allocate(encodedString.length);
    try {
        const destination = new Uint8Array(module.instance.exports.memory.buffer, stringAddress);
        destination.set(encodedString);
        const result = module.instance.exports.count_as(stringAddress);
        console.log(result);
    } finally {
        module.instance.exports.deallocate(stringAddress);
    }
})();
