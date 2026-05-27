import { TreeItem } from "@/type"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertFilestoTreeItems (files:{[path:string]:string}):TreeItem[]{

  return []


}
