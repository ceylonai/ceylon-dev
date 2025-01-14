import React from 'react'
import {Folder, FileText, ChevronRight, ChevronDown} from 'lucide-react'

interface FileTreeItem {
    name: string
    type: 'file' | 'folder'
    expanded?: boolean
    children?: FileTreeItem[]
}

interface FileTreeItemProps {
    item: FileTreeItem
    depth?: number
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({item, depth = 0}) => {
    const Icon = item.type === 'folder' ? Folder : FileText
    const ChevronIcon = item.expanded ? ChevronDown : ChevronRight

    return (
        <div className="select-none">
            <div
                className="flex items-center py-1 px-2 hover:bg-accent cursor-pointer rounded-sm"
                style={{paddingLeft: `${depth * 16}px`}}
            >
                {item.type === 'folder' && (
                    <ChevronIcon className="w-4 h-4 mr-1 text-muted-foreground"/>
                )}
                <Icon className="w-4 h-4 mr-2 text-primary"/>
                <span className="text-sm">{item.name}</span>
            </div>
            {item.type === 'folder' && item.expanded && item.children?.map((child, index) => (
                <FileTreeItem key={index} item={child} depth={depth + 1}/>
            ))}
        </div>
    )
}

interface FileTreeProps {
    items: FileTreeItem[]
}

export const FileTree: React.FC<FileTreeProps> = ({items}) => {
    return (
        <div>
            {items.map((item, index) => (
                <FileTreeItem key={index} item={item}/>
            ))}
        </div>
    )
}

