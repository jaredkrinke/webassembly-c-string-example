#include <malloc.h>

#define WASM_EXPORT_AS(name) __attribute__((export_name(name)))
#define WASM_EXPORT(symbol) WASM_EXPORT_AS(#symbol) symbol

// Memory management helpers
void* WASM_EXPORT(allocate)(unsigned int size) {
    return malloc(size);
}

void WASM_EXPORT(deallocate)(void* allocation) {
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

const char* WASM_EXPORT(write_bs)(unsigned int count) {
    // Allocate space for the string, plus a null terminator
    char* str = (char*)malloc(count + 1);

    // Fill in the string and null terminator
    char* c = str;
    for (unsigned int i = 0; i < count; i++) {
        *c = 'b';
        ++c;
    }
    *c = '\0';

    return str;
}
