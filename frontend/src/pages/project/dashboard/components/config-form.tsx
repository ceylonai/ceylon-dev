import React from 'react'
import {Input} from "@/components/ui/input.tsx"
import {Label} from "@/components/ui/label.tsx"

interface Config {
    llmModel: string
    embedder: string
    chunkSize: string
    overlap: string
}

interface ConfigFormProps {
    config: Config
    setConfig: React.Dispatch<React.SetStateAction<Config>>
}

export const ConfigForm: React.FC<ConfigFormProps> = ({config, setConfig}) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="llmModel">LLM Model</Label>
                <Input
                    id="llmModel"
                    value={config.llmModel}
                    onChange={(e) => setConfig({...config, llmModel: e.target.value})}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="embedder">Embedder</Label>
                <Input
                    id="embedder"
                    value={config.embedder}
                    onChange={(e) => setConfig({...config, embedder: e.target.value})}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="chunkSize">Chunk Size</Label>
                <Input
                    id="chunkSize"
                    value={config.chunkSize}
                    onChange={(e) => setConfig({...config, chunkSize: e.target.value})}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="overlap">Overlap</Label>
                <Input
                    id="overlap"
                    value={config.overlap}
                    onChange={(e) => setConfig({...config, overlap: e.target.value})}
                />
            </div>
        </div>
    )
}

