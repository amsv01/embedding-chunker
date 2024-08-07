export type Embedding = number[]

export const modelTokenLimits = {
  'text-embedding-3-small': 8191,
  'text-embedding-3-large': 8191,
  'text-embedding-ada-002': 8191
} as const

export type ModelName = keyof typeof modelTokenLimits

const simpleTokenizer = (text: string): string[] => {
  return text.split(/\s+/)
}

export const createEmbeddings = async (
  content: string,
  modelName: ModelName,
  overlapSize: number,
  embeddingFunction: (text: string) => Promise<Embedding>
): Promise<Embedding[]> => {
  const maxTokenSize = modelTokenLimits[modelName]
  const tokens = simpleTokenizer(content)
  const totalTokens = tokens.length

  if (totalTokens <= maxTokenSize) {
    // If the content is within the max token size, process it as a single chunk
    return [await embeddingFunction(content)]
  }

  const chunks: string[] = []
  let i = 0

  while (i < tokens.length) {
    const chunkTokens: string[] = []
    let j = i

    // Collect tokens until we reach the max token size
    while (j < tokens.length && chunkTokens.length < maxTokenSize) {
      chunkTokens.push(tokens[j])
      j++
    }

    chunks.push(chunkTokens.join(' '))

    // Move the index forward by the chunk size minus the overlap size
    i += chunkTokens.length - overlapSize
  }

  const embeddings: Embedding[] = await Promise.all(
    chunks.map(async chunk => {
      try {
        return await embeddingFunction(chunk)
      } catch (error) {
        console.error('Error processing chunk:', error)
        return []
      }
    })
  )

  return embeddings
}
