import produce from 'immer';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { filters, FilterMap } from 'lib/filters';
import { Filter } from '../lib/filters';

const STORE_KEY = "image-store";


type FilterKey = keyof FilterMap;
export interface MImage {
  id: number;
  src: ImageBitmap;
}

export interface ImagesState {
  colorPicker: ImageData | null;
  filter: { key: FilterKey, f: Filter } | null;
  src: ImageBitmap | null;
  images: MImage[];
  imagesNextId: number;
  addImage: (image: ImageBitmap) => void;
  deleteImage: (id: number) => void;
  setColorPicker: (src: ImageData | null) => void;
  setFilter: (key: FilterKey | null) => void;
}



export const useImagesStore = create<ImagesState>()(
  devtools(
    // persist(
    (set) => {
      const mutator = (cb: ((state: ImagesState) => void)) => set(produce(cb));

      return {
        src: null,
        images: [],
        imagesNextId: 0,
        colorPicker: null,
        filter: null,

        // addImage: (src: ImageBitmap) => set(produce((state: ImagesState) => {
        //     state.imagesNextId += 1;
        //     state.images.push({
        //       id: state.imagesNextId,
        //       src,
        //     })
        //   })),
        addImage: (src: ImageBitmap) => mutator((state: ImagesState) => {
          state.imagesNextId += 1;
          state.images = [{
            id: state.imagesNextId,
            src,
          }];
          state.src = src;
        }),

        deleteImage: (id: number) => mutator((state: ImagesState) => {
          const index = state.images.findIndex((image) => image.id === id);
          state.images.splice(index, 1);
        }),
      
        setColorPicker: (src: ImageData | null) => mutator((state: ImagesState) => {
          state.colorPicker = src;
        }),
      
        setFilter: (key: FilterKey | null) => mutator((state: ImagesState) => {
          state.filter = key && key in filters ? { key, f: filters[key] } : null;
        }),
      };
    },
    //   {
    //     name: STORE_KEY
    //   }
    // ),
    {
      name: STORE_KEY
    }
  ),
)
