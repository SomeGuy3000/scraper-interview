function createBatches<T>(items: T[], batchSize: number): T[][] {
  return items.reduce((resultArray, item, idx) => {
    const chunkIdx = Math.floor(idx / batchSize);
    if (!resultArray[chunkIdx]) {
      resultArray[chunkIdx] = [];
    }
    resultArray[chunkIdx].push(item);
    return resultArray;
  }, [] as T[][]);
}

export async function runInParallel<T, R>(
  threadCount: number,
  callback: (item: T) => Promise<R>,
  items: T[]
): Promise<R[]> {
  const batches: T[][] = createBatches(
    items,
    Math.ceil(items.length / threadCount)
  );

  return (
    await Promise.all(
      batches.map(async (batch) => {
        const result: R[] = [];
        for (const item of batch) {
          result.push(await callback(item));
        }
        return result;
      })
    )
  ).reduce((acc, curr) => [...acc, ...curr], []);
}
