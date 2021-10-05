const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

// Pass in a factory for an object with a "dispose" property and this will
// ensure "dispose" is called on the object after the provided lambda returns
// or throws
export const use = (create, run) => {
    const o = create();
    try {
        run(o);
    } finally {
        o.dispose();
    }
};

export const useInstanceAllocation = (module, create, run) => {
    use(() => {
        const address = create();
        return {
            address,
            dispose: () => module.instance.exports.deallocate(address),
        };
    }, run);
};

export const useInstanceString = (module, create, run) => {
    useInstanceAllocation(module, create, ({ address }) => {
        const buffer = module.instance.exports.memory.buffer;
        const encodedStringLength = (new Uint32Array(buffer, address, 1))[0];
        const encodedStringBuffer = new Uint8Array(buffer, address + 4, encodedStringLength); // Skip the 4 byte size
        const str = textDecoder.decode(encodedStringBuffer);
        run(str);
    })
};

const useNewInstanceAllocation = (module, size, run) => {
    return useInstanceAllocation(() => module.instance.exports.allocate(size), run);
};

export const useNewInstanceString = (module, str, run) => {
    // Encode the string (with null terminator) to get the required size
    const nullTerminatedString = str + "\0";
    const encodedString = textEncoder.encode(nullTerminatedString);

    // Allocate space in linear memory for the encoded string
    useNewInstanceAllocation(module, encodedString.length, (address) => {
        // Copy the string into the buffer
        const destination = new Uint8Array(module.instance.exports.memory.buffer, address);
        textEncoder.encodeInto(nullTerminatedString, destination);

        run(address);
    });
};
