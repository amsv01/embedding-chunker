# Embedding Chunker

Embedding Chunker is a TypeScript library designed to efficiently generate embeddings for large content by breaking it into manageable chunks, ensuring context is preserved using a sliding window approach. This library is particularly useful for applications requiring text embeddings with OpenAI models, handling the limitations of maximum token sizes while maintaining the integrity of the content.

## Features

•	Dynamic Chunking: Automatically adjusts chunk sizes based on the specified OpenAI embedding model’s token limits.
•	Model Support: Supports multiple OpenAI embedding models, including:
  •	text-embedding-3-small (8191 tokens)
  •	text-embedding-3-large (8191 tokens)
  •	text-embedding-ada-002 (8191 tokens)
•	Context Preservation: Utilizes a sliding window technique with configurable overlap size to maintain context between chunks.
•	Error Handling: Robust error handling to continue processing other chunks if an error occurs during embedding generation.


## Installation
```bash
npm install embedding-chunker
```

## Usage
```typescript
import { createEmbeddings, Embedding } from 'embedding-chunker';

const content = "Your large content here...";
const modelName = "text-embedding-ada-002";
const overlapSize = 50;

const embeddingFunction = async (text: string): Promise<Embedding> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Array(512).fill(Math.random())); // Example embedding
    }, 500);
  });
};

createEmbeddings(content, modelName, overlapSize, embeddingFunction)
  .then(embeddings => {
    console.log('Generated embeddings:', embeddings);
  })
  .catch(error => {
    console.error('Error generating embeddings:', error);
  });
```

## API

createEmbeddings(content: string, modelName: ModelName, overlapSize: number, embeddingFunction: (text: string) => Promise<Embedding>): Promise<Embedding[]>

	•	content: The large content to be processed.
	•	modelName: The name of the embedding model to use (text-embedding-3-small, text-embedding-3-large, text-embedding-ada-002).
	•	overlapSize: The number of tokens to overlap between chunks to preserve context.
	•	embeddingFunction: The asynchronous function that generates embeddings for a given chunk of text.

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests for any enhancements or bug fixes.


## License

This project is licensed under the GNU General Public License v3.0 License.

Embedding Chunker ensures efficient and context-preserving embedding generation for large texts, leveraging OpenAI’s powerful models. Perfect for natural language processing tasks that require high-quality embeddings within token limits.
