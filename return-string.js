import fs from "fs";

(async () => {
    const module = await WebAssembly.instantiate(await fs.promises.readFile("./string-example.wasm"));

    // String used for testing (from command line or hard-coded)
    const count = parseInt(process.argv[2] ?? "3");
    const address = module.instance.exports.write_bs(count);
    try {
        const buffer = module.instance.exports.memory.buffer;
        const encodedStringLength = (new Uint8Array(buffer, address)).indexOf(0);
        const encodedStringBuffer = new Uint8Array(buffer, address, encodedStringLength);
        const result = (new TextDecoder()).decode(encodedStringBuffer);
        console.log(result);
    } finally {
        module.instance.exports.deallocate(address);
    }
})();
