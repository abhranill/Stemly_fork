# RAG Academy

A single-file, interactive learning website that introduces
**Retrieval-Augmented Generation (RAG)** from beginner to intermediate
level. It explains the concepts behind document retrieval and grounded
language-model answers, with mini demos, code examples, a learning
roadmap, and a knowledge check.

## Features

-   Responsive dark-themed interface with topic navigation
-   Search across the learning guide
-   Beginner-friendly explanations of the RAG pipeline
-   Coverage of document ingestion, chunking, embeddings, vector
    databases, retrieval, reranking, and grounded generation
-   Advanced RAG patterns, evaluation, security, and common failure
    modes
-   Interactive chunking, cosine-similarity, and toy retrieval
    demonstrations
-   Example project architecture and Python pseudocode
-   Learning checklist with progress tracking
-   Short knowledge-check quiz

## Topics Covered

1.  What is RAG?
2.  LLMs and context windows
3.  Indexing and query-time pipeline
4.  Document ingestion and metadata
5.  Chunking strategies
6.  Embeddings and similarity
7.  Vector databases and ANN search
8.  Dense, sparse, and hybrid retrieval
9.  Reranking
10. Grounded generation and citations
11. Advanced RAG architectures
12. RAG evaluation
13. Security, privacy, and governance
14. Tools and frameworks
15. Building a PDF question-answering project
16. Learning roadmap and glossary

## Getting Started

This project does not require a build step or package installation.

1.  Download or clone the project.
2.  Locate `rag-academy.html`.
3.  Open the file in a modern browser such as Chrome, Firefox, or Edge.
4.  Use the sidebar to navigate topics and try the interactive demos.

## Project Structure

``` text
rag-academy/
└── rag-academy.html    # Complete website: markup, styles, content, and JavaScript
```

## Technologies

-   HTML5
-   CSS3
-   Vanilla JavaScript

No frontend framework or external JavaScript library is required. The
learning guide is contained in one HTML file.

## Interactive Demos

-   **Chunking demo:** Change chunk length and overlap to see how text
    is divided.
-   **Similarity demo:** Adjust two illustrative vectors and view cosine
    similarity.
-   **Retrieval demo:** Search a small sample knowledge base using a
    simplified keyword-overlap score.
-   **Checklist and quiz:** Track learning progress and check
    understanding.

The similarity and retrieval demos are educational illustrations, not
production embedding or vector-database implementations.

## Important Note

This website is an educational guide, not a production RAG application.
Its Python pipeline is conceptual pseudocode; specific loader,
embedding, vector-store, and LLM APIs depend on the libraries and
providers you choose. Verify current package documentation before using
them in a real project.

## Future Improvements

-   Add a working backend for PDF upload and indexing
-   Connect an embedding model and persistent vector database
-   Add real semantic and hybrid retrieval
-   Implement reranking and source-grounded citations
-   Add user authentication and document-level permissions
-   Create an evaluation dataset and quality dashboard
-   Add streaming responses and chat history
