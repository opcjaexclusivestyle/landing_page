'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

interface MarkdownPreviewProps {
  content: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
}

export default function MarkdownPreview({
  content,
  onChange,
  readOnly = false,
}: MarkdownPreviewProps) {
  const [markdown, setMarkdown] = useState(content);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>(
    readOnly ? 'preview' : 'edit',
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setMarkdown(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  return (
    <div className='border border-gray-200 rounded-lg overflow-hidden'>
      {/* Zakładki */}
      {!readOnly && (
        <div className='flex border-b border-gray-200'>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'edit'
                ? 'bg-royal-gold text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Edycja
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'preview'
                ? 'bg-royal-gold text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Podgląd
          </button>
        </div>
      )}

      {/* Panel edycji */}
      {activeTab === 'edit' && !readOnly && (
        <div className='p-4'>
          <textarea
            value={markdown}
            onChange={handleChange}
            className='w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-royal-gold'
            placeholder='Wpisz treść w formacie Markdown...'
          />
          <div className='mt-2 text-xs text-gray-500'>
            <p>Dostępne formatowanie:</p>
            <ul className='list-disc ml-4 mt-1'>
              <li># Nagłówek 1</li>
              <li>## Nagłówek 2</li>
              <li>**pogrubienie**</li>
              <li>*kursywa*</li>
              <li>[tekst linku](url)</li>
              <li>![alt text](url obrazka)</li>
              <li>- element listy</li>
              <li>{'>'} cytat</li>
            </ul>
          </div>
        </div>
      )}

      {/* Panel podglądu */}
      {activeTab === 'preview' && (
        <div className='p-4 markdown-content'>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className='text-3xl font-bold mt-8 mb-4'>{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className='text-2xl font-bold mt-8 mb-4'>{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className='text-xl font-bold mt-6 mb-3'>{children}</h3>
              ),
              p: ({ children }) => (
                <p className='mb-4 text-gray-700'>{children}</p>
              ),
              ul: ({ children }) => (
                <ul className='ml-6 mb-6 list-disc'>{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className='ml-6 mb-6 list-decimal'>{children}</ol>
              ),
              li: ({ children }) => <li className='mb-2'>{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className='pl-4 border-l-4 border-royal-gold italic my-6 text-gray-600'>
                  {children}
                </blockquote>
              ),
              img: ({ src, alt }) => (
                <div className='my-8 relative'>
                  <Image
                    src={src || ''}
                    alt={alt || 'Zdjęcie do artykułu'}
                    width={800}
                    height={500}
                    className='rounded-lg mx-auto'
                  />
                </div>
              ),
              a: ({ href, children }) => (
                <a href={href} className='text-royal-gold hover:underline'>
                  {children}
                </a>
              ),
              code: ({ children }) => (
                <code className='bg-gray-100 px-2 py-1 rounded text-sm'>
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className='bg-gray-800 text-white p-4 rounded-lg overflow-x-auto my-6'>
                  {children}
                </pre>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
