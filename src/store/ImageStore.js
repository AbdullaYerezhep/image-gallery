import {defineStore} from "pinia"

export const useImageStore= defineStore("ImageStore", {
    //state
    state: () => ({
        images: [],
        authors: [],
        currentPage: 1,
        imagesPerPage: 12,
        totalImagesCount: 36,
    }),
    //actions
    actions: {
      async fetchImages(page) {
        try {
          const apiUrl = 'https://api.unsplash.com/photos/';
          const clientId = 'ZLkFBPxs3bTDgF8WuphomdydB9xUP9bh2jD9A0cqqYM';
          
          // Define headers
          const headers = new Headers({
            'Accept-Version': 'v1',
            'Authorization': `Client-ID ${clientId}`,
          });
          
          // Define query parameters if needed
          const queryParams = new URLSearchParams({
              'per_page': this.totalImagesCount,
              'page': page,
          });
      
          // Combine the URL with query parameters
          const requestUrl = apiUrl + '?' + queryParams;
      
          const response = await fetch(requestUrl, { method: 'GET', headers });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
      
          // Handle the response data
          const apiImages = data;
          this.authors = apiImages.map((image) => image.user.name);
          this.images = apiImages;
        } catch (error) {
          // Handle errors
          console.error(error);
        }
      },
      
      },
    })
