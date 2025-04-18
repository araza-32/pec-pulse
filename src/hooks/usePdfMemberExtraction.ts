
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WorkbodyMember } from '@/types';
import * as pdfjsLib from 'pdfjs-dist';

export const usePdfMemberExtraction = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedMembers, setExtractedMembers] = useState<WorkbodyMember[]>([]);

  const extractMembersFromDocument = async (
    documentId: string, 
    workbodyId: string
  ) => {
    setIsExtracting(true);
    try {
      console.log('Starting document extraction for document:', documentId);
      
      // Fetch the document URL and type
      const { data: documentData, error: documentError } = await supabase
        .from('workbody_documents')
        .select('file_url, document_type')
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
      
      let members: WorkbodyMember[] = [];
      
      // Get file extension from URL
      const fileUrl = documentData.file_url;
      const fileExtension = fileUrl.split('.').pop()?.toLowerCase();
      
      console.log('Detected file extension:', fileExtension);
      
      if (fileExtension === 'pdf') {
        members = await extractFromPdf(fileUrl);
      } else if (['doc', 'docx'].includes(fileExtension || '')) {
        members = await extractFromWord(fileUrl);
      } else if (['jpg', 'jpeg', 'png'].includes(fileExtension || '')) {
        members = await extractFromImage(fileUrl);
      } else {
        console.warn('Unsupported file format:', fileExtension);
        throw new Error(`Unsupported file format: ${fileExtension}`);
      }

      console.log(`Total members extracted: ${members.length}`);

      if (members.length === 0) {
        console.warn('No members were extracted from the document');
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
    } catch (error) {
      console.error('Error extracting members from document:', error);
      throw error;
    } finally {
      setIsExtracting(false);
    }
  };

  const extractFromPdf = async (fileUrl: string): Promise<WorkbodyMember[]> => {
    console.log('Starting PDF extraction');
    
    try {
      // Configure PDF.js worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      // Fetch PDF
      const loadingTask = pdfjsLib.getDocument(fileUrl);
      const pdf = await loadingTask.promise;
      console.log(`PDF loaded with ${pdf.numPages} pages`);

      const members: WorkbodyMember[] = [];
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`Processing page ${pageNum}`);
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Extract members from text content
        textContent.items.forEach((textItem: any) => {
          const text = textItem.str;
          // Example pattern: "Name - Role" or "Name: Role"
          const memberMatch = text.match(/([A-Za-z\s]+)[\s-:]+([A-Za-z\s]+)/);
          
          if (memberMatch) {
            const member: WorkbodyMember = {
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
      
      return members;
    } catch (pdfError) {
      console.error('Error processing PDF:', pdfError);
      throw pdfError;
    }
  };

  const extractFromWord = async (fileUrl: string): Promise<WorkbodyMember[]> => {
    console.log('Starting Word document extraction');
    
    try {
      // This is a placeholder implementation. In a real application,
      // you would use a service like mammoth.js or a cloud-based service
      // to extract text from Word documents
      console.log('Word document processing placeholder implementation');
      
      return [{
        id: crypto.randomUUID(),
        name: "Extracted from Word",
        role: "Member",
        hasCV: false
      }];
    } catch (error) {
      console.error('Error processing Word document:', error);
      throw error;
    }
  };

  const extractFromImage = async (fileUrl: string): Promise<WorkbodyMember[]> => {
    console.log('Starting image extraction');
    
    try {
      // This is a placeholder implementation. In a real application,
      // you would use a service like Tesseract.js or a cloud OCR service
      console.log('Image OCR processing placeholder implementation');
      
      return [{
        id: crypto.randomUUID(),
        name: "Extracted from Image",
        role: "Member",
        hasCV: false
      }];
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  };

  return {
    extractMembersFromDocument,
    isExtracting,
    extractedMembers
  };
};
