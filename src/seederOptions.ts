import Member from "./member";

interface SeederOptions {
    class?: (member: Member) => string;
    textClass?: (member: Member) => string;
    extra?: (member: Member) => object;
}

export default SeederOptions;