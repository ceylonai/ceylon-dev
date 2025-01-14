import {Box, CogIcon, Search} from 'lucide-react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"

export default function OpenPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-white container mx-auto p-4">
            <div className="flex h-[calc(100vh-2rem)]">
                {/* Left Sidebar */}
                <div className="w-64 bg-slate-100 p-2 dark:bg-slate-800">
                    <div className="mb-6 flex items-center space-x-2 p-2">
                        <div className="h-8 w-8 rounded bg-slate-200 p-1 dark:bg-slate-700">
                            <Box className="h-6 w-6 text-slate-800 dark:text-white"/>
                        </div>
                        <div>
                            <div className="font-medium">DEV - Friend</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">v 1.0.0</div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div
                            className="flex items-center justify-between px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-700">
                            <span>Settings</span>
                            <CogIcon className="h-4 w-4 text-slate-500 dark:text-slate-400"/>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    <div className="mb-6 flex items-center space-x-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400"/>
                            <Input
                                placeholder="Search projects"
                                className="h-9 bg-slate-100 pl-9 text-slate-700 placeholder-slate-500 dark:bg-slate-800 dark:text-slate-300 dark:placeholder-slate-400"
                            />
                        </div>
                        <Button
                            onClick={async () => {
                                console.log("open file dialog",  window.pywebview!.api)
                                console.log("open file dialog",  window.pywebview!.api.open_file_dialog)
                                console.log("open file dialog",  window)
                                const res =  await window.pywebview!.api.open_file_dialog()
                                console.log("open file dialog",  res)
                            }}
                            variant="secondary"
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">
                            Open Project
                        </Button>
                    </div>

                    {/* Project List */}
                    <div className="space-y-2">
                        {[
                            {
                                name: "ceylon-ai-rag",
                                path: "G:\\Projects\\myrag\\ceylon-ai-rag",
                                icon: "C",
                            },
                            {
                                name: "rk-core",
                                path: "L:\\projects\\Ceylon\\rk-core",
                                icon: "R",
                            },
                            {
                                name: "ceylon-app",
                                path: "G:\\Projects\\myrag\\ceylon-app",
                                icon: "C",
                            },
                            {
                                name: "ceylon-ai-app",
                                path: "G:\\Projects\\myrag\\ceylon-ai-app",
                                icon: "C",
                            },
                            {
                                name: "mistral",
                                path: "F:\\projects\\research\\mistral",
                                icon: "M",
                            },
                        ].map((project) => (
                            <div
                                key={project.name}
                                className="group flex items-center space-x-3 rounded p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
                            >
                                <div
                                    className="flex h-6 w-6 items-center justify-center rounded bg-slate-300 text-slate-800 dark:bg-slate-600 dark:text-white"
                                >
                                    {project.icon}
                                </div>
                                <div>
                                    <div>{project.name}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">{project.path}</div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="ml-auto hidden h-6 w-6 hover:bg-slate-300 group-hover:block dark:hover:bg-slate-600"
                                >
                                    <span className="sr-only">More options</span>
                                    <svg
                                        className="h-4 w-4"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <circle cx="8" cy="2" r="1.5"/>
                                        <circle cx="8" cy="8" r="1.5"/>
                                        <circle cx="8" cy="14" r="1.5"/>
                                    </svg>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}