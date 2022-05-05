
    // Validation
 export interface Validation{
    value: string | number
    required?: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
}

// Validation function here
export function validates(validatedInput: Validation){
    let isValid = true
    if(validatedInput.required){
        isValid = isValid && validatedInput.value.toString().trim().length !== 0
    }
    if (validatedInput.minLength != null && typeof validatedInput.value === "string"){
        isValid = isValid && validatedInput.value.length >= validatedInput.minLength
    }
    if (validatedInput.maxLength != null && typeof validatedInput.value === "string"){
        isValid = isValid && validatedInput.value.length <= validatedInput.maxLength
    }
    if (validatedInput.min != null && typeof validatedInput.value === "number"){
        isValid = isValid && validatedInput.value >= validatedInput.min
    }
    if (validatedInput.max != null && typeof validatedInput.value === "number"){
        isValid = isValid && validatedInput.value <= validatedInput.max
    }
    return isValid
}