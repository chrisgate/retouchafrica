/** Serializable gallery photo handed from server pages to the client gallery. */
export type GalleryItem = {
  id: string;
  src: string;
  caption: string | null;
  category: string | null;
  /** Natural pixel size; falls back to 4:3 when the file couldn't be read. */
  width: number;
  height: number;
};
