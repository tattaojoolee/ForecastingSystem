import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { Database } from 'lucide-react';
import { Brain } from 'lucide-react';

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
    <Card className="shadow-xl border-2 border-blue-100 dark:border-blue-900 bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-900/30 dark:to-cyan-900/30 border-b">
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          Input Historical Data
        </CardTitle>
        <CardDescription>
          Enter laboratory test data or upload a CSV/TXT file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="flex gap-2 items-center">
          <Label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg">
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
          <Button onClick={handleAddRow} variant="outline" size="sm" className="border-2 hover:bg-blue-50 dark:hover:bg-blue-950">
            <Plus className="w-4 h-4 mr-2" />
            Add Row
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg border-2 border-slate-200 dark:border-slate-800">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-slate-100 to-blue-100 dark:from-slate-800 dark:to-blue-900 border-b-2">
                <th className="p-3 text-left">Month</th>
                <th className="p-3 text-left">Year</th>
                <th className="p-3 text-left">Total Tests</th>
                <th className="p-3 text-left">CBC</th>
                <th className="p-3 text-left">Urinalysis</th>
                <th className="p-3 text-left">Fecalysis</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-b hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors">
                  <td className="p-2">
                    <select
                      value={row.month}
                      onChange={(e) => handleInputChange(index, 'month', e.target.value)}
                      className="w-full p-2 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-slate-800"
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
                      className="w-20 border-2 focus:border-blue-500"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      value={row.totalTests}
                      onChange={(e) => handleInputChange(index, 'totalTests', parseInt(e.target.value) || 0)}
                      className="w-24 border-2 focus:border-blue-500"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      value={row.cbc}
                      onChange={(e) => handleInputChange(index, 'cbc', parseInt(e.target.value) || 0)}
                      className="w-24 border-2 focus:border-green-500"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      value={row.urinalysis}
                      onChange={(e) => handleInputChange(index, 'urinalysis', parseInt(e.target.value) || 0)}
                      className="w-24 border-2 focus:border-blue-500"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      value={row.fecalysis}
                      onChange={(e) => handleInputChange(index, 'fecalysis', parseInt(e.target.value) || 0)}
                      className="w-24 border-2 focus:border-purple-500"
                    />
                  </td>
                  <td className="p-2">
                    <Button
                      onClick={() => handleRemoveRow(index)}
                      variant="ghost"
                      size="sm"
                      disabled={rows.length === 1}
                      className="hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg shadow-lg hover:shadow-xl transition-all">
          <Brain className="w-5 h-5 mr-2" />
          Process Data & Train Model
        </Button>
      </CardContent>
    </Card>
  );
}