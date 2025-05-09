
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send } from "lucide-react";

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  createdBy: string;
  authorName: string;
}

export function ChairmanAnalysisSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();
  
  // Function to check if user can add comments
  const canAddComments = session?.role === 'admin' || session?.email?.includes('coordination');
  
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a production app, this would be saved to the database
      // For now, we'll just add it to the local state
      
      // Mock implementation - in real app would use supabase
      /*
      const { data, error } = await supabase
        .from('chairman_comments')
        .insert({
          text: newComment,
          created_by: session?.id
        })
        .select()
        .single();
        
      if (error) throw error;
      */
      
      // Simulate a successful save
      const newCommentObj = {
        id: Math.random().toString(),
        text: newComment,
        createdAt: new Date().toISOString(),
        createdBy: session?.id || "unknown",
        authorName: session?.email || "Current User"
      };
      
      setComments([newCommentObj, ...comments]);
      setNewComment("");
      
      toast({
        title: "Comment Added",
        description: "Your analysis has been added successfully",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add your comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-pec-green" />
          <span>Chairman's Analysis & Comments</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-6">
        {canAddComments && (
          <div className="space-y-4 text-left">
            <Textarea
              placeholder="Add your analysis or comments for the Chairman's review..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[120px] text-left resize-none border-gray-200 focus-visible:ring-1 focus-visible:ring-pec-green"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleAddComment}
                disabled={isSubmitting || !newComment.trim()}
                className="bg-pec-green hover:bg-pec-green/90 flex items-center gap-2"
                size="sm"
              >
                <Send className="h-4 w-4" />
                <span>Add Comment</span>
              </Button>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <MessageSquare className="h-6 w-6 text-gray-500" />
              </div>
              <h4 className="text-lg font-medium mb-2">No Comments Yet</h4>
              <p className="text-muted-foreground text-center max-w-md">
                {canAddComments 
                  ? "Start the discussion by adding your analysis or comments above."
                  : "No analysis or comments have been added yet."}
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-5 rounded-lg border text-left">
                <p className="text-sm text-muted-foreground mb-2 flex items-center justify-between">
                  <span>{new Date(comment.createdAt).toLocaleDateString()} by {comment.authorName}</span>
                </p>
                <p className="text-base">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
