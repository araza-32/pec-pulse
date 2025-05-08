
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  createdBy: string;
  authorName: string;
}

export function ChairmanAnalysisSection() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      text: "Task forces need to increase their action completion rate. Current rate is below target by 15%.",
      createdAt: "2025-05-05T10:30:00Z",
      createdBy: "admin-1",
      authorName: "Admin User"
    },
    {
      id: "2",
      text: "Education Committee has shown significant improvement in meeting attendance. All members attended the last 3 meetings.",
      createdAt: "2025-05-03T14:45:00Z",
      createdBy: "coord-1",
      authorName: "Coordination Officer"
    }
  ]);
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
        authorName: session?.email || "Current User"  // Changed from session?.user.email to session?.email
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
    <div className="space-y-6">
      {canAddComments && (
        <div className="space-y-2 text-left">
          <Textarea
            placeholder="Add your analysis or comments for the Chairman's review..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] text-left"
          />
          <Button 
            onClick={handleAddComment}
            disabled={isSubmitting || !newComment.trim()}
            className="bg-pec-green hover:bg-pec-green/90"
          >
            Add Comment
          </Button>
        </div>
      )}
      
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-4 rounded-lg border text-left">
            <p className="text-sm text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString()} by {comment.authorName}
            </p>
            <p className="mt-2">{comment.text}</p>
          </div>
        ))}
        
        {comments.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            <p>No analysis or comments have been added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
