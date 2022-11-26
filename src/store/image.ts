import { cloneDeep } from 'lodash';
import produce from 'immer'
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const STORE_KEY = "image-store";

export interface MImage {
  id: number;
  src: ImageBitmap;
}

export interface ImagesState {
  colorPicker: ImageData | null;
  src: any;
  images: MImage[];
  imagesNextId: number;
  addImage: (image: ImageBitmap) => void;
  deleteImage: (id: number) => void;
  setColorPicker: (src: ImageData | null) => void;
}



export const useImagesStore = create<ImagesState>()(
  devtools(
    // persist(
    (set) => {
      const mutator = (cb: ((state: ImagesState) => void)) => set(produce(cb));

      return {
        images: [],
        imagesNextId: 0,
        src: null,
        colorPicker: null,

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
        }),
        deleteImage: (id: number) => mutator((state: ImagesState) => {
          const index = state.images.findIndex((image) => image.id === id);
          state.images.splice(index, 1);
        }),
      
        setColorPicker: (src: ImageData | null) => mutator((state: ImagesState) => {
          state.colorPicker = src;
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
