import axios from "axios";

export async function googlebooks() {
   // Variables
   const googlebooksBaseUrl = process.env?.GOOGLEBOOKS_API_BASE_URL;
   const googlebooksUserId = process.env?.GOOGLEBOOKS_USER_ID;
   const googlebooksShefId = process.env?.GOOGLEBOOKS_SELF_ID;

   try {
      const response = await axios.get(
         `${googlebooksBaseUrl}/users/${googlebooksUserId}/bookshelves/${googlebooksShefId}/volumes`,
      );
      if (response.status !== 200) return null;
      const googlebooksData = response.data.items;
      googlebooksData.map(item => {
         delete item.kind;
         delete item.id;
         delete item.etag;
         delete item.selfLink;
         delete item.saleInfo;
         delete item.accessInfo;

         delete item.volumeInfo.industryIdentifiers;
         delete item.volumeInfo.readingModes;
         delete item.volumeInfo.allowAnonLogging;
         delete item.volumeInfo.contentVersion;
         delete item.volumeInfo.panelizationSummary;
         delete item.volumeInfo.previewLink;
         delete item.volumeInfo.infoLink;
         delete item.volumeInfo.canonicalVolumeLink;
         delete item.volumeInfo.ratingsCount;
         delete item.volumeInfo.imageLinks.smallThumbnail;
         item.volumeInfo.imageLinks = item.volumeInfo.imageLinks.thumbnail;
      });
      return googlebooksData;
   } catch (error) {
      return null;
   }
}
