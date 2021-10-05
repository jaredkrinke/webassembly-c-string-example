#include <malloc.h>

#define WASM_EXPORT_AS(name) __attribute__((export_name(name)))
#define WASM_EXPORT(symbol) WASM_EXPORT_AS(#symbol) symbol

// Memory management helpers
unsigned char* WASM_EXPORT(allocate)(unsigned int size) {
    return (unsigned char*)malloc(size);
}

void WASM_EXPORT(deallocate)(unsigned char* allocation) {
    free(allocation);
}

// Example of passing a string in
unsigned int WASM_EXPORT(count_as)(const char* string) {
    unsigned int numberOfAs = 0;
    while (*string != '\0') {
        if (*string == 'a') {
            ++numberOfAs;
        }
        string++;
    }
    return numberOfAs;
}

// Example of returning a dynamic string
typedef struct {
    unsigned int length;
    char buffer[];
} wasm_string;

wasm_string* WASM_EXPORT(write_bs)(unsigned int count) {
    // Allocate space for the string length and content (note: no null terminator)
    wasm_string* str = (wasm_string*)malloc(sizeof(unsigned int) + count);
    str->length = count;

    // Fill in the string
    char* c = &str->buffer[0];
    for (unsigned int i = 0; i < count; i++) {
        *c = 'b';
        ++c;
    }
    return str;
}
