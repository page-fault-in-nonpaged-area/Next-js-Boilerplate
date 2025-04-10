import { getBlogPost, getComments } from '@/mockdata/blog-data';
import { RiUser3Line } from '@remixicon/react';
import Image from 'next/image';
import { Suspense } from 'react';
import BlogClient from './client';
import { NavigationPathUpdater } from './path';
import '@/styles/zrx/loading.css';

// Simple string hash function to generate stable keys
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(36);
}

// Simple loading component for the entire page
function Loading() {
  return (
    <div className="min-h-screen mx-auto py-12 px-4 sm:px-6 lg:max-w-4xl lg:px-8">
      {/* Header skeleton */}
      <div className="mb-10">
        <div className="h-12 zrx-skeleton rounded mb-3 w-3/4" />
        <div className="h-6 zrx-skeleton rounded mb-8 w-1/2" />
        <div className="h-[400px] zrx-skeleton-feature rounded-lg mb-8" />
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full zrx-skeleton" />
          <div className="ml-4">
            <div className="h-4 zrx-skeleton rounded w-32 mb-1" />
            <div className="h-3 zrx-skeleton rounded w-24" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-4 mb-10">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-5 zrx-skeleton rounded w-full" />
        ))}
      </div>

      {/* Comments skeleton */}
      <div className="mt-10">
        <div className="h-6 zrx-skeleton rounded w-32 mb-4" />
        {[1, 2].map(i => (
          <div key={i} className="mb-6">
            <div className="flex justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full zrx-skeleton" />
                <div className="ml-3 h-4 zrx-skeleton rounded w-28" />
              </div>
              <div className="h-5 w-8 zrx-skeleton rounded" />
            </div>
            <div className="h-12 zrx-skeleton rounded mt-3 ml-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Main blog page component - combining both data fetching and rendering
async function BlogPageContent() {
  // Fetch blog post and comments data in parallel
  const [blogPost, initialComments] = await Promise.all([
    getBlogPost('the-hidden-patterns'),
    getComments('the-hidden-patterns'),
  ]);

  return (
    <main className="min-h-screen mx-auto py-12 px-4 sm:px-6 lg:max-w-4xl lg:px-8">
      {/* Blog header */}
      <div className="mb-10">
        <h1 className="zrx-h1-thin mt-4 mb-3">{blogPost.title}</h1>
        <h2 className="zrx-h3-thin mb-8">{blogPost.subtitle}</h2>

        {/* Featured Image */}
        <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src="/images/city.jpg"
            alt="Featured image"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        <div className="flex items-center mb-10">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <RiUser3Line className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="zrx-caption font-medium">{blogPost.author}</p>
            <p className="zrx-caption">
              {blogPost.date}
              {' '}
              ·
              {' '}
              {blogPost.readTime}
            </p>
          </div>
        </div>
      </div>

      {/* Blog content */}
      <article className="prose dark:prose-invert max-w-none">
        <div className="mb-8">
          {blogPost.content.map((paragraph, _i) => (
            <p
              key={`content-${hashString(paragraph)}`}
              className="zrx-p mb-5"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <blockquote className="zrx-blockquote my-10">{blogPost.blockquote}</blockquote>

        <h2 className="zrx-h2 mt-10">{blogPost.subheading1}</h2>
        <div className="mb-8">
          {blogPost.content2.map(paragraph => (
            <p key={`content2-${hashString(paragraph)}`} className="zrx-p mb-5">
              {paragraph}
            </p>
          ))}
        </div>

        <h2 className="zrx-h2 mt-10">{blogPost.subheading2}</h2>
        <div className="mb-8">
          {blogPost.content3.map(paragraph => (
            <p key={`content3-${hashString(paragraph)}`} className="zrx-p mb-5">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mb-8">
          <p className="zrx-p-lg">{blogPost.conclusion}</p>
        </div>
      </article>

      {/* Client component for interactive parts */}
      <BlogClient initialComments={initialComments} />
    </main>
  );
}

// Export the page with navigation updater and suspense boundary
export default function BlogPage() {
  return (
    <>
      {/* Navigation path updater - runs immediately before any suspense or data fetching */}
      <NavigationPathUpdater />
      {/* Content with suspense boundary */}
      <Suspense fallback={<Loading />}>
        <BlogPageContent />
      </Suspense>
    </>
  );
}
