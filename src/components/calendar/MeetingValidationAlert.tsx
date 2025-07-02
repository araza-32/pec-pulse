
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface MeetingValidationAlertProps {
  validationResult: ValidationResult;
}

export function MeetingValidationAlert({ validationResult }: MeetingValidationAlertProps) {
  if (!validationResult || (validationResult.errors.length === 0 && validationResult.warnings.length === 0)) {
    return null;
  }

  return (
    <div className="space-y-2">
      {validationResult.errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-left">
            <ul className="list-disc list-inside space-y-1">
              {validationResult.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {validationResult.warnings.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-left">
            <ul className="list-disc list-inside space-y-1">
              {validationResult.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
