import React, { useState, useEffect } from 'react';
import { Comment, User } from '../types.ts';
import Card from './Card.tsx';
import LoadingSpinner from './LoadingSpinner.tsx';
import * as cloudService from '../services/cloudService.ts';

interface CommentThreadProps {
    reportId: string;
    currentUser: User;
    onPostComment: (reportId: string, userId: string, userName: string, text: string) => Promise<Comment>;
}

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
    <div className="flex items-start gap-3 py-3 border-b border-slate-200 last:border-b-0">
        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center font-bold text-sm text-slate-600 flex-shrink-0">
            {comment.userName.charAt(0)}
        </div>
        <div>
            <div className="flex items-baseline gap-2">
                <p className="font-semibold text-slate-800 text-sm">{comment.userName}</p>
                <p className="text-xs text-slate-500">{new Date(comment.timestamp).toLocaleString()}</p>
            </div>
            <p className="text-slate-600 text-sm mt-1 whitespace-pre-wrap">{comment.text}</p>
        </div>
    </div>
);

const CommentThread: React.FC<CommentThreadProps> = ({ reportId, currentUser, onPostComment }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        if (!reportId) return;
        
        setIsLoading(true);
        const unsubscribe = cloudService.getCommentsForReport_REALTIME(reportId, (newComments) => {
            setComments(newComments);
            setIsLoading(false);
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();

    }, [reportId]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !reportId || !currentUser.name) return;
        setIsPosting(true);
        await onPostComment(reportId, currentUser.uid, currentUser.name, newComment);
        setNewComment('');
        setIsPosting(false);
        // The realtime listener should update the comments list automatically
    };

    return (
        <Card className="mt-8">
            <h3 className="text-xl font-bold text-slate-800">Team Collaboration</h3>
            {isLoading ? (
                <div className="py-8"><LoadingSpinner /></div>
            ) : (
                <div className="mt-4">
                    {comments.length > 0 ? (
                        <div className="space-y-4">
                            {comments.map(comment => <CommentItem key={comment.id} comment={comment} />)}
                        </div>
                    ) : (
                        <p className="text-center text-slate-500 py-4">No comments yet. Start the conversation!</p>
                    )}
                </div>
            )}
             <form onSubmit={handleSubmit} className="mt-6 flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center font-bold text-sm text-slate-600 flex-shrink-0">
                    {currentUser.name?.charAt(0)}
                </div>
                <div className="flex-grow">
                    <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Add a comment... use @ to mention a teammate."
                        rows={3}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                     <button type="submit" disabled={isPosting || !newComment.trim()} className="mt-2 btn btn-secondary">
                        {isPosting ? 'Posting...' : 'Post Comment'}
                    </button>
                </div>
            </form>
        </Card>
    );
};

export default CommentThread;