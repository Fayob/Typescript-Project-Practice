// Drag and Drop Interfaces

export interface Draggable {
    dragStartHandler(event: DragEvent): void
    dragEndHandler(event: DragEvent): void
}

export interface DragTarget {
    dragOverHandler(event:DragEvent): void
    dropHandler(event: DragEvent): void
    dragLeaveHandler(event: DragEvent): void
}

    // Validation
interface Validation{
    value: string | number
    required?: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
}

// Validation function here
function validates(validatedInput: Validation){
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

// Autobind decorator
function Bind(_: any, _1: string, descriptor: PropertyDescriptor){
    // console.log(descriptor);
    const originalDescriptor = descriptor.value
    const newDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get(){
            const bind = originalDescriptor.bind(this)
            return bind
        }
    }
    return newDescriptor
}

enum ProjectStatus {
    Active, Finished
}

// Project Class
class Project{
    constructor(
        public id: string, 
        public title: string, 
        public description: string, 
        public people: number,  
        public status: ProjectStatus 
        ){}
}

// Project State Management
type Listener<T> = (item: T[]) => void

// Base class for State
class State<T> {
    protected listener: Listener<T>[] = []

    addListener(listenerFn: Listener<T>){
        this.listener.push(listenerFn)
    }
}

class ProjectState extends State<Project> {
    private projects: Project[] = []
    private static instance: ProjectState

    private constructor(){
        super()
    }

    static getInstance (){
        if (this.instance){
            return this.instance
        }
        this.instance = new ProjectState()
        return this.instance
    }

    addProject(title: string, description: string, numOfPeople: number){
        const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active)
        this.projects.push(newProject)
        this.updateListener()
    }

    moveProject(projectId: string, newStatus: ProjectStatus){
        const project = this.projects.find(pro => pro.id === projectId)
        if (project && project.status !== newStatus){
            project.status = newStatus
            this.updateListener()
        }
    }

    private updateListener(){
        for (const listenerFn of this.listener){
            listenerFn(this.projects.slice())
        }
    }
}

const projectState = ProjectState.getInstance()

abstract class Component <T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement
    hostElement: T
    element: U

    constructor(templateId: string, hostElementId: string, insertAtStart:boolean, newElementId?: string){
        this.templateElement = <HTMLTemplateElement>document.getElementById(templateId)
        this.hostElement = <T>document.getElementById(hostElementId)

        const importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as U
        if (newElementId){
            this.element.id = newElementId
        }
        this.attach(insertAtStart)
    }

    private attach (insertAtBeginning: boolean) {
        this.hostElement.insertAdjacentElement(insertAtBeginning? "afterbegin": "beforeend", this.element)
    }

    // abstract configure?(): void // to make it optional that other classes that extends from this class won't be forced to have the function
    abstract configure(): void
    abstract renderContent(): void
}

// ProjectItem Class
class ProjectItems extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
    private project: Project

    get persons (){
        if (this.project.people === 1){
            return "1 Person"
        }
        return `${this.project.people} Persons`
    }

    constructor(hostId: string, project: Project){
        super("single-project", hostId, false,project.id)
        this.project = project

        this.configure()
        this.renderContent()
    }

    @Bind
    dragStartHandler(event: DragEvent){
        event.dataTransfer!.setData("text/plain", this.project.id)
        event.dataTransfer!.effectAllowed = "move"
        
    }

    dragEndHandler(event: DragEvent){
        console.log("Drag end");
    }

    configure(){
        this.element.addEventListener("dragstart", this.dragStartHandler)
        this.element.addEventListener("dragend", this.dragEndHandler)
    }

    renderContent(){
        this.element.querySelector("h2")!.textContent = this.project.title
        this.element.querySelector("h4")!.textContent = this.project.people.toString() + (this.project.people === 1? " person Assigned": " Persons Assigned")
        // this.element.querySelector("h4")!.textContent = this.persons + " Assigned"
        this.element.querySelector("p")!.textContent = this.project.description
    }
}

// Project List Class
class ProjectList extends Component <HTMLDivElement, HTMLElement> implements DragTarget {
    assignProject: Project[]

    constructor (private type: "active" | "finished"){
        super("project-list", "app", false, `${type}-projects`)
        // this.templateElement = <HTMLTemplateElement>document.getElementById("project-list")
        // this.hostElement = <HTMLDivElement>document.getElementById("app")
        this.assignProject = []

        // const importedNode = document.importNode(this.templateElement.content, true)
        // this.element = importedNode.firstElementChild as HTMLElement
        // this.element.id = `${this.type}-projects`

        // projectState.addListener((projects: Project[])=>{
        //     const relevantProjects = projects.filter(pro => {
        //         if(this.type === "active"){
        //             return pro.status === ProjectStatus.Active
        //         } 
        //             return pro.status === ProjectStatus.Finished
        //     })
        //     this.assignProject = relevantProjects
        //     this.renderProjects()
        // })

        // this.attach()
        this.configure()
        this.renderContent()
    }

    @Bind
    dragOverHandler(event: DragEvent){
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain"){
            event.preventDefault()
            const listEl = this.element.querySelector("ul")!
            listEl.classList.add("droppable")
        }
    }

    @Bind
    dropHandler(event: DragEvent){
        const prjId = event.dataTransfer!.getData("text/plain")
        projectState.moveProject(prjId, this.type === "active"? ProjectStatus.Active : ProjectStatus.Finished )
    }

    @Bind
    dragLeaveHandler(event: DragEvent){
        const listEl = this.element.querySelector("ul")!
        listEl.classList.remove("droppable")
    }

    configure(){
        this.element.addEventListener("dragover", this.dragOverHandler)
        this.element.addEventListener("dragleave", this.dragLeaveHandler)
        this.element.addEventListener("drop", this.dropHandler)
        projectState.addListener((projects: Project[])=>{
            const relevantProjects = projects.filter(pro => {
                if(this.type === "active"){
                    return pro.status === ProjectStatus.Active
                } 
                    return pro.status === ProjectStatus.Finished
            })
            this.assignProject = relevantProjects
            this.renderProjects()
        })
    }

    renderContent (){
        const listId = `${this.type}-projects-list`
        this.element.querySelector("ul")!.id = listId
        this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS"
    }
    // private attach () {
    //     this.hostElement.insertAdjacentElement("beforeend", this.element)
    // }

    private renderProjects(){
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        listEl.innerHTML = ""
        for (const projectItem of this.assignProject){
           new ProjectItems(this.element.querySelector("ul")!.id, projectItem)
    }
  }
}

// ProjectInput Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

const projectInput = new ProjectInput()

const activeProject = new ProjectList("active")
const finishedProject = new ProjectList("finished")

