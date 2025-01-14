import {useState} from 'react'
import {Play, Search} from 'lucide-react'
import {Button} from "@/components/ui/button.tsx"
import {Textarea} from "@/components/ui/textarea.tsx"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx"
import {Card, CardContent} from "@/components/ui/card.tsx"
import {ScrollArea} from "@/components/ui/scroll-area.tsx"
import {ConfigForm} from "@/pages/project/dashboard/components/config-form.tsx";
import {FileTree} from "@/pages/project/dashboard/components/file-tree.tsx";

export default function CodeAnalysisUI() {
    const [config, setConfig] = useState({
        llmModel: 'gpt-4',
        embedder: 'nomic-embed-text',
        chunkSize: '1000',
        overlap: '200'
    })
    const [query, setQuery] = useState('')
    const [results, setResults] = useState('')
    const [status, setStatus] = useState('Ready')
    const [isProcessing, setIsProcessing] = useState(false)

    const fileTree = [
        {
            name: 'src',
            type: 'folder' as const,
            expanded: true,
            children: [
                {
                    name: 'components', type: 'folder' as const, children: [
                        {name: 'CodeAnalysis.js', type: 'file' as const},
                        {name: 'FileTree.js', type: 'file' as const}
                    ]
                },
                {
                    name: 'utils', type: 'folder' as const, children: [
                        {name: 'helpers.js', type: 'file' as const}
                    ]
                },
                {name: 'App.js', type: 'file' as const}
            ]
        },
        {
            name: 'public',
            type: 'folder' as const,
            children: [
                {name: 'index.html', type: 'file' as const}
            ]
        }
    ]

    const handleProcess = () => {
        setIsProcessing(true)
        setStatus('Processing codebase...')
        // Simulate processing
        setTimeout(() => {
            setIsProcessing(false)
            setStatus('Processing complete')
        }, 2000)
    }

    const handleAnalyze = () => {
        if (!query.trim()) {
            setStatus('Please enter a query')
            return
        }
        setStatus('Analyzing code...')
        // Simulate analysis
        setTimeout(() => {
            setResults('Sample analysis results would appear here...')
            setStatus('Analysis complete')
        }, 1500)
    }

    return (
        <div className="h-screen flex flex-col bg-background">
            <header className="bg-card border-b p-4">
                <h1 className="text-2xl font-bold text-card-foreground">Code Analysis RAG</h1>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <div className="w-80 border-r bg-card">
                    <Tabs defaultValue="files" className="w-full">
                        <TabsList className="w-full">
                            <TabsTrigger value="files" className="w-1/2">Files</TabsTrigger>
                            <TabsTrigger value="config" className="w-1/2">Config</TabsTrigger>
                        </TabsList>
                        <TabsContent value="files" className="p-4">
                            <Button
                                className="w-full mb-4"
                                onClick={handleProcess}
                                disabled={isProcessing}
                            >
                                <Play className="w-4 h-4 mr-2"/>
                                Process Codebase
                            </Button>
                            <ScrollArea className="h-[calc(100vh-200px)]">
                                <FileTree items={fileTree}/>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="config" className="p-4">
                            <ConfigForm config={config} setConfig={setConfig}/>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                    <Card className="m-4">
                        <CardContent className="p-4">
                            <div className="flex space-x-2">
                                <Textarea
                                    className="flex-1 resize-none"
                                    placeholder="Enter your query here..."
                                    rows={3}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <Button onClick={handleAnalyze}>
                                    <Search className="w-4 h-4 mr-2"/>
                                    Analyze
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="flex-1 m-4 overflow-hidden">
                        <CardContent className="p-4 h-full">
                            <ScrollArea className="h-full">
                <pre className="whitespace-pre-wrap text-sm">
                  {results || 'Analysis results will appear here...'}
                </pre>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <div className="px-4 py-2 border-t bg-muted text-sm text-muted-foreground">
                        {status}
                    </div>
                </div>
            </div>
        </div>
    )
}

