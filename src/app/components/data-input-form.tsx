import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Upload, Plus, Trash2 } from 'lucide-react';

export interface TestData {
  month: string;
  year: number;
  totalTests: number;
  cbc: number;
  urinalysis: number;
  fecalysis: number;
}

interface DataInputFormProps {
  onDataSubmit: (data: TestData[]) => void;
}

export function DataInputForm({ onDataSubmit }: DataInputFormProps) {
  const [rows, setRows] = useState<TestData[]>([
    { month: 'Jan', year: 2023, totalTests: 1300, cbc: 800, urinalysis: 200, fecalysis: 300 },
    { month: 'Feb', year: 2023, totalTests: 1500, cbc: 1000, urinalysis: 300, fecalysis: 200 },
  ]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1];
    const nextMonthIndex = (months.indexOf(lastRow.month) + 1) % 12;
    const nextYear = nextMonthIndex === 0 ? lastRow.year + 1 : lastRow.year;
    
    setRows([
      ...rows,
      { month: months[nextMonthIndex], year: nextYear, totalTests: 0, cbc: 0, urinalysis: 0, fecalysis: 0 },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (index: number, field: keyof TestData, value: string | number) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      // Skip header row
      const dataLines = lines.slice(1);
      const parsedData: TestData[] = [];

      dataLines.forEach(line => {
        const [monthYear, total, cbc, urinalysis, fecalysis] = line.split(/[,\t]/).map(s => s.trim());
        
        if (monthYear) {
          const [month, year] = monthYear.split(' ');
          parsedData.push({
            month: month,
            year: parseInt(year) || 2023,
            totalTests: parseInt(total) || 0,
            cbc: parseInt(cbc) || 0,
            urinalysis: parseInt(urinalysis) || 0,
            fecalysis: parseInt(fecalysis) || 0,
          });
        }
      });

      if (parsedData.length > 0) {
        setRows(parsedData);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    onDataSubmit(rows);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Input Historical Data</CardTitle>
        <CardDescription>
          Enter laboratory test data or upload a CSV/TXT file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 items-center">
          <Label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
              <Upload className="w-4 h-4" />
              <span>Upload File</span>
            </div>
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </Label>
          <Button onClick={handleAddRow} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Row
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Month</th>
                <th className="p-2 text-left">Year</th>
                <th className="p-2 text-left">Total Tests</th>
                <th className="p-2 text-left">CBC</th>
                <th className="p-2 text-left">Urinalysis</th>
                <th className="p-2 text-left">Fecalysis</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">
                    <select
                      value={row.month}
                      onChange={(e) => handleInputChange(index, 'month', e.target.value)}
                      className="w-full p-1 border rounded"
                    >
                      {months.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      value={row.year}
                      onChange={(e) => handleInputChange(index, 'year', parseInt(e.target.value) || 2023)}
                      className="w-20"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      value={row.totalTests}
                      onChange={(e) => handleInputChange(index, 'totalTests', parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      value={row.cbc}
                      onChange={(e) => handleInputChange(index, 'cbc', parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      value={row.urinalysis}
                      onChange={(e) => handleInputChange(index, 'urinalysis', parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      value={row.fecalysis}
                      onChange={(e) => handleInputChange(index, 'fecalysis', parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                  </td>
                  <td className="p-2">
                    <Button
                      onClick={() => handleRemoveRow(index)}
                      variant="ghost"
                      size="sm"
                      disabled={rows.length === 1}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Process Data & Train Model
        </Button>
      </CardContent>
    </Card>
  );
}
