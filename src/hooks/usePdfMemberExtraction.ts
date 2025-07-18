
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WorkbodyMember } from '@/types';
import * as pdfjsLib from 'pdfjs-dist';
import { useToast } from '@/hooks/use-toast';

// Configure PDF.js to use the built-in worker from the dist folder
// instead of trying to fetch it from a CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href;

export const usePdfMemberExtraction = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedMembers, setExtractedMembers] = useState<WorkbodyMember[]>([]);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const { toast } = useToast();

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

      // First, delete any members from this document that indicate errors
      const { data: existingMembers } = await supabase
        .from('workbody_members')
        .select('id, name, role')
        .eq('workbody_id', workbodyId)
        .eq('source_document_id', documentId);
        
      // If we have successfully extracted members, remove any error members
      if (members.length > 0 && !members[0].name.includes('Error') && !members[0].name.includes('Processing')) {
        console.log('Cleaning up any past extraction errors');
        
        // Delete any error members from this workbody, regardless of document source
        const { error: cleanupError } = await supabase
          .from('workbody_members')
          .delete()
          .eq('workbody_id', workbodyId)
          .filter('name', 'ilike', '%Error%');
          
        if (cleanupError) {
          console.error('Error cleaning up error members:', cleanupError);
        }
      }

      // Store extracted members in Supabase
      if (members.length > 0) {
        console.log('Inserting members into database');
        
        // Delete any existing members from this document to avoid duplicates
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

        if (!members[0].name.includes('Error')) {
          toast({
            title: "Success",
            description: `${members.length} members were extracted and saved.`,
          });
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
      
      // Create a simpler loading task with better error handling
      const loadingTask = pdfjsLib.getDocument({
        url: fileUrl,
        disableAutoFetch: false,
        disableStream: false,
        disableFontFace: false,
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
  
  const extractMembersFromText = (textContent: any): WorkbodyMember[] => {
    const members: WorkbodyMember[] = [];
    const roleKeywords = ['Convener', 'Deputy Convener', 'Member'];
    
    // Group text items by their vertical position (y-coordinate)
    const lineGroups: { [key: number]: { text: string, x: number }[] } = {};
    
    textContent.items.forEach((item: any) => {
      const y = Math.round(item.transform[5]); // Round y-coordinate for grouping
      if (!lineGroups[y]) {
        lineGroups[y] = [];
      }
      lineGroups[y].push({
        text: item.str.trim(),
        x: item.transform[4]
      });
    });
    
    // Sort line groups by y-coordinate (top to bottom)
    const sortedYPositions = Object.keys(lineGroups)
      .map(Number)
      .sort((a, b) => b - a);
    
    sortedYPositions.forEach((y) => {
      const line = lineGroups[y];
      
      // Sort items in line by x-coordinate (left to right)
      line.sort((a, b) => a.x - b.x);
      
      // Join text items in the line
      const fullLine = line.map(item => item.text).join(' ').trim();
      
      // Check for numbered entry pattern (e.g., "1.", "2.")
      if (/^\d+\./.test(fullLine)) {
        const role = roleKeywords.find(role => 
          line.some(item => item.text.includes(role))
        ) || 'Member';
        
        // Remove the number prefix and extract the name
        const nameMatch = fullLine.match(/^\d+\.\s+((?:Engr\.|Dr\.)?\s*[^,\n]+)/);
        if (nameMatch) {
          const name = nameMatch[1].trim();
          
          // Create member entry with role
          members.push({
            id: crypto.randomUUID(),
            name: name,
            role: role,
            hasCV: false
          });
        }
      }
    });
    
    return members;
  };
  
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
    console.log('Starting image extraction from:', fileUrl);
    
    try {
      // Get filename from URL
      const filename = fileUrl.split('/').pop() || '';
      console.log('Image filename:', filename);
      
      // Clean the filename for better name extraction
      const cleanName = filename
        .replace(/\.[^/.]+$/, '') // Remove file extension
        .replace(/[_-]/g, ' ') // Replace underscores and dashes with spaces
        .replace(/\d+/g, '') // Remove numbers
        .trim();
      
      console.log('Processed filename for member extraction:', cleanName);
      
      // If we have something that looks like a name (at least two words)
      if (cleanName.includes(' ') && cleanName.length > 5) {
        // Create a member from the filename
        return [{
          id: crypto.randomUUID(),
          name: cleanName,
          role: "Member", // Default role
          hasCV: false
        }];
      }
      
      // Try to extract members from common patterns in image names
      const possibleMembers = [];
      
      // If filename contains keywords like "committee", "member", etc.
      if (/committee|member|board|council|team/i.test(filename) && filename.length > 15) {
        console.log('Image appears to be a committee/member document');
        
        const nameParts = cleanName.split(/(?:and|,|\s{2,})/);
        
        for (const part of nameParts) {
          const trimmedPart = part.trim();
          // Only include parts that look like names (capitalized words)
          if (trimmedPart.length > 5 && /^[A-Z][a-z]/.test(trimmedPart)) {
            possibleMembers.push({
              id: crypto.randomUUID(),
              name: trimmedPart,
              role: "Member",
              hasCV: false
            });
          }
        }
      }
      
      if (possibleMembers.length > 0) {
        console.log(`Extracted ${possibleMembers.length} potential members from image filename`);
        return possibleMembers;
      }
      
      // Return a placeholder for manual entry
      console.log('No members could be extracted from image, returning placeholder');
      return [{
        id: crypto.randomUUID(),
        name: "Image Content",
        role: "Manual entry recommended for image uploads",
        hasCV: false
      }];
    } catch (error) {
      console.error('Error processing image:', error);
      return [{
        id: crypto.randomUUID(),
        name: "Image Processing", 
        role: "Manual entry required - could not process image",
        hasCV: false
      }];
    }
  };

  return {
    extractMembersFromDocument,
    isExtracting,
    extractedMembers,
    extractionError,
    clearExtractionError: () => setExtractionError(null)
  };
};
