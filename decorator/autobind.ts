
    // Autobind decorator
export function Bind(_: any, _1: string, descriptor: PropertyDescriptor){
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