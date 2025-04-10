'use client';

import { ZrxAlertBar } from '@/components/zrx/alertbar/alertbar';
import ZrxButton from '@/components/zrx/button/button';
import { ZrxInput } from '@/components/zrx/input/input';
import ZrxTextarea from '@/components/zrx/textarea/textarea';
import { useNavigationPath } from '@/hooks/useNavigationPath';
import {
  RiBookOpenLine,
  RiChat3Line,
  RiFacebookCircleFill,
  RiHeartFill,
  RiHeartLine,
  RiLinkedinBoxFill,
  RiTwitterXFill,
} from '@remixicon/react';
import { useEffect, useLayoutEffect, useState } from 'react';

type Comment = {
  id: number;
  author: string;
  date: string;
  text: string;
  likes: number;
};

type BlogClientProps = {
  initialComments: Comment[];
};

export default function BlogClient({ initialComments }: BlogClientProps) {
  const { setNavigationPath } = useNavigationPath();
  const [mounted, setMounted] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [likedComments, setLikedComments] = useState<number[]>([]);
  const [_showShareOptions, setShowShareOptions] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Use layout effect with higher priority to update navigation path immediately
  // This runs synchronously before browser paint
  useLayoutEffect(() => {
    setNavigationPath([
      {
        label: 'Blog',
        path: '/blog',
        icon: <RiBookOpenLine className="w-5 h-5" />,
      },
      {
        label: 'Blog Post',
        path: '/blog',
        icon: <RiBookOpenLine className="w-5 h-5" />,
      },
    ]);
  }, [setNavigationPath]);

  // Handle component mounting in a separate effect
  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleSubmitComment = () => {
    if (newComment.trim() && name.trim()) {
      const newCommentObj = {
        id: comments.length + 1,
        author: name,
        date: new Date().toLocaleDateString(),
        text: newComment,
        likes: 0,
      };
      setComments([...comments, newCommentObj]);
      setNewComment('');
      setName('');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const handleLikeComment = (id: number) => {
    if (likedComments.includes(id)) {
      setLikedComments(likedComments.filter(commentId => commentId !== id));
      setComments(comments.map(comment =>
        comment.id === id ? { ...comment, likes: comment.likes - 1 } : comment,
      ));
    } else {
      setLikedComments([...likedComments, id]);
      setComments(comments.map(comment =>
        comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment,
      ));
    }
  };

  const handleShare = (platform: string) => {
    console.warn(`Sharing to ${platform}`);
    setShowShareOptions(false);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <>
      {/* Show notification when comment is posted */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50">
          <ZrxAlertBar
            success
            title="Success"
            message="Your action was completed successfully!"
            onClose={() => setShowNotification(false)}
          />
        </div>
      )}

      {/* Share buttons */}
      <div className="mb-10 mt-20">
        <h4 className="zrx-h4 mb-4">Share This Article</h4>
        <div className="flex flex-wrap gap-3">
          <ZrxButton
            primary
            className="flex items-center gap-2"
            onClick={() => handleShare('facebook')}
          >
            <RiFacebookCircleFill className="text-lg" />
            {' '}
            Share to Facebook
          </ZrxButton>
          <ZrxButton
            secondary
            className="flex items-center gap-2"
            onClick={() => handleShare('twitter')}
          >
            <RiTwitterXFill className="text-lg" />
            {' '}
            Share to X
          </ZrxButton>
          <ZrxButton
            success
            className="flex items-center gap-2"
            onClick={() => handleShare('linkedin')}
          >
            <RiLinkedinBoxFill className="text-lg" />
            {' '}
            Share to LinkedIn
          </ZrxButton>
          <ZrxButton
            warning
            className="flex items-center gap-2"
            onClick={() => handleShare('email')}
          >
            Share via Email
          </ZrxButton>
        </div>
      </div>

      <hr className="zrx-divider my-8" />

      {/* Comments section */}
      <section className="mt-10">
        <h3 className="zrx-section-heading flex items-center mb-6">
          <RiChat3Line className="mr-2" />
          {' '}
          Comments (
          {comments.length}
          )
        </h3>

        {comments.map(comment => (
          <div key={comment.id} className="mb-4">
            {/* if not first item, add a zrxdivider */}
            {comment.id !== 1 && (
              <hr className="zrx-divider mb-8" />
            )}

            <div className="flex justify-between">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <span className="text-sm font-semibold">{comment.author.charAt(0)}</span>
                </div>
                <span className="ml-3 font-medium">{comment.author}</span>
                <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">{comment.date}</span>
              </div>

              <button
                onClick={() => handleLikeComment(comment.id)}
                className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                type="button"
              >
                {likedComments.includes(comment.id)
                  ? (
                      <RiHeartFill className="w-5 h-5 text-red-500" />
                    )
                  : (
                      <RiHeartLine className="w-5 h-5" />
                    )}
                <span className="ml-1">{comment.likes}</span>
              </button>
            </div>

            <p className="zrx-p-sm mt-3 pl-13">{comment.text}</p>
          </div>
        ))}

        {/* Add comment form */}
        <div className="mt-10">
          <h4 className="zrx-h4 mb-5">Leave a Comment</h4>

          <div className="mb-5">
            <ZrxInput
              placeholder="Your name"
              value={name}
            />
          </div>

          <div className="mb-5">
            <ZrxTextarea
              placeholder="Write your comment here..."
              value={newComment}
              onChange={setNewComment}
              rows={4}
            />
          </div>

          <ZrxButton
            primary
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || !name.trim()}
          >
            Submit Comment
          </ZrxButton>
        </div>
      </section>

      {/* Navigation buttons */}
      <div className="pt-4">
        <hr className="zrx-divider mb-8" />
        <div className="flex justify-between">
          <div className="flex gap-3">
            <ZrxButton secondary>Previous Post</ZrxButton>
            <ZrxButton secondary>Next Post</ZrxButton>
          </div>

          <div>
            <ZrxButton
              primary
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Back to Top
            </ZrxButton>
          </div>
        </div>
      </div>
    </>
  );
}
