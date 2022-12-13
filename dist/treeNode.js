"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const treeNodeMarriage_1 = __importDefault(require("./treeNodeMarriage"));
class TreeNode {
    constructor(member, options) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.id = member.id;
        this.name = member.name;
        this.class = (_b = (_a = options === null || options === void 0 ? void 0 : options.class) === null || _a === void 0 ? void 0 : _a.call(options, member)) !== null && _b !== void 0 ? _b : "";
        this.textClass = (_d = (_c = options === null || options === void 0 ? void 0 : options.textClass) === null || _c === void 0 ? void 0 : _c.call(options, member)) !== null && _d !== void 0 ? _d : "";
        this.depthOffset = (_e = member.depthOffset) !== null && _e !== void 0 ? _e : -1;
        this.marriages = new Array();
        this.extra = (_g = (_f = options === null || options === void 0 ? void 0 : options.extra) === null || _f === void 0 ? void 0 : _f.call(options, member)) !== null && _g !== void 0 ? _g : {};
    }
    canInsertAsDescendant(descendent) {
        var _a;
        if (this.id === descendent.id) {
            return false;
        }
        for (let index = 0; index < this.marriages.length; index++) {
            const marriage = this.marriages[index];
            if (((_a = marriage.spouse) === null || _a === void 0 ? void 0 : _a.id) === descendent.id) {
                return false;
            }
            if (marriage.children.map(child => child.id).includes(descendent.id)) {
                this._overwriteChild(marriage, descendent);
                return true;
            }
            if (this._canInsertAsDescendantByPivotingOnAMarriage(marriage, descendent)) {
                return true;
            }
            if (marriage.children.some((child) => child.canInsertAsDescendant(descendent))) {
                return true;
            }
        }
        return false;
    }
    _overwriteChild(marriage, newChild) {
        const index = marriage.children.findIndex(child => child.id === newChild.id);
        marriage.children.splice(index, 1, newChild);
    }
    _canInsertAsDescendantByPivotingOnAMarriage(marriage, descendent) {
        if (marriage.spouse === undefined) {
            return false;
        }
        const childIds = marriage.children.map(child => child.id);
        if (!descendent.marriages.map(m => { var _a; return (_a = m.spouse) === null || _a === void 0 ? void 0 : _a.id; })
            .some(id => childIds.includes(id))) {
            return false;
        }
        const marriageToPivotOn = descendent.marriages.find(m => { var _a; return childIds.includes((_a = m.spouse) === null || _a === void 0 ? void 0 : _a.id); });
        const newDescendent = this._pivotOnMarriage(marriageToPivotOn, descendent);
        this._overwriteChild(marriage, newDescendent);
        return true;
    }
    _pivotOnMarriage(marriage, descendent) {
        const newDescendent = marriage === null || marriage === void 0 ? void 0 : marriage.spouse;
        const newMarriage = new treeNodeMarriage_1.default();
        descendent.marriages = new Array();
        newMarriage.spouse = descendent;
        newMarriage.children = marriage === null || marriage === void 0 ? void 0 : marriage.children;
        newDescendent.marriages.push(newMarriage);
        return newDescendent;
    }
}
exports.default = TreeNode;
//# sourceMappingURL=treeNode.js.map