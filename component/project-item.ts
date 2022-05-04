// /// <reference path="base-component.ts" />
// /// <reference path="../decorator/autobind.ts" />
// /// <reference path="../models/drag-drop.ts" />
// /// <reference path="../models/project.ts" />

import Component from "./base-component"
import {Bind} from "../decorator/autobind"
import { Draggable} from "../models/drag-drop"
import { Project} from "../models/project"


    // ProjectItem Class
export class ProjectItems extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
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