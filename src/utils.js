// Assorted useful functions

export const getNextLetter = (letter) => {
    if (letter === 'z'){
        return 'a';
    }
    return String.fromCharCode(letter.charCodeAt(0) + 1);
}