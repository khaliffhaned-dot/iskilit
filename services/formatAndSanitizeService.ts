// A simple but effective HTML sanitizer to prevent XSS from AI-generated content.

/**
 * A strict whitelist of allowed HTML tags.
 * Any tags not in this list will be stripped out.
 */
const ALLOWED_TAGS = ['strong', 'em', 'b', 'i', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code'];

/**
 * A strict whitelist of allowed attributes for the allowed tags.
 * This prevents things like `onclick` or `style` attributes.
 * Currently, we allow no attributes.
 */
const ALLOWED_ATTR = [''];

/**
 * Sanitizes an HTML string by removing any tags and attributes that are not on the whitelist.
 * This is crucial for safely rendering AI-generated content that may use markdown.
 *
 * @param dirty The potentially unsafe HTML string to sanitize.
 * @returns A sanitized HTML string that is safe to render with `dangerouslySetInnerHTML`.
 */
const sanitize = (dirty: string): string => {
    const doc = new DOMParser().parseFromString(dirty, 'text/html');
    const allElements = doc.body.querySelectorAll('*');

    allElements.forEach(el => {
        // Remove disallowed tags
        if (!ALLOWED_TAGS.includes(el.tagName.toLowerCase())) {
            el.parentNode?.removeChild(el);
            return;
        }

        // Remove disallowed attributes
        for (const attr of [...el.attributes]) {
            if (!ALLOWED_ATTR.includes(attr.name.toLowerCase())) {
                el.removeAttribute(attr.name);
            }
        }
    });

    return doc.body.innerHTML;
};

/**
 * A combined function to first perform simple markdown-like formatting
 * on a raw AI text response, and then sanitize it for security.
 *
 * @param rawText The raw text from the AI, which may contain simple markdown.
 * @returns A sanitized, formatted HTML string.
 */
export const sanitizeAndFormatAIOutput = (rawText: string | null | undefined): string => {
    if (!rawText) return '';

    // Step 1: Basic formatting from markdown-like syntax to HTML
    const formatted = rawText
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/(\r\n|\n|\r){2,}/g, '</p><p>') // Handle paragraph breaks
        .replace(/(\r\n|\n|\r)/g, '<br />'); // Handle line breaks

    // Wrap in a paragraph if it doesn't start with one
    const wrapped = `<p>${formatted}</p>`.replace('<p></p>', '');
    
    // Step 2: Sanitize the now-HTML string to prevent XSS
    return sanitize(wrapped);
};

/**
 * A simple input sanitizer to strip potential HTML tags from user input
 * before sending to an AI model. This is a defense-in-depth measure against
 * prompt injection attacks that might try to use HTML to structure fake instructions.
 *
 * @param input The raw user input string.
 * @returns A string with HTML-like characters stripped.
 */
export const sanitizeAIInput = (input: string): string => {
    if (!input) return '';
    // This regex removes anything that looks like an HTML tag.
    return input.replace(/<\/?[^>]+(>|$)/g, "");
};