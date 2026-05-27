// this file contains utility functions for the project
import { type TreeItem } from "@/type"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"



// this function is uses clsx and tailwind-merge to conditionally apply classnames and merge tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// this function converts a flat object of file paths to nested tree structure
// input: an objecct where keys and values are string
export function convertFilestoTreeItems(files: { [path: string]: string }): TreeItem[] {

  // an object where key is string and value is either string(file content) or another Tree Node object (subdirectory)
  interface TreeNode {
    [key: string]: TreeNode | string;
  }
  const tree: TreeNode = {}
  const sortedPaths = Object.keys(files).sort()
  
  //for each file path, split it into parts, creating nested objects for directories and assigning file content to the leaf nodes
  for (const filePath of sortedPaths) {
    let current = tree
    const parts = filePath.split('/')

    for (let j = 0; j < parts.length - 1; j++) {
      const part = parts[j]

      if (!current[part]) {
        current[part] = {}
      }
      current = current[part] as TreeNode

    }

    const fileName = parts[parts.length - 1]; // 改这里

    current[fileName] = files[filePath];      // 改这里


  }

  // this function recursively converts nested objects into the TreeItem format 
  function convertNode(node: TreeNode, name?: string): TreeItem[] | TreeItem {
    const entries = Object.entries(node)
    if (entries.length === 0) {
      return name || ""
    }
    const children: TreeItem[] = []
    for (const [key, value] of entries) {
      if (value == null) {
        children.push(key)
      } else {
        const subTree = convertNode(value as TreeNode, key)
        if (Array.isArray(subTree)) {
          children.push([key, ...subTree])

        } else {
          children.push([key, subTree])
        }

      }
    }
    return children

  }


  const result = convertNode(tree)
  return Array.isArray(result) ? result : [result]


}
