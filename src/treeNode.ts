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
    canInsertAsDescendant(descendent: TreeNode): boolean {
        if (this.id === descendent.id) {
            return false;
        }

        // use for loop instead of forEach, forEach's function boundary inhibits proper return statements
        for (let index = 0; index < this.marriages.length; index++) {
            const marriage = this.marriages[index];

            if (marriage.spouse?.id === descendent.id) {
                return false;
            }

            if (marriage.children.map(child => child.id).includes(descendent.id)) {
                this._overwriteChild(marriage, descendent);
                return true;
            }
        }
        return false;
    }
    private _overwriteChild(marriage: TreeNodeMarriage, newChild: TreeNode): void {
        const index = marriage.children.findIndex(child => child.id === newChild.id);
        marriage.children.splice(index, 1, newChild);
    }
}

export default TreeNode;