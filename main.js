const fs = require("fs");

(async () => {
    // String used for testing (from command line or hard-coded)
    const testString = process.argv[2] ?? "How many letter a's are there in this string? Three!";

    // Encode the string to get the required size
    const nullTerminatedString = testString + "\0";
    const textEncoder = new TextEncoder();
    const encodedString = textEncoder.encode(nullTerminatedString);

    // Calculate the required memory size and allocate
    const webAssemblyMemoryPageSize = 64 * 1024; // 64 KB page size
    const initialMemorySizeInPages = Math.max(2, Math.ceil(encodedString.length / webAssemblyMemoryPageSize)); // Note: Minimum size must be at least 2 pages because that's what the module requires
    const memory = new WebAssembly.Memory({ initial: initialMemorySizeInPages });

    // Copy string into buffer
    textEncoder.encodeInto(nullTerminatedString, new Uint8Array(memory.buffer));

    const module = await WebAssembly.instantiate(await fs.promises.readFile("./string-example.wasm"), { env: { memory } });
    const result = module.instance.exports.countAs(0); // String was written to address zero
    console.log(result);

    // TODO: Am I overwriting stack or other data?
    // TODO: How to deal with C stack size?
    // TODO: Can I pass the string in the table and not have to encode, etc.?
})();
