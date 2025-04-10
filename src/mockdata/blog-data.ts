// This file simulates data fetching for the blog

// Sample blog post data
const blogPostData = {
  'the-hidden-patterns': {
    title: 'The Hidden Patterns of Modern Architecture',
    subtitle: 'Discovering symmetry in seemingly chaotic urban spaces',
    author: 'Jane Architect',
    date: 'March 15, 2023',
    readTime: '8 min read',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim.',
      'Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue.',
      'Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum.',
    ],
    blockquote: 'Architecture is not simply about space and form, but about event, action, and what happens in space.',
    subheading1: 'The Emergence of Neo-Brutalism',
    content2: [
      'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper.',
      'Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.',
    ],
    subheading2: 'Sustainable Materials in Contemporary Design',
    content3: [
      'Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui.',
      'Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.',
    ],
    conclusion: 'The future of urban architecture lies not in rejecting the past, but in understanding and reimagining the patterns that have shaped our cities for centuries.',
  },
};

// Sample comments
const commentsData = {
  'the-hidden-patterns': [
    {
      id: 1,
      author: 'Robert Builder',
      date: 'March 16, 2023',
      text: 'Fascinating perspective on neo-brutalism. I\'ve always thought these structures were misunderstood.',
      likes: 12,
    },
    {
      id: 2,
      author: 'Sarah Designer',
      date: 'March 16, 2023',
      text: 'The point about sustainable materials resonates with my current project. Would love to hear more specific examples of materials that balance aesthetics and sustainability.',
      likes: 8,
    },
  ],
};

// Simulated data fetching functions with delay to mimic real API calls
export async function getBlogPost(slug: string) {
  // In a real app, you'd fetch from an API or database here
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return blogPostData[slug as keyof typeof blogPostData];
}

export async function getComments(slug: string) {
  // In a real app, you'd fetch from an API or database here
  await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network delay
  return commentsData[slug as keyof typeof commentsData] || [];
}
