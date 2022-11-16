import Member from "./member";
import TreeNodeMarriage from "./treeNodeMarriage";

class TreeNode {
    constructor(member: Member) {
        this.id = member.id;
        this.name = member.name;
        this.marriages = new Array<TreeNodeMarriage>();
    }
    id: number;
    name: string;
    marriages: TreeNodeMarriage[];
}

export default TreeNode;