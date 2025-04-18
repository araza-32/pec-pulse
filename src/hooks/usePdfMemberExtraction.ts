
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WorkbodyMember } from '@/types';
import * as pdfjsLib from 'pdfjs-dist';

export const usePdfMemberExtraction = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedMembers, setExtractedMembers] = useState<WorkbodyMember[]>([]);

  const extractMembersFromPdf = async (
    documentId: string, 
    workbodyId: string
  ) => {
    setIsExtracting(true);
    try {
      // Fetch the PDF document URL
      const { data: documentData, error: documentError } = await supabase
        .from('workbody_documents')
        .select('file_url')
        .eq('id', documentId)
        .single();

      if (documentError) throw documentError;

      // Load PDF.js
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      // Fetch PDF
      const loadingTask = pdfjsLib.getDocument(documentData.file_url);
      const pdf = await loadingTask.promise;

      // Basic extraction (you'll want to customize this)
      const members: WorkbodyMember[] = [];
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Simple example of extracting members 
        // You'll need to implement more robust parsing logic
        textContent.items.forEach((textItem: any) => {
          const text = textItem.str;
          // Example regex - adjust based on your actual PDF format
          const memberMatch = text.match(/([A-Za-z\s]+)\s*-\s*([A-Za-z\s]+)/);
          
          if (memberMatch) {
            members.push({
              id: crypto.randomUUID(),
              name: memberMatch[1].trim(),
              role: memberMatch[2].trim(),
              hasCV: false
            });
          }
        });
      }

      // Store extracted members in Supabase
      const { error: insertError } = await supabase
        .from('workbody_members')
        .insert(
          members.map(member => ({
            workbody_id: workbodyId,
            name: member.name,
            role: member.role,
            has_cv: member.hasCV,
            source_document_id: documentId
          }))
        );

      if (insertError) throw insertError;

      setExtractedMembers(members);
      return members;
    } catch (error) {
      console.error('Error extracting members from PDF:', error);
      return [];
    } finally {
      setIsExtracting(false);
    }
  };

  return { 
    extractMembersFromPdf, 
    isExtracting, 
    extractedMembers 
  };
};
