import TreeNode from "./treeNode";

interface SeederOptions {
    class?: (node: TreeNode) => string;
}

export default SeederOptions;