// Assorted useful functions

export const getNextLetter = (letter, language) => {
    
    console.log(letter, language);
    console.log(language[0])
    const index = language.indexOf(letter)
    console.log(index);
    if (index + 1 < language.length) {
        return language[index+1]
    } else{
        return null;
    }
}