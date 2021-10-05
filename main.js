const fs = require("fs");

(async () => {
    const module = await WebAssembly.instantiate(await fs.promises.readFile("./string-example.wasm"));

    // String used for testing (from command line or hard-coded)
    const testString = process.argv[2] ?? "How many letter a's are there in this string? Three!";

    // Encode the string (with null terminator) to get the required size
    const nullTerminatedString = testString + "\0";
    const textEncoder = new TextEncoder();
    const encodedString = textEncoder.encode(nullTerminatedString);

    // Allocate space in linear memory for the encoded string
    const address = module.instance.exports.allocate(encodedString.length);
    try {
        // Copy the string into the buffer
        const destination = new Uint8Array(module.instance.exports.memory.buffer, address);
        textEncoder.encodeInto(nullTerminatedString, destination);

        // Call the function
        const result = module.instance.exports.countAs(address);
        console.log(result);
    } finally {
        // Always free the allocation when done
        module.instance.exports.deallocate(address);
    }
})();
