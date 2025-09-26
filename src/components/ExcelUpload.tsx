import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface ExcelData {
  [key: string]: any;
}

interface ExcelUploadProps {
  onDataLoaded: (data: ExcelData[], headers: string[]) => void;
}

export const ExcelUpload: React.FC<ExcelUploadProps> = ({ onDataLoaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel file (.xlsx or .xls)",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length === 0) {
        throw new Error('The Excel file appears to be empty');
      }

      // Extract headers from first row
      const headers = (jsonData[0] as string[]) || [];
      
      // Convert data rows to objects
      const dataRows = jsonData.slice(1).map((row: any) => {
        const obj: ExcelData = {};
        headers.forEach((header, index) => {
          if (header && row[index] !== undefined) {
            obj[header] = row[index];
          }
        });
        return obj;
      }).filter(row => Object.keys(row).length > 0);

      if (dataRows.length === 0) {
        throw new Error('No data rows found in the Excel file');
      }

      onDataLoaded(dataRows, headers);
      setUploadComplete(true);
      
      toast({
        title: "Success!",
        description: `Uploaded ${dataRows.length} rows of data from ${file.name}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to parse Excel file",
        variant: "destructive",
      });
      setUploadComplete(false);
    } finally {
      setIsUploading(false);
    }
  }, [onDataLoaded, toast]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
      // Reset input value to prevent double upload
      e.target.value = '';
    }
  }, [handleFileUpload]);

  return (
    <Card className="border-2 border-dashed border-border/50 hover:border-primary/50 transition-all duration-300 shadow-medium">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-3 text-xl">
          <FileSpreadsheet className="h-6 w-6 text-primary" />
          Excel Upload
        </CardTitle>
        <CardDescription className="text-base">
          Upload your price book Excel file to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        {uploadComplete ? (
          <div className="animate-fade-in text-center p-8">
            <Check className="h-12 w-12 text-success mx-auto mb-4" />
            <p className="text-lg font-medium text-success">Upload Complete!</p>
            <p className="text-sm text-muted-foreground mt-2">{fileName}</p>
          </div>
        ) : (
          <div
            className="relative border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-accent-soft/30 transition-all duration-300 cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            {isUploading ? (
              <div className="animate-premium-pulse">
                <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-lg font-medium">Processing file...</p>
                <p className="text-sm text-muted-foreground mt-2">Please wait while we parse your data</p>
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Drop your Excel file here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <Button variant="outline" className="mt-2">
                  Choose File
                </Button>
              </div>
            )}
            <input
              id="file-input"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        )}
        <div className="flex items-start gap-2 mt-4 p-3 bg-primary-soft rounded-lg">
          <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-primary">Supported formats:</p>
            <p className="text-muted-foreground">Excel files (.xlsx, .xls) with columns like Region, Country, Supplier, Currency, Service Levels, etc.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};