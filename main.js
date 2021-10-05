const fs = require("fs");

// Pass in a factory for an object with a "dispose" property and this will
// ensure "dispose" is called on the object after the provided lambda returns
// or throws
const use = (create, run) => {
    const o = create();
    try {
        run(o);
    } finally {
        o.dispose();
    }
};

const useInstanceAllocation = (module, size, run) => {
    use(() => {
        const address = module.instance.exports.allocate(size);
        return {
            address,
            dispose: () => module.instance.exports.deallocate(address),
        };
    }, run);
};

const withStringInInstanceMemory = (module, str, run) => {
    // Encode the string (with null terminator) to get the required size
    const nullTerminatedString = str + "\0";
    const textEncoder = new TextEncoder();
    const encodedString = textEncoder.encode(nullTerminatedString);

    // Allocate space in linear memory for the encoded string
    useInstanceAllocation(module, encodedString.length, (address) => {
        // Copy the string into the buffer
        const destination = new Uint8Array(module.instance.exports.memory.buffer, address);
        textEncoder.encodeInto(nullTerminatedString, destination);

        run(address);
    });
};

(async () => {
    const module = await WebAssembly.instantiate(await fs.promises.readFile("./string-example.wasm"));

    // String used for testing (from command line or hard-coded)
    const testString = process.argv[2] ?? "How many letter a's are there in this string? Three!";
    withStringInInstanceMemory(module, testString, (stringAddress) => {
        const result = module.instance.exports.countAs(stringAddress);
        console.log(result);
    });
})();
