#include <malloc.h>

#define WASM_EXPORT_AS(name) __attribute__((export_name(name)))
#define WASM_EXPORT(symbol) WASM_EXPORT_AS(#symbol) symbol

unsigned char* WASM_EXPORT(allocate)(unsigned int size) {
    return (unsigned char*)malloc(size);
}

void WASM_EXPORT(deallocate)(unsigned char* allocation) {
    free(allocation);
}

unsigned int WASM_EXPORT(countAs)(const char* string) {
    unsigned int numberOfAs = 0;
    while (*string != '\0') {
        if (*string == 'a') {
            ++numberOfAs;
        }
        string++;
    }
    return numberOfAs;
}
