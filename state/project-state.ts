import {Project, ProjectStatus} from "../models/project"


    // Project State Management
 type Listener<T> = (item: T[]) => void

// Base class for State
 class State<T> {
    protected listener: Listener<T>[] = []

    addListener(listenerFn: Listener<T>){
        this.listener.push(listenerFn)
    }
}
 
export class ProjectState extends State<Project> {
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

export const projectState = ProjectState.getInstance()


