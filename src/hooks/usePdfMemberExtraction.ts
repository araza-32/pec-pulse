
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
      console.log('Starting PDF extraction for document:', documentId);
      
      // Fetch the PDF document URL
      const { data: documentData, error: documentError } = await supabase
        .from('workbody_documents')
        .select('file_url')
        .eq('id', documentId)
        .single();

      if (documentError) {
        console.error('Error fetching document:', documentError);
        throw documentError;
      }

      if (!documentData || !documentData.file_url) {
        console.error('No document URL found');
        throw new Error('No document URL found');
      }

      console.log('Document URL fetched:', documentData.file_url);

      // Load PDF.js
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      try {
        // Fetch PDF
        const loadingTask = pdfjsLib.getDocument(documentData.file_url);
        const pdf = await loadingTask.promise;
        console.log(`PDF loaded with ${pdf.numPages} pages`);

        // Basic extraction (you'll want to customize this)
        const members: WorkbodyMember[] = [];
        
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          console.log(`Processing page ${pageNum}`);
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          // Simple example of extracting members 
          // You'll need to implement more robust parsing logic
          textContent.items.forEach((textItem: any) => {
            const text = textItem.str;
            // Example regex - adjust based on your actual PDF format
            const memberMatch = text.match(/([A-Za-z\s]+)\s*-\s*([A-Za-z\s]+)/);
            
            if (memberMatch) {
              const member = {
                id: crypto.randomUUID(),
                name: memberMatch[1].trim(),
                role: memberMatch[2].trim(),
                hasCV: false
              };
              console.log('Extracted member:', member);
              members.push(member);
            }
          });
        }

        console.log(`Total members extracted: ${members.length}`);

        if (members.length === 0) {
          console.warn('No members were extracted from the PDF');
        }

        // Store extracted members in Supabase
        if (members.length > 0) {
          console.log('Inserting members into database');
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

          if (insertError) {
            console.error('Error inserting members:', insertError);
            throw insertError;
          }

          console.log('Members successfully inserted');
        }

        setExtractedMembers(members);
        return members;
      } catch (pdfError) {
        console.error('Error processing PDF:', pdfError);
        throw pdfError;
      }
    } catch (error) {
      console.error('Error extracting members from PDF:', error);
      throw error;
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
