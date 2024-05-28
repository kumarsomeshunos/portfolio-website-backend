// All imports
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItAttrs from "markdown-it-attrs";

// Converts markdown to HTML
export default function markdownToHtml(markdown) {
   try {
      const md = new markdownIt({
         html: true,
         linkify: true,
         typographer: true,
         langPrefix: "language-",
      });
      md.use(markdownItAnchor, {});
      md.use(markdownItAttrs, {});
      const html = md.render(markdown);
      return html;
   } catch (error) {
      console.log("Something went wrong in the markdownToHtml function :(");
      return null;
   }
}
