import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WorkbodyMember } from '@/types';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker source with a more reliable CDN
const pdfWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

export const usePdfMemberExtraction = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedMembers, setExtractedMembers] = useState<WorkbodyMember[]>([]);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  const extractMembersFromDocument = async (
    documentId: string, 
    workbodyId: string
  ) => {
    setIsExtracting(true);
    setExtractionError(null);
    
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
        setExtractionError('Failed to fetch document details');
        throw documentError;
      }

      if (!documentData || !documentData.file_url) {
        console.error('No document URL found');
        setExtractionError('No document URL found');
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
        setExtractionError(`Unsupported file format: ${fileExtension}`);
        members = createPlaceholderMembers('Unsupported Format', 'Please upload PDF, DOC, DOCX, JPG or PNG');
      }

      console.log(`Total members extracted: ${members.length}`);

      if (members.length === 0) {
        console.warn('No members were extracted from the document');
        setExtractionError('No members found in document');
        members = createPlaceholderMembers('No Members Found', 'Please try another document with member information');
      }

      // Store extracted members in Supabase
      if (members.length > 0) {
        console.log('Inserting members into database');
        
        // First, delete any existing members from this document to avoid duplicates
        const { error: deleteError } = await supabase
          .from('workbody_members')
          .delete()
          .eq('workbody_id', workbodyId)
          .eq('source_document_id', documentId);
          
        if (deleteError) {
          console.error('Error deleting existing members:', deleteError);
        }
        
        // Insert new members
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
          setExtractionError('Failed to save extracted members');
          throw insertError;
        }

        console.log('Members successfully inserted');
      }

      setExtractedMembers(members);
      return members;
    } catch (error: any) {
      console.error('Error extracting members from document:', error);
      setExtractionError(error.message || 'Unknown error during extraction');
      throw error;
    } finally {
      setIsExtracting(false);
    }
  };

  // Helper function to create placeholder members
  const createPlaceholderMembers = (name: string, role: string): WorkbodyMember[] => {
    return [{
      id: crypto.randomUUID(),
      name,
      role,
      hasCV: false
    }];
  };

  const extractFromPdf = async (fileUrl: string): Promise<WorkbodyMember[]> => {
    console.log('Starting PDF extraction');
    
    try {
      console.log('PDF.js version:', pdfjsLib.version);
      console.log('Worker source:', pdfWorkerSrc);
      
      // Fetch PDF with timeout
      const loadingTask = pdfjsLib.getDocument({
        url: fileUrl,
        cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
        useWorkerFetch: true,
      });
      
      // Set a 30 second timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('PDF loading timeout')), 30000);
      });
      
      // Race between PDF loading and timeout
      const pdf = await Promise.race([
        loadingTask.promise,
        timeoutPromise
      ]);
      
      console.log(`PDF loaded with ${pdf.numPages} pages`);

      const members: WorkbodyMember[] = [];
      let foundMembers = false;
      
      // Process more pages to find member data
      const pagesToProcess = Math.min(10, pdf.numPages);
      
      for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
        console.log(`Processing page ${pageNum}`);
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Extract members from text content - match various patterns
        const extractedOnPage = extractMembersFromText(textContent);
        if (extractedOnPage.length > 0) {
          members.push(...extractedOnPage);
          foundMembers = true;
        }
      }
      
      // If no members found with pattern matching, try creating members from lines that look like names
      if (!foundMembers) {
        console.log('No members matched patterns, trying fallback extraction');
        const fallbackMembers = await extractMembersWithFallback(pdf);
        members.push(...fallbackMembers);
      }
      
      // If still no members found, add a placeholder
      if (members.length === 0) {
        members.push({
          id: crypto.randomUUID(),
          name: "No Members Found",
          role: "Try another PDF or format",
          hasCV: false
        });
      }
      
      return members;
    } catch (pdfError: any) {
      console.error('Error processing PDF:', pdfError);
      
      // Return a placeholder member when there's an error
      return [{
        id: crypto.randomUUID(),
        name: "PDF Processing Error", 
        role: pdfError.message || "Error occurred during extraction",
        hasCV: false
      }];
    }
  };
  
  // Extract members from text content with specific roles
  const extractMembersFromText = (textContent: any): WorkbodyMember[] => {
    const members: WorkbodyMember[] = [];
    const lines: string[] = [];
    
    // Collect all text into lines
    textContent.items.forEach((textItem: any) => {
      lines.push(textItem.str.trim());
    });
    
    // Process lines to extract members
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
      
      // Pattern 1: "Name - Role" or "Name: Role"
      const pattern1 = line.match(/([A-Za-z\s.]+)[\s-:]+([A-Za-z\s]+)/);
      
      // Pattern 2: Role followed by name
      const roleKeywords = ['Convener', 'Dy Convener', 'Member'];
      const hasRole = roleKeywords.some(role => line.includes(role));
      
      if (pattern1 && pattern1[1] && pattern1[2]) {
        const name = pattern1[1].trim();
        const role = pattern1[2].trim();
        
        // Only add if role matches our keywords
        if (roleKeywords.some(keyword => role.includes(keyword))) {
          members.push({
            id: crypto.randomUUID(),
            name,
            role,
            hasCV: false
          });
        }
      } else if (hasRole) {
        // If line contains role, look for name in next line
        const roleFound = roleKeywords.find(role => line.includes(role)) || 'Member';
        if (nextLine && /^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/.test(nextLine)) {
          members.push({
            id: crypto.randomUUID(),
            name: nextLine,
            role: roleFound,
            hasCV: false
          });
          i++; // Skip next line as we've used it
        }
      } else if (/^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/.test(line)) {
        // If line looks like a name, check if previous line had role
        const prevLine = i > 0 ? lines[i - 1].trim() : '';
        const roleInPrev = roleKeywords.find(role => prevLine.includes(role));
        
        if (roleInPrev) {
          members.push({
            id: crypto.randomUUID(),
            name: line,
            role: roleInPrev,
            hasCV: false
          });
        }
      }
    }
    
    return members;
  };
  
  // Fallback extraction when pattern matching fails
  const extractMembersWithFallback = async (pdf: any): Promise<WorkbodyMember[]> => {
    const members: WorkbodyMember[] = [];
    const allLines: string[] = [];
    
    // Extract all text from the first few pages
    for (let pageNum = 1; pageNum <= Math.min(5, pdf.numPages); pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      textContent.items.forEach((item: any) => {
        const line = item.str.trim();
        if (line.length > 0) {
          allLines.push(line);
        }
      });
    }
    
    // Look for potential name lines (names are typically capitalized words)
    for (let i = 0; i < allLines.length; i++) {
      const line = allLines[i].trim();
      
      // Check if line looks like a person's name (2+ words, each capitalized)
      if (/^([A-Z][a-z]+\s+)+[A-Z][a-z]+$/.test(line) && line.split(' ').length >= 2) {
        members.push({
          id: crypto.randomUUID(),
          name: line,
          role: "Member", // Default role when we can't determine
          hasCV: false
        });
        
        // Limit to 10 members to avoid false positives
        if (members.length >= 10) break;
      }
    }
    
    return members;
  };

  const extractFromWord = async (fileUrl: string): Promise<WorkbodyMember[]> => {
    console.log('Starting Word document extraction');
    
    try {
      // This is a placeholder implementation. In a real application,
      // you would use a service like mammoth.js or a cloud-based service
      console.log('Word document processing placeholder implementation');
      
      return [{
        id: crypto.randomUUID(),
        name: "Word Document Support",
        role: "Coming soon - document processed",
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
        name: "Image OCR Support",
        role: "Coming soon - image processed",
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
    extractedMembers,
    extractionError
  };
};
