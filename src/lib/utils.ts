
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add function to format bold text between ** markers
export function formatBoldText(text: string): string {
  if (!text) return '';
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

// // Format markdown-like syntax for proposals
// export function formatProposalContent(content: string): string {
//   if (!content) return '';
  
//   let formatted = content;
  
//   // Format bold text
//   formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
//   // Format dividers
//   formatted = formatted.replace(/---/g, '<hr class="border-t border-white/20 my-4" />');
  
//   // Format headings
//   formatted = formatted.replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-bold mb-0 text-agency-purple">$1</h1>');
//   formatted = formatted.replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-bold mb-0 text-agency-blue">$1</h2>');
//   formatted = formatted.replace(/^### (.*?)$/gm, '<h3 class="text-xl font-bold mb-0 text-agency-teal">$1</h3>');
  
//   // Replace newlines with <br> tags
//   formatted = formatted.replace(/\n/g, '<br />');
  
//   return formatted;
// }

export function formatProposalContent(content: string): string {
  if (!content) return '';

  let formatted = content;

  // Format bold text (**bold**)
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Format dividers (---)
  formatted = formatted.replace(/---/g, '<hr class="border-t border-white/20 my-4" />');

  // Format headings
  formatted = formatted.replace(/^### (.*?)$/gm, '<h3 class="text-xl font-bold mb-2 text-agency-teal tracking-tight">$1</h3>');
  formatted = formatted.replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-bold mb-2 text-agency-blue">$1</h2>');
  formatted = formatted.replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-bold mb-2 text-agency-purple">$1</h1>');

  // Remove newlines after headings or hr (they're block elements)
  formatted = formatted.replace(/(<\/h[1-3]>|<\/hr>)\n+/g, '$1');

  // Normalize multiple newlines after </strong> to a single <br />
  formatted = formatted.replace(/<\/strong>\n+/g, '</strong><br />');

  // Replace remaining single newlines with <br />
  formatted = formatted.replace(/\n/g, '<br />');

  // Replace markdown email links with plain email
formatted = formatted.replace(/\[([^\]]+)\]\(mailto:[^)]+\)/g, '$1');

  return formatted;
}
