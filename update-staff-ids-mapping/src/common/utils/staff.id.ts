export const formatId = (id: string): string => {
    if (!/^\d+$/.test(id) || id.length > 6){
      return undefined
    }
    if (id.length === 6) {
      return id
    }
    const placeholder = '0'.repeat(6 - id.length)
    return placeholder.concat(id)
  }
