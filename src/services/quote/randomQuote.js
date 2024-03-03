import axios from "axios";

export async function randomQuote() {
   // Variables
   const randomQuoteBaseUrl = process.env?.RANDOM_QUOTE_BASE_URL;

   try {
      const response = await axios.get(
         `${randomQuoteBaseUrl}/api/portfolio/quotes/random`,
      );
      if (response.status !== 200) return null;
      const randomQuoteData = response.data.data;
      return { randomQuoteData };
   } catch (error) {
      return null;
   }
}
