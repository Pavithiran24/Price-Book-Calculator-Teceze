import React, { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, Database, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ExcelData {
  [key: string]: any;
}

interface DataPreviewProps {
  data: ExcelData[];
  headers: string[];
}

export const DataPreview: React.FC<DataPreviewProps> = ({ data, headers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const itemsPerPage = 10;
  
  // Filter data based on search term
  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  
  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const formatCellValue = (value: any) => {
    if (value == null) return '';
    if (typeof value === 'number') {
      // Format currency-like numbers
      if (value > 0 && value < 10000 && value % 1 !== 0) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(value);
      }
      return value.toLocaleString();
    }
    return String(value);
  };

  const getColumnType = (header: string) => {
    const sampleValues = data.slice(0, 5).map(row => row[header]).filter(v => v != null);
    if (sampleValues.every(v => typeof v === 'number')) {
      return 'number';
    }
    if (header.toLowerCase().includes('region') || header.toLowerCase().includes('country')) {
      return 'location';
    }
    if (header.toLowerCase().includes('level') || header.toLowerCase().includes('l1') || 
        header.toLowerCase().includes('l2') || header.toLowerCase().includes('l3')) {
      return 'service';
    }
    return 'text';
  };

  const getColumnIcon = (type: string) => {
    switch (type) {
      case 'number':
        return '💰';
      case 'location':
        return '📍';
      case 'service':
        return '⚙️';
      default:
        return '📄';
    }
  };

  if (!isExpanded) {
    return (
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-primary" />
              Data Preview
            </div>
            <Button
              variant="outline"
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Data
            </Button>
          </CardTitle>
          <CardDescription>
            {data.length} rows loaded with {headers.length} columns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-primary-soft rounded-lg">
                <p className="text-2xl font-bold text-primary">{data.length}</p>
                <p className="text-sm text-muted-foreground">Total Rows</p>
              </div>
              <div className="p-3 bg-accent-soft rounded-lg">
                <p className="text-2xl font-bold text-accent">{headers.length}</p>
                <p className="text-sm text-muted-foreground">Columns</p>
              </div>
              <div className="p-3 bg-success-soft rounded-lg">
                <p className="text-2xl font-bold text-success">
                  {[...new Set(data.map(row => row[headers.find(h => h.toLowerCase().includes('region')) || headers[0]]))].length}
                </p>
                <p className="text-sm text-muted-foreground">Regions</p>
              </div>
              <div className="p-3 bg-warning-soft rounded-lg">
                <p className="text-2xl font-bold text-warning">
                  {headers.filter(h => h.toLowerCase().includes('l') || h.toLowerCase().includes('level')).length}
                </p>
                <p className="text-sm text-muted-foreground">Service Levels</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Detected Columns:</h4>
              <div className="flex flex-wrap gap-2">
                {headers.slice(0, 8).map((header, index) => {
                  const type = getColumnType(header);
                  return (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <span>{getColumnIcon(type)}</span>
                      {header}
                    </Badge>
                  );
                })}
                {headers.length > 8 && (
                  <Badge variant="secondary">+{headers.length - 8} more</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-large">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="h-6 w-6 text-primary" />
            Data Preview
          </div>
          <Button
            variant="outline"
            onClick={() => setIsExpanded(false)}
            size="sm"
          >
            Collapse
          </Button>
        </CardTitle>
        <CardDescription>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} rows
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {headers.map((header, index) => (
                    <TableHead key={index} className="font-semibold">
                      <div className="flex items-center gap-2">
                        <span>{getColumnIcon(getColumnType(header))}</span>
                        {header}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-muted/30">
                    {headers.map((header, colIndex) => (
                      <TableCell key={colIndex} className="max-w-xs truncate">
                        {formatCellValue(row[header])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};