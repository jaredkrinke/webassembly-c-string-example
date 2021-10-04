#include <malloc.h>

#define WASM_EXPORT_AS(name) __attribute__((export_name(name)))
#define WASM_EXPORT(symbol) WASM_EXPORT_AS(#symbol) symbol

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
