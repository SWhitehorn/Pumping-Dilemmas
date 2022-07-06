// Assorted useful functions

export const getNextLetter = (letter, language) => {
    
    const index = language.indexOf(letter)
    console.log(index);
    if (index + 1 < language.length) {
        return language[index+1]
    } else{
        return language[0];
    }
}