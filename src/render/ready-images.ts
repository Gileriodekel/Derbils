/** Retain a decoded frame per subject while its next SVG is loading. Late older
 * loads cannot replace a newer ready frame; records and callbacks stay bounded. */
export function createReadyImages(maximum: number) {
  interface Frame { requested: HTMLImageElement; sequence: number; readySequence: number; ready?: HTMLImageElement }
  const frames = new Map<string, Frame>();
  return {
    get(key: string, image: HTMLImageElement): HTMLImageElement | undefined {
      let frame = frames.get(key);
      const created = !frame;
      if (!frame) {
        frame = { requested: image, sequence: 0, readySequence: -1 }; frames.set(key, frame);
        if (frames.size > maximum) frames.delete(frames.keys().next().value!);
      } else { frames.delete(key); frames.set(key, frame); }
      const changed = frame.requested !== image;
      if (changed) { frame.requested = image; frame.sequence++; }
      const sequence = frame.sequence, record = frame;
      const promote = () => {
        if (frames.get(key) === record && sequence >= record.readySequence && image.complete && image.naturalWidth) {
          record.ready = image; record.readySequence = sequence;
        }
      };
      if (image.complete && image.naturalWidth) promote();
      else if (changed || created) {
        // An image can be requested by several frames; one callback per frame request.
        image.addEventListener('load', promote, { once: true });
      }
      return frame.ready;
    },
    clear() { frames.clear(); },
    retain(keys:ReadonlySet<string>) { for(const key of frames.keys())if(!keys.has(key))frames.delete(key); },
  };
}
