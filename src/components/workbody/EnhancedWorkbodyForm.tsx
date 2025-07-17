import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileText, Clock } from "lucide-react";

interface WorkbodyFormData {
  name: string;
  type: string;
  description: string;
  category: string;
  subcategory: string;
  chairman: string;
  created_date: string;
  end_date?: string;
  terms_of_reference: string;
}

interface EnhancedWorkbodyFormProps {
  onSubmit: (data: WorkbodyFormData) => void;
  onCancel: () => void;
  initialData?: Partial<WorkbodyFormData>;
  isEditing?: boolean;
}

const workbodyTypes = [
  { value: 'committee', label: 'Committee', color: 'bg-blue-100 text-blue-800' },
  { value: 'working-group', label: 'Working Group', color: 'bg-green-100 text-green-800' },
  { value: 'task-force', label: 'Task Force', color: 'bg-orange-100 text-orange-800' }
];

const categories = [
  'Regulations',
  'Corporate Affairs',
  'Technical Standards',
  'Education & Training',
  'International Relations',
  'Professional Development'
];

const subcategories = {
  'Regulations': ['EAB', 'Licensing', 'Ethics', 'Disciplinary'],
  'Corporate Affairs': ['Finance', 'HR', 'Legal', 'Communications'],
  'Technical Standards': ['Civil', 'Electrical', 'Mechanical', 'Chemical'],
  'Education & Training': ['Curriculum', 'Assessment', 'CPD', 'Research'],
  'International Relations': ['Mutual Recognition', 'Agreements', 'Exchange Programs'],
  'Professional Development': ['Workshops', 'Seminars', 'Certifications']
};

export function EnhancedWorkbodyForm({ 
  onSubmit, 
  onCancel, 
  initialData = {}, 
  isEditing = false 
}: EnhancedWorkbodyFormProps) {
  const [formData, setFormData] = useState<WorkbodyFormData>({
    name: initialData.name || '',
    type: initialData.type || '',
    description: initialData.description || '',
    category: initialData.category || '',
    subcategory: initialData.subcategory || '',
    chairman: initialData.chairman || '',
    created_date: initialData.created_date || new Date().toISOString().split('T')[0],
    end_date: initialData.end_date || '',
    terms_of_reference: initialData.terms_of_reference || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.chairman.trim()) newErrors.chairman = 'Chairman is required';
    if (!formData.created_date) newErrors.created_date = 'Creation date is required';
    
    if (formData.type === 'task-force' && !formData.end_date) {
      newErrors.end_date = 'End date is required for Task Forces';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const selectedType = workbodyTypes.find(t => t.value === formData.type);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          {isEditing ? 'Edit Workbody' : 'Create New Workbody'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Workbody Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter workbody name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="type">Type *</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {workbodyTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={type.color}>{type.label}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
              </div>

              <div>
                <Label htmlFor="chairman">Chairman *</Label>
                <Input
                  id="chairman"
                  value={formData.chairman}
                  onChange={(e) => setFormData(prev => ({ ...prev, chairman: e.target.value }))}
                  placeholder="Enter chairman name"
                  className={errors.chairman ? 'border-red-500' : ''}
                />
                {errors.chairman && <p className="text-sm text-red-500">{errors.chairman}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, category: value, subcategory: '' }));
                  }}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>

              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select 
                  value={formData.subcategory} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory: value }))}
                  disabled={!formData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.category && subcategories[formData.category as keyof typeof subcategories]?.map(sub => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="created_date">Created Date *</Label>
                  <Input
                    id="created_date"
                    type="date"
                    value={formData.created_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, created_date: e.target.value }))}
                    className={errors.created_date ? 'border-red-500' : ''}
                  />
                  {errors.created_date && <p className="text-sm text-red-500">{errors.created_date}</p>}
                </div>

                {formData.type === 'task-force' && (
                  <div>
                    <Label htmlFor="end_date">End Date *</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      className={errors.end_date ? 'border-red-500' : ''}
                    />
                    {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the purpose and objectives of this workbody"
              rows={3}
            />
          </div>

          {/* Terms of Reference */}
          <div>
            <Label htmlFor="terms_of_reference">Terms of Reference</Label>
            <Textarea
              id="terms_of_reference"
              value={formData.terms_of_reference}
              onChange={(e) => setFormData(prev => ({ ...prev, terms_of_reference: e.target.value }))}
              placeholder="Define the scope, responsibilities, and authority of this workbody"
              rows={4}
            />
          </div>

          {/* Preview */}
          {selectedType && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={selectedType.color}>{selectedType.label}</Badge>
                {formData.category && (
                  <Badge variant="outline">{formData.category}</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {formData.name || 'Workbody Name'} 
                {formData.chairman && ` • Chairman: ${formData.chairman}`}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {isEditing ? 'Update Workbody' : 'Create Workbody'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}