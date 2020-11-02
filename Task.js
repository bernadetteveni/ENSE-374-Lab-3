export default class Task{
    constructor(name, owner, creator, done, cleared){
        this._id = Task.incrementId();
        this.name = name;
        this.owner = owner;
        this.creator = creator;
        this.done = done;
        this.cleared = cleared;
    }
    static incrementId(){
        if(!this.latestId){
            this.latestId = 1;
        }
        else{
            this.latestId++;
        }
        return this.latestId;
    }
}