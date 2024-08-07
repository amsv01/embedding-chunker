import { createEmbeddings, modelTokenLimits, type Embedding, type ModelName } from './index'

describe('createEmbeddings', () => {
  const embeddingFunction = jest.fn(async (text: string): Promise<Embedding> => {
    return Array(512).fill(Math.random())
  })

  beforeEach(() => {
    embeddingFunction.mockClear()
  })

  it('should process content within max token size as a single chunk', async () => {
    const content = 'small content'
    const modelName: ModelName = 'text-embedding-ada-002'
    const overlapSize = 50

    const embeddings = await createEmbeddings(content, modelName, overlapSize, embeddingFunction)

    expect(embeddingFunction).toHaveBeenCalledTimes(1)
    expect(embeddings.length).toBe(1)
  })

  it('should break content into overlapping chunks if it exceeds max token size', async () => {
    const content = Array(2000).fill('word').join(' ')
    const modelName: ModelName = 'text-embedding-3-small'
    const overlapSize = 50

    const embeddings = await createEmbeddings(content, modelName, overlapSize, embeddingFunction)

    // Calculate expected number of chunks
    const expectedChunks = Math.ceil((2000 - (modelTokenLimits[modelName] / 2)) / (modelTokenLimits[modelName] - overlapSize))

    expect(embeddingFunction).toHaveBeenCalledTimes(expectedChunks)
    expect(embeddings.length).toBe(expectedChunks)
  })

  it('should handle errors during embedding generation and continue processing', async () => {
    const content = Array(2000).fill('word').join(' ')
    const modelName: ModelName = 'text-embedding-3-large'
    const overlapSize = 50

    embeddingFunction.mockImplementationOnce(async () => {
      throw new Error('Simulated error')
    })

    const embeddings = await createEmbeddings(content, modelName, overlapSize, embeddingFunction)

    // Calculate expected number of chunks
    const expectedChunks = Math.ceil((2000 - (modelTokenLimits[modelName] / 2)) / (modelTokenLimits[modelName] - overlapSize))

    expect(embeddingFunction).toHaveBeenCalledTimes(expectedChunks)
    expect(embeddings.length).toBe(expectedChunks)
    expect(embeddings.some(embedding => embedding.length === 0)).toBe(true) // Check if there is an empty embedding due to error
  })
})
