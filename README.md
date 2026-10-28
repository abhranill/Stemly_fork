🎓 RAG Academy — Learn Retrieval-Augmented Generation

An interactive, beginner-friendly learning platform for mastering Retrieval-Augmented Generation (RAG), Large Language Models (LLMs), vector databases, semantic search, and modern AI retrieval systems.

RAG Academy is an educational web application designed to help developers, students, and AI enthusiasts understand how Retrieval-Augmented Generation works, why it matters, and how to build reliable AI-powered applications using external knowledge sources.

Instead of relying only on theoretical explanations, RAG Academy combines structured learning materials, interactive demonstrations, code examples, implementation guides, and knowledge checks to make complex AI concepts easier to understand.

Whether you're starting your journey in Generative AI or exploring advanced retrieval techniques, RAG Academy provides a structured path to learning the fundamentals and practical applications of RAG.

---

📌 Table of Contents

- "Overview" (#-overview)
- "Why RAG Academy?" (#-why-rag-academy)
- "Key Features" (#-key-features)
- "Topics Covered" (#-topics-covered)
- "How RAG Works" (#-how-rag-works)
- "Technology Stack" (#-technology-stack)
- "Project Structure" (#-project-structure)
- "Getting Started" (#-getting-started)
- "Installation" (#-installation)
- "Running the Project" (#-running-the-project)
- "Learning Roadmap" (#-learning-roadmap)
- "Example RAG Pipeline" (#-example-rag-pipeline)
- "Who Is This Project For?" (#-who-is-this-project-for)
- "Future Improvements" (#-future-improvements)
- "Contributing" (#-contributing)
- "License" (#-license)
- "Author" (#-author)

---

🌟 Overview

Large Language Models can generate remarkably useful responses, but they also have limitations.

They may produce incorrect information, lack access to private or domain-specific documents, or fail to incorporate information published after their training data was collected.

Retrieval-Augmented Generation (RAG) addresses these challenges by retrieving relevant information from an external knowledge source and supplying it to a language model as context when generating a response.

RAG Academy explains this process step by step, covering the components that make retrieval-based AI applications work.

The platform explores:

- How Large Language Models process information.
- Why context windows matter.
- How documents are prepared for retrieval.
- How text chunking affects retrieval quality.
- How embedding models represent semantic meaning.
- How vector databases store and search embeddings.
- How retrieval systems identify relevant information.
- How reranking improves search results.
- How retrieved information is used to generate grounded answers.
- How RAG applications can be evaluated, secured, and optimized.

The goal is to bridge the gap between understanding RAG theoretically and learning how to implement it in real-world applications.

---

💡 Why RAG Academy?

Learning modern AI development often requires understanding several interconnected technologies.

RAG Academy organizes these concepts into a structured learning experience.

The problem

Developers learning RAG frequently encounter challenges such as:

- Understanding the difference between traditional search and semantic search.
- Choosing appropriate document chunking strategies.
- Understanding embeddings and vector similarity.
- Selecting between dense, sparse, and hybrid retrieval.
- Improving the relevance of retrieved documents.
- Reducing hallucinations through grounded generation.
- Evaluating retrieval and generation quality.
- Understanding security risks in document-based AI systems.

The solution

RAG Academy aims to make these topics easier to learn through:

- Beginner-friendly explanations.
- A structured learning guide.
- Interactive demonstrations.
- Practical code examples.
- Example project architecture.
- Python pseudocode.
- A progress-tracking checklist.
- Short knowledge-check quizzes.

The vision: Make RAG easier to understand, easier to experiment with, and easier to implement.

---

✨ Key Features

📚 1. Structured Learning Guide

Explore RAG concepts through an organized learning path, progressing from introductory material to more advanced retrieval techniques.

🌙 2. Responsive Dark-Themed Interface

A dark-themed learning interface designed to provide a comfortable reading experience across supported screen sizes.

🔎 3. Searchable Learning Content

Search across the learning guide to find relevant topics and explanations without manually navigating every section.

🧠 4. Beginner-Friendly Explanations

Learn complex concepts through accessible explanations, terminology breakdowns, and examples.

🔄 5. Complete RAG Pipeline Coverage

Understand the major stages of a RAG application:

- Document ingestion.
- Text extraction and cleaning.
- Document chunking.
- Embedding generation.
- Index creation.
- Information retrieval.
- Optional reranking.
- Context construction.
- Answer generation.
- Evaluation.

💻 6. Interactive Demonstrations

Explore demonstrations designed to illustrate concepts such as chunking, cosine similarity, and retrieval behavior.

🐍 7. Python Pseudocode and Implementation Examples

Learn how RAG components can be implemented in Python, including the general logic behind indexing and retrieval.

🏗️ 8. Example Project Architecture

Understand how ingestion pipelines, retrieval components, language models, and application interfaces fit together in a typical RAG application.

✅ 9. Learning Checklist

Track your learning progress and identify topics that deserve further study.

📝 10. Knowledge-Check Quiz

Test your understanding of key RAG concepts through a short quiz.

📖 11. Advanced RAG Concepts

Explore advanced patterns and techniques, including:

- Hybrid retrieval.
- Reranking.
- Retrieval evaluation.
- Grounded generation.
- Security considerations.
- Common failure modes.

---

📖 Topics Covered

RAG Academy covers the following major learning areas.

1. Introduction to RAG

- What is Retrieval-Augmented Generation?
- Why RAG is useful.
- Limitations of language models.
- RAG versus traditional LLM applications.
- RAG versus fine-tuning.
- Common real-world applications.

2. Large Language Models and Context Windows

- What are Large Language Models?
- How prompts and context work.
- Tokenization fundamentals.
- Context-window limitations.
- Context construction.
- The importance of relevant information.

3. The Indexing and Query-Time Pipeline

Understand the two major stages of a RAG system.

Indexing pipeline:

- Collecting source documents.
- Extracting and cleaning text.
- Splitting documents into chunks.
- Generating embeddings.
- Storing searchable representations.

Query-time pipeline:

- Receiving a user query.
- Transforming the query when necessary.
- Retrieving relevant chunks.
- Reranking results when appropriate.
- Constructing the context.
- Generating a response.
- Evaluating the answer.

4. Document Ingestion and Metadata

- Loading documents from different sources.
- Extracting text.
- Cleaning document content.
- Handling metadata.
- Preserving document references.
- Tracking source information.
- Updating indexed documents.

5. Chunking Strategies

Learn why documents are divided into smaller pieces before indexing.

Topics include:

- Fixed-size chunking.
- Overlapping chunks.
- Sentence-based chunking.
- Paragraph-based chunking.
- Recursive text splitting.
- Structure-aware chunking.
- Semantic chunking.
- Choosing chunk sizes.
- Balancing context and retrieval precision.

6. Embeddings and Semantic Similarity

- What are embeddings?
- How text becomes a vector.
- Semantic representations.
- Embedding models.
- Vector dimensions.
- Cosine similarity.
- Similarity-based retrieval.
- Embedding model selection.

7. Vector Databases and Approximate Nearest-Neighbor Search

- What is a vector database?
- Vector storage and indexing.
- Similarity search.
- Exact versus approximate nearest-neighbor search.
- Metadata filtering.
- Indexing trade-offs.
- Retrieval performance.

8. Dense, Sparse, and Hybrid Retrieval

Dense retrieval: Uses vector representations to identify semantically similar content.

Sparse retrieval: Uses term-based representations and matching techniques, such as BM25.

Hybrid retrieval: Combines dense and sparse approaches to benefit from semantic matching and keyword relevance.

Learn when each approach is useful and why hybrid retrieval can improve search quality.

9. Reranking

- Why initial retrieval can return imperfect results.
- Candidate document selection.
- Cross-encoder reranking.
- Relevance scoring.
- Balancing retrieval quality and latency.
- Choosing the final context.

10. Grounded Generation

- Constructing prompts with retrieved context.
- Connecting answers to source documents.
- Reducing unsupported claims.
- Handling insufficient evidence.
- Source attribution.
- Limitations of grounding.

11. Advanced RAG Patterns

Explore techniques that extend basic retrieval pipelines:

- Query rewriting.
- Query expansion.
- Multi-query retrieval.
- Metadata-aware retrieval.
- Parent-child retrieval.
- Contextual retrieval.
- Multi-step retrieval.
- Agent-assisted retrieval workflows.

12. Evaluation and Optimization

Understand how to evaluate the individual components of a RAG application.

Retrieval evaluation:

- Precision@k.
- Recall@k.
- Mean Reciprocal Rank (MRR).
- Normalized Discounted Cumulative Gain (NDCG).

Generation evaluation:

- Answer relevance.
- Faithfulness to retrieved context.
- Correctness.
- Citation accuracy.
- Completeness.

Also explore latency, cost, and retrieval-quality trade-offs.

13. Security and Common Failure Modes

- Hallucinations.
- Missing or irrelevant context.
- Poor document chunking.
- Embedding mismatches.
- Retrieval failures.
- Prompt injection through retrieved documents.
- Sensitive information exposure.
- Access-control enforcement.
- Untrusted document handling.

14. Building a RAG Application

Bring the concepts together into a practical architecture involving:

- A document ingestion process.
- An embedding model.
- A vector index or database.
- A retrieval component.
- An optional reranker.
- An LLM.
- A user-facing application.
- Logging and evaluation.

---

🔄 How RAG Works

A typical RAG application has two major workflows.

A. Indexing Workflow

Before a user asks a question, the application prepares its knowledge source.

1. Document collection: Gather PDFs, text files, documentation, or other supported sources.
2. Text extraction: Convert source documents into usable text.
3. Text cleaning: Remove unnecessary formatting and normalize content where appropriate.
4. Chunking: Divide documents into manageable pieces.
5. Embedding generation: Convert chunks into vector representations.
6. Index storage: Store vectors alongside the associated text and metadata.

B. Query Workflow

When a user submits a question:

1. Receive the query: Accept the user's question.
2. Prepare the query: Normalize or rewrite it if necessary.
3. Retrieve relevant content: Search the index for potentially useful chunks.
4. Rerank results: Optionally reorder retrieved chunks by relevance.
5. Build the context: Select suitable evidence and assemble the prompt.
6. Generate an answer: Ask the language model to answer using the supplied context.
7. Return the response: Present the answer and, where supported, its sources.
8. Evaluate quality: Measure whether retrieval and generation meet the application's requirements.

Simplified Architecture

                 DOCUMENTS
                     |
                     v
              Text Extraction
                     |
                     v
               Text Cleaning
                     |
                     v
              Document Chunking
                     |
                     v
              Embedding Model
                     |
                     v
             Vector Index/Store
                     |
                     |
USER QUESTION ------+
       |
       v
Query Processing
       |
       v
Retrieval and Search
       |
       v
Optional Reranking
       |
       v
Context Construction
       |
       v
Large Language Model
       |
       v
Grounded Answer
       |
       v
User / Application

Note: This diagram represents a typical RAG architecture. Individual implementations may use different components or processing stages.

---

🛠️ Technology Stack

The repository's visible configuration indicates a TypeScript-based web project with Vite tooling and a Node.js server component.

The following table distinguishes the technologies indicated by the repository from optional technologies that can be used when implementing actual RAG systems.

Technology| Purpose
TypeScript| Application development with static typing
Vite| Development server and frontend build tooling
Node.js| JavaScript runtime for server-side functionality
HTML| Web page structure
CSS| Styling and responsive layouts
npm| Package management and script execution
Python| Example language for demonstrating RAG pipelines

Optional Technologies for Future RAG Implementations

These technologies are examples of tools that could be explored while extending the learning material. They are not claims about dependencies already installed in this repository.

Technology| Potential Use
Python| RAG pipeline implementation
FastAPI| Backend API development
Sentence Transformers| Text embedding generation
FAISS| Vector similarity search
Chroma| Vector storage and retrieval
PostgreSQL with pgvector| Relational storage with vector search
OpenAI API| Embeddings or language-model generation
Hugging Face| Access to models and machine-learning tools

---

📁 Project Structure

Based on the repository structure visible on GitHub:

RAG-Academy/
│
├── api/                    # API-related application code
├── src/                    # Main source code
│
├── .env.example            # Example environment configuration
├── .gitignore              # Git exclusion rules
├── index.html              # HTML entry point
├── metadata.json           # Project metadata
│
├── package.json            # Project dependencies and npm scripts
├── package-lock.json       # Locked npm dependency versions
│
├── server.ts               # TypeScript server entry point
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── vercel.json              # Vercel deployment configuration
│
└── README.md                # Project documentation

The exact responsibilities of the files and directories should be verified against their implementations. This structure is based on the repository listing rather than a complete source-code inspection.

---

🚀 Getting Started

Follow these steps to run RAG Academy locally.

Prerequisites

Install the following software:

- Node.js — preferably a currently supported LTS release compatible with the project.
- npm — generally included with Node.js.
- Git.
- A code editor such as Visual Studio Code.

Check whether Node.js and npm are installed:

node --version
npm --version
git --version

---

📥 Installation

Step 1: Clone the Repository

git clone https://github.com/abhranil1/Stemly_fork.git

Navigate into the project directory:

cd Stemly_fork

Step 2: Install Dependencies

npm install

This installs the dependencies declared in "package.json".

Step 3: Configure Environment Variables

Inspect ".env.example" to identify the environment variables required by the project.

If the application requires a local environment file, create one using the example as a starting point.

For PowerShell:

Copy-Item .env.example .env

For macOS or Linux:

cp .env.example .env

Important: Do not assume that every project requires a ".env" file. Check the source code and configuration to determine whether it is necessary.

If API keys or other secrets are required, provide them through the appropriate environment variables. Never commit real credentials to GitHub.

Step 4: Start the Development Server

Inspect the scripts in "package.json" to identify the appropriate development command.

For a project configured with a Vite development script, run:

npm run dev

For projects that provide a separate server or combined development command, use the corresponding script defined in "package.json".

Step 5: Open the Application

Vite commonly serves the development application at:

http://localhost:5173

Use the actual local address printed by the development server, as the configured port may differ.

---

🧪 Running the Project

Development

Start the development environment using the configured npm script.

npm run dev

Production Build

If the project defines a Vite build script:

npm run build

This typically generates optimized production assets.

Preview the Production Build

If the project defines a preview script:

npm run preview

Type Checking

If a type-checking script is configured, run it to identify TypeScript errors.

For example:

npm run typecheck

The commands above depend on the scripts actually defined in "package.json". If a script is unavailable, inspect the existing scripts rather than adding an unsupported command blindly.

---

🧑‍💻 Example RAG Pipeline

The following Python pseudocode illustrates the general logic behind a basic RAG application.

It is a conceptual example, not a runnable implementation included with the current web project.

def rag_pipeline(question, documents):
    # 1. Split source documents into chunks.
    chunks = split_documents(documents)

    # 2. Convert chunks into vector representations.
    embeddings = embed_documents(chunks)

    # 3. Create or update the searchable index.
    index = build_index(chunks, embeddings)

    # 4. Retrieve relevant chunks for the question.
    relevant_chunks = retrieve_documents(
        question=question,
        index=index,
        top_k=5
    )

    # 5. Construct the context for generation.
    context = "\n\n".join(relevant_chunks)

    # 6. Generate an answer grounded in the retrieved context.
    answer = generate_answer(
        question=question,
        context=context
    )

    return answer

A production implementation would normally separate indexing from query processing so documents do not need to be reprocessed for every question.

It would also handle errors, access permissions, source attribution, retrieval evaluation, and model-specific API requirements.

---

🗺️ Learning Roadmap

Use this roadmap to study RAG in a structured sequence.

- [ ] Understand what RAG is and why it is useful.
- [ ] Learn the fundamentals of LLMs and context windows.
- [ ] Understand tokens and document ingestion.
- [ ] Experiment with different chunking strategies.
- [ ] Learn embedding generation.
- [ ] Understand vector similarity and cosine similarity.
- [ ] Explore vector databases and approximate nearest-neighbor search.
- [ ] Compare dense and sparse retrieval.
- [ ] Implement or study hybrid retrieval.
- [ ] Understand reranking.
- [ ] Learn context construction and grounded generation.
- [ ] Explore advanced RAG patterns.
- [ ] Study retrieval and generation evaluation.
- [ ] Learn about RAG security and prompt injection.
- [ ] Design a complete RAG application.
- [ ] Build a small project using your preferred technology stack.
- [ ] Evaluate the system using a set of representative questions.

---

🎯 Who Is This Project For?

Students

Students interested in Artificial Intelligence, Machine Learning, Natural Language Processing, and Generative AI can use the platform to build foundational knowledge.

Beginner Developers

Developers who understand basic programming but are new to LLM-powered applications can use the structured learning path to understand RAG.

AI and ML Enthusiasts

Learners exploring embeddings, vector search, semantic retrieval, and language-model applications can use the guide as a starting point.

Developers Building AI Applications

Developers planning document assistants, knowledge-base chatbots, research tools, or internal search systems can use the material to understand common RAG architectures and trade-offs.

---

🔮 Future Improvements

RAG Academy can be extended with additional educational and interactive capabilities.

Learning Experience

- [ ] Add a dedicated learning dashboard.
- [ ] Introduce beginner, intermediate, and advanced learning paths.
- [ ] Add topic completion tracking.
- [ ] Add bookmarks and saved topics.
- [ ] Expand quizzes with explanations.
- [ ] Add diagrams for complex retrieval architectures.

Interactive AI Demonstrations

- [ ] Add a visual document-chunking playground.
- [ ] Demonstrate cosine similarity with sample vectors.
- [ ] Compare dense and sparse retrieval results.
- [ ] Visualize how reranking changes search results.
- [ ] Demonstrate the impact of different chunk sizes.
- [ ] Compare answers generated with and without retrieved context.

Practical Learning

- [ ] Add complete Python implementation examples.
- [ ] Add a working end-to-end RAG tutorial.
- [ ] Introduce example document collections.
- [ ] Add retrieval evaluation exercises.
- [ ] Demonstrate common RAG failure modes.
- [ ] Add practical deployment guidance.

Engineering and Accessibility

- [ ] Improve accessibility and keyboard navigation.
- [ ] Add automated tests.
- [ ] Improve mobile responsiveness.
- [ ] Add performance monitoring.
- [ ] Expand technical documentation.
- [ ] Add a structured contribution guide.

These items are proposed improvements, not statements about features already implemented.

---

🤝 Contributing

Contributions, corrections, suggestions, and educational examples are welcome.

If you would like to improve RAG Academy:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the changes locally.
5. Commit your work with a descriptive message.
6. Push the branch to your fork.
7. Open a pull request describing the changes.

Example:

git checkout -b feature/improve-rag-guide

git add .

git commit -m "Improve RAG learning materials"

git push origin feature/improve-rag-guide

When contributing, please aim to:

- Keep explanations technically accurate.
- Use clear language.
- Include examples where useful.
- Avoid exposing credentials or private information.
- Test code examples before presenting them as runnable.
- Keep the interface responsive and accessible.

---

🔐 Security Considerations

When building or extending RAG applications, consider the following:

- Never expose API keys in frontend code.
- Keep server-side secrets in environment variables or an appropriate secret manager.
- Treat retrieved documents as untrusted input.
- Enforce document-level access controls.
- Avoid assuming that retrieved content is accurate or safe.
- Evaluate the system against prompt injection and data-exposure risks.
- Avoid sending sensitive documents to external services without appropriate authorization.
- Monitor retrieval quality and unsupported model claims.

These considerations are particularly important when a RAG application accesses private documents or business information.

---

📄 License

The repository's license should determine how the project may be used, modified, and distributed.

Check the repository for an existing "LICENSE" file before specifying licensing terms.

If you intend to release RAG Academy as open-source software, choose a license appropriate to your goals and add the corresponding license file.

---

👨‍💻 Author

Abhranil Roy

Computer Science and Engineering student interested in Artificial Intelligence, Machine Learning, and software development.

GitHub: "@abhranil1" (https://github.com/abhranil1)

---

⭐ Support the Project

If you find RAG Academy useful:

- ⭐ Star the repository.
- 🐛 Report bugs or incorrect explanations.
- 💡 Suggest new learning topics.
- 🤝 Contribute improvements.
- 📢 Share the project with other AI learners.

Your feedback can help make RAG concepts more accessible to developers and students.

---

RAG Academy — Understand the retrieval. Improve the context. Build better AI applications.
