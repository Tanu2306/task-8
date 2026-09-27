import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '../../services/commentService';
import { UserAvatar } from '../common/UserAvatar';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, Edit2, Send, MessageSquare } from 'lucide-react';
import { Comment } from '../../types';

interface CommentListProps {
  taskId: number;
}

export const CommentList: React.FC<CommentListProps> = ({ taskId }) => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => commentService.getComments(taskId),
  });

  const addMutation = useMutation({
    mutationFn: (content: string) => commentService.addComment(taskId, content),
    onSuccess: () => {
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      commentService.updateComment(id, content),
    onSuccess: () => {
      setEditingCommentId(null);
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: commentService.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addMutation.mutate(newComment);
  };

  const handleEditSubmit = (commentId: number) => {
    if (!editContent.trim()) return;
    updateMutation.mutate({ id: commentId, content: editContent });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-gray-900 dark:text-white font-bold text-base">
        <MessageSquare className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        <span>Comments ({comments.length})</span>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleAddSubmit} className="flex items-start space-x-3">
        <UserAvatar user={currentUser} size="md" />
        <div className="flex-1 relative">
          <textarea
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment to this task..."
            className="w-full pl-4 pr-12 py-2.5 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || addMutation.isPending}
            className="absolute right-3 bottom-3 p-1.5 rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-xs text-gray-400 animate-pulse">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No comments on this task yet.</p>
        ) : (
          comments.map((comment) => {
            const isOwner = currentUser?.id === comment.user.id;
            const isEditing = editingCommentId === comment.id;

            return (
              <div
                key={comment.id}
                className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm flex items-start space-x-3"
              >
                <UserAvatar user={comment.user} size="md" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {comment.user.name}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>

                    {isOwner && !isEditing && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditContent(comment.content);
                          }}
                          className="p-1 text-gray-400 hover:text-brand-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(comment.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 mt-2">
                      <textarea
                        rows={2}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2.5 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="px-3 py-1 text-xs border rounded-lg text-gray-600 dark:text-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditSubmit(comment.id)}
                          className="px-3 py-1 text-xs bg-brand-600 text-white rounded-lg font-medium"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {comment.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
