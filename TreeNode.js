class TreeNode{
    constructor(name){
        this.name = name;
        this.children = [];
    }


    /**
     * Adds an existing node as a child item
     * @param {TreeNode} node 
     */
    addChildNode(node){
        if(!(node instanceof TreeNode)){
            throw new TypeError(`Expected node to be of type treeNode.`, 'TreeNode.js');
        }else{
            this.children.push(node);
        }
    }

    findMaxDepth(){
        if(this.children.length === 0){
            return 0;
        }else{
            return 1+this.children
                .map(c => c.findMaxDepth())
                .reduce((max, val) => max > val ? max : val, 0);
        }
    }

    findTotalNestedDepths(parentDepth = -1){
        let thisDepth = parentDepth + 1
        if(this.children.length === 0)
            return thisDepth;
        else {
            return thisDepth + this.children
                .map(c => c.findTotalNestedDepths(thisDepth))
                .reduce((acc, val) => acc+ val, 0);
        }
    }
    
    /**
     * 
     * @param {TreeNode} rootNode Node to begin search
     * @param {string} searchName Node Name to search 
     */
    static bredthFirstSearch(rootNode, searchName){
        let path = []; 
        if(rootNode.name === searchName){
            return [rootNode.name];
        }else{
            for(let c of rootNode.children){
                let cBFS = TreeNode.bredthFirstSearch(c,searchName);
                if(cBFS.length >0){
                    return [rootNode.name, ...cBFS];
                }
            }
        }
        return [];
    }
    
}


exports.TreeNode = TreeNode;