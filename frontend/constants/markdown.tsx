export const components = {
    h1: ({ ...props }) => (
        <h1 {...props} className="text-lg font-bold mb-2 mt-1" />
    ),
    h2: ({ ...props }) => (
        <h2 {...props} className="text-sm font-bold mb-2 mt-1" />
    ),
    h3: ({ ...props }) => (
        <h3 {...props} className="text-sm font-bold mb-2 mt-1" />
    ),
    // Paragraphs
    p: ({ ...props }) => (
        <p {...props} className="text-sm mb-2 last:mb-0 leading-normal" />
    ),
    // Lists
    ul: ({ ...props }) => (
        <ul {...props} className="list-disc pl-4 mb-2 space-y-1" />
    ),
    ol: ({ ...props }) => (
        <ol {...props} className="list-decimal pl-4 mb-2 space-y-1" />
    ),
    li: ({ ...props }) => (
        <li {...props} className="leading-normal text-sm" />
    ),
    strong: ({ ...props }) => (
        <strong {...props} className="font-bold" />
    ),
    em: ({ ...props }) => (
        <em {...props} className="italic" />
    ),
    a: ({ ...props }) => (
        <a
            {...props}
            className="underline underline-offset-4 text-blue-600 hover:text-blue-700"
            target="_blank"
            rel="noopener noreferrer"
        />
    ),
    blockquote: ({ ...props }) => (
        <blockquote
            {...props}
            className="border-l-2 pl-4 italic my-2 border-gray-300"
        />
    ),
    hr: ({ ...props }) => (
        <hr
            {...props}
            className="border-white/10"
        />
    ),
}