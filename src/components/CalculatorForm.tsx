import React, { useState, useEffect } from 'react';
import { Calculator, MapPin, Clock, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

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

interface CalculatorFormProps {
  data: ExcelData[];
  headers: string[];
  onCalculationComplete: (result: CalculationResult) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ data, headers, onCalculationComplete }) => {
  // Form state
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedServiceLevel, setSelectedServiceLevel] = useState('');
  const [projectType, setProjectType] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [duration, setDuration] = useState('1');
  const [distance, setDistance] = useState('0');
  const [isOutOfHours, setIsOutOfHours] = useState(false);
  const [isWeekendHoliday, setIsWeekendHoliday] = useState(false);

  // New field for project duration
  const [projectDuration, setProjectDuration] = useState('');
  const projectDurationOptions = ['Short Term', 'Long Term'];

  // Derived data
  const [regions, setRegions] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<ExcelData[]>([]);

  // Fixed region list
  const regionList = [
    'APAC',
    'Europe',
    'Latin America (LAM)',
    'North America (NAM)',
    'Africa',
    'Middle East',
    'North America (NAM) - Tier 1 Cities*',
    'North America (NAM) - Other Cities'
  ];

  // Fixed country list
  const countryList = [
    "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","The Bahamas","Bahrain","Bangladesh","Belarus","Belgium","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Cambodia","Cameroon","Canada","Central African Republic","Chile","China","Colombia","Comoros","Congo","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Dominican Republic","Ecuador","El Salvador","Equatorial Guinea","Egypt","Ethiopia","Fiji","Finland","France","The Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guatemala","Guernsey","Guinea","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Latvia","Lebanon","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritius","Mayotte","Mexico","Moldova","Monaco","Mongolia","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America (Tier 1)","United States of America (Tier 2)","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Virgin Islands","Yemen","Zambia","Zimbabwe"
  ];

  // Extract unique regions and countries from data
  useEffect(() => {
    setRegions(regionList);
    setCountries(countryList);
  }, [data, headers]);

  // Filter data based on selections
  useEffect(() => {
    let filtered = data;
    
    if (selectedRegion) {
      const regionColumn = headers.find(h => 
        h.toLowerCase().includes('region') || h.toLowerCase().includes('area')
      );
      if (regionColumn) {
        filtered = filtered.filter(row => row[regionColumn] === selectedRegion);
      }
    }

    if (selectedCountry) {
      const countryColumn = headers.find(h => 
        h.toLowerCase().includes('country') || h.toLowerCase().includes('location')
      );
      if (countryColumn) {
        filtered = filtered.filter(row => row[countryColumn] === selectedCountry);
      }
    }

    setFilteredData(filtered);
  }, [selectedRegion, selectedCountry, data, headers]);

  // Fixed service levels
  const serviceLevels = ['L1', 'L2', 'L3', 'L4', 'L5'];

  const getServiceLevels = () => serviceLevels;

  const getProjectTypes = () => {
    return ['Full Day', 'Half Day', 'Dispatch Ticket', 'Short Term Project', 'Long Term Project'];
  };

  const getRateForSelection = () => {
    if (!filteredData.length || !selectedServiceLevel) return 0;
    
    // Try to find rate in the filtered data
    const rateRow = filteredData[0]; // Take first matching row
    const serviceRate = rateRow[selectedServiceLevel];
    
    if (typeof serviceRate === 'number') {
      return serviceRate;
    }
    
    // Try to parse if it's a string
    const parsed = parseFloat(String(serviceRate).replace(/[^0-9.-]/g, ''));
    return isNaN(parsed) ? 100 : parsed; // Default fallback rate
  };

  const calculateTotal = () => {
    const baseRate = getRateForSelection();
    const qty = parseFloat(quantity) || 1;
    const dur = parseFloat(duration) || 1;
    const dist = parseFloat(distance) || 0;

    // Project type multipliers
    const projectMultiplier = {
      'Full Day': 1,
      'Half Day': 0.6,
      'Dispatch Ticket': 0.3,
      'Short Term Project': 1.1,
      'Long Term Project': 0.9,
    }[projectType] || 1;

    // Base calculation
    const adjustedBaseRate = baseRate * projectMultiplier * qty * dur;
    
    // Service Management Fee (5%)
    const serviceManagementFee = adjustedBaseRate * 0.05;
    
    // Travel charges (>50km at $0.40/km)
    const travelCharges = dist > 50 ? (dist - 50) * 0.40 * qty : 0;
    
    // Out of hours multiplier (x1.5)
    const outOfHoursMultiplier = isOutOfHours ? adjustedBaseRate * 0.5 : 0;
    
    // Weekend/Holiday multiplier (x2)
    const weekendHolidayMultiplier = isWeekendHoliday ? adjustedBaseRate * 1.0 : 0;
    
    const subtotal = adjustedBaseRate + serviceManagementFee + travelCharges + outOfHoursMultiplier + weekendHolidayMultiplier;
    const total = subtotal;

    const result: CalculationResult = {
      baseRate: adjustedBaseRate,
      serviceManagementFee,
      travelCharges,
      outOfHoursMultiplier,
      weekendHolidayMultiplier,
      subtotal,
      total,
      breakdown: [
        {
          label: `Base Rate (${projectType})`,
          amount: adjustedBaseRate,
          description: `${selectedServiceLevel} × ${qty} × ${dur} days × ${projectMultiplier}`
        },
        {
          label: 'Service Management Fee (5%)',
          amount: serviceManagementFee,
          description: 'Administrative and project management costs'
        },
        ...(travelCharges > 0 ? [{
          label: `Travel Charges (${dist}km)`,
          amount: travelCharges,
          description: `Distance over 50km at $0.40/km × ${qty}`
        }] : []),
        ...(outOfHoursMultiplier > 0 ? [{
          label: 'Out of Hours (50% surcharge)',
          amount: outOfHoursMultiplier,
          description: 'After hours service premium'
        }] : []),
        ...(weekendHolidayMultiplier > 0 ? [{
          label: 'Weekend/Holiday (100% surcharge)',
          amount: weekendHolidayMultiplier,
          description: 'Weekend and holiday service premium'
        }] : [])
      ]
    };

    return result;
  };

  const handleCalculate = () => {
    if (!selectedRegion || !selectedCountry || !selectedServiceLevel || !projectType) {
      return;
    }
    
    const result = calculateTotal();
    onCalculationComplete(result);
  };

  const isFormValid = selectedRegion && selectedCountry && selectedServiceLevel && projectType && 
                     parseFloat(quantity) > 0 && parseFloat(duration) > 0;

  return (
    <Card className="shadow-large">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <Calculator className="h-6 w-6 text-primary" />
          Price Calculator
        </CardTitle>
        <CardDescription>
          Configure your service requirements to calculate pricing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-primary" />
            <Label className="text-sm font-medium">Location</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Service Configuration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4 text-primary" />
            <Label className="text-sm font-medium">Service Configuration</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceLevel">Service Level</Label>
              <Select value={selectedServiceLevel} onValueChange={setSelectedServiceLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service level" />
                </SelectTrigger>
                <SelectContent>
                  {getServiceLevels().map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type</Label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  {getProjectTypes().map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Project Duration Selection */}
          <div className="space-y-2">
            <Label htmlFor="projectDuration">Project Duration</Label>
            <Select value={projectDuration} onValueChange={setProjectDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {projectDurationOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Quantity and Duration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-primary" />
            <Label className="text-sm font-medium">Quantity & Duration</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                min="0.5"
                step="0.5"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="distance">Distance (km)</Label>
              <Input
                id="distance"
                type="number"
                min="0"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Premium Options */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-primary" />
            <Label className="text-sm font-medium">Premium Options</Label>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="outOfHours">Out of Hours Service</Label>
                <p className="text-sm text-muted-foreground">50% surcharge for after-hours support</p>
              </div>
              <Switch
                id="outOfHours"
                checked={isOutOfHours}
                onCheckedChange={setIsOutOfHours}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="weekendHoliday">Weekend/Holiday Service</Label>
                <p className="text-sm text-muted-foreground">100% surcharge for weekend and holiday support</p>
              </div>
              <Switch
                id="weekendHoliday"
                checked={isWeekendHoliday}
                onCheckedChange={setIsWeekendHoliday}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Calculate Button */}
        <Button 
          onClick={handleCalculate}
          disabled={!isFormValid}
          className="w-full premium-gradient text-white hover:opacity-90 transition-all duration-300 shadow-medium"
          size="lg"
        >
          <Calculator className="h-4 w-4 mr-2" />
          Calculate Total Cost
        </Button>
      </CardContent>
    </Card>
  );
};