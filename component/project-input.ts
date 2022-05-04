// /// <reference path="base-component.ts" />
// /// <reference path="../decorator/autobind.ts" />
// /// <reference path="../utils/validation.ts" />
// /// <reference path="../state/project-state.ts" />

import Component from "./base-component"
import {Bind} from "../decorator/autobind"
// import {Bind as Autobind} from "../decorator/autobind.js" // it can also be imported like this as an alias
import {projectState} from "../state/project-state"
import {validates, Validation} from "../utils/validation"
// import * as Valid from "../utils/validation.js" // it can also be imported like this as a group and use dot(.) notation (like Valid.validates) to access its value

    // ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    // templateElement: HTMLTemplateElement
    // hostElement: HTMLDivElement
    // element: HTMLFormElement
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    peopleInputElement: HTMLInputElement

    constructor(){
        super("project-input", "app", true, "user-input")
        // this.templateElement = <HTMLTemplateElement>document.getElementById("project-input")
        // this.hostElement = <HTMLDivElement>document.getElementById("app")

        // const importedNode = document.importNode(this.templateElement.content, true)
        // this.element = importedNode.firstElementChild as HTMLFormElement
        // this.element.id = "user-input"

        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement
        this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement
        
        this.configure()
        // this.attach()
    }

    configure(){
        this.element.addEventListener("submit", this.submitHandler)
    }

    renderContent(){}

    private gatherUserInfo(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value
        const enteredDescription = this.descriptionInputElement.value
        const enteredPeople = this.peopleInputElement.value

        const titleValidator: Validation = {
            value: enteredTitle,
            required: true
        }
        const descriptionValidator: Validation = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }
        const peopleValidator: Validation = {
            value: enteredPeople,
            required: true,
            min: 1,
            max: 8,
        }
        
        // if (enteredTitle.trim().length === 0 || enteredDescription.trim().length === 0 || enteredPeople.trim().length === 0) {
        if ( !validates(titleValidator) || !validates(descriptionValidator)  || !validates(peopleValidator) ){
          alert("Invalid Input! Please fill all required form")
          return
        } else {
          return [enteredTitle,enteredDescription ,parseFloat(enteredPeople)]
        }
    }

    private clearInputs(){
        this.titleInputElement.value = ""
        this.descriptionInputElement.value = ""
        this.peopleInputElement.value = ""
    }

    @Bind
    private submitHandler(event: Event){
        event.preventDefault()
        // console.log(this.titleInputElement.value);
        const userInput = this.gatherUserInfo()
        if (Array.isArray(userInput)){
            const [title, desc, people] = userInput
            // console.log(title, desc, people);
            projectState.addProject(title, desc, people)
            this.clearInputs()
        }
    }
    
   
    // private attach (){
    //     this.hostElement.insertAdjacentElement("afterbegin", this.element)
    // }
}