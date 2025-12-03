/**
 * Serializes Firestore data to plain objects that can be passed to Client Components
 * Converts Timestamp objects to ISO strings
 */
export function serializeFirestoreData<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => serializeFirestoreData(item)) as T;
  }

  // Handle objects
  if (typeof data === "object") {
    const dataAny = data as any;
    
    // Check if it's a Firestore Timestamp
    // Timestamps have toDate() method and seconds/nanoseconds properties
    if (
      typeof dataAny.toDate === "function" &&
      typeof dataAny.seconds === "number" &&
      typeof dataAny.nanoseconds === "number"
    ) {
      // Convert Timestamp to ISO string
      try {
        return dataAny.toDate().toISOString() as T;
      } catch (e) {
        // Fallback: convert seconds to ISO string
        return new Date(dataAny.seconds * 1000).toISOString() as T;
      }
    }

    // Handle Date objects
    if (data instanceof Date) {
      return data.toISOString() as T;
    }

    // Handle plain objects
    const serialized: any = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializeFirestoreData(value);
    }
    return serialized as T;
  }

  // Return primitives as-is
  return data;
}

