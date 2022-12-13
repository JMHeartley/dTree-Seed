import Member from "./member";

interface SeederOptions {
    class?: (member: Member) => string;
    textClass?: (member: Member) => string;
}

export default SeederOptions;