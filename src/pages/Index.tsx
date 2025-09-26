import React, { useState, useEffect } from 'react';
import { Calculator, FileSpreadsheet, Zap, Shield, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ExcelUpload } from '@/components/ExcelUpload';
import { CalculatorForm } from '@/components/CalculatorForm';
import { PriceSummary } from '@/components/PriceSummary';
import { DataPreview } from '@/components/DataPreview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ExcelData {
  [key: string]: any;
}

interface CalculationResult {
  baseRate: number;
  serviceManagementFee: number;
  travelCharges: number;
  outOfHoursMultiplier: number;
  weekendHolidayMultiplier: number;
  subtotal: number;
  total: number;
  breakdown: {
    label: string;
    amount: number;
    description: string;
  }[];
}

const Index = () => {
  const [excelData, setExcelData] = useState<ExcelData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  // Show welcome popup on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 500);

    // Auto hide after 3 seconds
    const hideTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleDataLoaded = (data: ExcelData[], loadedHeaders: string[]) => {
    setExcelData(data);
    setHeaders(loadedHeaders);
    setCalculation(null); // Reset calculation when new data is loaded
  };

  const handleCalculationComplete = (result: CalculationResult) => {
    setCalculation(result);
  };

  const handleReset = () => {
    setCalculation(null);
  };

  const features = [
    {
      icon: FileSpreadsheet,
      title: 'Excel Integration',
      description: 'Upload any Excel file and automatically extract pricing data',
    },
    {
      icon: Calculator,
      title: 'Dynamic Calculations',
      description: 'Real-time pricing with fees, multipliers, and travel charges',
    },
    {
      icon: Zap,
      title: 'Premium Features',
      description: 'PDF export, CSV download, and professional summaries',
    },
    {
      icon: Shield,
      title: 'Reliable & Secure',
      description: 'Frontend-only processing ensures your data stays private',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-soft/20 to-accent-soft/20">
      {/* Welcome Popup */}
      {showWelcome && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative mx-4 max-w-2xl w-full">
            {/* Close button */}
            <button
              onClick={() => setShowWelcome(false)}
              className="absolute -top-2 -right-2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            {/* Main popup content */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-gray-900 dark:to-purple-950 rounded-3xl p-12 shadow-2xl border-2 border-blue-200 dark:border-blue-800 animate-in zoom-in-95 duration-500 slide-in-from-bottom-10">
              {/* Welcome icon */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 animate-bounce">
                  <span className="text-4xl">👋</span>
                </div>
                
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                  Welcome Team! 🎉
                </h1>
                
                {/* Message */}
                <div className="space-y-4">
                  <p className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100">
                    This is <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">Pavithiran</span>
                  </p>
                  <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200">
                    Your new intern ✨
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
                    Ready to revolutionize your pricing calculations!
                  </p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 text-blue-300 dark:text-blue-700 opacity-50">
                <Calculator className="h-8 w-8" />
              </div>
              <div className="absolute top-4 right-4 text-purple-300 dark:text-purple-700 opacity-50">
                <FileSpreadsheet className="h-8 w-8" />
              </div>
              <div className="absolute bottom-4 left-4 text-pink-300 dark:text-pink-700 opacity-50">
                <Zap className="h-8 w-8" />
              </div>
              <div className="absolute bottom-4 right-4 text-green-300 dark:text-green-700 opacity-50">
                <Shield className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-lg p-2">
                <Calculator className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Price Book Calculator</h1>
                <p className="text-sm text-muted-foreground">Professional pricing made simple</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* <Badge variant="outline" className="hidden sm:flex">
                v1.0.0
              </Badge> */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        {excelData.length === 0 && (
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Professional Price Book Calculator
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upload your Excel price book, configure service parameters, and generate professional 
              pricing quotes with detailed breakdowns and export capabilities.
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-medium transition-all duration-300 border-border/50">
                  <CardHeader className="pb-3">
                    <div className="bg-primary-soft rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {/* Step 1: Excel Upload */}
          {excelData.length === 0 ? (
            <div className="animate-slide-up">
              <ExcelUpload onDataLoaded={handleDataLoaded} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Data Preview */}
                <div className="animate-fade-in">
                  <DataPreview data={excelData} headers={headers} />
                </div>

                {/* Calculator Form */}
                <div className="animate-slide-up">
                  <CalculatorForm 
                    data={excelData} 
                    headers={headers} 
                    onCalculationComplete={handleCalculationComplete}
                  />
                </div>
                {/* Show calculated value below form if valid and not zero */}
                {calculation && calculation.total > 0 && (
                  <div className="mt-8 animate-fade-in">
                    <div className="bg-gradient-to-br from-primary-soft via-accent-soft to-secondary-soft rounded-2xl p-8 shadow-xl border border-primary/30 flex flex-col items-center">
                      <h3 className="text-2xl font-bold mb-2 text-primary">Total Cost</h3>
                      <div className="text-5xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                        ${calculation.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="w-full max-w-md mx-auto">
                        <ul className="divide-y divide-border/30">
                          {calculation.breakdown.map((item, idx) => (
                            <li key={idx} className="py-2 flex justify-between items-center">
                              <span className="font-medium text-muted-foreground">{item.label}</span>
                              <span className="font-semibold text-primary">${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Price Summary */}
                {calculation && (
                  <div className="animate-scale-in">
                    <PriceSummary 
                      calculation={calculation} 
                      onReset={handleReset}
                    />
                  </div>
                )}

                {/* Empty state when no calculation */}
                {!calculation && (
                  <Card className="border-dashed border-2 border-border/50">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                      <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Ready to Calculate</h3>
                      <p className="text-muted-foreground">
                        Configure your service requirements in the form to generate a detailed price summary.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              This website is built with React, TypeScript, and Tailwind CSS. Developed by <span className="text-blue-800 dark:text-blue-600 font-medium">Thevarasa Pavithiran</span>.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              All processing happens locally in your browser - your data never leaves your device.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;