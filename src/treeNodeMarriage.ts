import TreeNode from "./treeNode";

class treeNodeMarriage {
    constructor() {
        this.spouse = null;
        this.children = new Array<TreeNode>();
    }
    spouse: TreeNode | null;
    children: TreeNode[];
}

export default treeNodeMarriage;