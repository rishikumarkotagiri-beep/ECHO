export function perceive(world) {
  return world.objects.map(object => ({
    ...object,
    novelty: object.seenBefore ? 0.1 : 0.9,
    type: object.known ? "known" : "unknown"
  }));
}
