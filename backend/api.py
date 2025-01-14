import os
from pathlib import Path
from typing import Dict, Any, Optional, Union

from ceylon_rag.interfaces.schemas import QueryResult
from rag.app import CodeAnalysisRAG

# Global state to maintain RAG instance
_rag = None
_initialized = False


async def open_project(file_path: Union[str, Path]):
    """Open a new project and reset the RAG system"""
    global _initialized
    print(file_path)
    _initialized = False
    await initialize_rag()


async def initialize_rag(config: Optional[Dict[str, Any]] = None) -> Dict[str, str]:
    """Initialize the RAG system with optional custom configuration"""
    global _rag, _initialized

    if _initialized:
        return {"status": "RAG system already initialized"}

    # Default configuration if none provided
    default_config = {
        "llm": {
            "type": "ollama",
            "model_name": "phi3.5:latest"
            # "type": "openai",
            # "model_name": "gpt-4",
            # "api_key": os.getenv("OPENAI_API_KEY")
        },
        "embedder": {
            "type": "ollama",
            "model_name": "nomic-embed-text"
            # "type": "openai",
            # "model_name": "text-embedding-3-small",
            # "api_key": os.getenv("OPENAI_API_KEY")
        },
        "vector_store": {
            "type": "lancedb",
            "db_path": "./data/lancedb",
            "table_name": "code_documents"
        },
        "chunk_size": 1000,
        "chunk_overlap": 200,
        "excluded_dirs": [
            "venv", "node_modules", ".git", "__pycache__",
            "build", "dist", "tests/fixtures"
        ],
        "excluded_files": [
            "setup.py", "requirements.txt", "package.json",
            ".env", ".env.local"
        ],
        "excluded_extensions": [
            ".pyc", ".pyo", ".pyd", ".log", ".csv", ".json"
        ]
    }

    final_config = config if config else default_config
    _rag = CodeAnalysisRAG(final_config)
    await _rag.initialize()
    _initialized = True

    return {"status": "RAG system initialized successfully"}


async def process_codebase(root_path: Union[str, Path],
                           recursive: bool = True) -> Dict[str, Any]:
    """Process and index a codebase from the given path"""
    global _rag, _initialized

    if not _initialized:
        raise RuntimeError("RAG system not initialized. Call initialize_rag() first.")

    try:
        documents = await _rag.process_codebase(root_path, recursive)
        await _rag.index_code(documents)

        return {
            "status": "success",
            "processed_documents": len(documents),
            "message": f"Successfully processed and indexed {len(documents)} code segments"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": f"Error processing codebase: {str(e)}"
        }


async def analyze_code(question: str,
                       filter_criteria: Optional[Dict[str, Any]] = None,
                       top_k: int = 5) -> Dict[str, Any]:
    """Analyze code using the RAG system"""
    global _rag, _initialized

    if not _initialized:
        raise RuntimeError("RAG system not initialized. Call initialize_rag() first.")

    try:
        result: QueryResult = await _rag.analyze_code(
            question=question,
            filter_criteria=filter_criteria,
            top_k=top_k
        )

        return {
            "status": "success",
            "response": result.response,
            "sources": [
                {
                    "file_path": doc.metadata.get("file_path"),
                    "language": doc.metadata.get("language"),
                    "snippet": doc.content[:200] + "..."  # First 200 chars of each source
                }
                for doc in result.source_documents
            ],
            "metadata": result.metadata
        }

    except Exception as e:
        return {
            "status": "error",
            "message": f"Error analyzing code: {str(e)}"
        }


async def close() -> Dict[str, str]:
    """Clean up RAG system resources"""
    global _rag, _initialized

    if _rag:
        await _rag.close()
        _initialized = False
        return {"status": "RAG system resources cleaned up"}
    return {"status": "No RAG system to clean up"}
